"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

const FILTERS = ["All", "Agricultural Science", "Arts", "Biology", "Chemistry", "Christian Religious Knowledge", "Commercial", "Economics", "English Language", "Financial Accounting", "General Mathematics", "Geography", "Government", "Languages", "Literature in English", "Oral English", "Physics", "Sciences", "Yoruba"];

export function CourseGrid() {
  return (
    <section id="courses" className="py-24 bg-white relative overflow-hidden">
      <div className="container relative">
        <ScrollReveal className="mx-auto max-w-2xl text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/8">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Explore Our Courses
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            Curated <span className="text-gradient">Learning</span> Paths
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Expert-recorded lessons covering all major exam subjects.
            Detailed explanations, practical examples, and exam-focused insights.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {FILTERS.map((f) => (
              <span
                key={f}
                className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-gradient-primary hover:text-white hover:border-primary transition-smooth shadow-card"
              >
                {f}
              </span>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-xl mx-auto">
            <p className="font-bold text-primary">Catalogue coming soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;re recording lessons right now. Subscribe to be first in line.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4} className="mt-8 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 font-bold border-primary text-primary hover:bg-primary hover:text-white"
          >
            <Link href="/courses">View All Subjects →</Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
