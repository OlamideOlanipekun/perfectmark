"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { useSubjects } from "@/hooks/use-catalogue";
import type { ExamType } from "@/types";

const EXAMS: { type: ExamType; blurb: string; color: string }[] = [
  { type: "WAEC",  blurb: "West African Senior School Certificate Examination.", color: "from-[#1a3a8f] to-[#2563eb]" },
  { type: "NECO",  blurb: "National Examinations Council of Nigeria.",           color: "from-[#065f46] to-[#10b981]" },
  { type: "UTME",  blurb: "Unified Tertiary Matriculation Examination (JAMB).",  color: "from-[#7c3aed] to-[#a78bfa]" },
];

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  
  const subjects = useSubjects({ search: search.length >= 2 ? search : undefined });

  return (
    <>
      <PageHeader
        title="Catalogue"
        description="Choose the examination you are preparing for or search for subjects."
      />

      {/* Global Search */}
      <div className="relative mb-10 max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search subjects (e.g. Mathematics, Physics)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth shadow-elegant"
        />
        {subjects.isFetching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {search.length >= 2 ? (
        <div className="animate-fade-in">
          <h2 className="text-xl font-extrabold text-primary mb-6">Search Results</h2>
          {subjects.isLoading ? (
            <div className="grid gap-5 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 rounded-3xl bg-secondary/30 animate-pulse" />
              ))}
            </div>
          ) : (subjects.data?.subjects.length ?? 0) > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {subjects.data?.subjects.map((s) => (
                <Link
                  key={s.id}
                  href={`/catalogue/${s.examType.toLowerCase()}/${s.stream.toLowerCase()}/${s.slug}`}
                  className="group"
                >
                  <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {s.examType} · {s.stream}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                    </div>
                    <h3 className="font-extrabold text-primary">{s.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-3xl border border-dashed border-border bg-secondary/30">
              <p className="text-muted-foreground">No subjects found matching &quot;{search}&quot;</p>
            </div>
          )}
        </div>
      ) : (
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
      )}
    </>
  );
}
