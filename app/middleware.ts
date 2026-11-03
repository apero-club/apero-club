/**
 * Vercel Routing Middleware: runs on the server before every request, including
 * the app's scripts and lesson files, so nothing is served without the access code.
 * Not used by `npm run dev` (local development stays open).
 */
import { cookieHeader, COOKIE, currentCode, readCookie, safeNext, sameToken, tokenFor } from './gate/access';
import { gatePage, type GateState } from './gate/page';

const NOINDEX = { 'X-Robots-Tag': 'noindex, nofollow' };

/**
 * Let the request through to the site. This is what `next()` from
 * @vercel/functions does; it's inlined because importing that package pulls in
 * Node-only code (child_process, fs) that crashes the Edge runtime.
 */
const next = (init: { headers?: Record<string, string> } = {}) =>
  new Response(null, { headers: { ...init.headers, 'x-middleware-next': '1' } });

function gate(state: GateState, nextPath: string, status = 401) {
  return new Response(gatePage(state, nextPath), {
    status,
    headers: { ...NOINDEX, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export default async function middleware(request: Request): Promise<Response> {
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
      return new Response(null, { status: 303, headers: { ...NOINDEX, Location: dest, 'Set-Cookie': cookieHeader(want), 'Cache-Control': 'no-store' } });
    }
    await new Promise(r => setTimeout(r, 600)); // slows down guessing
    return gate('wrong', dest);
  }

  if (code) {
    const have = readCookie(request.headers.get('cookie'), COOKIE);
    if (have && sameToken(have, await tokenFor(code))) return next({ headers: NOINDEX });
  }

  // Pages get the gate screen; anything else (scripts, lesson data, images) is just refused.
  const wantsPage = request.method === 'GET' && (request.headers.get('accept') ?? '').includes('text/html');
  if (wantsPage) return gate(code ? 'ask' : 'unset', url.pathname + url.search, code ? 401 : 503);
  return new Response('Access code required', { status: 401, headers: { ...NOINDEX, 'Cache-Control': 'no-store' } });
}
