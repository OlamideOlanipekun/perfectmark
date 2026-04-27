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
import { useMySubscription } from "@/hooks/use-billing";
import type { ContinueWatchingItem } from "@/lib/progress";

export default function DashboardPage() {
  const { user } = useAuth();
  const sub = useMySubscription();
  const watching = useContinueWatching(6);
  const stats = useCompletionStats();

  const firstName = user?.name.split(" ")[0] ?? "Scholar";
  const subscription = sub.data?.subscription ?? null;

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <PageHeader
          title={`Welcome back, ${firstName}`}
          description="Your path to academic excellence continues here."
        />
        <div className="hidden lg:flex items-center gap-3 pb-8">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-background bg-secondary text-[10px] grid place-items-center font-bold text-primary"
              >
                PM
              </div>
            ))}
          </div>
          <span className="text-xs font-semibold text-muted-foreground italic">
            Join 10k+ active students
          </span>
        </div>
      </div>

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
          <EmptyContinue hasSubscription={!!subscription} />
        )}

        {!watching.isLoading && watching.data && watching.data.items.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {watching.data.items.map((item, i) => (
              <ContinueCard key={item.lesson.id} item={item} delay={i * 80} />
            ))}
          </div>
        )}
      </section>

      {/* Subscription strip */}
      <section className="rounded-3xl border border-border bg-gradient-to-r from-secondary/50 to-transparent p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Subscription
          </div>
          <div className="mt-1 font-extrabold text-primary text-lg">
            {subscription
              ? `${subscription.planName} — ${subscription.status}`
              : "No active plan"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {subscription?.expiryDate
              ? `${subscription.autoRenew ? "Renews" : "Ends"} ${new Date(subscription.expiryDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`
              : "Start learning with Scholar — full library, pay-as-you-go."}
          </div>
        </div>
        <Button asChild variant="hero" className="rounded-full">
          <Link href="/subscriptions">
            {subscription ? "Manage plan" : "View plans"}
          </Link>
        </Button>
      </section>

      {/* Study Insights */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary tracking-tight px-1">Study insights</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={PlayCircle}
            value={stats.data?.completedCount ?? "—"}
            label="Lessons completed"
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
            value={stats.data ? formatHours(stats.data.totalWatchMinutes) : "—"}
            label="Hours studied"
            color="text-primary"
            loading={stats.isLoading}
          />
          <StatCard
            icon={BookOpen}
            value="240+"
            label="Total tutorials"
            color="text-primary"
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

function EmptyContinue({ hasSubscription }: { hasSubscription: boolean }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-primary shadow-glow mb-4">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <p className="font-bold text-primary text-lg">Nothing to resume yet</p>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        {hasSubscription
          ? "Start a lesson from the catalogue and we'll keep your place here."
          : "Grab a plan or try a free lesson — your continue-watching list builds itself."}
      </p>
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
      <div className="flex items-center justify-between mb-2">
        <Icon className={cn("h-4 w-4", color)} />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          LIVE
        </span>
      </div>
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

function formatHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = minutes / 60;
  return hours >= 10 ? `${Math.round(hours)}h` : `${hours.toFixed(1)}h`;
}
