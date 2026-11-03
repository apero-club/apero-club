import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import middleware, { COOKIE, PREVIEW_COOKIE, safeNext, tokenFor } from '../middleware.js';

const BASE = 'https://apero.example';
const page = (path = '/', cookie?: string) =>
  new Request(BASE + path, { headers: { accept: 'text/html', ...(cookie ? { cookie } : {}) } });
const post = (code: string, next = '/') =>
  new Request(BASE + '/__access', { method: 'POST', body: new URLSearchParams({ code, next }) });
const passes = (r: Response) => r.headers.get('x-middleware-next') === '1';

describe('access gate', () => {
  beforeEach(() => { process.env.ACCESS_CODE = 'Croissant-42'; delete process.env.EDGE_CONFIG; });
  afterEach(() => { delete process.env.ACCESS_CODE; });

  it('shows the gate screen to a new visitor, marked noindex', async () => {
    const r = await middleware(page('/?date=2026-11-03'));
    expect(r.status).toBe(401);
    expect(r.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    const html = await r.text();
    expect(html).toContain('Access code');
    expect(html).toContain('name="robots" content="noindex');
    expect(html).toContain('value="/?date=2026-11-03"');
    expect(html).not.toContain('Croissant-42');
  });

  it('refuses app files without the cookie', async () => {
    const r = await middleware(new Request(BASE + '/assets/index.js', { headers: { accept: '*/*' } }));
    expect(r.status).toBe(401);
    expect(passes(r)).toBe(false);
  });

  it('accepts the right code (any case, extra spaces) and remembers the device', async () => {
    const r = await middleware(post('  croissant-42 ', '/?date=2026-11-03'));
    expect(r.status).toBe(303);
    expect(r.headers.get('location')).toBe('/?date=2026-11-03');
    const set = r.headers.get('set-cookie')!;
    expect(set).toMatch(/HttpOnly/);
    expect(set).toMatch(/Max-Age=34560000/);
    expect(set).not.toContain('Croissant');
    const cookie = set.split(';')[0];
    expect(passes(await middleware(page('/', cookie)))).toBe(true);
    expect(passes(await middleware(new Request(BASE + '/assets/index.js', { headers: { cookie } })))).toBe(true);
  });

  it('rejects a wrong code', async () => {
    const r = await middleware(post('baguette'));
    expect(r.status).toBe(401);
    expect(await r.text()).toContain('didn’t work');
  });

  it('rejects a forged cookie', async () => {
    expect(passes(await middleware(page('/', `${COOKIE}=${'0'.repeat(64)}`)))).toBe(false);
  });

  it('signs devices out when the code changes', async () => {
    const cookie = `${COOKIE}=${await tokenFor('Croissant-42')}`;
    process.env.ACCESS_CODE = 'Pain-au-chocolat-7';
    expect(passes(await middleware(page('/', cookie)))).toBe(false);
  });

  it('lets nobody in when no code is set', async () => {
    delete process.env.ACCESS_CODE;
    const r = await middleware(page());
    expect(r.status).toBe(503);
    expect(await r.text()).toContain('isn’t set up');
    expect((await middleware(post(''))).status).toBe(503);
  });

  it('only redirects to same-site paths', () => {
    expect(safeNext('https://evil.example')).toBe('/');
    expect(safeNext('//evil.example')).toBe('/');
    expect(safeNext('/?date=2026-11-03')).toBe('/?date=2026-11-03');
  });
});

describe('daily lessons and preview mode', () => {
  const START = '2026-11-03';
  let access: string, fetched: string[];
  const get = (path: string, cookie = access, accept = '*/*') => middleware(new Request(BASE + path, { headers: { accept, cookie } }));
  const at = (iso: string) => vi.setSystemTime(new Date(iso));
  let n = 0;
  beforeEach(async () => {
    process.env.ACCESS_CODE = 'Croissant-42'; process.env.PREVIEW_CODE = 'Editor-Only-9';
    delete process.env.EDGE_CONFIG; delete process.env.LESSON_START_DATE;
    access = `${COOKIE}=${await tokenFor('Croissant-42')}`;
    fetched = [];
    vi.useFakeTimers({ toFake: ['Date'] });
    // Each test starts on a new fake day far apart, so the 5-minute schedule cache never carries over.
    at(`2027-0${1 + (n++ % 8)}-01T12:00:00Z`);
    vi.stubGlobal('fetch', async (u: string) => { fetched.push(String(u)); return new Response(JSON.stringify({ startDate: START, timeZone: 'Europe/Paris' }), { headers: { 'content-type': 'application/json' } }); });
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); delete process.env.PREVIEW_CODE; });

  it('serves the schedule without any cookie (the server reads it too)', async () => {
    expect(passes(await get('/lessons/schedule.json', ''))).toBe(true);
  });
  it('opens lessons on their day, in Paris time', async () => {
    at('2026-11-04T22:30:00Z'); // 23:30 on 4 Nov in Paris: lesson 2's day
    expect(passes(await get('/lessons/lesson-002.json'))).toBe(true);
    expect((await get('/lessons/lesson-003.json')).status).toBe(404);
    expect((await get('/lessons/lesson-003/audio/abc.mp3')).status).toBe(404);
    expect(fetched[0]).toBe(BASE + '/lessons/schedule.json');
  });
  it('opens lesson 3 just after midnight in Paris', async () => {
    at('2026-11-04T23:00:00Z'); // 00:00 on 5 Nov in Paris
    expect(passes(await get('/lessons/lesson-003.json'))).toBe(true);
  });
  it('always opens lesson 1, even before the start date', async () => {
    at('2026-10-01T12:00:00Z');
    expect(passes(await get('/lessons/lesson-001.json'))).toBe(true);
    expect((await get('/lessons/lesson-002.json')).status).toBe(404);
  });
  it('still asks for the access code first', async () => {
    expect((await get('/lessons/lesson-001.json', '')).status).toBe(401);
  });
  it('preview: the right code unlocks future lessons for 30 days', async () => {
    at('2026-11-03T12:00:00Z');
    const r = await middleware(new Request(BASE + '/__preview', { method: 'POST', headers: { cookie: access }, body: new URLSearchParams({ code: ' editor-only-9 ', next: '/?lesson=9' }) }));
    expect(r.status).toBe(303);
    expect(r.headers.get('location')).toBe('/?lesson=9');
    const set = r.headers.getSetCookie();
    expect(set.find(c => c.startsWith(PREVIEW_COOKIE + '='))).toMatch(/HttpOnly.*|Max-Age=2592000/);
    expect(set.some(c => c.startsWith('apero_preview_ui=1'))).toBe(true);
    const pv = set.find(c => c.startsWith(PREVIEW_COOKIE + '='))!.split(';')[0];
    expect(passes(await get('/lessons/lesson-009.json', `${access}; ${pv}`))).toBe(true);
    expect((await get('/lessons/lesson-009.json')).status).toBe(404); // without it
  });
  it('preview: a wrong code, a missing PREVIEW_CODE, and forged or swapped cookies get nothing', async () => {
    at('2026-11-03T12:00:00Z');
    const wrong = await middleware(new Request(BASE + '/__preview', { method: 'POST', headers: { cookie: access }, body: new URLSearchParams({ code: 'Croissant-42' }) }));
    expect(wrong.status).toBe(401);
    expect(await wrong.text()).toContain('didn’t work');
    // The access token can't stand in for the preview token (different scope), nor the other way round.
    expect((await get('/lessons/lesson-009.json', `${access}; ${PREVIEW_COOKIE}=${await tokenFor('Croissant-42')}`)).status).toBe(404);
    expect((await get('/lessons/lesson-001.json', `${COOKIE}=${await tokenFor('Croissant-42', 'preview')}`)).status).toBe(401);
    delete process.env.PREVIEW_CODE;
    const unset = await get('/__preview', access, 'text/html');
    expect(await unset.text()).toContain('PREVIEW_CODE');
  });
  it('preview: the code page needs the access code first, and /__preview/exit clears both cookies', async () => {
    expect((await get('/__preview', '', 'text/html')).status).toBe(401);
    const page = await get('/__preview', access, 'text/html');
    expect(await page.text()).toContain('Preview code');
    const exit = await get('/__preview/exit');
    expect(exit.status).toBe(303);
    expect(exit.headers.getSetCookie().every(c => /Max-Age=0/.test(c))).toBe(true);
  });
  it('if the schedule can’t be read, only lesson 1 is open', async () => {
    vi.stubGlobal('fetch', async () => { throw new Error('offline'); });
    expect(passes(await get('/lessons/lesson-001.json'))).toBe(true);
    expect((await get('/lessons/lesson-002.json')).status).toBe(404);
  });
  it('LESSON_START_DATE in Vercel overrides the file', async () => {
    process.env.LESSON_START_DATE = '2027-01-01';
    at('2027-01-02T12:00:00Z');
    expect(passes(await get('/lessons/lesson-002.json'))).toBe(true);
    expect((await get('/lessons/lesson-003.json')).status).toBe(404);
  });
});
