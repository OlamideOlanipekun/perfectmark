"use client";

import { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  direction?: "up" | "left" | "right";
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  once = true,
  direction = "up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          entry.target.classList.remove("active");
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [once]);

  const directionClass = {
    up: "reveal",
    left: "reveal-left",
    right: "reveal-right",
  }[direction];

  return (
    <div
      ref={ref}
      className={cn(directionClass, className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
