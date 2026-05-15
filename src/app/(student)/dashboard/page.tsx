"use client";

import Link from "next/link";
import {
  BookOpen,
  Clock,
  PlayCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useContinueWatching, useCompletionStats } from "@/hooks/use-progress";
import { useCatalogueStats } from "@/hooks/use-catalogue";
import type { ContinueWatchingItem } from "@/lib/progress";

export default function DashboardPage() {
  const { user } = useAuth();
  const watching = useContinueWatching(6);
  const stats = useCompletionStats();
  const catalogueStats = useCatalogueStats();

  const firstName = user?.name?.trim().split(" ")[0] ?? "";
  const greeting = getTimeBasedGreeting();

  return (
    <div className="animate-fade-in space-y-10">
      <PageHeader
        title={firstName ? `${greeting}, ${firstName}` : `${greeting} 👋`}
        description="Your path to academic excellence continues here."
      />

      {/* Continue Watching */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold text-primary tracking-tight">Continue watching</h2>
          <Link
            href="/catalogue"
            className="text-sm font-semibold text-primary hover:text-primary-glow transition-smooth"
          >
            Browse catalogue →
          </Link>
        </div>

        {watching.isLoading && <ContinueSkeleton />}

        {!watching.isLoading && (watching.data?.items.length ?? 0) === 0 && (
          <EmptyContinue
            hasCompletedLessons={(stats.data?.completedCount ?? 0) > 0}
          />
        )}

        {!watching.isLoading && watching.data && watching.data.items.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {watching.data.items.map((item, i) => (
              <ContinueCard key={item.lesson.id} item={item} delay={i * 80} />
            ))}
          </div>
        )}
      </section>


      {/* Study Insights */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary tracking-tight px-1">Study insights</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={PlayCircle}
            value={stats.data?.completedCount ?? "—"}
            label={pluralLabel(stats.data?.completedCount, "Lesson completed", "Lessons completed")}
            color="text-primary"
            loading={stats.isLoading}
          />
          <StatCard
            icon={Zap}
            value={stats.data?.inProgressCount ?? "—"}
            label="In progress"
            color="text-accent"
            loading={stats.isLoading}
          />
          <StatCard
            icon={Clock}
            value={stats.data && stats.data.totalWatchMinutes > 0 ? formatHours(stats.data.totalWatchMinutes) : "—"}
            label="Hours studied"
            color="text-primary"
            loading={stats.isLoading}
          />
          <StatCard
            icon={BookOpen}
            value={catalogueStats.data?.totalLessons ?? "—"}
            label={pluralLabel(catalogueStats.data?.totalLessons, "Lesson in catalogue", "Lessons in catalogue")}
            color="text-primary"
            loading={catalogueStats.isLoading}
          />
        </div>
      </section>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────

function ContinueCard({ item, delay }: { item: ContinueWatchingItem; delay: number }) {
  const mins = item.lesson.durationSeconds
    ? Math.max(1, Math.round(item.lesson.durationSeconds / 60))
    : null;
  const remaining = item.lesson.durationSeconds
    ? Math.max(0, item.lesson.durationSeconds - item.progress.positionSeconds)
    : null;
  const remainingMins = remaining !== null ? Math.max(1, Math.round(remaining / 60)) : null;

  return (
    <Link
      href={`/watch/${item.lesson.id}`}
      style={{ animationDelay: `${delay}ms` }}
      className="group animate-fade-in-up relative overflow-hidden rounded-3xl border border-border bg-card shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth block"
    >
      <div className="relative aspect-[16/10] bg-gradient-primary overflow-hidden">
        {item.lesson.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.lesson.thumbnailUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <span className="absolute top-3 left-3 rounded-full bg-primary/90 text-white text-[11px] font-semibold px-3 py-1 backdrop-blur">
          {item.lesson.examType} · {item.lesson.subjectName}
        </span>
        {item.lesson.isFree && (
          <span className="absolute top-3 right-3 rounded-full bg-accent text-primary text-[11px] font-bold px-3 py-1">
            FREE
          </span>
        )}
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-background/95 text-primary shadow-elegant ring-4 ring-white/30 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all">
            <PlayCircle className="h-6 w-6 fill-current" />
          </div>
        </div>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-accent"
            style={{ width: `${item.percentComplete}%` }}
          />
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-primary line-clamp-2 min-h-[3rem] group-hover:text-primary-glow transition-smooth">
          {item.lesson.title}
        </h3>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{item.percentComplete}% watched</span>
          {remainingMins !== null && mins !== null && (
            <span>{remainingMins} min left</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ContinueSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-border bg-card shadow-card"
        >
          <Skeleton className="aspect-[16/10] w-full" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyContinue({ hasCompletedLessons }: { hasCompletedLessons: boolean }) {
  const title = hasCompletedLessons ? "All caught up" : "Nothing to resume yet";
  const body = hasCompletedLessons
    ? "You've finished what you started. Browse the catalogue for what's next."
    : "Start a lesson from the catalogue and we'll keep your place here.";

  return (
    <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-primary shadow-glow mb-4">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <p className="font-bold text-primary text-lg">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{body}</p>
      <Button asChild variant="hero" className="rounded-full mt-5">
        <Link href="/catalogue">Browse catalogue</Link>
      </Button>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
  loading,
}: {
  icon: typeof PlayCircle;
  value: string | number;
  label: string;
  color: string;
  loading?: boolean;
}) {
  return (
    <div className="group rounded-3xl border border-border bg-white px-6 py-5 shadow-card hover:border-primary/20 transition-smooth">
      <Icon className={cn("h-4 w-4 mb-3", color)} />
      {loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <div className="text-3xl font-black text-primary tracking-tighter group-hover:scale-105 transition-transform origin-left">
          {value}
        </div>
      )}
      <div className="mt-1 text-xs font-semibold text-muted-foreground truncate">{label}</div>
    </div>
  );
}

function pluralLabel(
  count: number | undefined,
  singular: string,
  plural: string,
): string {
  return count === 1 ? singular : plural;
}

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = minutes / 60;
  return hours >= 10 ? `${Math.round(hours)}h` : `${hours.toFixed(1)}h`;
}
