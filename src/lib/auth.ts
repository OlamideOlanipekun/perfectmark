import Cookies from "js-cookie";

/**
 * Frontend token storage.
 *
 * Access token: short-lived (15 min), read by JS on every API call.
 * Refresh token: long-lived (30 d), read by JS to call /auth/refresh.
 *
 * Both live in cookies so Next.js middleware can gate protected routes on the
 * server without an extra round-trip. `SameSite=Lax` + `Secure` in prod.
 *
 * NOTE: these are intentionally NOT httpOnly — this app uses Bearer auth from
 * the browser, so the JS must read the token. XSS is the defense of last
 * resort; protect by sanitizing inputs + strict CSP.
 */

export const ACCESS_TOKEN_COOKIE = "pmtc_at";
export const REFRESH_TOKEN_COOKIE = "pmtc_rt";
/**
 * Non-authoritative role hint for the Next.js middleware so it can redirect
 * non-admins away from /admin/* without an extra round-trip. The backend
 * remains the source of truth — it independently verifies the JWT role on
 * every admin route via requireRole('admin').
 */
export const ROLE_HINT_COOKIE = "pmtc_role";

const isProd = process.env.NODE_ENV === "production";

const COOKIE_OPTS = {
  sameSite: "lax" as const,
  secure: isProd,
  path: "/",
};

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return Cookies.get(ACCESS_TOKEN_COOKIE) ?? null;
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return Cookies.get(REFRESH_TOKEN_COOKIE) ?? null;
}

export function setTokens(opts: {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}): void {
  // Access token cookie expires when the JWT does, plus a small buffer.
  // The buffer means the middleware will still see it as present while the
  // refresh-on-401 dance completes.
  const accessBufferSec = 60;
  const accessDays = (opts.accessTokenExpiresIn + accessBufferSec) / 86_400;

  Cookies.set(ACCESS_TOKEN_COOKIE, opts.accessToken, {
    ...COOKIE_OPTS,
    expires: accessDays,
  });

  Cookies.set(REFRESH_TOKEN_COOKIE, opts.refreshToken, {
    ...COOKIE_OPTS,
    expires: 30, // match backend REFRESH_TOKEN_TTL_DAYS
  });
}

export function setRoleHint(role: "student" | "admin"): void {
  Cookies.set(ROLE_HINT_COOKIE, role, { ...COOKIE_OPTS, expires: 30 });
}

export function getRoleHint(): "student" | "admin" | null {
  if (typeof window === "undefined") return null;
  const v = Cookies.get(ROLE_HINT_COOKIE);
  return v === "student" || v === "admin" ? v : null;
}

export function clearTokens(): void {
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(ROLE_HINT_COOKIE, { path: "/" });
}
