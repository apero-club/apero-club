// @ts-check
/**
 * Vercel Routing Middleware: the access-code gate.
 *
 * Runs on Vercel before every request (pages, scripts, lesson files), so nothing
 * is served without the access code. Local `npm run dev` stays open.
 *
 * Deliberately ONE plain-JavaScript file with NO imports. Vercel ships middleware
 * files as-is without bundling them, so a TypeScript file, a relative import or
 * an npm package here fails at runtime with MIDDLEWARE_INVOCATION_FAILED.
 *
 * The code never ships to the browser. A device is remembered with an HttpOnly
 * cookie holding a hash of the current code, so a cookie can't be forged without
 * the code, and changing the code signs every device out.
 *
 * Daily lessons ("mode": "dated" in lessons/schedule.json): lesson N's file and
 * folder (images, audio) are refused until its day, in Paris time, and never
 * beyond readyThrough. In "open" mode every lesson on the site is served.
 * Preview mode (PREVIEW_CODE, entered at /__preview) unlocks every lesson for
 * 30 days on that device; /__preview/exit turns it off.
 */

export const COOKIE = 'apero_access';
export const PREVIEW_COOKIE = 'apero_preview';
/** Readable by the app, only to show preview tools; the HttpOnly cookie above is what the server trusts. */
const PREVIEW_UI_COOKIE = 'apero_preview_ui';
const PREVIEW_MAX_AGE = 30 * 24 * 60 * 60;
/** 400 days, the longest browsers keep a cookie. */
const MAX_AGE = 400 * 24 * 60 * 60;
const NOINDEX = { 'X-Robots-Tag': 'noindex, nofollow' };

/** Codes are compared without case or surrounding spaces, so phone auto-capitalisation doesn't matter. */
const normalize = (/** @type {string} */ code) => code.trim().toLowerCase();

/**
 * Reads one item from a connected Vercel Edge Config store, the same request
 * @vercel/edge-config makes. Returns undefined if not connected or not found.
 * @param {string} key
 */
async function edgeConfigItem(key) {
  const conn = process.env.EDGE_CONFIG;
  if (!conn) return undefined;
  let id = null, token = null;
  if (conn.startsWith('edge-config:')) {
    const p = new URLSearchParams(conn.slice(12));
    id = p.get('id'); token = p.get('token');
  } else {
    const u = new URL(conn);
    id = u.pathname.split('/')[1] || null; token = u.searchParams.get('token');
  }
  if (!id || !token) return undefined;
  const res = await fetch(`https://edge-config.vercel.com/${id}/item/${encodeURIComponent(key)}?version=1`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
  });
  return res.ok ? res.json() : undefined;
}

/**
 * The current access code. An Edge Config item `accessCode` wins when a store is
 * connected (changes apply within seconds, no redeploy); otherwise the
 * `ACCESS_CODE` environment variable. Null means not set up: nobody gets in.
 * @returns {Promise<string | null>}
 */
async function currentCode() {
  try {
    const v = await edgeConfigItem('accessCode');
    if (typeof v === 'string' && v.trim()) return v.trim();
  } catch { /* fall back to the environment variable */ }
  return process.env.ACCESS_CODE?.trim() || null;
}

/**
 * Cookie value for a code. `scope` keeps access and preview tokens distinct, so
 * one can never be used as the other even if the two codes were the same.
 * @param {string} code @param {'access' | 'preview'} [scope]
 */
