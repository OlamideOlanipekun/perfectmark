"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Gauge } from "lucide-react";
import { useProgressReporter } from "@/hooks/use-progress-reporter";

interface VideoPlayerProps {
  lessonId: string;
  manifestUrl: string;
  initialPosition?: number;
  /** Short identifier displayed as a faint overlay for anti-piracy traceability. */
  watermark?: string;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const;

export function VideoPlayer({
  lessonId,
  manifestUrl,
  initialPosition = 0,
  watermark,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState<number>(1);
  const { report, flush } = useProgressReporter(lessonId);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    const seekToInitial = () => {
      if (initialPosition > 0) video.currentTime = initialPosition;
    };

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        // Credentials aren't used on R2 signed URLs, so default is fine.
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        },
      });
      hls.loadSource(manifestUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, seekToInitial);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari: native HLS support
      video.src = manifestUrl;
      video.addEventListener("loadedmetadata", seekToInitial, { once: true });
    }

    const onTime = () => report(video.currentTime);
    const onPause = () => {
      report(video.currentTime);
      void flush();
    };
    const onEnded = () => {
      report(video.currentTime, true);
      void flush();
    };

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      hls?.destroy();
    };
  }, [manifestUrl, initialPosition, report, flush]);

  const handleSpeedChange = (s: number) => {
    setSpeed(s);
    if (videoRef.current) videoRef.current.playbackRate = s;
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        controls
        playsInline
        controlsList="nodownload"
        disablePictureInPicture
        className="aspect-video w-full"
      />

      {/* Anti-piracy watermark — faint, top-left, user-scoped */}
      {watermark && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-4 left-4 font-mono text-[11px] tracking-widest text-white/25 mix-blend-difference select-none"
        >
          {watermark}
        </div>
      )}

      <div className="absolute right-3 top-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <Gauge className="mr-1 h-4 w-4" />
              {speed}&times;
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {SPEEDS.map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={speed === s ? "font-semibold" : undefined}
              >
                {s}&times;
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
