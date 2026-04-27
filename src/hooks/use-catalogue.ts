"use client";

import { useQuery } from "@tanstack/react-query";
import { catalogue, type ListSubjectsParams } from "@/lib/catalogue";
import type { ExamType } from "@/types";

const FIVE_MINUTES = 5 * 60 * 1000;

export const catalogueKeys = {
  all: ["catalogue"] as const,
  subjects: (params: ListSubjectsParams) => [...catalogueKeys.all, "subjects", params] as const,
  subject: (examType: ExamType, slug: string) =>
    [...catalogueKeys.all, "subject", examType, slug] as const,
  topics: (subjectId: string) => [...catalogueKeys.all, "topics", subjectId] as const,
  lessons: (topicId: string) => [...catalogueKeys.all, "lessons", topicId] as const,
  lesson: (id: string) => [...catalogueKeys.all, "lesson", id] as const,
  freeLessons: (limit: number) => [...catalogueKeys.all, "free-lessons", limit] as const,
};

export function useSubjects(params: ListSubjectsParams = {}) {
  return useQuery({
    queryKey: catalogueKeys.subjects(params),
    queryFn: () => catalogue.listSubjects(params),
    staleTime: FIVE_MINUTES,
  });
}

export function useSubjectBySlug(examType: ExamType, slug: string) {
  return useQuery({
    queryKey: catalogueKeys.subject(examType, slug),
    queryFn: () => catalogue.getSubjectBySlug(examType, slug),
    staleTime: FIVE_MINUTES,
  });
}

export function useTopics(subjectId: string | null | undefined) {
  return useQuery({
    queryKey: catalogueKeys.topics(subjectId ?? ""),
    queryFn: () => catalogue.listTopics(subjectId!),
    staleTime: FIVE_MINUTES,
    enabled: !!subjectId,
  });
}

export function useLessons(topicId: string | null | undefined) {
  return useQuery({
    queryKey: catalogueKeys.lessons(topicId ?? ""),
    queryFn: () => catalogue.listLessons(topicId!),
    staleTime: FIVE_MINUTES,
    enabled: !!topicId,
  });
}

export function useLesson(lessonId: string | null | undefined) {
  return useQuery({
    queryKey: catalogueKeys.lesson(lessonId ?? ""),
    queryFn: () => catalogue.getLesson(lessonId!),
    staleTime: FIVE_MINUTES,
    enabled: !!lessonId,
  });
}

export function useFreeLessons(limit = 15) {
  return useQuery({
    queryKey: catalogueKeys.freeLessons(limit),
    queryFn: () => catalogue.listFreeLessons(limit),
    staleTime: FIVE_MINUTES,
  });
}
