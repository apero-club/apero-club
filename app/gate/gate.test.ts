import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import middleware from '../middleware';
import { COOKIE, safeNext, tokenFor } from './access';

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
