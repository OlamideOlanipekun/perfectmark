"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, Mail, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarketingFooter() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Courses", href: "/courses" },
        { label: "How it Works", href: "/#how" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Popular Subjects",
      links: [
        { label: "Mathematics", href: "/courses?subject=Mathematics" },
        { label: "Physics", href: "/courses?subject=Physics" },
        { label: "Chemistry", href: "/courses?subject=Chemistry" },
        { label: "Biology", href: "/courses?subject=Biology" },
        { label: "English", href: "/courses?subject=English" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/faq" },
        { label: "Contact Us", href: "/contact" },
        { label: "Terms of Service", href: "/legal/terms" },
        { label: "Privacy Policy", href: "/legal/privacy" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0b0a24] text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative background elements - more subtle brand glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-0 pointer-events-none" />
      
      <div className="container mx-auto px-[5%] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 pb-20 border-b border-white/5">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl shadow-2xl border border-white/10 transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src="/logo.jpg" 
                  alt="PerfectMark Logo" 
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-2xl leading-none tracking-tight text-white">PerfectMark</div>
                <div className="text-[11px] font-bold text-[#cead60] uppercase tracking-[0.3em] mt-1.5">Tutors College</div>
              </div>
            </Link>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Nigeria&apos;s premier cloud-based learning platform. We provide expert-led 
              video tutorials tailored for WAEC, NECO, and JAMB success. 
            </p>
            <div className="flex gap-4">
              {[
                { icon: Phone, label: "Phone", href: "tel:+2349162062050" },
                { icon: MessageSquare, label: "Chat", href: "https://wa.me/2349162062050" },
                { icon: Mail, label: "Email", href: "mailto:support@perfectmarktutorschoolproject.com" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#cead60] hover:text-[#21205c] transition-all duration-300 shadow-lg"
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((col) => (
            <div key={col.title} className="space-y-8">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#cead60]">
                {col.title}
              </h4>
              <ul className="space-y-5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-[15px] text-white/50 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8 text-[14px] text-white/30 font-medium">
          <p>© {new Date().getFullYear()} Perfect Mark Tutors College. Built by <a href="https://midetechsolutions.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4 font-semibold text-[#cead60]">MideTech Solutions</a>.</p>
          <div className="flex items-center gap-10">
            <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>

      {/* Floating Back to Top */}
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={cn(
          "fixed bottom-[100px] lg:bottom-10 right-6 lg:right-10 z-[60] grid h-14 w-14 place-items-center rounded-2xl bg-[#cead60] text-[#21205c] shadow-2xl hover:-translate-y-2 active:scale-95 transition-all duration-500",
          showScroll ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        )}
      >
        <ChevronUp className="h-7 w-7" />
      </button>
    </footer>
  );
}
