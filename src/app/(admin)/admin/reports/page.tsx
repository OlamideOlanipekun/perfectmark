"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, TrendingUp, Users, BookOpen, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { api } from "@/lib/api";

interface AdminReports {
  revenueThisMonthKobo: number;
  revenuePrevMonthKobo: number;
  newSubscriptionsThisMonth: number;
  lessonCompletionsThisMonth: number;
  newUsersThisMonth: number;
  monthlyRevenue: { month: string; revenueKobo: number }[];
}

function formatNaira(kobo: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 0,
  }).format(kobo / 100);
}

function pctChange(curr: number, prev: number): string {
  if (prev === 0) return curr > 0 ? "+100%" : "—";
  const pct = ((curr - prev) / prev) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export default function AdminReportsPage() {
  const reports = useQuery<AdminReports>({
    queryKey: ["admin", "reports"],
    queryFn: () => api.get<AdminReports>("/admin/reports"),
    staleTime: 60_000,
    retry: false,
  });

  const maxRevenue = Math.max(...(reports.data?.monthlyRevenue.map((m) => m.revenueKobo) ?? [1]));

  return (
    <>
      <PageHeader title="Reports" description="Revenue and engagement over time." />

      {reports.isLoading && (
        <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading reports…</span>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-5 md:grid-cols-3 mb-8">
        {[
          {
            label: "Revenue this month",
            value: reports.data ? formatNaira(reports.data.revenueThisMonthKobo) : "—",
            sub: reports.data ? `${pctChange(reports.data.revenueThisMonthKobo, reports.data.revenuePrevMonthKobo)} vs last month` : "Loading…",
            icon: TrendingUp,
            color: "from-[#1a3a8f] to-[#2563eb]",
          },
          {
            label: "New subscriptions",
            value: reports.data ? String(reports.data.newSubscriptionsThisMonth) : "—",
            sub: "This month",
            icon: CreditCard,
            color: "from-[#065f46] to-[#10b981]",
          },
          {
            label: "Lesson completions",
            value: reports.data ? String(reports.data.lessonCompletionsThisMonth) : "—",
            sub: "This month",
            icon: BookOpen,
            color: "from-[#7c3aed] to-[#a78bfa]",
          },
        ].map((card) => (
          <div key={card.label} className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${card.color} text-white mb-4`}>
              <card.icon className="h-4 w-4" />
            </div>
            <div className="text-3xl font-extrabold text-primary">{card.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{card.label} this month</div>
            <div className="mt-1 text-xs text-muted-foreground/70">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue Bar Chart */}
      {reports.data?.monthlyRevenue && reports.data.monthlyRevenue.length > 0 ? (
        <div className="rounded-3xl border border-border bg-card shadow-card p-8">
          <h2 className="font-extrabold text-primary mb-6">Monthly Revenue</h2>
          <div className="flex items-end gap-3 h-48">
            {reports.data.monthlyRevenue.map((m) => {
              const heightPct = maxRevenue > 0 ? (m.revenueKobo / maxRevenue) * 100 : 0;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-smooth">
                    {formatNaira(m.revenueKobo)}
                  </div>
                  <div
                    className="w-full rounded-t-xl bg-gradient-primary transition-all duration-500"
                    style={{ height: `${Math.max(heightPct, 4)}%` }}
                  />
                  <div className="text-[10px] text-muted-foreground font-semibold">
                    {m.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : !reports.isLoading && (
        <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-16 text-center">
          <div className="text-5xl mb-4">📈</div>
          <p className="font-bold text-primary text-lg">No revenue data yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Charts will appear here once the reports API returns data.
          </p>
        </div>
      )}

      {/* New users card */}
      {reports.data && (
        <div className="mt-6 rounded-3xl bg-gradient-primary text-white p-6 shadow-elegant flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 border border-white/20">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="text-3xl font-extrabold">{reports.data.newUsersThisMonth}</div>
              <div className="text-white/70 text-sm">New users this month</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/70">Completions</div>
            <div className="text-2xl font-extrabold">{reports.data.lessonCompletionsThisMonth}</div>
          </div>
        </div>
      )}
    </>
  );
}
