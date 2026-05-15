"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, PlayCircle } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { usePreviewLessons } from "@/hooks/use-catalogue";
import type { PreviewLesson } from "@/lib/catalogue";

export function CourseGrid() {
  const { data, isLoading } = usePreviewLessons();
  const [selected, setSelected] = useState<string>("all");

  const lessons = data?.lessons ?? [];
  const isEmpty = !isLoading && lessons.length === 0;

  const displayed =
    selected === "all" ? lessons : lessons.filter((l) => l.subjectId === selected);

  return (
    <section id="courses" className="py-24 bg-white relative overflow-hidden">
      <div className="container relative">
        {/* Section header */}
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

        {/* Filter pills — only when there is content */}
        {!isEmpty && (
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-24 rounded-full" />
                ))
              ) : (
                <>
                  <PillButton
                    label="All"
                    active={selected === "all"}
                    onClick={() => setSelected("all")}
                  />
                  {lessons.map((l) => (
                    <PillButton
                      key={l.subjectId}
                      label={l.subjectName}
                      active={selected === l.subjectId}
                      onClick={() => setSelected(l.subjectId)}
                    />
                  ))}
                </>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* Cards grid */}
        <ScrollReveal delay={0.2}>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border shadow-card">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-xl mx-auto">
              <p className="font-bold text-primary">Catalogue coming soon</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;re recording lessons right now. Subscribe to be first in line.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((lesson) => (
                <PreviewCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          )}
        </ScrollReveal>

        {/* View all CTA */}
        {!isEmpty && !isLoading && (
          <ScrollReveal delay={0.4} className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-8 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-smooth"
            >
              View All Subjects →
            </Link>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────

function PillButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-smooth shadow-card ${
        active
          ? "bg-gradient-primary text-white border-primary shadow-elegant"
          : "border-border bg-card text-primary hover:bg-gradient-primary hover:text-white hover:border-primary"
      }`}
    >
      {label}
    </button>
  );
}

function PreviewCard({ lesson }: { lesson: PreviewLesson }) {
  return (
    <Link
      href={`/login?next=/watch/${lesson.id}`}
      className="group block"
      aria-label={`Preview: ${lesson.title}`}
    >
      <div className="rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1">
        {/* Thumbnail frame */}
        <div className="relative aspect-video bg-gradient-to-br from-[#21205c] to-[#0d0b30]">
          {lesson.thumbnailUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lesson.thumbnailUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Dim overlay */}
          <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />

          {/* Lock badge */}
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-sm border border-white/15 px-2.5 py-1 text-[10px] font-semibold text-white/90">
            <Lock className="h-2.5 w-2.5" />
            Sign in to watch
          </div>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-white/25 animate-ping" />
              <div className="relative grid h-12 w-12 place-items-center rounded-full bg-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                <PlayCircle className="h-6 w-6 fill-[#21205c] text-[#21205c]" />
              </div>
            </div>
          </div>

          {/* Exam type badge */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center rounded-full bg-black/55 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-widest">
              {lesson.examType}
            </span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4 bg-card">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            {lesson.subjectName}
          </p>
          <p className="font-bold text-primary text-sm leading-snug line-clamp-2">
            {lesson.title}
          </p>
        </div>
      </div>
    </Link>
  );
}
