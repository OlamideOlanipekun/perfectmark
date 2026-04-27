import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import type { ExamType } from "@/types";

const EXAMS: { type: ExamType; blurb: string; color: string }[] = [
  { type: "WAEC",  blurb: "West African Senior School Certificate Examination.", color: "from-[#1a3a8f] to-[#2563eb]" },
  { type: "NECO",  blurb: "National Examinations Council of Nigeria.",           color: "from-[#065f46] to-[#10b981]" },
  { type: "UTME",  blurb: "Unified Tertiary Matriculation Examination (JAMB).",  color: "from-[#7c3aed] to-[#a78bfa]" },
];

export default function CataloguePage() {
  return (
    <>
      <PageHeader
        title="Catalogue"
        description="Choose the examination you are preparing for."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {EXAMS.map(({ type, blurb, color }) => (
          <Link key={type} href={`/catalogue/${type.toLowerCase()}`} className="group">
            <div className="h-full rounded-3xl border border-border bg-card shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1 overflow-hidden">
              <div className={`h-2 w-full bg-gradient-to-r ${color}`} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                    {type}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{blurb}</p>
                <p className="mt-3 text-xs text-primary font-semibold">Browse subjects by stream →</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
