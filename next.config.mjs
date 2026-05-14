/** @type {import('next').NextConfig} */

// Content Security Policy — starts as Report-Only so we can observe what
// breaks before enforcing. Switch the header name to "Content-Security-Policy"
// (drop "-Report-Only") once the violation reports are clean.
//
// Sources:
//   self                       — own origin
//   API host                   — backend on Railway
//   media host                 — HLS bucket on R2 custom domain
//   r2.dev                     — fallback if anyone uses pub URL
//   data:                      — inline images / fonts
//   blob:                      — HLS.js builds segment Blob URLs
//   'unsafe-inline' (script)   — Next.js hydration scripts; tighten with nonces later
//   'unsafe-eval' (script)     — Next.js dev mode + some libs; review for prod
//
// frame-ancestors 'none'       — never embed our app in another iframe
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
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
  // Report-Only first — flip to "Content-Security-Policy" after reviewing reports.
  { key: "Content-Security-Policy-Report-Only", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
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
