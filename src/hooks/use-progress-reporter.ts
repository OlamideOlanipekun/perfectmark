"use client";

import { useCallback, useEffect, useRef } from "react";
import { api } from "@/lib/api";

/**
 * Client-side progress reporter.
 *
 * Behaviour:
 *   - `report(positionSec, completed)` updates an in-memory snapshot only.
 *   - Every 10s (and on unmount / pause / ended via flush) we POST /progress
 *     with the latest snapshot plus the watch-time delta accumulated since
 *     the previous successful flush.
 *   - Delta is capped at 300s per report (matches backend schema) to prevent
 *     spoofed time rewards from a long-idle tab.
 *   - Network failures are swallowed — the next interval retries with the
 *     current snapshot. Delta is not double-counted because `pendingDelta`
 *     only rolls back on HTTP success.
 */
const REPORT_INTERVAL_MS = 10_000;
const MAX_DELTA_PER_REPORT = 300;

export function useProgressReporter(lessonId: string) {
  const snapshot = useRef<{ position: number; completed: boolean } | null>(null);
  const lastFlushAt = useRef<number>(Date.now());
  const pendingDelta = useRef<number>(0);
  const inFlight = useRef(false);

  const flush = useCallback(async () => {
    if (!snapshot.current || inFlight.current) return;
    const snap = snapshot.current;
    const now = Date.now();
    const elapsedSec = Math.max(0, Math.floor((now - lastFlushAt.current) / 1000));
    const delta = Math.min(elapsedSec + pendingDelta.current, MAX_DELTA_PER_REPORT);

    inFlight.current = true;
    try {
      await api.post("/progress", {
        lessonId,
        positionSeconds: Math.floor(snap.position),
        watchDeltaSeconds: delta,
        completed: snap.completed,
      });
      pendingDelta.current = 0;
      lastFlushAt.current = now;
    } catch {
      // Roll the delta forward so the next attempt doesn't lose credit.
      pendingDelta.current = delta;
      lastFlushAt.current = now;
    } finally {
      inFlight.current = false;
    }
  }, [lessonId]);

  const report = useCallback((positionSec: number, completed = false) => {
    snapshot.current = { position: positionSec, completed };
  }, []);

  useEffect(() => {
    const id = setInterval(() => void flush(), REPORT_INTERVAL_MS);
    return () => {
      clearInterval(id);
      void flush();
    };
  }, [flush]);

  return { report, flush };
}
