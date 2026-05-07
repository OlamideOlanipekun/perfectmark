"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileVideo,
  Loader2,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { adminCatalogue } from "@/lib/admin-catalogue";
import {
  assessUploadSize,
  startUpload,
  UPLOAD_LIMITS,
  type UploadAdvice,
  type UploadHandle,
  type UploadProgress,
} from "@/lib/admin-media";

const ACCEPTED_MIMES = ["video/mp4", "video/quicktime", "video/x-matroska", "video/webm"];
// Frontend cap (matches assessUploadSize). Backend cap remains 5 GB so we
// can still curl through an oversize file in an emergency.
const MAX_BYTES = UPLOAD_LIMITS.frontendHardLimitBytes;

export default function UploadLessonPage() {
  const subjects = useQuery({
    queryKey: ["admin", "catalogue", "subjects"],
    queryFn: () => adminCatalogue.listSubjects(),
    staleTime: 5 * 60_000,
  });

  const [subjectId, setSubjectId] = useState<string>("");
  const [topicId, setTopicId] = useState<string>("");
  const [lessonId, setLessonId] = useState<string>("");

  const topics = useQuery({
    queryKey: ["admin", "catalogue", "topics", subjectId],
    queryFn: () => adminCatalogue.listTopics(subjectId),
    enabled: !!subjectId,
    staleTime: 60_000,
  });

  const lessons = useQuery({
    queryKey: ["admin", "catalogue", "lessons", topicId],
    queryFn: () => adminCatalogue.listLessons(topicId),
    enabled: !!topicId,
    staleTime: 30_000,
  });

  const [file, setFile] = useState<File | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ phase: "idle" });
  const handleRef = useRef<UploadHandle | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const selectedLesson = useMemo(() => {
    if (!lessons.data) return null;
    return lessons.data.lessons.find((l) => l.id === lessonId) ?? null;
  }, [lessons.data, lessonId]);

  useEffect(() => {
    setTopicId("");
    setLessonId("");
  }, [subjectId]);
  useEffect(() => {
    setLessonId("");
  }, [topicId]);

  const validateFile = useCallback((candidate: File): string | null => {
    if (!ACCEPTED_MIMES.includes(candidate.type) && !candidate.name.match(/\.(mp4|mov|mkv|webm|m4v)$/i)) {
      return "Unsupported file type. Choose an MP4, MOV, MKV, or WebM.";
    }
    if (candidate.size > MAX_BYTES) {
      return "File is larger than the 2 GB frontend cap. Compress it locally first.";
    }
    return null;
  }, []);

  // Live size advice — surface as soon as a file is picked, before any upload starts.
  const sizeAdvice: UploadAdvice | null = file ? assessUploadSize(file.size) : null;

  const onPickFile = (picked: File | null) => {
    if (!picked) return;
    const err = validateFile(picked);
    if (err) {
      setProgress({ phase: "error", message: err });
      return;
    }
    setFile(picked);
    setProgress({ phase: "idle" });
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropActive(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    onPickFile(f);
  };

  const upload = () => {
    if (!file || !lessonId) return;
    const handle = startUpload({
      lessonId,
      file,
      onProgress: setProgress,
    });
    handleRef.current = handle;
    handle.promise.catch(() => undefined);
  };

  const cancel = () => {
    handleRef.current?.abort();
  };

  const reset = () => {
    setFile(null);
    setProgress({ phase: "idle" });
    if (fileInput.current) fileInput.current.value = "";
  };

  const uploadPct =
    progress.phase === "uploading" && progress.total > 0
      ? Math.round((progress.loaded / progress.total) * 100)
      : null;

  const canStart =
    file &&
    lessonId &&
    progress.phase === "idle" &&
    sizeAdvice?.level !== "block";
  const isBusy =
    progress.phase === "signing" ||
    progress.phase === "uploading" ||
    progress.phase === "completing";

  return (
    <>
      <PageHeader
        title="Upload lesson"
        description="Pre-signed direct-to-R2 upload → HLS transcoding pipeline."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDropActive(true);
          }}
          onDragLeave={() => setDropActive(false)}
          onDrop={onDrop}
          onClick={() => !file && fileInput.current?.click()}
          className={`rounded-3xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center gap-4 transition-smooth ${
            dropActive
              ? "border-primary bg-secondary"
              : file
                ? "border-border bg-card cursor-default"
                : "border-primary/30 bg-secondary/30 hover:border-primary/60 hover:bg-secondary/50 cursor-pointer"
          }`}
        >
          <input
            ref={fileInput}
            type="file"
            accept=".mp4,.mov,.mkv,.webm,.m4v,video/*"
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          />

          {!file && (
            <>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                <FileVideo className="h-7 w-7" />
              </div>
              <div>
                <p className="font-bold text-primary text-lg">Drop your video here</p>
                <p className="text-sm text-muted-foreground mt-1">MP4, MOV, MKV or WebM · Max 5 GB</p>
              </div>
              <Button variant="hero" className="rounded-full">
                <Upload className="mr-2 h-4 w-4" />
                Browse files
              </Button>
            </>
          )}

          {file && (
            <div className="w-full max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-white shrink-0">
                    <FileVideo className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="font-semibold text-primary truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                </div>
                {progress.phase === "idle" && (
                  <button
                    type="button"
                    onClick={reset}
                    className="p-2 text-muted-foreground hover:text-primary"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Size advice — surfaces BEFORE upload so admins can rethink */}
              {progress.phase === "idle" && sizeAdvice && sizeAdvice.level !== "ok" && (
                <div
                  className={`mb-4 rounded-xl border p-3 text-left flex items-start gap-3 ${
                    sizeAdvice.level === "block"
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-accent/30 bg-accent/5"
                  }`}
                >
                  <AlertTriangle
                    className={`h-4 w-4 mt-0.5 shrink-0 ${
                      sizeAdvice.level === "block" ? "text-destructive" : "text-accent"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-bold text-xs uppercase tracking-wider ${
                        sizeAdvice.level === "block" ? "text-destructive" : "text-primary"
                      }`}
                    >
                      {sizeAdvice.level === "block" ? "Too large" : "Heads up — large file"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {sizeAdvice.message}
                    </p>
                  </div>
                </div>
              )}

              {(progress.phase === "uploading" ||
                progress.phase === "signing" ||
                progress.phase === "completing") && (
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all"
                      style={{
                        width:
                          progress.phase === "uploading" && uploadPct !== null
                            ? `${uploadPct}%`
                            : "100%",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {progress.phase === "signing" && "Requesting upload URL…"}
                      {progress.phase === "uploading" && `Uploading to R2 — ${uploadPct ?? 0}%`}
                      {progress.phase === "completing" && "Queuing transcoder…"}
                    </span>
                    {progress.phase === "uploading" && (
                      <button
                        type="button"
                        onClick={cancel}
                        className="font-semibold text-destructive hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {progress.phase === "done" && (
                <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-left">
                  <div className="flex items-center gap-2 font-bold text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    Upload complete — transcoding queued
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The worker will produce HLS variants and flip the lesson to
                    <strong> ready</strong> when done.
                  </p>
                  <Button
                    variant="softOutline"
                    size="sm"
                    className="mt-3 rounded-full"
                    onClick={reset}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Upload another
                  </Button>
                </div>
              )}

              {progress.phase === "error" && (
                <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4 text-left">
                  <div className="font-bold text-destructive">Upload failed</div>
                  <p className="mt-1 text-xs text-muted-foreground">{progress.message}</p>
                  <Button variant="softOutline" size="sm" className="mt-3 rounded-full" onClick={reset}>
                    Try again
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-border bg-card shadow-card p-6 flex flex-col gap-4">
          <h3 className="font-bold text-primary">Target lesson</h3>

          <Field label="Subject">
            {subjects.isLoading ? (
              <Skeleton className="h-10 w-full rounded-2xl" />
            ) : (
              <Select value={subjectId} onValueChange={setSubjectId} disabled={isBusy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject…" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.data?.subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.examType} · {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <Field label="Topic">
            <Select
              value={topicId}
              onValueChange={setTopicId}
              disabled={!subjectId || topics.isLoading || isBusy}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={subjectId ? "Select topic…" : "Choose a subject first"}
                />
              </SelectTrigger>
              <SelectContent>
                {topics.data?.topics.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Lesson">
            <Select
              value={lessonId}
              onValueChange={setLessonId}
              disabled={!topicId || lessons.isLoading || isBusy}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={topicId ? "Select lesson…" : "Choose a topic first"}
                />
              </SelectTrigger>
              <SelectContent>
                {lessons.isLoading && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">Loading lessons…</div>
                )}
                {!lessons.isLoading && (lessons.data?.lessons.length ?? 0) === 0 && (
                  <div className="px-3 py-3 text-sm text-muted-foreground space-y-1">
                    <p className="font-semibold text-primary">No lessons in this topic</p>
                    <p className="text-xs">
                      Create one from the{" "}
                      <Link href="/admin/videos" className="underline text-primary">
                        Lessons page
                      </Link>{" "}
                      first.
                    </p>
                  </div>
                )}
                {lessons.data?.lessons.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {selectedLesson && (
            <div className="rounded-xl bg-secondary/40 p-3 text-xs leading-relaxed">
              <div className="font-semibold text-primary">{selectedLesson.title}</div>
              <div className="mt-1 text-muted-foreground">
                Status: <strong className="capitalize">{selectedLesson.status}</strong>
                {selectedLesson.durationSeconds !== null && (
                  <>
                    {" · "}
                    {Math.round(selectedLesson.durationSeconds / 60)} min
                  </>
                )}
              </div>
              {selectedLesson.status !== "draft" && selectedLesson.status !== "failed" && (
                <p className="mt-2 text-muted-foreground">
                  ⚠ Uploading will replace the existing video once transcoded.
                </p>
              )}
            </div>
          )}

          <Button
            variant="hero"
            className="rounded-full w-full mt-2"
            onClick={upload}
            disabled={!canStart}
          >
            {isBusy && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {progress.phase === "uploading" ? "Uploading…" : "Upload & transcode"}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            Flow: sign URL → PUT to R2 direct → complete → transcode worker.
            The lesson stays in <strong>transcoding</strong> until HLS is ready.
          </p>
        </aside>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-primary mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
