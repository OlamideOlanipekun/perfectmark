"use client";

import { UserPlus, CreditCard, BookOpenCheck, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Create Account",
    desc: "Join the PerfectMark community in seconds with just your email and student details.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: CreditCard,
    title: "Choose Plan",
    desc: "Select a budget-friendly subscription that gives you unlimited access to all subjects.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: BookOpenCheck,
    title: "Start Learning",
    desc: "Watch expert tutorials, practice, and master your exams with confidence.",
    color: "bg-green-100 text-green-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-primary">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Mastering your exams is as easy as 1-2-3. Follow our simple process to start your journey to academic excellence.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-dashed-line -translate-y-12 z-0" />

          {STEPS.map((step, idx) => (
            <div key={step.title} className="relative z-10 flex flex-col items-center text-center group">
              <div className={`h-24 w-24 rounded-3xl ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 ring-4 ring-white`}>
                <step.icon className="h-10 w-10" />
                <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed px-4">
                {step.desc}
              </p>
              {idx < 2 && (
                <div className="md:hidden mt-8 text-primary/20">
                  <ArrowRight className="h-8 w-8 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .bg-dashed-line {
          background-image: linear-gradient(to right, hsl(var(--primary) / 0.1) 50%, transparent 50%);
          background-size: 20px 1px;
          background-repeat: repeat-x;
        }
      `}</style>
    </section>
  );
}
