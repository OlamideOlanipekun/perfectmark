import { PageHeader } from "@/components/shared/page-header";

export default function AdminReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Revenue and engagement over time." />

      <div className="grid gap-5 md:grid-cols-3 mb-6">
        {["Total revenue", "New subscriptions", "Lesson completions"].map((label) => (
          <div key={label} className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="text-3xl font-extrabold text-primary">—</div>
            <div className="mt-1 text-sm text-muted-foreground">{label} this month</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-dashed border-border bg-secondary/30 p-16 text-center">
        <div className="text-5xl mb-4">📈</div>
        <p className="font-bold text-primary text-lg">Charts coming soon</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Revenue and engagement charts will render here once analytics endpoints are available.
        </p>
      </div>
    </>
  );
}
