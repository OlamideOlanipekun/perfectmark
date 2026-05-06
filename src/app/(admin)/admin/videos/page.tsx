"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Plus, Search, RefreshCw, Loader2, CheckCircle2, Clock,
  AlertTriangle, FileVideo, XCircle, Pencil, Trash2,
  Globe, EyeOff, MoreHorizontal,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { adminCatalogue } from "@/lib/admin-catalogue";
import type { Lesson, LessonStatus, Subject, Topic } from "@/lib/catalogue";
import type { CreateLessonInput, UpdateLessonInput } from "@/lib/admin-catalogue";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LessonStatus, { label: string; icon: React.ElementType; color: string }> = {
  draft:       { label: "Draft",       icon: FileVideo,    color: "text-muted-foreground" },
  uploading:   { label: "Uploading",   icon: Clock,        color: "text-blue-500" },
  transcoding: { label: "Transcoding", icon: Loader2,      color: "text-amber-500" },
  ready:       { label: "Ready",       icon: CheckCircle2, color: "text-emerald-500" },
  failed:      { label: "Failed",      icon: XCircle,      color: "text-destructive" },
};

const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

interface FlatLesson extends Lesson {
  subjectName: string;
  topicTitle: string;
}

// ── Lesson Form Dialog ────────────────────────────────────────────────────────

interface LessonFormDialogProps {
  open: boolean;
  onClose: () => void;
  editing?: FlatLesson | null;
  subjects: Subject[];
  topicsBySubject: Map<string, Topic[]>;
  onTopicsFetch: (subjectId: string) => Promise<void>;
}

