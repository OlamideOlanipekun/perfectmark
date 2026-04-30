"use client";

import { UserPlus, CreditCard, BookOpenCheck, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create Account",
    desc: "Join the PerfectMark community in seconds with just your email and student details.",
    bg: "bg-secondary",
    iconColor: "text-primary",
    ringColor: "ring-primary/10",
  },
  {
    icon: CreditCard,
    title: "Choose Plan",
    desc: "Select a budget-friendly subscription that gives you unlimited access to all subjects.",
    bg: "bg-gradient-primary",
    iconColor: "text-white",
    ringColor: "ring-primary/20",
  },
  {
    icon: BookOpenCheck,
    title: "Start Learning",
    desc: "Watch expert tutorials, practice, and master your exams with confidence.",
    bg: "bg-accent/20",
    iconColor: "text-accent-foreground",
    ringColor: "ring-accent/20",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-background overflow-hidden">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-2 w-2 rounded-full bg-primary-glow" />
            Simple Process
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Mastering your exams is as easy as 1-2-3. Follow our simple
            process to start your journey to academic excellence.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Dashed connector line — desktop only */}
          <div
            className="hidden md:block absolute top-[22%] left-[22%] right-[22%] h-px z-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, hsl(222 65% 22% / 0.15) 0, hsl(222 65% 22% / 0.15) 8px, transparent 8px, transparent 20px)",
            }}
          />

          {STEPS.map((step, idx) => (
            <div
              key={step.title}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Icon wrapper — relative so the badge positions correctly */}
              <div
                className={`relative h-24 w-24 rounded-3xl ${step.bg} flex items-center justify-center mb-6 shadow-card group-hover:scale-110 transition-transform duration-500 ring-4 ring-white ${step.ringColor}`}
              >
                <step.icon className={`h-10 w-10 ${step.iconColor}`} />
                {/* Step number badge */}
                <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-sm shadow-card border-2 border-background">
                  {idx + 1}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed px-4">
                {step.desc}
              </p>

              {/* Mobile arrow connector */}
              {idx < 2 && (
                <div className="md:hidden mt-8 text-primary/20">
                  <ArrowRight className="h-8 w-8 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