export async function tokenFor(code, scope = 'access') {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`apero-club-${scope}:v1:` + normalize(code)));
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time comparison of two hex strings. @param {string} a @param {string} b */
function sameToken(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** @param {string | null} header @param {string} name */
function readCookie(header, name) {
  for (const part of (header ?? '').split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

/** Today's date (YYYY-MM-DD) in a time zone. Same as src/lesson/schedule.ts. @param {string} timeZone */
export function todayIn(timeZone, now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
/** Lesson number live on a date. Same as src/lesson/schedule.ts. @param {string} start @param {string} date */
export function lessonNumberOn(start, date) {
  const utc = (/** @type {string} */ d) => { const [y, m, dd] = d.split('-').map(Number); return Date.UTC(y, m - 1, dd); };
  return Math.floor((utc(date) - utc(start)) / 86_400_000) + 1;
}

/** @typedef {{ mode: 'dated' | 'open', startDate: string, timeZone: string, readyThrough?: number }} ScheduleInfo */
/** @type {{ at: number, value: ScheduleInfo | null } | null} */
let scheduleCache = null;
/**
 * The schedule, read from the site's own lessons/schedule.json (cached 5 minutes).
 * LESSON_START_DATE in Vercel overrides the file's start date if set.
 * @param {string} origin
 */
async function loadSchedule(origin) {
  const age = scheduleCache ? Date.now() - scheduleCache.at : -1;
  if (scheduleCache && age >= 0 && age < (scheduleCache.value ? 300_000 : 30_000)) return scheduleCache.value;
  /** @type {ScheduleInfo | null} */
  let value = null;
  try {
    const r = await fetch(`${origin}/lessons/schedule.json`);
    if (r.ok) { const j = await r.json(); if (j.mode === 'open') value = { mode: 'open', startDate: j.startDate, timeZone: j.timeZone || 'Europe/Paris' };
    else if (/^\d{4}-\d{2}-\d{2}$/.test(j.startDate)) value = { mode: 'dated', startDate: j.startDate, timeZone: j.timeZone || 'Europe/Paris', readyThrough: Number.isInteger(j.readyThrough) && j.readyThrough >= 1 ? j.readyThrough : undefined }; }
  } catch { /* fall through */ }
  const override = process.env.LESSON_START_DATE?.trim();
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) value = { mode: 'dated', startDate: override, timeZone: value?.timeZone ?? 'Europe/Paris', readyThrough: value?.readyThrough };
  scheduleCache = { at: Date.now(), value };
  return value;
}
/**
 * Highest lesson number open today: by date, capped by readyThrough (lessons not yet
 * reviewed), at least lesson 1. If the schedule can't be read, only lesson 1.
 * @param {string} origin
 */
async function openUpTo(origin) {
  const s = await loadSchedule(origin);
  if (s?.mode === 'open') return Infinity;
  return s ? Math.max(1, Math.min(lessonNumberOn(s.startDate, todayIn(s.timeZone)), s.readyThrough ?? Infinity)) : 1;
}

/** Only same-site paths are allowed as a post-login destination. @param {unknown} n */
export const safeNext = n => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') && !n.startsWith('/\\') ? n : '/');

/** @param {string} s */
const esc = s => s.replace(/[&<>"']/g, c => /** @type {Record<string, string>} */ ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const TEXT = {
  access: {
    eyebrow: 'Private preview', lede: 'A short French story every day, with the why behind the grammar.',
    action: '/__access', label: 'Access code', hand: 'ask the club for yours', fine: 'You’ll only need it once on this device.',
    wrong: 'That code didn’t work. Check it and try again.', unset: 'Access isn’t set up yet. Ask the person who invited you.',
  },
  preview: {
    eyebrow: 'Preview mode', lede: 'Open any lesson, including ones that aren’t live yet, to review them before they go out.',
    action: '/__preview', label: 'Preview code', hand: 'for the editor only', fine: 'Lasts 30 days on this device. To leave preview mode, open /__preview/exit.',
    wrong: 'That code didn’t work. Check it and try again.', unset: 'Preview isn’t set up yet. Add PREVIEW_CODE in Vercel, then redeploy.',
  },
};

/**
 * The access-code (or preview-code) screen in the apéro club design. Self-contained (the app bundle is behind the gate).
 * @param {'ask' | 'wrong' | 'unset'} state
 * @param {string} next
 * @param {'access' | 'preview'} [mode]
 */
function gatePage(state, next, mode = 'access') {
  const t = TEXT[mode];
  const msg = state === 'ask' ? '' : `<p class="msg" role="alert">${t[state]}</p>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#3A1FD4">
<title>apéro club</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%233A1FD4'/%3E%3Cpath d='M16 56V32a16 16 0 0 1 32 0v24z' fill='%23F0A4EB'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600..900&family=Figtree:wght@400..700&family=Caveat:wght@700&display=swap">
<style>
:root{--violet-50:#EFECFF;--violet-100:#DDD7FF;--violet-500:#3A1FD4;--violet-700:#2913A6;--violet-900:#160A5C;--lilac-500:#F0A4EB;--lilac-700:#C463BE;
--orange-500:#FF5A1F;--orange-900:#641B02;--sun-300:#FFCF66;--green-300:#86D9A9;--green-900:#004A3A;--sky-300:#ADD1F1;
--white:#fff;--cream-100:#ECE9E3;--cream-200:#DFDBD2;--cream-300:#CBC5B9;--ink-500:#6C6773;--ink-700:#3B3741;--ink-900:#121014;
--display:'Unbounded','Figtree',system-ui,sans-serif;--body:'Figtree',system-ui,sans-serif;--hand:'Caveat','Comic Sans MS',cursive;--ease:cubic-bezier(.22,1,.36,1)}
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:var(--cream-200);color:var(--ink-900);font:400 16px/1.5 var(--body);-webkit-font-smoothing:antialiased}
.shell{display:flex;flex-direction:column;min-height:100dvh;max-width:440px;margin:0 auto;background:var(--cream-100);overflow:hidden}
@media (min-width:520px) and (min-height:700px){body{min-height:100dvh;display:flex;align-items:center;padding:24px 16px}.shell{width:100%;min-height:0;border-radius:40px;box-shadow:0 0 0 10px var(--ink-900),0 18px 36px -14px rgba(18,16,20,.3)}}
.hero{background:var(--violet-500);padding:calc(env(safe-area-inset-top,0px) + 40px) 24px 30px;display:flex;flex-direction:column;gap:12px}
.eyebrow{font:700 12px/1 var(--display);letter-spacing:.04em;text-transform:uppercase;color:var(--lilac-500)}
h1{margin:0;font:900 48px/.92 var(--display);letter-spacing:-.05em;color:var(--lilac-500)}
.lede{margin:0;font-size:16px;line-height:1.5;color:var(--white);max-width:30ch}
.tiles{display:grid;grid-template-columns:repeat(3,1fr)}
.tile{aspect-ratio:1;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;container-type:inline-size}
.t1{background:var(--sky-300)}.t1 .c{width:64%;height:64%;border-radius:50%;background:var(--violet-500)}
.eyes{position:absolute;left:50%;top:48%;translate:-50% -50%;display:flex;gap:5cqw;animation:blink 4.6s infinite}
.eyes i{display:block;width:15cqw;height:15cqw;border-radius:50%;background:var(--white);position:relative}
.eyes i::after{content:'';position:absolute;left:50%;top:50%;width:56%;height:56%;border-radius:50%;background:var(--ink-900);translate:-50% -50%}
.t2{background:var(--orange-500)}.t2 .a{width:56%;height:76%;border-radius:999px 999px 0 0;background:var(--sun-300);position:relative;top:12%}
.t3{background:var(--green-900)}.f{position:relative;width:70%;height:70%}
.f span{position:absolute;width:50%;height:50%;border-radius:50%;background:var(--green-300)}
.f span:nth-child(1){left:0;top:25%}.f span:nth-child(2){left:50%;top:25%}.f span:nth-child(3){left:25%;top:0}.f span:nth-child(4){left:25%;top:50%}
.f b{position:absolute;left:35%;top:35%;width:30%;height:30%;border-radius:50%;background:var(--violet-500)}
form{padding:28px 24px calc(env(safe-area-inset-bottom,0px) + 32px);display:flex;flex-direction:column;gap:12px}
label{font:700 12px/1 var(--display);letter-spacing:.04em;text-transform:uppercase;color:var(--violet-700)}
input{width:100%;height:56px;padding:0 18px;border-radius:16px;border:2px solid var(--cream-300);background:var(--white);font:600 20px/1 var(--body);letter-spacing:.04em;color:var(--ink-900)}
input:focus{outline:none;border-color:var(--violet-500);box-shadow:0 0 0 4px var(--violet-100)}
input[aria-invalid=true]{border-color:var(--orange-500);animation:shake 360ms var(--ease)}
button{margin-top:4px;height:56px;border:0;border-radius:999px;background:var(--violet-500);color:var(--white);font:600 16px/1 var(--display);letter-spacing:-.02em;cursor:pointer;
box-shadow:0 4px 0 var(--violet-900);transition:transform 100ms var(--ease),box-shadow 100ms var(--ease),background 200ms var(--ease)}
button:hover{background:#4A30EA}button:active{transform:translateY(4px);box-shadow:0 0 0 var(--violet-900)}
:focus-visible{outline:3px solid var(--lilac-500);outline-offset:2px}
.msg{margin:0;font-size:14px;line-height:1.45;color:var(--orange-900)}
.hand{font:700 24px/1 var(--hand);color:var(--violet-500);transform:rotate(-2deg);align-self:flex-start;margin-top:4px}
.fine{margin:0;font-size:13px;line-height:1.45;color:var(--ink-500)}
@keyframes blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.08)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
</head>
<body>
<main class="shell">
  <section class="hero">
    <span class="eyebrow">${t.eyebrow}</span>
    <h1>apéro club</h1>
    <p class="lede">${t.lede}</p>
  </section>
  <div class="tiles" aria-hidden="true">
    <div class="tile t2"><div class="a"></div></div>
    <div class="tile t1"><div class="c"></div><span class="eyes"><i></i><i></i></span></div>
    <div class="tile t3"><div class="f"><span></span><span></span><span></span><span></span><b></b></div></div>
  </div>
  <form method="post" action="${t.action}">
    <label for="code">${t.label}</label>
    <input id="code" name="code" type="text" required autofocus autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" enterkeyhint="go"${state === 'wrong' ? ' aria-invalid="true"' : ''}>
    <input type="hidden" name="next" value="${esc(next)}">
    ${msg}
    <button type="submit">Enter</button>
    <span class="hand">${t.hand}</span>
    <p class="fine">${t.fine}</p>
  </form>
</main>
</body>
</html>`;
}

/** @param {'ask' | 'wrong' | 'unset'} state @param {string} nextPath @param {'access' | 'preview'} [mode] */
function gate(state, nextPath, status = 401, mode = /** @type {'access' | 'preview'} */ ('access')) {
  return new Response(gatePage(state, nextPath, mode), {
    status,
    headers: { ...NOINDEX, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

/** Let the request through to the site (what `next()` from @vercel/functions does). */
const pass = () => new Response(null, { headers: { ...NOINDEX, 'x-middleware-next': '1' } });

/** @param {Request} request @returns {Promise<Response>} */
export default async function middleware(request) {
  const url = new URL(request.url);
  const code = await currentCode();

  // The form posts here.
  if (url.pathname === '/__access' && request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const entered = String(form?.get('code') ?? '');
    const dest = safeNext(form?.get('next'));
    if (!code) return gate('unset', dest, 503);
    const want = await tokenFor(code);
    if (entered.trim() && sameToken(await tokenFor(entered), want)) {
      return new Response(null, {
        status: 303,
        headers: { ...NOINDEX, Location: dest, 'Cache-Control': 'no-store', 'Set-Cookie': `${COOKIE}=${want}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax` },
      });
    }
    await new Promise(r => setTimeout(r, 600)); // slows down guessing
    return gate('wrong', dest);
  }

  // The schedule holds only a start date; it's public so this middleware can read it.
  if (url.pathname === '/lessons/schedule.json') return pass();

  const cookies = request.headers.get('cookie');
  const have = readCookie(cookies, COOKIE);
  const allowed = !!code && !!have && sameToken(have, await tokenFor(code));
  if (!allowed) {
    // Pages get the gate screen; anything else (scripts, lesson data, images) is just refused.
    const wantsPage = request.method === 'GET' && (request.headers.get('accept') ?? '').includes('text/html');
    if (wantsPage) return gate(code ? 'ask' : 'unset', url.pathname + url.search, code ? 401 : 503);
    return new Response('Access code required', { status: 401, headers: { ...NOINDEX, 'Cache-Control': 'no-store' } });
  }

  // Preview mode: /__preview asks for PREVIEW_CODE; /__preview/exit turns it off.
  const previewCode = process.env.PREVIEW_CODE?.trim() || null;
  const previewToken = previewCode ? await tokenFor(previewCode, 'preview') : null;
  if (url.pathname === '/__preview/exit') return redirectClearingPreview();
  if (url.pathname === '/__preview') {
    if (request.method === 'POST') {
      const form = await request.formData().catch(() => null);
      const entered = String(form?.get('code') ?? '');
      const dest = safeNext(form?.get('next'));
      if (!previewToken) return gate('unset', dest, 503, 'preview');
      if (entered.trim() && sameToken(await tokenFor(entered, 'preview'), previewToken)) {
        const h = new Headers({ ...NOINDEX, Location: dest, 'Cache-Control': 'no-store' });
        h.append('Set-Cookie', `${PREVIEW_COOKIE}=${previewToken}; Path=/; Max-Age=${PREVIEW_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`);
        h.append('Set-Cookie', `${PREVIEW_UI_COOKIE}=1; Path=/; Max-Age=${PREVIEW_MAX_AGE}; Secure; SameSite=Lax`);
        return new Response(null, { status: 303, headers: h });
      }
      await new Promise(r => setTimeout(r, 600));
      return gate('wrong', dest, 401, 'preview');
    }
    return gate(previewToken ? 'ask' : 'unset', '/', 200, 'preview');
  }

  // Lessons that aren't live yet: their file and folder don't exist, unless in preview mode.
  const m = url.pathname.match(/^\/lessons\/lesson-(\d{3,})(?:\.json$|\/)/);
  if (m) {
    const pv = readCookie(cookies, PREVIEW_COOKIE);
    const previewing = !!previewToken && !!pv && sameToken(pv, previewToken);
    if (!previewing && Number(m[1]) > await openUpTo(url.origin)) {
      return new Response('Not found', { status: 404, headers: { ...NOINDEX, 'Cache-Control': 'no-store' } });
    }
  }
  return pass();
}

/** Leave preview mode: clear both preview cookies and go home. */
function redirectClearingPreview() {
  const h = new Headers({ ...NOINDEX, Location: '/', 'Cache-Control': 'no-store' });
  h.append('Set-Cookie', `${PREVIEW_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`);
  h.append('Set-Cookie', `${PREVIEW_UI_COOKIE}=; Path=/; Max-Age=0; Secure; SameSite=Lax`);
  return new Response(null, { status: 303, headers: h });
}
