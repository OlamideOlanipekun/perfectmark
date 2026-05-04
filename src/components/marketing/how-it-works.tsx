"use client";

import { UserPlus, BookOpen, BookOpenCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { cardHover, scaleIn } from "@/lib/animations";

const STEPS = [
  {
    num: "01",
    icon: UserPlus,
    title: "Create Account",
    desc: "Join the PerfectMark community in seconds. Browse our extensive course catalog and choose the plan that fits your academic goals.",
    accentColor: "#cead60",
    topAccent: "border-t-[4px] border-[#cead60]",
  },
  {
    num: "02",
    icon: BookOpen,
    title: "Select Your Exam",
    desc: "Choose between WAEC, NECO, or JAMB specialized tracks tailored for your success. Pick your subjects and level — JSS, SS1, SS2 or SS3.",
    accentColor: "#21205c",
    topAccent: "border-t-[4px] border-[#21205c]",
  },
  {
    num: "03",
    icon: BookOpenCheck,
    title: "Start Mastering",
    desc: "Watch expertly crafted video tutorials, practise past questions, and track your progress daily. Real Nigerian teachers. Real exam questions.",
    accentColor: "#cead60",
    topAccent: "border-t-[4px] border-[#cead60]",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-white overflow-hidden">
      <div className="container">
        {/* Section header */}
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/8">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Simple Process
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            How It{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#cead60,#b8962a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Works
            </span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Mastering your exams is as easy as 1-2-3. Follow our simple
            process to start your journey to academic excellence.
          </p>
        </ScrollReveal>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Dashed connector line — desktop only */}
          <div
            className="hidden md:block absolute top-[30%] left-[22%] right-[22%] h-px z-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, rgba(33,32,92,0.18) 0, rgba(33,32,92,0.18) 8px, transparent 8px, transparent 20px)",
            }}
          />

          {STEPS.map((step, idx) => (
            <motion.div
              key={step.title}
              variants={cardHover}
              whileHover="whileHover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className={`relative z-10 bg-white rounded-3xl p-8 shadow-card group overflow-hidden border border-border ${step.topAccent}`}
            >
              {/* Large decorative step number */}
              <motion.span
                variants={scaleIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="pointer-events-none select-none absolute right-5 top-3 text-[5.5rem] font-black leading-none opacity-[0.05] text-primary"
                aria-hidden
              >
                {step.num}
              </motion.span>

              {/* Icon circle with step badge */}
              <div className="relative mb-7 self-start">
                <div
                  className="relative h-20 w-20 rounded-3xl flex items-center justify-center shadow-card group-hover:scale-110 transition-transform duration-500 ring-4 ring-white"
                  style={{
                    background:
                      idx === 1
                        ? "linear-gradient(135deg,#21205c,#312f8a)"
                        : "linear-gradient(135deg,#cead60,#b8962a)",
                  }}
                >
                  <step.icon className="h-9 w-9 text-white" />
                  {/* Step badge */}
                  <div
                    className="absolute -top-3 -right-3 h-8 w-8 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-card border-2 border-white"
                    style={{
                      background:
                        idx === 1
                          ? "#cead60"
                          : "linear-gradient(135deg,#21205c,#312f8a)",
                    }}
                  >
                    {idx + 1}
                  </div>
                </div>
              </div>

              {/* Step number label */}
              <span
                className="text-xs font-black uppercase tracking-[0.2em] mb-3 block"
                style={{ color: step.accentColor }}
              >
                Step {step.num}
              </span>

              <h3 className="text-2xl font-bold text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {step.desc}
              </p>

              {/* Mobile arrow connector */}
              {idx < 2 && (
                <div className="md:hidden mt-8 text-primary/20 flex justify-center">
                  <ArrowRight className="h-8 w-8 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <ScrollReveal delay={0.6} className="text-center mt-12 text-sm text-muted-foreground">
          <strong className="text-primary">No credit card required</strong> to
          get started. Free trial available for all new students.
        </ScrollReveal>
      </div>
    </section>
  );
}
