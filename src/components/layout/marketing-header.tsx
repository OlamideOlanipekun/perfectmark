"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home",         href: "/" },
  { label: "About",        href: "/about" },
  { label: "Courses",      href: "/courses" },
  { label: "How it works", href: "/about#how" },
  { label: "FAQ",          href: "/faq" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hash, setHash] = useState("");
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("pm-banner-v1")) setBannerVisible(true);

    const onScroll = () => setScrolled(window.scrollY > 20);
    const onHashChange = () => setHash(window.location.hash);

    onScroll();
    onHashChange();

    window.addEventListener("scroll", onScroll);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const dismissBanner = () => {
    setBannerVisible(false);
    localStorage.setItem("pm-banner-v1", "1");
  };

  const isActive = (href: string) => {
    const [linkPath, linkHash] = href.split("#");
    const normalizedLinkHash = linkHash ? `#${linkHash}` : "";
    if (pathname !== linkPath) return false;
    if (normalizedLinkHash) return hash === normalizedLinkHash;
    return !hash;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-[5%] py-4 pointer-events-none">
      <div className="mx-auto max-w-7xl pointer-events-auto">
        {/* Announcement Banner — Now integrated into the floating flow */}
        {bannerVisible && (
          <div className="mb-4 overflow-hidden rounded-full border border-primary/10 bg-background/60 backdrop-blur-xl animate-fade-in shadow-sm">
            <div className="relative flex items-center justify-center gap-2 bg-gradient-primary/5 px-8 py-2">
              <Sparkles className="h-3.5 w-3.5 text-accent shrink-0 animate-pulse" />
              <p className="text-[11px] font-bold text-primary tracking-wide">
                🎓 New A-Level Mathematics courses now live —{" "}
                <Link
                  href="/courses"
                  className="underline underline-offset-2 hover:text-accent transition-smooth"
                >
                  Browse now
                </Link>
              </p>
              <button
                onClick={dismissBanner}
                aria-label="Dismiss announcement"
                className="ml-4 text-primary/30 hover:text-primary transition-smooth"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        <div
          className={cn(
            "relative flex items-center justify-between gap-4 transition-all duration-500 ease-in-out px-6",
            scrolled
              ? "h-20 rounded-[2rem] bg-background/80 backdrop-blur-3xl shadow-elegant border border-primary/10"
              : "h-24 bg-transparent border-transparent",
          )}
        >
          {/* Subtle bottom glow on scroll */}
          <div 
            className={cn(
              "absolute inset-x-12 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent transition-opacity duration-500",
              scrolled ? "opacity-100" : "opacity-0"
            )} 
          />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group relative z-10">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-md group-hover:blur-xl transition-all duration-500" />
              <Image
                src="/logo.jpg"
                alt="Perfect Mark logo"
                width={56}
                height={56}
                className={cn(
                  "object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                  scrolled ? "h-12 w-12" : "h-14 w-14"
                )}
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className={cn(
                "font-extrabold tracking-tight transition-all duration-500",
                scrolled ? "text-lg" : "text-xl",
                "text-primary"
              )}>
                Perfect<span className="text-accent">Mark</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-black opacity-80 mt-0.5">
                Tutors College
              </span>
            </div>
          </Link>

          {/* Centered slick pill nav */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-secondary/40 backdrop-blur-md border border-primary/5 shadow-inner">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative px-5 py-2 text-sm font-bold rounded-full transition-all duration-300",
                    active
                      ? "text-white"
                      : "text-foreground/60 hover:text-primary hover:bg-white/50"
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-gradient-primary shadow-glow animate-scale-in" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3 relative z-10">
            <Link 
              href="/login" 
              className="hidden md:block text-sm font-bold text-foreground/70 hover:text-primary transition-smooth px-4"
            >
              Log in
            </Link>

            <Button
              asChild
              variant="hero"
              className={cn(
                "hidden sm:flex rounded-full px-8 overflow-hidden group/cta relative transition-all duration-500",
                scrolled ? "h-11" : "h-12"
              )}
            >
              <Link href="/register">
                <span className="relative z-10 flex items-center gap-2">
                  Join Free
                  <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
                </span>
                {/* Slick shimmer */}
                <div className="absolute inset-0 -translate-x-[100%] group-hover/cta:translate-x-[100%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              </Link>
            </Button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden h-11 w-11 grid place-items-center rounded-2xl bg-secondary text-primary hover:bg-secondary/70 transition-smooth border border-primary/10 shadow-sm"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5 flex flex-col justify-center gap-1.5 overflow-hidden">
                <span className={cn(
                  "h-0.5 w-full bg-current transition-all duration-300 origin-center",
                  mobileOpen ? "rotate-45 translate-y-1" : ""
                )} />
                <span className={cn(
                  "h-0.5 w-full bg-current transition-all duration-300",
                  mobileOpen ? "-translate-x-full opacity-0" : ""
                )} />
                <span className={cn(
                  "h-0.5 w-full bg-current transition-all duration-300 origin-center",
                  mobileOpen ? "-rotate-45 -translate-y-1" : ""
                )} />
              </div>
            </button>
          </div>
        </div>

        {/* Slick Mobile Menu */}
        {mobileOpen && (
          <div className="mt-4 lg:hidden rounded-3xl border border-primary/10 bg-background/95 backdrop-blur-3xl p-4 shadow-elegant animate-in fade-in zoom-in-95 duration-300">
            <nav className="flex flex-col gap-1">
              {navItems.map((item, i) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ animationDelay: `${i * 50}ms` }}
                    className={cn(
                      "flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all animate-in slide-in-from-bottom-2",
                      active
                        ? "bg-gradient-primary text-white shadow-glow"
                        : "text-foreground/70 hover:bg-secondary hover:text-primary"
                    )}
                  >
                    {item.label}
                    {active && <Sparkles className="h-4 w-4" />}
                  </Link>
                );
              })}
              <div className="grid grid-cols-2 gap-3 pt-3 mt-2 border-t border-primary/5">
                <Button asChild variant="ghost" className="rounded-2xl h-12 font-bold">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild variant="hero" className="rounded-2xl h-12 font-bold">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
