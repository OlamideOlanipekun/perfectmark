import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { Preloader } from "@/components/animations/preloader";
import { WhatsappWidget } from "@/components/layout/whatsapp-widget";
import { StickyCTA } from "@/components/layout/sticky-cta";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const SITE_URL = "https://perfectmarktutorschoolproject.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Perfect Mark Tutors College — Master WAEC, NECO & JAMB",
    template: "%s | Perfect Mark Tutors College",
  },
  description:
    "Expertly designed WAEC, NECO and JAMB video tutorials by experienced Nigerian teachers. Cloud-based learning across Sciences, Arts, Languages, Commercial and Trade.",
  keywords: [
    "WAEC tutorials",
    "NECO online lessons",
    "JAMB preparation",
    "Nigerian education",
    "online tutors Nigeria",
    "secondary school video lessons",
    "SSCE online classes",
    "PerfectMark",
    "EdTech Nigeria",
  ],
  authors: [{ name: "PerfectMark Tutors College", url: SITE_URL }],
  creator: "PerfectMark Tutors College",
  publisher: "PerfectMark Tutors College",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Perfect Mark Tutors College",
    title: "Perfect Mark Tutors College — Master WAEC, NECO & JAMB",
    description:
      "Expertly designed WAEC, NECO and JAMB video tutorials by experienced Nigerian teachers. Cloud-based learning across Sciences, Arts, Languages, Commercial and Trade.",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Perfect Mark Tutors College",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfect Mark Tutors College — Master WAEC, NECO & JAMB",
    description:
      "Expertly designed WAEC, NECO and JAMB video tutorials by experienced Nigerian teachers.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <Preloader />
              {children}
              <WhatsappWidget />
            <StickyCTA />
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
