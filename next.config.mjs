/** @type {import('next').NextConfig} */

// Content Security Policy
//
// Sources:
//   self                       — own origin
//   API host                   — backend on Railway
//   media host                 — HLS bucket on R2 custom domain
//   r2.dev                     — fallback if anyone uses pub URL
//   data:                      — inline images / fonts
//   blob:                      — HLS.js builds segment Blob URLs
//   'unsafe-inline' (script)   — Next.js hydration scripts; tighten with nonces later
//
// frame-ancestors 'none'       — never embed our app in another iframe
const isDev = process.env.NODE_ENV !== "production";

// 'unsafe-eval' is only needed for Next.js hot-reload in dev; never in production.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com"
  : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://*.up.railway.app https://media.perfectmarktutorschoolproject.com https://*.r2.cloudflarestorage.com https://*.r2.dev https://api.pwnedpasswords.com",
  "media-src 'self' blob: https://media.perfectmarktutorschoolproject.com https://*.r2.dev",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://perfectmarktutorschoolproject.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
