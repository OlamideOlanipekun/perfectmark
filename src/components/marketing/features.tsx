"use client";

import { BookOpen, Video, Globe, Wallet, TrendingUp, Users, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { StatsCounter } from "@/components/animations/stats-counter";
import { cn } from "@/lib/utils";
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

const STATS = [
  { icon: TrendingUp, value: 10000, suffix: "+", label: "Active Students" },
  { icon: Video,      value: 2000,  suffix: "+",  label: "Video Lessons" },
  { icon: Users,      value: 250,   suffix: "+", label: "Expert Tutors" },
  { icon: Award,      value: 98,    suffix: "%",  label: "Pass Rate" },
  { icon: Clock,      value: 24,    suffix: "/7", label: "Always Available" },
];

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

        {/* ── Stats strip ── */}
        <ScrollReveal delay={0.2}>
          <div
            className="mt-16 rounded-3xl p-8 shadow-elegant overflow-hidden relative"
            style={{ background: "linear-gradient(135deg,#21205c,#312f8a)" }}
          >
            {/* Decorative blobs */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(circle,rgba(206,173,96,.12) 0%,transparent 65%)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full"
              style={{ background: "radial-gradient(circle,rgba(206,173,96,.08) 0%,transparent 65%)" }}
            />

            <div className="relative grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
              {STATS.map((s, idx) => (
                <div
                  key={s.label}
                  className={cn(
                    "group flex flex-col items-center text-center gap-2 md:gap-3 rounded-2xl bg-white/10 hover:bg-white/[0.17] border border-white/10 p-4 md:p-5 transition-all duration-300",
                    idx === 4 && "col-span-2 lg:col-span-1" // Make last item full width on mobile (2 cols)
                  )}
                >
                  <div className="grid h-8 w-8 md:h-10 md:w-10 place-items-center rounded-xl bg-white/15 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25">
                    <s.icon className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-white leading-none">
                    <StatsCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[9px] md:text-[11px] uppercase tracking-wider text-white/60 font-semibold leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
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
