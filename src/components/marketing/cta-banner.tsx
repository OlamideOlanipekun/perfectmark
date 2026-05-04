"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { pulseAnimation } from "@/lib/animations";

const TRUST_POINTS = [
  "No credit card required",
  "Cancel anytime",
  "Unlimited access to 2,000+ lessons",
  "Free trial for all new accounts"
];

export function CTABanner() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#21205c]">
      {/* Brand aligned navy gradient with more vibrance */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, #2a2875 0%, #0d0b30 100%)",
        }}
      />

      {/* Decorative orbs - more pronounced */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(206,173,96,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(49,47,138,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <ScrollReveal>
        <div className="container relative max-w-4xl text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#cead60] border border-[#cead60]/40 bg-[#cead60]/10 backdrop-blur-md mb-8"
          >
            <Sparkles className="h-3 w-3" />
            Limited Time Offer
          </motion.span>

          <h2
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1]"
            style={{ letterSpacing: "-0.04em" }}
          >
            Begin Your Path to a{" "}
            <br className="hidden md:block" />
            <span
              className="relative inline-block px-2"
              style={{
                background: "linear-gradient(135deg, #cead60, #ffd700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Perfect Mark
              <span className="absolute inset-x-0 -bottom-1 h-1.5 bg-[#cead60]/20 blur-sm rounded-full" />
            </span>
          </h2>

          <p className="text-white/90 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
            Join <strong className="text-[#cead60]">10,000+ students</strong> who are acing their 
            exams today. Get instant access to Nigeria&apos;s most comprehensive 
            learning platform.
          </p>

          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <motion.div
                variants={pulseAnimation}
                animate="animate"
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="xl"
                  className="rounded-2xl font-bold px-12 py-8 text-lg shadow-glow group border-none"
                  style={{
                    background: "linear-gradient(135deg, #cead60, #b8962a)",
                    color: "#21205c", // Dark blue text for better contrast on gold
                  }}
                >
                  <Link href="/register">
                    Start Learning Today
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="outline"
                  size="xl"
                  className="rounded-2xl font-bold px-12 py-8 text-lg bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-md"
                >
                  <Link href="/courses">View Samples</Link>
                </Button>
              </motion.div>
            </div>

            {/* Trust points - cleaner & brighter */}
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {TRUST_POINTS.map((point, idx) => (
                <motion.div 
                  key={point} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-2.5 text-white/90 text-sm font-semibold"
                >
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  {point}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
