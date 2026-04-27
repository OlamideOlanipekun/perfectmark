"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { media, getDeviceId, type StreamResponse } from "@/lib/media";

/**
 * Fetch a signed HLS manifest URL for a lesson.
 *
 * Behaviour:
 *   - Re-fetches automatically ~10s before the signed URL expires.
 *   - Sends a heartbeat every 45s while mounted to keep the concurrent-stream
 *     slot alive.
 *   - Releases the slot on unmount.
 */
export function useStream(lessonId: string | null | undefined) {
  const qc = useQueryClient();
  const deviceId = useRef<string>("");
  if (!deviceId.current) deviceId.current = getDeviceId();

  const query = useQuery<StreamResponse>({
    queryKey: ["stream", lessonId ?? ""],
    queryFn: () => media.getStream(lessonId!, deviceId.current),
    enabled: !!lessonId,
    // Don't cache — every render of the watch page should request fresh.
    // Auto re-request triggered by the interval below, not by staleness.
    staleTime: 0,
    gcTime: 0,
    retry: (count, err) => {
      // Don't auto-retry access denials — show the UI immediately.
      const status = (err as { status?: number }).status;
      if (status === 403 || status === 404) return false;
      return count < 2;
    },
  });

  // Schedule re-request before the signed URL expires.
  useEffect(() => {
    if (!lessonId || !query.data) return;
    const ttlMs = Math.max(5_000, (query.data.ttlSeconds - 10) * 1000);
    const t = setTimeout(() => {
      void qc.invalidateQueries({ queryKey: ["stream", lessonId] });
    }, ttlMs);
    return () => clearTimeout(t);
  }, [lessonId, query.data, qc]);

  // Heartbeat every 45s — refreshes the Redis slot (120s TTL on the backend).
  useEffect(() => {
    if (!lessonId) return;
    const interval = setInterval(() => {
      void media.heartbeat(lessonId, deviceId.current).catch(() => {
        // 403 here means cap exceeded elsewhere or subscription lapsed —
        // invalidate the stream query so the UI re-renders with the error.
        void qc.invalidateQueries({ queryKey: ["stream", lessonId] });
      });
    }, 45_000);
    return () => clearInterval(interval);
  }, [lessonId, qc]);

  // Release the slot on unmount.
  useEffect(() => {
    const id = lessonId;
    const d = deviceId.current;
    return () => {
      if (id) void media.release(id, d).catch(() => undefined);
    };
  }, [lessonId]);

  return query;
}
