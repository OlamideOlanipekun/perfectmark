import type { ExamType, Stream } from "@/types";

export const EXAM_TYPES: readonly ExamType[] = ["WAEC", "NECO", "UTME"] as const;

export const STREAMS: readonly Stream[] = [
  "Junior Secondary",
  "Sciences",
  "Arts",
  "Languages",
  "Commercial",
  "Trade",
  "General",
] as const;

export const STREAM_DESCRIPTIONS: Record<Stream, string> = {
  "Junior Secondary": "JSS 1–3 core subjects across all streams.",
  Sciences: "Physics, Chemistry, Biology, Further Maths and more.",
  Arts: "Literature, Government, History, CRS and more.",
  Languages: "English Language, French, Yoruba, Igbo and more.",
  Commercial: "Economics, Accounting, Commerce, Marketing and more.",
  Trade: "Agricultural Science, Technical Drawing, Food Science.",
  General: "General-knowledge subjects and electives.",
};

export function normaliseExam(raw: string): ExamType | null {
  const upper = raw.toUpperCase();
  return (EXAM_TYPES as readonly string[]).includes(upper) ? (upper as ExamType) : null;
}

export function normaliseStream(raw: string): Stream | null {
  // Decode percent-encoding, replace hyphens used in URLs with spaces,
  // then title-case every word so "junior-secondary" → "Junior Secondary".
  const decoded = decodeURIComponent(raw).replace(/-/g, " ");
  const titleCased = decoded.replace(/\b\w/g, (c) => c.toUpperCase());
  return (STREAMS as readonly string[]).includes(titleCased) ? (titleCased as Stream) : null;
}

/** Convert a stream name to a URL-safe slug: "Junior Secondary" → "junior-secondary" */
export function streamToSlug(stream: Stream): string {
  return stream.toLowerCase().replace(/ /g, "-");
}
