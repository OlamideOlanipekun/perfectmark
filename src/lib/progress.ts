import { api } from "@/lib/api";
import type { ExamType } from "@/types";

export interface ProgressRecord {
  lessonId: string;
  positionSeconds: number;
  completed: boolean;
  watchTimeSeconds: number;
  updatedAt: string;
}

export interface ContinueWatchingItem {
  lesson: {
    id: string;
    title: string;
    description: string | null;
    durationSeconds: number | null;
    thumbnailKey: string | null;
    subjectId: string;
    topicId: string;
    isFree: boolean;
    subjectName: string;
    subjectSlug: string;
    examType: ExamType;
  };
  progress: ProgressRecord;
  percentComplete: number;
}

export interface CompletionStats {
  completedCount: number;
  inProgressCount: number;
  totalWatchMinutes: number;
}

export const progress = {
  continueWatching: (limit = 8) =>
    api.get<{ items: ContinueWatchingItem[] }>(`/progress/me/continue?limit=${limit}`),

  stats: () => api.get<CompletionStats>("/progress/me/stats"),

  forLesson: (lessonId: string) =>
    api.get<{ progress: ProgressRecord | null }>(`/progress/lessons/${lessonId}`),
};
