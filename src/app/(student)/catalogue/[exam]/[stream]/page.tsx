"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubjects } from "@/hooks/use-catalogue";
import { ApiError } from "@/lib/api";
import type { ExamType, Stream } from "@/types";

const EXAM_TYPES: readonly ExamType[] = ["WAEC", "NECO", "UTME"] as const;
const STREAMS: readonly Stream[] = [
  "Sciences",
  "Arts",
  "Languages",
  "Commercial",
  "Trade",
] as const;

function normaliseExam(raw: string): ExamType | null {
  const upper = raw.toUpperCase();
  return (EXAM_TYPES as readonly string[]).includes(upper) ? (upper as ExamType) : null;
}

function normaliseStream(raw: string): Stream | null {
  const decoded = decodeURIComponent(raw);
  const title = decoded.charAt(0).toUpperCase() + decoded.slice(1).toLowerCase();
  return (STREAMS as readonly string[]).includes(title) ? (title as Stream) : null;
}

interface Params {
  params: { exam: string; stream: string };
}

export default function StreamPage({ params }: Params) {
  const examType = normaliseExam(params.exam);
  const stream = normaliseStream(params.stream);

  const query = useMemo(
    () => ({ examType: examType ?? undefined, stream: stream ?? undefined }),
    [examType, stream],
  );
  const { data, isLoading, error } = useSubjects(query);

  if (!examType || !stream) {
    return (
      <EmptyState
        title="Unknown combination"
        message="That exam or stream doesn't match what we teach. Check the URL or pick from the catalogue."
        backHref="/catalogue"
      />
    );
  }

  return (
    <>
      <PageHeader
        title={`${examType} · ${stream}`}
        description="Subjects in this stream — tap any to see topics and lessons."
      />

      {isLoading && <SubjectGridSkeleton />}

      {error && (
        <EmptyState
          title="Couldn't load subjects"
          message={error instanceof ApiError ? error.message : "Please try again in a moment."}
          backHref="/catalogue"
        />
      )}

      {!isLoading && !error && (data?.subjects.length ?? 0) === 0 && (
        <EmptyState
          title="No subjects yet"
          message={`We're adding ${stream} subjects for ${examType} soon. Check back shortly.`}
          backHref={`/catalogue/${params.exam}`}
        />
      )}

      {!isLoading && !error && data && data.subjects.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.subjects.map((s) => (
            <Link
              key={s.id}
              href={`/catalogue/${examType.toLowerCase()}/${stream.toLowerCase()}/${s.slug}`}
              className="group"
            >
              <article className="h-full rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-primary text-lg tracking-tight">{s.name}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth" />
                </div>
                {s.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {s.description}
                  </p>
                )}
                <div className="mt-5 flex items-center gap-2 text-xs text-primary font-semibold">
                  <PlayCircle className="h-4 w-4" />
                  {s.lessonCount} {s.lessonCount === 1 ? "lesson" : "lessons"}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function SubjectGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-border bg-card p-6 shadow-card space-y-3"
        >
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-1/3 mt-4" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  message,
  backHref,
}: {
  title: string;
  message: string;
  backHref: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-12 text-center">
      <div className="text-4xl mb-3">📚</div>
      <p className="font-bold text-primary text-lg">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{message}</p>
      <Link
        href={backHref}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-glow transition-smooth"
      >
        ← Back
      </Link>
    </div>
  );
}
