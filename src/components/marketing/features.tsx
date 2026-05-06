"use client";

import { BookOpen, Video, Globe, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { cardHover } from "@/lib/animations";

const FEATURES_DATA = [
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum Coverage",
    desc: "Aligned with JSS 1-3, WAEC, NECO, and JAMB syllabi across Sciences, Arts, Languages, Commercial and Trade — every topic, fully covered.",
    tags: ["JSS 1-3", "WAEC", "NECO", "JAMB"],
    featured: true,
    accentColor: "#21205c",
  },
  {
    icon: Video,
    title: "Expertly Designed Video Lessons",
    desc: "Clear, engaging HD lessons recorded by experienced and certified Nigerian teachers who know the exam inside out.",
    tags: ["HD Video", "Certified Tutors"],
    featured: false,
    accentColor: "#cead60",
  },
  {
    icon: Globe,
    title: "Flexible & Accessible Learning",
    desc: "Access lessons anytime, on any device. Cloud-powered learning that fits your schedule — not the other way around.",
    tags: ["Mobile", "Desktop", "24/7"],
    featured: false,
    accentColor: "#21205c",
  },
  {
    icon: Wallet,
    title: "Affordable Subscription Plans",
    desc: "Premium-quality tutorials priced for every student. Pay monthly or yearly — free trial to get you started, no card required.",
    tags: ["Monthly", "Yearly", "Free Trial"],
    featured: true,
    accentColor: "#cead60",
  },
] as const;

export function Features() {
  return (
    <section
      id="about"
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Subtle dot-grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(hsl(222 65% 22% / 0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Radial fade so edges stay clean */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, hsl(0 0% 100%) 100%)",
        }}
      />

      <div className="container relative">
        {/* ── Section header ── */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/8">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Why Choose Us
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            Everything You Need to{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#cead60,#b8962a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Excel
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            PerfectMark brings together world-class content, expert teachers,
            and a seamless learning experience — built for Nigerian exam success.
          </p>
        </ScrollReveal>

        {/* ── Bento card grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          {FEATURES_DATA.map((feature) => (
            <FeatureCard key={feature.title} f={feature} index={FEATURES_DATA.indexOf(feature)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── sub-component ─────────────────────────── */
type FeatureDatum = (typeof FEATURES_DATA)[number];

function FeatureCard({
  f,
  index,
}: {
  f: FeatureDatum;
  index: number;
}) {
  return (
    <motion.div
      variants={cardHover}
      whileHover="hover"
      className={
        `group relative overflow-hidden rounded-3xl border border-border bg-white shadow-card flex flex-col` +
        (f.featured ? " lg:col-span-2" : "")
      }
      style={{ borderTop: `4px solid ${f.accentColor}` }}
    >
      {/* Decorative background number */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute right-5 top-3 text-[6rem] font-black leading-none text-primary/[0.04]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Hover soft glow fill */}
      <div className="pointer-events-none absolute inset-0 bg-secondary/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl" />

      <div className={`relative flex flex-col flex-1 ${f.featured ? "p-9" : "p-8"}`}>
        {/* Icon */}
        <div className="relative mb-7 self-start">
          <div
            className={`grid place-items-center rounded-2xl text-white shadow-card transition-all duration-300 group-hover:scale-110 ${
              f.featured ? "h-16 w-16" : "h-14 w-14"
            }`}
            style={{
              background:
                f.accentColor === "#cead60"
                  ? "linear-gradient(135deg,#cead60,#b8962a)"
                  : "linear-gradient(135deg,#21205c,#312f8a)",
            }}
          >
            <f.icon className={f.featured ? "h-8 w-8" : "h-7 w-7"} />
          </div>
        </div>

        <h3
          className={`font-extrabold text-primary mb-3 leading-tight ${
            f.featured ? "text-2xl" : "text-xl"
          }`}
        >
          {f.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {f.desc}
        </p>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {f.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/8"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <span
        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out rounded-b-3xl"
        style={{
          background: `linear-gradient(to right, ${f.accentColor}, transparent)`,
        }}
      />
    </motion.div>
  );
}