function LessonFormDialog({
  open, onClose, editing, subjects, topicsBySubject, onTopicsFetch,
}: LessonFormDialogProps) {
  const qc = useQueryClient();
  const isEdit = !!editing;

  const [subjectId, setSubjectId] = useState(editing ? (
    subjects.find((s) => topicsBySubject.get(s.id)?.some((t) => t.id === editing.topicId))?.id ?? ""
  ) : "");
  const [topicId, setTopicId] = useState(editing?.topicId ?? "");
  const [title, setTitle] = useState(editing?.title ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">(editing?.difficulty ?? "intermediate");
  const [isFree, setIsFree] = useState(editing?.isFree ?? false);
  const [sortOrder, setSortOrder] = useState(String(editing?.sortOrder ?? 0));
  const [tags, setTags] = useState((editing?.tags ?? []).join(", "));
  const [error, setError] = useState("");

  const topics = subjectId ? (topicsBySubject.get(subjectId) ?? []) : [];

  const mutation = useMutation({
    mutationFn: async () => {
      const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
      if (isEdit && editing) {
        const body: UpdateLessonInput = {
          title: title.trim(),
          description: description.trim() || undefined,
          difficulty,
          isFree,
          sortOrder: Number(sortOrder) || 0,
          tags: tagList,
        };
        return adminCatalogue.updateLesson(editing.id, body);
      } else {
        const body: CreateLessonInput = {
          topicId,
          title: title.trim(),
          description: description.trim() || undefined,
          difficulty,
          isFree,
          sortOrder: Number(sortOrder) || 0,
          tags: tagList,
        };
        return adminCatalogue.createLesson(body);
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "all-lessons"] });
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  function handleSubjectChange(sid: string) {
    setSubjectId(sid);
    setTopicId("");
    if (!topicsBySubject.has(sid)) void onTopicsFetch(sid);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Title is required.");
    if (!isEdit && !topicId) return setError("Please select a topic.");
    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Lesson" : "Create Lesson"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {!isEdit && (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary">Subject</label>
                <Select value={subjectId} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subject…" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary">Topic</label>
                <Select value={topicId} onValueChange={setTopicId} disabled={!subjectId || topics.length === 0}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={subjectId ? "Select topic…" : "Select a subject first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-primary">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="Lesson title"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-primary">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={4000}
              rows={3}
              placeholder="Brief description of the lesson…"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-primary">Difficulty</label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-primary">Sort order</label>
              <input
                type="number"
                min={0}
                max={10000}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-primary">Tags <span className="text-muted-foreground font-normal">(comma-separated)</span></label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. algebra, equations, ss2"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="h-4 w-4 rounded accent-primary"
            />
            <span className="text-sm font-medium text-primary">Free preview (visible without subscription)</span>
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full">Cancel</Button>
            <Button type="submit" variant="hero" className="rounded-full" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {isEdit ? "Save changes" : "Create lesson"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Single Delete Dialog ──────────────────────────────────────────────────────

function DeleteDialog({ lesson, onClose }: { lesson: FlatLesson; onClose: () => void }) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => adminCatalogue.deleteLesson(lesson.id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "all-lessons"] });
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete lesson?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="font-semibold text-primary">&ldquo;{lesson.title}&rdquo;</span> will be
          soft-deleted and hidden from students. This cannot be undone from the UI.
        </p>
        {mutation.error && (
          <p className="text-sm text-destructive mt-2">{(mutation.error as Error).message}</p>
        )}
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="rounded-full">Cancel</Button>
          <Button variant="destructive" className="rounded-full" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Trash2 className="h-4 w-4 mr-1" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Bulk Delete Dialog ────────────────────────────────────────────────────────

function BulkDeleteDialog({
  ids, onClose, onDone,
}: { ids: string[]; onClose: () => void; onDone: () => void }) {
  const qc = useQueryClient();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      setProgress(0);
      for (let i = 0; i < ids.length; i++) {
        await adminCatalogue.deleteLesson(ids[i]);
        setProgress(i + 1);
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "all-lessons"] });
      onDone();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <Dialog open onOpenChange={(v) => { if (!v && !mutation.isPending) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete {ids.length} lesson{ids.length !== 1 ? "s" : ""}?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-1">
          All {ids.length} selected lesson{ids.length !== 1 ? "s" : ""} will be soft-deleted and
          hidden from students. This cannot be undone from the UI.
        </p>

        {mutation.isPending && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Deleting…</span>
              <span>{progress} / {ids.length}</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-destructive transition-all"
                style={{ width: `${(progress / ids.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-destructive mt-2">{error}</p>}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending} className="rounded-full">
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="rounded-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? <Loader2 className="h-4 w-4 animate-spin mr-1" />
              : <Trash2 className="h-4 w-4 mr-1" />}
            Delete all
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminVideosPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LessonStatus | "all">("all");
  const [freeFilter, setFreeFilter] = useState<"all" | "free" | "paid">("all");

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<FlatLesson | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<FlatLesson | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────────

  const subjectsQuery = useQuery({
    queryKey: ["admin", "catalogue", "subjects"],
    queryFn: () => adminCatalogue.listSubjects(),
    staleTime: 5 * 60_000,
  });

  const subjects = subjectsQuery.data?.subjects ?? [];
  const [topicsBySubject, setTopicsBySubject] = useState<Map<string, Topic[]>>(new Map());

  async function fetchTopics(subjectId: string) {
    if (topicsBySubject.has(subjectId)) return;
    const res = await adminCatalogue.listTopics(subjectId);
    setTopicsBySubject((prev) => new Map(prev).set(subjectId, res.topics));
  }

  const allLessonsQuery = useQuery<FlatLesson[]>({
    queryKey: ["admin", "all-lessons"],
    queryFn: async () => {
      if (!subjectsQuery.data) return [];
      const result: FlatLesson[] = [];
      for (const subject of subjectsQuery.data.subjects) {
        const topicsRes = await adminCatalogue.listTopics(subject.id);
        setTopicsBySubject((prev) => new Map(prev).set(subject.id, topicsRes.topics));
        for (const topic of topicsRes.topics) {
          const lessonsRes = await adminCatalogue.listLessons(topic.id);
          for (const lesson of lessonsRes.lessons) {
            result.push({ ...lesson, subjectName: subject.name, topicTitle: topic.title });
          }
        }
      }
      return result;
    },
    enabled: !!subjectsQuery.data,
    staleTime: 30_000,
  });

  const filtered = useMemo(() => {
    return (allLessonsQuery.data ?? []).filter((l) => {
      if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (freeFilter === "free" && !l.isFree) return false;
      if (freeFilter === "paid" && l.isFree) return false;
      return true;
    });
  }, [allLessonsQuery.data, search, statusFilter, freeFilter]);

  const isLoading = subjectsQuery.isLoading || allLessonsQuery.isLoading;

  // ── Selection helpers ──────────────────────────────────────────────────────

  const allFilteredIds = filtered.map((l) => l.id);
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selected.has(id));
  const someSelected = allFilteredIds.some((id) => selected.has(id));

  function toggleAll() {
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelected((prev) => new Set(Array.from(prev).concat(allFilteredIds)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const selectedIds = Array.from(selected).filter((id) => allFilteredIds.includes(id));

  // ── Publish / Unpublish ────────────────────────────────────────────────────

  const publishMutation = useMutation({
    mutationFn: ({ id, publish }: { id: string; publish: boolean }) =>
      publish ? adminCatalogue.publishLesson(id) : adminCatalogue.unpublishLesson(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["admin", "all-lessons"] }),
  });

  // ── Helpers ────────────────────────────────────────────────────────────────

  function openCreate() { setEditingLesson(null); setFormOpen(true); }
  function openEdit(lesson: FlatLesson) { setEditingLesson(lesson); setFormOpen(true); }
  function closeForm() { setFormOpen(false); setEditingLesson(null); }

  function handleBulkDeleteDone() {
    setBulkDeleteOpen(false);
    setSelected(new Set());
  }

  return (
    <>
      <PageHeader
        title="Lessons"
        description="Manage the lesson catalogue — create, edit, publish and delete lessons."
        action={
          <div className="flex gap-2">
            <Button variant="hero" className="rounded-full" onClick={openCreate}>
              <Plus className="mr-1 h-4 w-4" /> Add lesson
            </Button>
            <Button asChild variant="softOutline" className="rounded-full">
              <Link href="/admin/videos/upload">Upload video</Link>
            </Button>
          </div>
        }
      />

      {/* Filters + bulk action bar */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card pl-11 pr-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth shadow-card"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-40 rounded-2xl shadow-card">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {(Object.keys(STATUS_CONFIG) as LessonStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={freeFilter} onValueChange={(v) => setFreeFilter(v as typeof freeFilter)}>
          <SelectTrigger className="w-36 rounded-2xl shadow-card">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All lessons</SelectItem>
            <SelectItem value="free">Free only</SelectItem>
            <SelectItem value="paid">Paid only</SelectItem>
          </SelectContent>
        </Select>

        {someSelected && (
          <Button
            variant="destructive"
            className="rounded-2xl gap-1.5"
            onClick={() => setBulkDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete selected ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/40 hover:bg-secondary/40">
              <TableHead className="w-10 pl-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                  onChange={toggleAll}
                  disabled={isLoading || filtered.length === 0}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </TableHead>
              <TableHead className="font-bold text-primary">Title</TableHead>
              <TableHead className="font-bold text-primary">Subject / Topic</TableHead>
              <TableHead className="font-bold text-primary">Status</TableHead>
              <TableHead className="font-bold text-primary">Difficulty</TableHead>
              <TableHead className="font-bold text-primary">Duration</TableHead>
              <TableHead className="font-bold text-primary">Views</TableHead>
              <TableHead className="font-bold text-primary w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((__, j) => (
                  <TableCell key={j}><div className="h-4 rounded bg-secondary animate-pulse" /></TableCell>
                ))}
              </TableRow>
            ))}

            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                  <div className="text-4xl mb-3">🎬</div>
                  <p className="font-semibold text-primary">
                    {search || statusFilter !== "all" || freeFilter !== "all"
                      ? "No lessons match your filters"
                      : "No lessons yet"}
                  </p>
                  <p className="text-sm mt-1">
                    {search || statusFilter !== "all" || freeFilter !== "all"
                      ? "Try adjusting your search or filters."
                      : "Click \"Add lesson\" to create your first lesson."}
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && filtered.map((lesson) => {
              const status = STATUS_CONFIG[lesson.status];
              const StatusIcon = status.icon;
              const mins = lesson.durationSeconds ? Math.round(lesson.durationSeconds / 60) : null;
              const isPublished = !!lesson.publishedAt;
              const isChecked = selected.has(lesson.id);

              return (
                <TableRow
                  key={lesson.id}
                  className={`hover:bg-secondary/20 transition-smooth ${isChecked ? "bg-secondary/30" : ""}`}
                >
                  <TableCell className="pl-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOne(lesson.id)}
                      className="h-4 w-4 rounded accent-primary cursor-pointer"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-primary line-clamp-1">{lesson.title}</div>
                    {lesson.isFree && (
                      <span className="text-[10px] font-bold text-accent uppercase">Free</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-primary font-medium">{lesson.subjectName}</div>
                    <div className="text-xs text-muted-foreground">{lesson.topicTitle}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${status.color}`}>
                      <StatusIcon className={`h-3.5 w-3.5 ${lesson.status === "transcoding" ? "animate-spin" : ""}`} />
                      {status.label}
                    </div>
                    {isPublished && (
                      <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Published</div>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm capitalize">{lesson.difficulty}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{mins !== null ? `${mins} min` : "—"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{lesson.viewCount.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => openEdit(lesson)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>

                        {lesson.status === "ready" && (
                          <DropdownMenuItem
                            onClick={() => publishMutation.mutate({ id: lesson.id, publish: !isPublished })}
                            disabled={publishMutation.isPending}
                          >
                            {isPublished
                              ? <><EyeOff className="h-3.5 w-3.5 mr-2" /> Unpublish</>
                              : <><Globe className="h-3.5 w-3.5 mr-2" /> Publish</>}
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeletingLesson(lesson)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {allLessonsQuery.error && (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Could not load all lessons — some subjects may be missing.
          <Button variant="ghost" size="sm" onClick={() => void allLessonsQuery.refetch()} className="ml-auto rounded-full gap-1">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}

      {/* Dialogs */}
      {formOpen && (
        <LessonFormDialog
          open={formOpen}
          onClose={closeForm}
          editing={editingLesson}
          subjects={subjects}
          topicsBySubject={topicsBySubject}
          onTopicsFetch={fetchTopics}
        />
      )}

      {deletingLesson && (
        <DeleteDialog lesson={deletingLesson} onClose={() => setDeletingLesson(null)} />
      )}

      {bulkDeleteOpen && (
        <BulkDeleteDialog
          ids={selectedIds}
          onClose={() => setBulkDeleteOpen(false)}
          onDone={handleBulkDeleteDone}
        />
      )}
    </>
  );
}
