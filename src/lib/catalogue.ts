import { api } from "@/lib/api";
import type { ExamType, Stream } from "@/types";

export interface Subject {
  id: string;
  name: string;
  slug: string;
  examType: ExamType;
  stream: Stream;
  description: string | null;
  coverImageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  description: string | null;
  sortOrder: number;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
}

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type LessonStatus = "draft" | "uploading" | "transcoding" | "ready" | "failed";

export interface Lesson {
  id: string;
  topicId: string;
  subjectId: string;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  isFree: boolean;
  status: LessonStatus;
  sortOrder: number;
  durationSeconds: number | null;
  /** R2 object key, not a URL. Request a signed URL via the media module to render. */
  thumbnailKey: string | null;
  tags: string[];
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ── Request params ──────────────────────────────────────────────────────

export interface ListSubjectsParams {
  examType?: ExamType;
  stream?: Stream;
}

function toQuery(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "";
  const qs = new URLSearchParams();
  for (const [k, v] of entries) qs.set(k, String(v));
  return `?${qs.toString()}`;
}

// ── Public API ──────────────────────────────────────────────────────────

export const catalogue = {
  listSubjects: (params: ListSubjectsParams = {}) =>
    api.get<{ subjects: Subject[] }>(`/catalogue/subjects${toQuery(params)}`),

  getSubjectBySlug: (examType: ExamType, slug: string) =>
    api.get<{ subject: Subject }>(`/catalogue/subjects/${examType}/${slug}`),

  listTopics: (subjectId: string) =>
    api.get<{ subject: Subject; topics: Topic[] }>(
      `/catalogue/subjects/${subjectId}/topics`,
    ),

  listLessons: (topicId: string, params: { isFree?: boolean; limit?: number; offset?: number } = {}) =>
    api.get<{ lessons: Lesson[] }>(`/catalogue/topics/${topicId}/lessons${toQuery(params)}`),

  listFreeLessons: (limit = 15) =>
    api.get<{ lessons: Lesson[] }>(`/catalogue/lessons/free${toQuery({ limit })}`),

  getLesson: (id: string) => api.get<{ lesson: Lesson }>(`/catalogue/lessons/${id}`),
};
