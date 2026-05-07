import type { ExamType, Stream } from "@/types";

export const EXAM_TYPES: readonly ExamType[] = ["WAEC", "NECO", "UTME"] as const;

export const STREAMS: readonly Stream[] = [
  "Sciences",
  "Arts",
  "Languages",
  "Commercial",
  "Trade",
] as const;

export const STREAM_DESCRIPTIONS: Record<Stream, string> = {
  Sciences: "Physics, Chemistry, Biology, Further Maths and more.",
  Arts: "Literature, Government, History, CRS and more.",
  Languages: "English Language, French, Yoruba, Igbo and more.",
  Commercial: "Economics, Accounting, Commerce, Marketing and more.",
  Trade: "Agricultural Science, Technical Drawing, Food Science.",
  "Junior Secondary": "JSS 1–3 core subjects across all streams.",
  General: "General-knowledge subjects and electives.",
};

export function normaliseExam(raw: string): ExamType | null {
  const upper = raw.toUpperCase();
  return (EXAM_TYPES as readonly string[]).includes(upper) ? (upper as ExamType) : null;
}

export function normaliseStream(raw: string): Stream | null {
  const decoded = decodeURIComponent(raw);
  const title = decoded.charAt(0).toUpperCase() + decoded.slice(1).toLowerCase();
  return (STREAMS as readonly string[]).includes(title) ? (title as Stream) : null;
}
