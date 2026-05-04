"use client";

import Link from "next/link";
import { Eye, Lock, Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFreeLessons } from "@/hooks/use-catalogue";

const FILTERS = ["All", "Agricultural Science", "Arts", "Biology", "Chemistry", "Christian Religious Knowledge", "Commercial", "Economics", "English Language", "Financial Accounting", "General Mathematics", "Geography", "Government", "Languages", "Literature in English", "Oral English", "Physics", "Sciences", "Yoruba"];

/**
 * Publicly viewable free-lesson marquee for the /courses marketing page.
 * Hits GET /catalogue/lessons/free — no auth required.
 */
export function CourseShowcase({ limit = 15 }: { limit?: number }) {
  const { data, isLoading, error } = useFreeLessons(limit);

  return (
    <section className="bg-gradient-soft py-16">
      <div className="container">
        {/* Filter pills (static for now; backend stream-filter wires in later) */}
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

        {isLoading && <CourseGridSkeleton />}

        {error && (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-xl mx-auto">
            <p className="font-bold text-primary">We&apos;re having trouble loading courses</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check your connection and refresh the page.
            </p>
          </div>
        )}

        {!isLoading && !error && (data?.lessons.length ?? 0) === 0 && (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center max-w-xl mx-auto">
            <p className="font-bold text-primary">Catalogue coming soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;re recording lessons right now. Subscribe to be first in line.
            </p>
          </div>
        )}

        {!isLoading && !error && data && data.lessons.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.lessons.map((lesson, i) => (
              <Link
                key={lesson.id}
                href={`/watch/${lesson.id}`}
                style={{ animationDelay: `${(i % 6) * 80}ms` }}
                className="group relative block overflow-hidden rounded-3xl bg-card border border-border shadow-card transition-all duration-500 hover:shadow-elegant hover:-translate-y-2 hover:border-primary/30 animate-fade-in-up"
              >
                <span className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md" />

                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-primary">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-[11px] font-semibold text-white">
                    {lesson.tags[0] ?? "Lesson"}
                  </span>
                  {lesson.isFree && (
                    <span className="absolute top-3 right-3 rounded-full bg-accent text-primary px-3 py-1 text-[11px] font-bold">
                      FREE
                    </span>
                  )}

                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-background/95 text-primary opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 rotate-[-90deg] group-hover:rotate-0 transition-all duration-500 shadow-elegant ring-4 ring-white/30">
                      <Play className="h-6 w-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 relative">
                  <h3 className="font-bold text-primary line-clamp-2 min-h-[3rem] transition-colors group-hover:text-primary-glow">
                    {lesson.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" /> {formatViews(lesson.viewCount)}
                    </span>
                    {lesson.isFree ? (
                      <span className="text-accent font-semibold">Watch free</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-primary font-semibold group-hover:translate-x-1 transition-smooth">
                        <Lock className="h-3 w-3" /> Subscribe to watch
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-primary group-hover:w-full transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K views`;
  return `${n} views`;
}

function CourseGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-3xl overflow-hidden border border-border bg-card shadow-card">
          <Skeleton className="aspect-[16/10] w-full" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
