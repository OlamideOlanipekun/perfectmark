"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate, AnimationPlaybackControls } from "framer-motion";

interface StatsCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function StatsCounter({ value, suffix = "", duration = 2 }: StatsCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    let controls: AnimationPlaybackControls | undefined;
    if (isInView) {
      controls = animate(count, value, {
        duration: duration,
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest).toLocaleString());
        },
      });
    }
    return () => controls?.stop();
  }, [isInView, value, duration, count]);

  return (
    <span ref={ref}>
      <span>{displayValue}</span>
      {suffix}
    </span>
  );
}

