export type ExamType = "WAEC" | "NECO" | "UTME";
export type Stream =
  | "Sciences"
  | "Arts"
  | "Languages"
  | "Commercial"
  | "Trade"
  | "Junior Secondary"
  | "General";
export type UserRole = "student" | "admin";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type LessonStatus = "processing" | "ready" | "failed";
export type PlanKind = "single_subject" | "full_stream" | "premium";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  classLevel: string | null;
  stream: Stream | null;
  emailVerifiedAt: string | null;
  mfaEnabled: boolean;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  examType: ExamType;
  stream: Stream;
  lessonCount: number;
  thumbnailUrl?: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  order: number;
  lessonCount: number;
}

export interface Lesson {
  id: string;
  topicId: string;
  subjectId: string;
  title: string;
  description: string;
  durationSec: number;
  difficulty: Difficulty;
  isFree: boolean;
  status: LessonStatus;
  order: number;
  tags: string[];
  thumbnailUrl?: string;
}

export interface Progress {
  lessonId: string;
  userId: string;
  positionSec: number;
  completed: boolean;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  kind: PlanKind;
  name: string;
  description: string;
  priceNgn: number;
  intervalDays: number;
  examType?: ExamType;
  stream?: Stream;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  startsAt: string;
  expiresAt: string;
  reference: string;
  active: boolean;
  autoRenew: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    requestId: string;
  };
}

export interface LessonStreamResponse {
  manifestUrl: string;
  expiresAt: string;
  lastPosition: number;
}
