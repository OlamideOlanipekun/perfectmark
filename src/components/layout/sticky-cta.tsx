"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { usePathname } from "next/navigation";

export function StickyCTA() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px (past the hero) and only on homepage
      setIsVisible(window.scrollY > 400 && pathname === "/");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && pathname === "/" && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden p-4 bg-white/80 backdrop-blur-lg border-t border-primary/5 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="flex gap-3">
            <Button
              asChild
              className="flex-1 h-12 rounded-xl font-bold shadow-elegant border-none"
              style={{
                background: "linear-gradient(135deg,#cead60,#b8962a)",
                color: "white",
              }}
            >
              <Link href="/register">
                Start Learning Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
