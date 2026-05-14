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
export type PinStatus = "unused" | "used" | "revoked";

export interface User {
  id: string;
  name: string;
  phone: string | null;
  role: UserRole;
  classLevel: string | null;
  stream: Stream | null;
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

export interface Pin {
  id: string;
  code: string;
  displayCode: string;
  status: PinStatus;
  batchLabel: string | null;
  createdAt: string;
  usedAt: string | null;
  usedBy: { id: string; name: string } | null;
}

export interface GeneratePinsResponse {
  pins: Pin[];
  count: number;
}

export interface PinsListResponse {
  pins: Pin[];
  total: number;
  page: number;
  limit: number;
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
