"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Eye,
  Lock,
  PlayCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useSubjectBySlug, useTopics, useLessons } from "@/hooks/use-catalogue";
import type { ExamType } from "@/types";
import type { Topic, Lesson } from "@/lib/catalogue";
import { ApiError } from "@/lib/api";

const EXAM_TYPES: readonly ExamType[] = ["WAEC", "NECO", "UTME"] as const;

function normaliseExam(raw: string): ExamType | null {
  const upper = raw.toUpperCase();
  return (EXAM_TYPES as readonly string[]).includes(upper) ? (upper as ExamType) : null;
}

interface Params {
  params: { exam: string; stream: string; subject: string };
}

export default function SubjectPage({ params }: Params) {
  const examType = normaliseExam(params.exam);
  const slug = decodeURIComponent(params.subject);

  const subjectQuery = useSubjectBySlug(examType ?? "WAEC", slug);
  const topicsQuery = useTopics(subjectQuery.data?.subject.id);

  if (!examType) {
    return <ErrorState message="Unknown exam type." />;
  }

  if (subjectQuery.isLoading) {
    return <SubjectPageSkeleton />;
  }

  if (subjectQuery.error) {
    const msg =
      subjectQuery.error instanceof ApiError && subjectQuery.error.status === 404
        ? "We couldn't find that subject — it may have been unpublished."
        : "Something went wrong loading this subject.";
    return <ErrorState message={msg} backHref={`/catalogue/${params.exam}/${params.stream}`} />;
  }

  if (!subjectQuery.data) return null;
  const { subject } = subjectQuery.data;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/catalogue" className="hover:text-primary transition-smooth">
          Catalogue
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/catalogue/${params.exam}`} className="hover:text-primary transition-smooth">
          {examType}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/catalogue/${params.exam}/${params.stream}`}
          className="hover:text-primary transition-smooth capitalize"
        >
          {decodeURIComponent(params.stream)}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary font-semibold">{subject.name}</span>
      </nav>

      <PageHeader
        title={subject.name}
        description={subject.description ?? `${examType} · ${subject.stream}`}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant="secondary">{examType}</Badge>
        <Badge variant="secondary">{subject.stream}</Badge>
        <Badge variant="secondary">
          {subject.lessonCount} {subject.lessonCount === 1 ? "lesson" : "lessons"}
        </Badge>
      </div>

      {topicsQuery.isLoading && <TopicListSkeleton />}

      {topicsQuery.error && (
        <ErrorState
          message="Couldn't load topics — please try again."
          backHref={`/catalogue/${params.exam}/${params.stream}`}
        />
      )}

      {!topicsQuery.isLoading &&
        !topicsQuery.error &&
        (topicsQuery.data?.topics.length ?? 0) === 0 && (
          <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-12 text-center">
            <p className="font-bold text-primary">No topics yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;re recording new content for this subject — check back soon.
            </p>
          </div>
        )}

      {!topicsQuery.isLoading && topicsQuery.data && topicsQuery.data.topics.length > 0 && (
        <div className="space-y-4">
          {topicsQuery.data.topics.map((t) => (
            <TopicRow key={t.id} topic={t} />
          ))}
        </div>
      )}
    </>
  );
}

function TopicRow({ topic }: { topic: Topic }) {
  const { data, isLoading } = useLessons(topic.id);

  return (
    <section className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
      <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-gradient-to-r from-secondary/40 to-transparent">
        <div>
          <h3 className="font-extrabold text-primary tracking-tight">{topic.title}</h3>
          {topic.description && (
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {topic.description}
            </p>
          )}
        </div>
        <span className="text-xs font-semibold text-muted-foreground shrink-0">
          {topic.lessonCount} {topic.lessonCount === 1 ? "lesson" : "lessons"}
        </span>
      </header>

      {isLoading && (
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && data && data.lessons.length === 0 && (
        <div className="px-6 py-8 text-center text-sm text-muted-foreground">
          No lessons published in this topic yet.
        </div>
      )}

      {!isLoading && data && data.lessons.length > 0 && (
        <div className="divide-y divide-border">
          {data.lessons.map((lesson, idx) => (
            <LessonRow key={lesson.id} lesson={lesson} index={idx + 1} />
          ))}
        </div>
      )}
    </section>
  );
}

function LessonRow({ lesson, index }: { lesson: Lesson; index: number }) {
  const mins = lesson.durationSeconds ? Math.round(lesson.durationSeconds / 60) : null;

  return (
    <Link
      href={`/watch/${lesson.id}`}
      className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/40 transition-smooth group"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-white shadow-card">
        <PlayCircle className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-muted-foreground shrink-0">
            {String(index).padStart(2, "0")}
          </span>
          <h4 className="font-bold text-primary truncate group-hover:text-primary-glow transition-smooth">
            {lesson.title}
          </h4>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          {mins !== null && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {mins} min
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" /> {lesson.viewCount.toLocaleString()}
          </span>
          <span className="capitalize">{lesson.difficulty}</span>
        </div>
      </div>

      {lesson.isFree ? (
        <Badge className="bg-accent text-primary hover:bg-accent">FREE</Badge>
      ) : (
        <Lock className="h-4 w-4 text-muted-foreground" />
      )}

      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-smooth" />
    </Link>
  );
}

function SubjectPageSkeleton() {
  return (
    <>
      <Skeleton className="h-4 w-2/3 mb-4" />
      <Skeleton className="h-8 w-1/2 mb-3" />
      <Skeleton className="h-4 w-3/4 mb-6" />
      <TopicListSkeleton />
    </>
  );
}

function TopicListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-border bg-card shadow-card p-6 space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
          <div className="pt-3 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, backHref }: { message: string; backHref?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-12 text-center">
      <p className="font-bold text-primary text-lg">Something&apos;s off</p>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{message}</p>
      {backHref && (
        <Link
          href={backHref}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-glow transition-smooth"
        >
          ← Back
        </Link>
      )}
    </div>
  );
}
