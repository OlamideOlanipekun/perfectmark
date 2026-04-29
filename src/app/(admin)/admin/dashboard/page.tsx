"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, Video, CreditCard, TrendingUp, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  revenueThisMonthKobo: number;
  totalLessons: number;
  newUsersThisMonth: number;
  completionsThisMonth: number;
}

function formatNaira(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(kobo / 100);
}

export default function AdminDashboardPage() {
  const stats = useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: () => api.get<AdminStats>("/admin/stats"),
    staleTime: 60_000,
    retry: false,
  });

  const CARDS = [
    {
      label: "Total users",
      value: stats.data ? stats.data.totalUsers.toLocaleString() : "—",
      sub: stats.data ? `+${stats.data.newUsersThisMonth} this month` : "Loading…",
      icon: Users,
      color: "from-[#1a3a8f] to-[#2563eb]",
    },
    {
      label: "Active subscriptions",
      value: stats.data ? stats.data.activeSubscriptions.toLocaleString() : "—",
      sub: "Currently active",
      icon: CreditCard,
      color: "from-[#065f46] to-[#10b981]",
    },
    {
      label: "Revenue this month",
      value: stats.data ? formatNaira(stats.data.revenueThisMonthKobo) : "—",
      sub: "From subscriptions",
      icon: TrendingUp,
      color: "from-[#92400e] to-[#d97706]",
    },
    {
      label: "Lessons ready",
      value: stats.data ? stats.data.totalLessons.toLocaleString() : "—",
      sub: "Published lessons",
      icon: Video,
      color: "from-[#7c3aed] to-[#a78bfa]",
    },
  ];

  return (
    <>
      <PageHeader title="Overview" description="Snapshot of platform activity." />

      {stats.isLoading && (
        <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading dashboard data…</span>
        </div>
      )}

      {stats.error && (
        <div className="mb-6 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive text-center">
          Could not load stats — make sure the API is running and the admin account is set up.
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth"
          >
            <div
              className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-glow mb-4`}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-extrabold text-primary">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-1 text-[11px] text-muted-foreground/60">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick stats row */}
      {stats.data && (
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-bold text-primary mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">New registrations</span>
                <span className="font-bold text-primary">{stats.data.newUsersThisMonth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lesson completions</span>
                <span className="font-bold text-primary">{stats.data.completionsThisMonth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Active subscriptions</span>
                <span className="font-bold text-primary">{stats.data.activeSubscriptions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-bold text-primary">{formatNaira(stats.data.revenueThisMonthKobo)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-primary p-6 shadow-elegant text-white">
            <h3 className="font-bold mb-4">Platform Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Total users</span>
                <span className="font-bold">{stats.data.totalUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Total lessons</span>
                <span className="font-bold">{stats.data.totalLessons}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Conversion rate</span>
                <span className="font-bold">
                  {stats.data.totalUsers > 0
                    ? `${((stats.data.activeSubscriptions / stats.data.totalUsers) * 100).toFixed(1)}%`
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!stats.data && !stats.isLoading && (
        <div className="mt-8 rounded-3xl border border-dashed border-border bg-secondary/30 p-12 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="font-bold text-primary">Analytics chart</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Revenue and engagement trends will appear here once the API is connected.
          </p>
        </div>
      )}
    </>
  );
}
