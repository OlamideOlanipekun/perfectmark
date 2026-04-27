"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    category: "General",
    items: [
      { q: "What is Perfect Mark Tutors College?", a: "Perfect Mark Tutors College is a cloud-based online school offering high-quality video tutorials aligned to WAEC, NECO, and JAMB syllabi. Our lessons are recorded by experienced Nigerian teachers and cover all SS1–SS3 subjects across Sciences, Arts, Languages, Commercial, and Trade streams." },
      { q: "Which exams do you cover?", a: "We cover WAEC (G.C.E + S.S.C.E), NECO (Internal + External), JAMB/UTME 2025, and Post-UTME for top Nigerian universities. Our library is updated every year as exam boards release new questions." },
      { q: "Who are the teachers?", a: "Every tutor on our platform has at least 8 years of classroom experience and a proven track record of students scoring in the top 10% of their exam. We audition and peer-review every hire before they record a lesson." },
    ],
  },
  {
    category: "Access & Devices",
    items: [
      { q: "Can I watch on my phone?", a: "Yes — everything works on Android and iPhone through your browser. Scholar and Mentor plan subscribers can also download lessons for offline playback." },
      { q: "How many devices can I use?", a: "You can stream on up to 3 devices simultaneously. Downloads are limited to the device you save them on and expire when your subscription lapses." },
      { q: "Is there an app?", a: "A dedicated mobile app is in development. For now, our mobile website is fully optimised for phone and tablet browsing — just open your browser and go." },
    ],
  },
  {
    category: "Subscription & Billing",
    items: [
      { q: "How much does it cost?", a: "Our Starter plan is permanently free and includes 40+ introductory lessons. Scholar (full library access) is ₦1,800/month or ₦14,400/year. Mentor (1:1 tutor calls) is ₦4,500/month. All prices are locked in Naira for 12 months." },
      { q: "Can I cancel at any time?", a: "Yes. Cancel anytime from your account page — you keep access until the end of your paid period. No cancellation fees." },
      { q: "Is there a student or group discount?", a: "Students with a valid school ID can email us for 30% off any annual plan. Schools and WAEC centres qualify for group discounts — contact admissions for a quote." },
      { q: "What payment methods do you accept?", a: "We use Paystack, which accepts all major Nigerian debit/credit cards, bank transfers, and USSD payments." },
    ],
  },
  {
    category: "Content",
    items: [
      { q: "How often is new content added?", a: "We publish 6–10 new tutorials per week during term time. The past-paper library is updated each year as WAEC, NECO, and JAMB release new questions." },
      { q: "What if I fail my exam?", a: "Our Mentor plan includes a pass guarantee — if you watch 80% of your subject track and your grade doesn't improve, we refund the annual fee. Terms apply." },
      { q: "Do you have past-paper walkthroughs?", a: "Yes. Scholar and Mentor subscribers get 10 years of fully-worked past-paper solutions across all exam boards, with explanations for every mark-scheme step." },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>("General-0");

  return (
    <>
      {/* Hero — clean white with decorative rings and gold "?" icon */}
      <section className="relative overflow-hidden bg-background pt-36 pb-16">
        {/* Decorative concentric rings */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[560px] w-[560px] rounded-full border border-primary/5" />
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[400px] rounded-full border border-primary/8" />
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[260px] w-[260px] rounded-full border border-primary/10" />
        {/* Gold accent blobs */}
        <div className="pointer-events-none absolute right-1/4 top-12 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 bottom-0 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="container relative text-center">
          {/* Large "?" icon badge */}
          <div className="flex justify-center mb-6">
            <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-primary shadow-elegant text-white font-black text-5xl leading-none">
              ?
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary border border-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            FAQ
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-primary max-w-3xl mx-auto">
            Questions? We have <span className="text-gradient">answers.</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground leading-relaxed">
            Everything you need to know about Perfect Mark Tutors College. Can't find an answer?{" "}
            <Link href="/contact" className="font-semibold text-primary hover:text-primary-glow transition-smooth underline underline-offset-4">
              Write to us
            </Link>{" "}
            — admissions replies within one working day.
          </p>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="bg-gradient-soft py-20">
        <div className="container max-w-3xl">
          {FAQS.map((group) => (
            <div key={group.category} className="mb-10">
              {/* Category label */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-border" />
                <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                  {group.category}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden divide-y divide-border">
                {group.items.map((item, i) => {
                  const key = `${group.category}-${i}`;
                  const isOpen = open === key;
                  return (
                    <div key={key} className={cn("transition-smooth", isOpen && "bg-secondary/30")}>
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="w-full flex items-center gap-4 px-6 py-5 text-left group"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-primary text-white text-xs font-bold shadow-glow">
                          {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </span>
                        <span className="flex-1 font-bold text-primary text-[15px] leading-snug group-hover:text-primary-glow transition-smooth">
                          {item.q}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 pl-[calc(1.5rem+1.75rem+1rem)] text-sm text-muted-foreground leading-relaxed animate-fade-in-up">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still have questions */}
          <div className="mt-10 rounded-3xl bg-gradient-primary text-white p-8 text-center shadow-elegant relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 50% 0%, white, transparent 60%)" }}
            />
            <div className="relative">
              <h3 className="text-xl font-extrabold">Still have a question?</h3>
              <p className="mt-2 text-white/80 text-sm">
                Our admissions team reads every message and responds within a working day.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Button asChild variant="softOutline" className="rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Link href="/contact">Contact us</Link>
                </Button>
                <Button asChild variant="hero" className="rounded-full bg-accent text-primary hover:bg-accent/90 border-0 shadow-none">
                  <Link href="/register">Start free trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
