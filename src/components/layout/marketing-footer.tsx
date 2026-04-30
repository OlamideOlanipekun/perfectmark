"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* Inline social icons — lucide-react doesn't ship brand glyphs */
const SocialFacebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 4.97 3.66 9.1 8.44 9.88v-6.99H7.9v-2.89h2.54V9.84c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33V22c4.78-.78 8.43-4.91 8.43-9.94z" />
  </svg>
);
const SocialInstagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
const SocialTwitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M18.244 2H21.5l-7.51 8.59L23 22h-6.91l-5.41-6.97L4.4 22H1.14l8.04-9.2L1 2h7.07l4.89 6.46L18.244 2zm-1.21 18h1.92L7.06 4H5.04l11.99 16z" />
  </svg>
);
const SocialYoutube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M23.5 7.2a2.99 2.99 0 0 0-2.1-2.12C19.55 4.6 12 4.6 12 4.6s-7.55 0-9.4.48A3 3 0 0 0 .5 7.2C0 9.05 0 12 0 12s0 2.95.5 4.8a3 3 0 0 0 2.1 2.12c1.85.48 9.4.48 9.4.48s7.55 0 9.4-.48A3 3 0 0 0 23.5 16.8C24 14.95 24 12 24 12s0-2.95-.5-4.8zM9.6 15.55v-7.1L15.84 12 9.6 15.55z" />
  </svg>
);

type LinkItem = { label: string; href: string };
type Column = { title: string; links: LinkItem[] };

const columns: Column[] = [
  {
    title: "Site Map",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Courses", href: "/courses" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Subjects",
    links: [
      { label: "Mathematics", href: "/courses?subject=Mathematics" },
      { label: "Physics", href: "/courses?subject=Physics" },
      { label: "Chemistry", href: "/courses?subject=Chemistry" },
      { label: "Biology", href: "/courses?subject=Biology" },
      { label: "English", href: "/courses?subject=English" },
      { label: "Literature", href: "/courses?subject=Literature" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Sciences", href: "/courses?category=Sciences" },
      { label: "Arts", href: "/courses?category=Arts" },
      { label: "Commercial", href: "/courses?category=Commercial" },
      { label: "Languages", href: "/courses?category=Languages" },
      { label: "Government", href: "/courses?category=Government" },
      { label: "Economics", href: "/courses?category=Economics" },
    ],
  },
  {
    title: "Help & Support",
    links: [
      { label: "Live Chat", href: "/contact" },
      { label: "Email Support", href: "mailto:support@perfectmarktutors.com" },
      { label: "Submit Feedback", href: "/contact" },
      { label: "Help Ticket", href: "/contact" },
      { label: "Call Center", href: "tel:+2349162062050" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms & Conditions", href: "/legal/terms" },
      { label: "Data Policy", href: "/legal/data" },
      { label: "Refund Policy", href: "/legal/refund" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign Up", href: "/register" },
      { label: "Log in", href: "/login" },
      { label: "My Courses", href: "/dashboard" },
      { label: "Subscription", href: "/dashboard/billing" },
      { label: "Billing", href: "/dashboard/billing" },
    ],
  },
];

export function MarketingFooter() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScroll(window.scrollY > 400);
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer id="contact" className="bg-primary px-4 sm:px-6 lg:px-8 pb-10 pt-16">
      <div className="mx-auto max-w-7xl rounded-3xl bg-primary/20 border border-white/10 shadow-elegant overflow-hidden backdrop-blur-sm">
        {/* Link grid */}
        <div className="px-6 sm:px-10 lg:px-14 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-white mb-4 tracking-tight">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-primary-foreground/70 hover:text-white transition-smooth story-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 bg-black/20 px-6 sm:px-10 lg:px-14 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/logo.jpg"
                alt="Perfect Mark Tutors logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain rounded-lg"
              />
              <span className="font-extrabold text-white tracking-tight">
                Perfect<span className="text-white/80">Mark</span>
              </span>
            </Link>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                {[
                  SocialFacebook,
                  SocialInstagram,
                  SocialTwitter,
                  SocialYoutube,
                ].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="social link"
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/5 border border-white/10 text-primary-foreground/60 hover:text-white hover:border-white/30 hover:-translate-y-0.5 transition-smooth"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <p className="text-xs text-primary-foreground/50">
                © {new Date().getFullYear()} Perfect Mark Tutors College. All
                Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={cn(
          "fixed bottom-8 right-8 z-[60] grid h-12 w-12 place-items-center rounded-full bg-gradient-primary text-white shadow-glow hover:-translate-y-1 active:scale-95 transition-all duration-300",
          showScroll
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0 pointer-events-none",
        )}
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </footer>
  );
}
