"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home",         href: "/" },
  { label: "About",        href: "/about" },
  { label: "Courses",      href: "/courses" },
  { label: "How it works", href: "/#how" },
  { label: "FAQ",          href: "/faq" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        scrolled || mobileOpen 
          ? "bg-white/80 backdrop-blur-xl shadow-sm py-3" 
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-[5%] flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-11 w-11 overflow-hidden rounded-xl shadow-elegant border border-primary/10 transition-transform"
          >
            <Image 
              src="/logo.jpg" 
              alt="PerfectMark Logo" 
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="hidden sm:block">
            <div className="font-bold text-lg text-primary leading-none tracking-tight">PerfectMark</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Tutors College</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {navItems.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
            >
              <Link 
                href={item.href}
                className={cn(
                  "text-sm font-semibold transition-colors relative py-1",
                  pathname === item.href 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.span 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" 
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              href="/login" 
              className="text-sm font-bold text-primary hover:text-primary-glow transition-colors px-4 py-2"
            >
              Log In
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button 
              asChild
              className="rounded-full font-bold px-7 shadow-elegant"
              style={{
                background: "linear-gradient(135deg,#cead60,#b8962a)",
                color: "white"
              }}
            >
              <Link href="/register">
                  Join Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-primary hover:bg-secondary rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed inset-x-0 top-[72px] bg-white border-t border-border p-6 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-5">
              {navItems.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-lg font-bold transition-colors",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Link 
                  href="/login" 
                  className="flex items-center justify-center font-bold text-primary py-3 rounded-xl border border-primary/10 bg-secondary/50"
                >
                  Log In
                </Link>
                <Link 
                  href="/register" 
                  className="flex items-center justify-center font-bold text-white py-3 rounded-xl shadow-lg"
                  style={{ background: "linear-gradient(135deg,#cead60,#b8962a)" }}
                >
                    Join Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
