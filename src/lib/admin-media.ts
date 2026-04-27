import { api, ApiError } from "@/lib/api";
import type { Lesson } from "@/lib/catalogue";

export interface CreateUploadBody {
  lessonId: string;
  contentType: "video/mp4" | "video/quicktime" | "video/x-matroska" | "video/webm";
  sizeBytes: number;
  originalFilename?: string;
}

export interface CreateUploadResponse {
  uploadUrl: string;
  objectKey: string;
  expiresAt: string;
  lessonId: string;
}

export const adminMedia = {
  createUpload: (body: CreateUploadBody) =>
    api.post<CreateUploadResponse>("/admin/media/uploads", body),

  completeUpload: (lessonId: string, body: { success: boolean; errorMessage?: string }) =>
    api.post<{ lesson: Lesson }>(`/admin/media/uploads/${lessonId}/complete`, body),

  retryTranscode: (lessonId: string) =>
    api.post<{ lesson: Lesson }>(`/admin/media/uploads/${lessonId}/retry`),
};

export type UploadProgress =
  | { phase: "idle" }
  | { phase: "signing" }
  | { phase: "uploading"; loaded: number; total: number }
  | { phase: "completing" }
  | { phase: "done"; lesson: Lesson }
  | { phase: "error"; message: string };

// ─── Pre-compression advice ──────────────────────────────────────────────
//
// We bias admins toward smaller, pre-compressed uploads because every byte
// the server has to handle costs Railway CPU + R2 egress + admin time.
//
//   < 500 MB  → green: ship it
//   < 2 GB    → amber: works, but compress next time
//   ≥ 2 GB    → red:   refuse on the frontend (backend cap is higher
//                       so we can override via curl in an emergency)

const SOFT_WARN_BYTES = 500 * 1024 * 1024;       // 500 MB
const FRONTEND_HARD_LIMIT_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

export type UploadAdvice =
  | { level: "ok" }
  | { level: "warn"; message: string }
  | { level: "block"; message: string };

export function assessUploadSize(sizeBytes: number): UploadAdvice {
  if (sizeBytes >= FRONTEND_HARD_LIMIT_BYTES) {
    return {
      level: "block",
      message:
        "Files larger than 2 GB are not accepted. Compress locally first — HandBrake's 'Fast 1080p30' preset typically cuts a recording to under 500 MB without visible quality loss.",
    };
  }
  if (sizeBytes >= SOFT_WARN_BYTES) {
    return {
      level: "warn",
      message:
        "This file is larger than 500 MB. Transcoding will work but will take noticeably longer and cost more compute. Consider compressing locally first (HandBrake → 'Fast 1080p30' preset).",
    };
  }
  return { level: "ok" };
}

export const UPLOAD_LIMITS = {
  softWarnBytes: SOFT_WARN_BYTES,
  frontendHardLimitBytes: FRONTEND_HARD_LIMIT_BYTES,
} as const;

export interface UploadHandle {
  abort: () => void;
  promise: Promise<Lesson>;
}

/**
 * Orchestrate the three-step upload pipeline with real-time byte progress
 * reported via `onProgress`. Uses XMLHttpRequest for the R2 PUT because
 * fetch() doesn't expose upload progress in browsers.
 */
export function startUpload(args: {
  lessonId: string;
  file: File;
  onProgress: (state: UploadProgress) => void;
}): UploadHandle {
  const xhr = new XMLHttpRequest();
  let aborted = false;

  const promise = (async (): Promise<Lesson> => {
    const { lessonId, file, onProgress } = args;

    const contentType = normaliseContentType(file.type);
    if (!contentType) {
      const err = new Error("Unsupported file type. Upload MP4, MOV, MKV, or WebM.");
      onProgress({ phase: "error", message: err.message });
      throw err;
    }

    onProgress({ phase: "signing" });
    let signed: CreateUploadResponse;
    try {
      signed = await adminMedia.createUpload({
        lessonId,
        contentType,
        sizeBytes: file.size,
        originalFilename: file.name,
      });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Could not start upload.";
      onProgress({ phase: "error", message: msg });
      throw err;
    }

    // R2 PUT with progress tracking. If this fails we still call the
    // complete endpoint with success=false so the backend rolls the lesson
    // back to 'draft' — otherwise it's stuck in 'uploading' forever.
    onProgress({ phase: "uploading", loaded: 0, total: file.size });
    try {
      await putToR2({ xhr, url: signed.uploadUrl, file, contentType, onProgress });
    } catch (err) {
      const msg = aborted
        ? "Upload cancelled"
        : err instanceof Error
          ? err.message
          : "Upload failed";
      // Best-effort rollback — if this fails we still want to report the original error.
      try {
        await adminMedia.completeUpload(lessonId, { success: false, errorMessage: msg });
      } catch {
        // swallow
      }
      onProgress({ phase: "error", message: msg });
      throw err;
    }

    onProgress({ phase: "completing" });
    try {
      const { lesson } = await adminMedia.completeUpload(lessonId, { success: true });
      onProgress({ phase: "done", lesson });
      return lesson;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Couldn't finalise upload";
      onProgress({ phase: "error", message: msg });
      throw err;
    }
  })();

  return {
    abort: () => {
      aborted = true;
      xhr.abort();
    },
    promise,
  };
}

function putToR2(args: {
  xhr: XMLHttpRequest;
  url: string;
  file: File;
  contentType: string;
  onProgress: (s: UploadProgress) => void;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const { xhr, url, file, contentType, onProgress } = args;
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress({ phase: "uploading", loaded: e.loaded, total: e.total });
      }
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`R2 rejected upload (HTTP ${xhr.status})`));
    });
    xhr.addEventListener("error", () => reject(new Error("Network error during upload")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));
    xhr.send(file);
  });
}

function normaliseContentType(mime: string): CreateUploadBody["contentType"] | null {
  switch (mime) {
    case "video/mp4":
    case "video/quicktime":
    case "video/x-matroska":
    case "video/webm":
      return mime;
    case "video/x-m4v":
      return "video/mp4";
    default:
      return null;
  }
}
