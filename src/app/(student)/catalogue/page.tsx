"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Loader2, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { useSubjects } from "@/hooks/use-catalogue";
import { streamToSlug } from "@/lib/streams";
import { useAuth } from "@/context/auth-context";
import type { ExamType } from "@/types";

const EXAMS: { type: ExamType; blurb: string; color: string }[] = [
  { type: "WAEC", blurb: "West African Senior School Certificate Examination.", color: "from-[#1a3a8f] to-[#2563eb]" },
  { type: "NECO", blurb: "National Examinations Council of Nigeria.",           color: "from-[#065f46] to-[#10b981]" },
  { type: "UTME", blurb: "Unified Tertiary Matriculation Examination (JAMB).",  color: "from-[#7c3aed] to-[#a78bfa]" },
];

const JSS_LEVELS = ["JSS1", "JSS2", "JSS3"];

function isJssStudent(classLevel: string | null, stream: string | null): boolean {
  if (stream === "Junior Secondary") return true;
  if (classLevel && JSS_LEVELS.includes(classLevel)) return true;
  return false;
}

export default function CataloguePage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const isJss = isJssStudent(user?.classLevel ?? null, user?.stream ?? null);

  // For JSS: fetch their subjects directly (stream filtered).
  // For search: fetch matching subjects across all streams.
  // For SS landing: no subject fetch needed (just show exam cards).
  const jssSubjects = useSubjects(
    isJss && !search ? { stream: "Junior Secondary" } : {},
  );
  const searchSubjects = useSubjects(
    search.length >= 2 ? { search, ...(isJss ? { stream: "Junior Secondary" } : {}) } : {},
  );

  const activeQuery = search.length >= 2 ? searchSubjects : jssSubjects;

  return (
    <>
      <PageHeader
        title="Catalogue"
        description={
          isJss
            ? "Browse your JSS subjects and lessons."
            : "Choose the examination you are preparing for or search for subjects."
        }
      />

      {/* Search */}
      <div className="relative mb-10 max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={isJss ? "Search JSS subjects…" : "Search subjects (e.g. Mathematics, Physics)…"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card pl-12 pr-4 py-4 text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth shadow-elegant"
        />
        {activeQuery.isFetching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* ── JSS student view ─────────────────────────────────────────────── */}
      {isJss && (
        <>
          {search.length >= 2 ? (
            <SearchResults query={searchSubjects} search={search} />
          ) : (
            <JssSubjectGrid query={jssSubjects} />
          )}
        </>
      )}

      {/* ── SS student / guest view ──────────────────────────────────────── */}
      {!isJss && (
        <>
          {search.length >= 2 ? (
            <SearchResults query={searchSubjects} search={search} />
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
      )}
    </>
  );
}

// ── JSS subject grid ──────────────────────────────────────────────────────

function JssSubjectGrid({ query }: { query: ReturnType<typeof useSubjects> }) {
  if (query.isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-3xl bg-secondary/30 animate-pulse" />
        ))}
      </div>
    );
  }

  const subjects = query.data?.subjects ?? [];

  if (subjects.length === 0) {
    return (
      <div className="text-center py-16 rounded-3xl border border-dashed border-border bg-secondary/30">
        <div className="text-4xl mb-3">📚</div>
        <p className="font-bold text-primary">JSS subjects coming soon</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;re adding Junior Secondary content. Check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((s) => (
        <Link
          key={s.id}
          href={`/catalogue/${s.examType.toLowerCase()}/${streamToSlug(s.stream)}/${s.slug}`}
          className="group"
        >
          <article className="h-full rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-primary text-lg tracking-tight">{s.name}</h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth" />
            </div>
            {s.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {s.description}
              </p>
            )}
            <div className="mt-5 flex items-center gap-2 text-xs text-primary font-semibold">
              <PlayCircle className="h-4 w-4" />
              {s.lessonCount} {s.lessonCount === 1 ? "lesson" : "lessons"}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

// ── Search results (shared) ───────────────────────────────────────────────

function SearchResults({
  query,
  search,
}: {
  query: ReturnType<typeof useSubjects>;
  search: string;
}) {
  if (query.isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 rounded-3xl bg-secondary/30 animate-pulse" />
        ))}
      </div>
    );
  }

  const subjects = query.data?.subjects ?? [];

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12 rounded-3xl border border-dashed border-border bg-secondary/30">
        <p className="text-muted-foreground">No subjects found matching &quot;{search}&quot;</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-extrabold text-primary mb-6">Search Results</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {subjects.map((s) => (
          <Link
            key={s.id}
            href={`/catalogue/${s.examType.toLowerCase()}/${streamToSlug(s.stream)}/${s.slug}`}
            className="group"
          >
            <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {s.stream}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-smooth" />
              </div>
              <h3 className="font-extrabold text-primary">{s.name}</h3>
              {s.description && (
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{s.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
