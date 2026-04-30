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

    const onScroll = () => setScrolled(window.scrollY > 8);
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
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* Announcement Banner */}
      {bannerVisible && (
        <div className="relative flex items-center justify-center gap-2 bg-gradient-primary px-10 py-2 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
          <p className="text-[12px] font-semibold text-white/90 text-center">
            🎓 New A-Level Mathematics courses now live —{" "}
            <Link
              href="/courses"
              className="underline underline-offset-2 hover:text-white transition-smooth font-bold"
            >
              Browse now
            </Link>
          </p>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss announcement"
            className="absolute right-4 text-white/50 hover:text-white transition-smooth"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div
        className={cn(
          "relative transition-smooth",
          scrolled
            ? "bg-background/85 backdrop-blur-2xl shadow-card border-b border-primary/10"
            : "bg-transparent",
        )}
      >
        {/* Gradient glow line at bottom on scroll */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />
        )}

        <div className="container flex h-24 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <Image
                src="/logo.jpg"
                alt="Perfect Mark Tutors College logo"
                width={64}
                height={64}
                className="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <span className="absolute inset-0 rounded-full bg-primary-glow/30 blur-lg opacity-0 group-hover:opacity-100 transition-smooth -z-10" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-lg font-extrabold text-primary tracking-tight">
                Perfect<span className="text-accent">Mark</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Tutors College
              </span>
            </div>
          </Link>

          {/* Centered pill nav */}
          <nav className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-secondary/80 backdrop-blur-md border border-primary/10 shadow-card">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative px-5 py-2 text-sm font-semibold rounded-full transition-smooth",
                    active
                      ? "text-primary-foreground"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5",
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-gradient-primary shadow-elegant animate-scale-in" />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="hidden md:inline-flex rounded-full font-semibold hover:bg-secondary"
            >
              <Link href="/login">Log in</Link>
            </Button>

            {/* Sign Up with shimmer */}
            <Button
              asChild
              variant="hero"
              className="hidden sm:inline-flex rounded-full overflow-hidden group/cta"
            >
              <Link href="/register">
                <span className="relative z-10 flex items-center gap-1.5">
                  Sign Up
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                </span>
                <span className="absolute inset-0 -skew-x-12 translate-x-[-150%] bg-white/20 group-hover/cta:translate-x-[250%] transition-transform duration-700 ease-out pointer-events-none" />
              </Link>
            </Button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden h-11 w-11 grid place-items-center rounded-full bg-secondary text-primary hover:bg-secondary/70 transition-smooth border border-primary/10"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background/97 backdrop-blur-2xl animate-fade-in">
            <nav className="container flex flex-col py-4 gap-1">
              {navItems.map((item, i) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ animationDelay: `${i * 45}ms` }}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-semibold transition-smooth animate-fade-in-up",
                      active
                        ? "bg-gradient-primary text-primary-foreground shadow-card"
                        : "text-foreground/80 hover:bg-secondary hover:text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex gap-2 pt-3 mt-2 border-t border-border">
                <Button asChild variant="ghost" className="flex-1 rounded-full">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild variant="hero" className="flex-1 rounded-full">
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
