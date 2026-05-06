"use client";

import Link from "next/link";
import {
  Clock,
  Eye,
  Lock,
  PlayCircle,
  ShieldAlert,
} from "lucide-react";
import { VideoPlayer } from "@/components/player/video-player";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLesson } from "@/hooks/use-catalogue";
import { useStream } from "@/hooks/use-stream";
import { ApiError } from "@/lib/api";

interface WatchPageProps {
  params: { lessonId: string };
}

export default function WatchPage({ params }: WatchPageProps) {
  const { lessonId } = params;
  const lessonQuery = useLesson(lessonId);
  const streamQuery = useStream(lessonId);

  return (
    <div className="animate-fade-in grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader
            title={lessonQuery.data?.lesson.title ?? "Loading…"}
            description={
              lessonQuery.data?.lesson.description ?? "Preparing your lesson"
            }
          />
        </div>

        <PlayerShell
          lessonId={lessonId}
          streamQuery={streamQuery}
          lessonLoading={lessonQuery.isLoading}
        />

        <LessonMeta lessonQuery={lessonQuery} streamQuery={streamQuery} />
      </div>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
          <div className="bg-secondary/40 p-5 border-b border-border">
            <h2 className="font-extrabold text-primary tracking-tight">About this lesson</h2>
          </div>
          <div className="p-5 text-sm text-muted-foreground leading-relaxed space-y-3">
            {lessonQuery.data?.lesson.description ? (
              <p>{lessonQuery.data.lesson.description}</p>
            ) : (
              <>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-3/4" />
              </>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-primary p-6 text-white shadow-elegant relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <h3 className="font-bold text-lg mb-2 relative z-10">Need a subscription?</h3>
          <p className="text-white/70 text-sm mb-4 relative z-10">
            Unlock the full library and get access to every lesson across WAEC, NECO and JAMB.
          </p>
          <Button asChild className="w-full rounded-xl bg-white text-primary hover:bg-white/90 font-bold relative z-10">
            <Link href="/subscriptions">View pricing</Link>
          </Button>
        </div>
      </aside>
    </div>
  );
}

type StreamQuery = ReturnType<typeof useStream>;
type LessonQuery = ReturnType<typeof useLesson>;

function PlayerShell({
  lessonId,
  streamQuery,
  lessonLoading,
}: {
  lessonId: string;
  streamQuery: StreamQuery;
  lessonLoading: boolean;
}) {
  if (streamQuery.isLoading || lessonLoading) {
    return (
      <div className="relative rounded-[2rem] overflow-hidden border border-primary/10 shadow-elegant bg-black aspect-video">
        <Skeleton className="absolute inset-0" />
      </div>
    );
  }

  if (streamQuery.error) {
    return <StreamError lessonId={lessonId} error={streamQuery.error} />;
  }

  if (!streamQuery.data) {
    return null;
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-primary rounded-[2rem] opacity-20 blur-xl group-hover:opacity-30 transition-smooth" />
      <div className="relative rounded-[2rem] overflow-hidden border border-primary/10 shadow-elegant bg-black aspect-video">
        <VideoPlayer
          lessonId={lessonId}
          manifestUrl={streamQuery.data.manifestUrl}
          initialPosition={streamQuery.data.lastPositionSeconds}
          watermark={streamQuery.data.watermark}
        />
      </div>
    </div>
  );
}

function StreamError({ lessonId, error }: { lessonId: string; error: unknown }) {
  const status = error instanceof ApiError ? error.status : null;
  const code = error instanceof ApiError ? error.code : null;

  if (status === 403 && code === "FORBIDDEN") {
    const isCapIssue = error instanceof ApiError && /too many devices/i.test(error.message);
    return (
      <div className="relative rounded-[2rem] border border-border bg-card p-12 text-center shadow-card">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/10 mb-5">
          {isCapIssue ? (
            <ShieldAlert className="h-8 w-8 text-accent" />
          ) : (
            <Lock className="h-8 w-8 text-accent" />
          )}
        </div>
        <h3 className="font-extrabold text-primary text-xl">
          {isCapIssue ? "Too many active devices" : "Subscription required"}
        </h3>
        <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
          {isCapIssue
            ? "You&apos;re already watching on the maximum number of devices. Close one of them and try again."
            : "This lesson is part of the subscribed catalogue. Start a free trial to unlock it."}
        </p>
        {!isCapIssue && (
          <Button asChild variant="hero" className="mt-6 rounded-full">
            <Link href="/subscriptions">See plans</Link>
          </Button>
        )}
      </div>
    );
  }

  if (status === 404) {
    return (
      <div className="relative rounded-[2rem] border border-border bg-card p-12 text-center shadow-card">
        <h3 className="font-extrabold text-primary text-xl">Lesson not found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This lesson may have been unpublished. Browse the catalogue for what&apos;s currently available.
        </p>
        <Button asChild variant="softOutline" className="mt-6 rounded-full">
          <Link href="/catalogue">Back to catalogue</Link>
        </Button>
      </div>
    );
  }

  if (code === "FORBIDDEN" && status === 403 && error instanceof ApiError && /not ready/i.test(error.message)) {
    return (
      <div className="relative rounded-[2rem] border border-border bg-card p-12 text-center shadow-card">
        <h3 className="font-extrabold text-primary text-xl">Lesson not ready yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The video for this lesson is still processing. Check back in a few minutes.
        </p>
      </div>
    );
  }

  // Fallthrough: network / 5xx
  void lessonId;
  return (
    <div className="relative rounded-[2rem] border border-border bg-card p-12 text-center shadow-card">
      <h3 className="font-extrabold text-primary text-xl">Couldn&apos;t load the video</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Check your connection and try refreshing the page.
      </p>
    </div>
  );
}

function LessonMeta({
  lessonQuery,
  streamQuery,
}: {
  lessonQuery: LessonQuery;
  streamQuery: StreamQuery;
}) {
  const lesson = lessonQuery.data?.lesson;
  const mins = lesson?.durationSeconds ? Math.round(lesson.durationSeconds / 60) : null;

  if (lessonQuery.isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 shadow-card space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    );
  }
  if (!lesson) return null;

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-card space-y-6">
      <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-muted-foreground">
        {mins !== null && (
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {mins} minutes
          </span>
        )}
        <span className="inline-flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          {lesson.viewCount.toLocaleString()} views
        </span>
        <Badge variant="secondary" className="capitalize">
          {lesson.difficulty}
        </Badge>
        {lesson.isFree && (
          <Badge className="bg-accent text-primary hover:bg-accent">FREE</Badge>
        )}
        {streamQuery.data && (
          <span className="inline-flex items-center gap-2 ml-auto text-xs">
            <PlayCircle className="h-3 w-3" />
            {streamQuery.data.activeStreams}/{streamQuery.data.maxConcurrentStreams} devices
          </span>
        )}
      </div>

      {lesson.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {lesson.tags.map((t) => (
            <Badge key={t} variant="outline" className="text-[11px]">
              {t}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
