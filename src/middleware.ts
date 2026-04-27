import { NextResponse, type NextRequest } from "next/server";

// Must match ACCESS_TOKEN_COOKIE / REFRESH_TOKEN_COOKIE / ROLE_HINT_COOKIE in src/lib/auth.ts
const TOKEN_COOKIE = "pmtc_at";
const REFRESH_TOKEN_COOKIE = "pmtc_rt";
const ROLE_HINT_COOKIE = "pmtc_role";

const STUDENT_PREFIXES = [
  "/dashboard",
  "/catalogue",
  "/watch",
  "/subscriptions",
];
const ADMIN_PREFIX = "/admin";
const AUTH_ONLY_PATHS = ["/login", "/register", "/forgot-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Treat presence of EITHER cookie as "potentially authenticated".
  // The client may have an expired access token but a valid refresh token —
  // the api client will rotate it on the next call. If we gated purely on the
  // access cookie, users would get redirected to /login during that window.
  const hasToken = Boolean(
    req.cookies.get(TOKEN_COOKIE)?.value ??
      req.cookies.get(REFRESH_TOKEN_COOKIE)?.value,
  );
  const token = hasToken ? "present" : undefined;

  const isStudentRoute = STUDENT_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const isAdminRoute =
    pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
  const isAuthRoute = AUTH_ONLY_PATHS.includes(pathname);

  if ((isStudentRoute || isAdminRoute) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Non-authoritative role gate for /admin/*. The backend independently
  // enforces admin role on every /admin/* API call via requireRole('admin').
  // This redirect just spares non-admins from rendering a page that will
  // immediately surface 403s in every panel.
  if (isAdminRoute && token) {
    const role = req.cookies.get(ROLE_HINT_COOKIE)?.value;
    if (role && role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute && token) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/catalogue/:path*",
    "/watch/:path*",
    "/subscriptions/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
