import { Users, Video, CreditCard, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";

const STATS = [
  { label: "Total users",           value: "—", icon: Users,      color: "from-[#1a3a8f] to-[#2563eb]" },
  { label: "Active subscriptions",  value: "—", icon: CreditCard, color: "from-[#065f46] to-[#10b981]" },
  { label: "Revenue this month",    value: "—", icon: TrendingUp, color: "from-[#92400e] to-[#d97706]" },
  { label: "Lessons ready",         value: "—", icon: Video,      color: "from-[#7c3aed] to-[#a78bfa]" },
];

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Overview" description="Snapshot of platform activity." />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth">
            <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-glow mb-4`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-extrabold text-primary">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-[11px] text-muted-foreground/60">Awaiting backend data</div>
          </div>
        ))}
      </div>

      {/* Placeholder chart area */}
      <div className="mt-8 rounded-3xl border border-dashed border-border bg-secondary/30 p-12 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="font-bold text-primary">Analytics chart</p>
        <p className="mt-1 text-sm text-muted-foreground">Revenue and engagement trends will appear here.</p>
      </div>
    </>
  );
}
