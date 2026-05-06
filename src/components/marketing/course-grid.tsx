"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { CourseShowcase } from "@/components/marketing/course-showcase";

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
            Free preview lessons from our catalogue. Detailed explanations,
            practical examples, and exam-focused insights.
          </p>
        </ScrollReveal>
      </div>

      <CourseShowcase limit={8} />

      <div className="container">
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
