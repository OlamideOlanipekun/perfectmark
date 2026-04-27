"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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

  useEffect(() => {
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

  const isActive = (href: string) => {
    const [linkPath, linkHash] = href.split("#");
    const normalizedLinkHash = linkHash ? `#${linkHash}` : "";
    
    // Path must match exactly
    if (pathname !== linkPath) return false;
    
    // If the link has a hash, it must match the current hash
    if (normalizedLinkHash) return hash === normalizedLinkHash;
    
    // If the link has NO hash, it's only active if the current URL has NO hash
    return !hash;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-smooth">
      <div
        className={cn(
          "transition-smooth",
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-card"
            : "bg-transparent",
        )}
      >
        <div className="container flex h-24 items-center justify-between gap-4">
          {/* Logo - Matching Reference */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <Image
                src="/logo.jpg"
                alt="Perfect Mark Tutors College logo"
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
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

          {/* Centered pill nav - Matching Reference */}
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
                      : "text-foreground/70 hover:text-primary",
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

          {/* CTAs - Matching Reference */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="hidden md:inline-flex rounded-full font-semibold hover:bg-secondary"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              variant="hero"
              className="hidden sm:inline-flex rounded-full"
            >
              <Link href="/register">Sign Up</Link>
            </Button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden h-11 w-11 grid place-items-center rounded-full bg-secondary text-primary hover:bg-secondary/70 transition-smooth"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu - Matching Reference */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in">
            <nav className="container flex flex-col py-4 gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-semibold transition-smooth",
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
