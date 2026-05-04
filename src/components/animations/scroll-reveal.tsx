"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { fadeInUp } from "@/lib/animations";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  width?: "fit-content" | "100%";
}

export function ScrollReveal({ 
  children, 
  className, 
  delay = 0,
  width = "100%" 
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "visible" }} className={className}>
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        transition={{ duration: 0.8, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
