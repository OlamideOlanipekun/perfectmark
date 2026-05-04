"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for hydration and then a tiny delay to ensure the premium feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // 1.2s delay for the initial wow factor

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: "-100%", // Slides up smoothly to reveal the site
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0b0a24] overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] opacity-50" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex flex-col items-center z-10"
          >
            {/* Logo Container with spinning ring */}
            <div className="relative h-24 w-24 mb-6">
              {/* Outer spinning dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                className="absolute -inset-3 rounded-full border border-dashed border-[#cead60]/40"
              />
              
              {/* Inner glowing ring */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                className="absolute inset-0 rounded-2xl border border-[#cead60] shadow-[0_0_15px_rgba(206,173,96,0.3)]"
              />

              <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl bg-white flex items-center justify-center p-1">
                <Image 
                  src="/logo.jpg" 
                  alt="PerfectMark Logo" 
                  fill
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
            </div>

            {/* Brand text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold text-white tracking-tight">PerfectMark</h1>
              <p className="text-[10px] font-bold text-[#cead60] uppercase tracking-[0.3em] mt-1">
                Tutors College
              </p>
            </motion.div>

            {/* Loading progress bar */}
            <motion.div 
              className="w-48 h-1 bg-white/10 rounded-full mt-8 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#cead60] to-[#ffd700] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: [0.45, 0, 0.55, 1] }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
