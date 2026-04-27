import { api } from "@/lib/api";
import type { Lesson, Subject, Topic } from "@/lib/catalogue";

/**
 * Admin catalogue client. Unlike the public catalogue lib, this hits the
 * /admin/catalogue endpoints and therefore returns unpublished + draft
 * content alongside published.
 */
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
};
