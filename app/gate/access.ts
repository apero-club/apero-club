/**
 * Access-code gate logic, shared by the Vercel middleware and its tests.
 *
 * The code itself never ships to the browser. The device is remembered with an
 * HttpOnly cookie holding a hash of the current code, so:
 *  - a cookie can't be forged without knowing the code;
 *  - changing the code signs every device out (testers enter the new one once).
 */
import { get } from '@vercel/edge-config';

export const COOKIE = 'apero_access';
/** 400 days, the longest browsers keep a cookie. */
export const MAX_AGE = 400 * 24 * 60 * 60;

/** Codes are compared without case or surrounding spaces, so phone auto-capitalisation doesn't matter. */
export const normalize = (code: string) => code.trim().toLowerCase();

/**
 * The current access code. An Edge Config item `accessCode` wins when the project
 * has an Edge Config store connected (changes apply instantly, no redeploy);
 * otherwise the `ACCESS_CODE` environment variable. Null means not set up: nobody gets in.
 */
export async function currentCode(): Promise<string | null> {
  if (process.env.EDGE_CONFIG) {
    try {
      const v = await get<string>('accessCode');
      if (typeof v === 'string' && v.trim()) return v.trim();
    } catch { /* fall back to the environment variable */ }
  }
  const env = process.env.ACCESS_CODE?.trim();
  return env || null;
}

export async function tokenFor(code: string): Promise<string> {
  const data = new TextEncoder().encode('apero-club-access:v1:' + normalize(code));
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time comparison of two equal-length hex strings. */
export function sameToken(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function readCookie(header: string | null, name: string): string | null {
  for (const part of (header ?? '').split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export const cookieHeader = (token: string) =>
  `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`;

/** Only same-site paths are allowed as a post-login destination. */
export const safeNext = (n: unknown) => (typeof n === 'string' && n.startsWith('/') && !n.startsWith('//') && !n.startsWith('/\\') ? n : '/');
