import { api } from "@/lib/api";
import type { Lesson, Subject, Topic } from "@/lib/catalogue";

export interface CreateLessonInput {
  topicId: string;
  title: string;
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  isFree?: boolean;
  sortOrder?: number;
  tags?: string[];
}

export interface UpdateLessonInput {
  title?: string;
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  isFree?: boolean;
  sortOrder?: number;
  tags?: string[];
}

export const adminCatalogue = {
  listSubjects: () => api.get<{ subjects: Subject[] }>("/admin/catalogue/subjects"),

  listTopics: (subjectId: string) =>
    api.get<{ subject: Subject; topics: Topic[] }>(
      `/admin/catalogue/subjects/${subjectId}/topics`,
    ),

  listLessons: (topicId: string) =>
    api.get<{ lessons: Lesson[] }>(`/admin/catalogue/topics/${topicId}/lessons`),

  getLesson: (lessonId: string) =>
    api.get<{ lesson: Lesson }>(`/admin/catalogue/lessons/${lessonId}`),

  createLesson: (body: CreateLessonInput) =>
    api.post<{ lesson: Lesson }>("/admin/catalogue/lessons", body),

  updateLesson: (lessonId: string, body: UpdateLessonInput) =>
    api.patch<{ lesson: Lesson }>(`/admin/catalogue/lessons/${lessonId}`, body),

  deleteLesson: (lessonId: string) =>
    api.del<void>(`/admin/catalogue/lessons/${lessonId}`),

  publishLesson: (lessonId: string) =>
    api.post<{ lesson: Lesson }>(`/admin/catalogue/lessons/${lessonId}/publish`),

  unpublishLesson: (lessonId: string) =>
    api.post<{ lesson: Lesson }>(`/admin/catalogue/lessons/${lessonId}/unpublish`),
};
