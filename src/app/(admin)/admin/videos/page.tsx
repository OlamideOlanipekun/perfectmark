"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search, RefreshCw, Loader2, CheckCircle2, Clock, AlertTriangle, FileVideo, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { adminCatalogue } from "@/lib/admin-catalogue";
import type { Lesson, LessonStatus } from "@/lib/catalogue";

const STATUS_CONFIG: Record<LessonStatus, { label: string; icon: React.ElementType; color: string }> = {
  draft:       { label: "Draft",       icon: FileVideo,     color: "text-muted-foreground" },
  uploading:   { label: "Uploading",   icon: Clock,         color: "text-blue-500" },
  transcoding: { label: "Transcoding", icon: Loader2,       color: "text-amber-500" },
  ready:       { label: "Ready",       icon: CheckCircle2,  color: "text-emerald-500" },
  failed:      { label: "Failed",      icon: XCircle,       color: "text-destructive" },
};

export default function AdminVideosPage() {
  const [search, setSearch] = useState("");

  const subjects = useQuery({
    queryKey: ["admin", "catalogue", "subjects"],
    queryFn: () => adminCatalogue.listSubjects(),
    staleTime: 5 * 60_000,
  });

  // Flatten all lessons across all subjects/topics
  const allLessons = useQuery<Lesson[]>({
    queryKey: ["admin", "all-lessons"],
    queryFn: async () => {
      if (!subjects.data) return [];
      const results: Lesson[] = [];
      for (const subject of subjects.data.subjects) {
        const topicsRes = await adminCatalogue.listTopics(subject.id);
        for (const topic of topicsRes.topics) {
          const lessonsRes = await adminCatalogue.listLessons(topic.id);
          results.push(...lessonsRes.lessons);
        }
      }
      return results;
    },
    enabled: !!subjects.data,
    staleTime: 30_000,
  });

  const filtered = (allLessons.data ?? []).filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase())
  );

  const isLoading = subjects.isLoading || allLessons.isLoading;

  return (
    <>
      <PageHeader
        title="Lessons"
        description="Upload new lessons and manage the catalogue."
        action={
          <Button asChild variant="hero" className="rounded-full">
            <Link href="/admin/videos/upload">
              <Plus className="mr-1 h-4 w-4" />
              Upload lesson
            </Link>
          </Button>
        }
      />

      {/* Search bar */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search lessons…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card pl-11 pr-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth shadow-card"
        />
      </div>

      <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/40 hover:bg-secondary/40">
              <TableHead className="font-bold text-primary">Title</TableHead>
              <TableHead className="font-bold text-primary">Subject</TableHead>
              <TableHead className="font-bold text-primary">Status</TableHead>
              <TableHead className="font-bold text-primary">Duration</TableHead>
              <TableHead className="font-bold text-primary">Views</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}>
                      <div className="h-4 rounded bg-secondary animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}

            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                  <div className="text-4xl mb-3">🎬</div>
                  <p className="font-semibold text-primary">
                    {search ? "No lessons match your search" : "No lessons yet"}
                  </p>
                  <p className="text-sm mt-1">
                    {search ? "Try a different keyword" : "Upload your first lesson to get started."}
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && filtered.map((lesson) => {
              const status = STATUS_CONFIG[lesson.status];
              const StatusIcon = status.icon;
              const mins = lesson.durationSeconds
                ? Math.round(lesson.durationSeconds / 60)
                : null;

              return (
                <TableRow key={lesson.id} className="hover:bg-secondary/20 transition-smooth">
                  <TableCell>
                    <div className="font-semibold text-primary line-clamp-1">{lesson.title}</div>
                    {lesson.isFree && (
                      <span className="text-[10px] font-bold text-accent uppercase">Free</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{lesson.subjectId}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${status.color}`}>
                      <StatusIcon className={`h-3.5 w-3.5 ${lesson.status === "transcoding" ? "animate-spin" : ""}`} />
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {mins !== null ? `${mins} min` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {lesson.viewCount.toLocaleString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {allLessons.error && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Could not load all lessons — some subjects may be missing.
          <Button variant="ghost" size="sm" onClick={() => void allLessons.refetch()} className="ml-auto rounded-full gap-1">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}
    </>
  );
}
