"use client";

import { useQuery } from "@tanstack/react-query";
import { progress } from "@/lib/progress";

const THIRTY_SECONDS = 30_000;

export const progressKeys = {
  all: ["progress"] as const,
  continueWatching: (limit: number) => [...progressKeys.all, "continue", limit] as const,
  stats: () => [...progressKeys.all, "stats"] as const,
  lesson: (lessonId: string) => [...progressKeys.all, "lesson", lessonId] as const,
};

export function useContinueWatching(limit = 8) {
  return useQuery({
    queryKey: progressKeys.continueWatching(limit),
    queryFn: () => progress.continueWatching(limit),
    staleTime: THIRTY_SECONDS,
  });
}

export function useCompletionStats() {
  return useQuery({
    queryKey: progressKeys.stats(),
    queryFn: () => progress.stats(),
    staleTime: THIRTY_SECONDS,
  });
}

export function useLessonProgress(lessonId: string | null | undefined) {
  return useQuery({
    queryKey: progressKeys.lesson(lessonId ?? ""),
    queryFn: () => progress.forLesson(lessonId!),
    enabled: !!lessonId,
    staleTime: THIRTY_SECONDS,
  });
}
