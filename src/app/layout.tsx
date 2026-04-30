import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/sonner";

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
              {children}
              <Toaster richColors position="top-right" />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
