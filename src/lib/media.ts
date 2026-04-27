import { api } from "@/lib/api";

export interface StreamResponse {
  manifestUrl: string;
  expiresAt: string;
  ttlSeconds: number;
  watermark: string;
  lessonId: string;
  activeStreams: number;
  maxConcurrentStreams: number;
  lastPositionSeconds: number;
}

export const media = {
  getStream: (lessonId: string, deviceId: string) =>
    api.post<StreamResponse>(`/media/lessons/${lessonId}/stream`, { deviceId }),

  heartbeat: (lessonId: string, deviceId: string) =>
    api.post<{ ok: true; activeStreams: number; maxConcurrentStreams: number }>(
      `/media/lessons/${lessonId}/heartbeat`,
      { deviceId },
    ),

  release: (lessonId: string, deviceId: string) =>
    api.post<void>(`/media/lessons/${lessonId}/release`, { deviceId }),
};

const DEVICE_ID_KEY = "pmtc_device_id";

/**
 * Stable device ID for the concurrent-stream cap. Lives in localStorage so
 * the same browser counts as the same slot across tabs. Reset on logout.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = generateDeviceId();
    window.localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function clearDeviceId(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(DEVICE_ID_KEY);
  }
}

function generateDeviceId(): string {
  // 32-char hex — satisfies backend's 8-64 char requirement.
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}
