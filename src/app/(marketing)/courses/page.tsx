import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseShowcase } from "@/components/marketing/course-showcase";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Catalog | JSS, WAEC, NECO & JAMB Tutorials",
  description: "Browse video tutorials across all Nigerian secondary school subjects. Specialized coaching for Sciences, Arts, Languages, Commercial, and Trade subjects.",
  keywords: ["online courses Nigeria", "WAEC video lessons", "JAMB tutorials", "Nigerian secondary school subjects", "JSS 1-3 courses"],
};

const STATS = [
  { value: "JSS-SS3", label: "Full coverage" },
  { value: "5",       label: "Subject streams" },
  { value: "WAEC",    label: "& NECO & JAMB" },
  { value: "HD",      label: "Video quality" },
];

export default function CoursesPage() {
  return (
    <>
      {/* Hero — light with accent glow, no dark background */}
      <section className="relative overflow-hidden bg-gradient-soft pt-36 pb-12">
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 70% 60%, hsl(43 53% 59% / 0.09), transparent 50%), radial-gradient(circle at 20% 30%, hsl(241 48% 24% / 0.06), transparent 50%)" }} />
        <div className="container relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary border border-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Our Courses
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-primary max-w-3xl mx-auto">
            Your <span className="text-gradient">Gateway</span> to Excellence
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground leading-relaxed">
            Expertly-taught video lessons covering JSS 1-3, WAEC, NECO and JAMB — Sciences, Arts, Languages, Commercial and Trade.
          </p>
          {/* Stats strip — card style on light bg */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl bg-card border border-border shadow-card px-4 py-4 text-center hover:shadow-elegant hover:-translate-y-1 transition-smooth">
                <div className="text-2xl font-extrabold text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live free-lesson grid — powered by GET /catalogue/lessons/free */}
      <CourseShowcase limit={15} />

      {/* CTA */}
      <section className="bg-gradient-soft pb-20">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground mb-5">
              Unlock the full library with a Scholar subscription.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="hero" size="xl" className="rounded-full">
                <Link href="/register">Start free trial</Link>
              </Button>
              <Button asChild variant="softOutline" size="xl" className="rounded-full">
                <Link href="/subscriptions">View pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
