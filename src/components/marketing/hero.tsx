"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MonitorPlay, GraduationCap, Users, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, slideInRight } from "@/lib/animations";

const AVATAR_SEEDS = ["amara", "chidi", "fatima", "emeka"];

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #eef0ff 0%, #f8f7ff 55%, #fff8ed 100%)" }}
    >
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(33,32,92,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(33,32,92,.03) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-28 -right-24 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(206,173,96,.08) 0%,transparent 68%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(33,32,92,.06) 0%,transparent 68%)" }}
      />

      {/* Decorative rings */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[600px] w-[600px] rounded-full border border-primary/8" />
      <div className="pointer-events-none absolute -left-20 top-40 h-[420px] w-[420px] rounded-full border border-primary/8" />

      <div className="container px-[5%] relative grid lg:grid-cols-2 gap-12 lg:gap-12 items-center py-12 md:py-16 lg:py-24 pt-28 lg:pt-32">
        {/* Left copy */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 md:space-y-7"
        >
          {/* Badge */}
          <motion.span 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 rounded-full bg-white border border-primary/10 px-4 py-2 text-[10px] md:text-xs font-semibold text-primary shadow-sm"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Nigeria&apos;s #1 Cloud-Based School
          </motion.span>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-[65px] font-extrabold leading-[1.1] md:leading-[1.07] text-primary"
            style={{ letterSpacing: "-0.03em" }}
          >
            Master Your
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#21205c,#312f8a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Exams
            </span>{" "}With
            <br />
            Nigeria&apos;s{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #cead60, #b8962a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Top Tutors
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            variants={fadeInUp}
            className="max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed px-4 lg:px-0"
          >
            Specialized video lessons for{" "}
            <strong className="text-primary">
              WAEC, NECO &amp; JAMB
            </strong>{" "}
            preparation. Study at your own pace with cloud-based access to
            Nigeria&apos;s elite curriculum.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="space-y-4 w-full px-4 lg:px-0">
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button
                  asChild
                  size="xl"
                  className="w-full rounded-xl font-bold px-8 shadow-elegant group border-none"
                  style={{
                    background: "linear-gradient(135deg,#cead60,#b8962a)",
                    color: "white",
                  }}
                >
                  <Link href="/register">
                    Start Learning Today →
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Bullets */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2">
              {[
                "No credit card required",
                "Full exam coverage",
                "All subjects included",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground font-medium"
                >
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 pt-2">
            <div className="flex -space-x-2.5">
              {AVATAR_SEEDS.map((seed) => (
                <Image
                  key={seed}
                  src={`https://i.pravatar.cc/36?u=${seed}`}
                  alt={`Student ${seed}`}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-background"
                />
              ))}
            </div>

            <div className="hidden sm:block w-px h-10 bg-primary/12" />

            <div className="flex flex-col items-center lg:items-start gap-0.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="h-3.5 w-3.5 fill-accent text-accent"
                  />
                ))}
                <span className="ml-1 text-sm font-extrabold text-primary">
                  4.9
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                <strong className="text-primary">10,000+</strong> students
                learning today
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right visual */}
        <motion.div 
          variants={slideInRight}
          initial="initial"
          animate="animate"
          className="relative h-[480px] md:h-[520px] lg:h-[620px] mt-8 lg:mt-0"
        >
          {/* Card */}
          <div
            className="absolute inset-0 rounded-[32px] overflow-hidden p-6 md:p-8 pb-0 flex flex-col shadow-elegant"
            style={{
              background: "linear-gradient(160deg, #21205c 0%, #0d0b30 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(206,173,96,0.18) 0%, transparent 65%)",
              }}
            />
            
            <div className="relative z-10 grid grid-cols-3 gap-2 md:gap-3 mb-6">
              {[
                { val: "2K+", label: "Videos", icon: "🎬" },
                { val: "10K+", label: "Students", icon: "🎓" },
                { val: "250+", label: "Tutors", icon: "👨‍🏫" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center text-center rounded-[18px] py-3 md:py-4 px-1 md:px-2 backdrop-blur-sm"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span className="text-xl md:text-2xl mb-0.5 md:mb-1">{s.icon}</span>
                  <span className="text-lg md:text-xl font-extrabold text-[#cead60]">{s.val}</span>
                  <span className="text-[9px] md:text-[10px] mt-0.5 md:mt-1 font-medium text-white/50">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="relative flex-1 flex items-end justify-center">
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 md:w-72 h-64 md:h-72 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(49,47,138,0.6) 0%, transparent 70%)",
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="w-[60%] md:w-auto"
              >
                <Image
                  src="/hero-student.png"
                  alt="Student"
                  width={600}
                  height={640}
                  priority
                  className="relative z-10 h-[280px] md:h-[340px] lg:h-[400px] w-auto object-contain drop-shadow-2xl mx-auto"
                />
              </motion.div>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute -left-2 sm:-left-6 top-16 sm:top-28 z-20 scale-[0.7] sm:scale-100 origin-left">
            <FloatCard
              icon={<MonitorPlay className="h-5 w-5" />}
              label="WAEC Ready"
              sub="2K+ Lessons"
            />
          </div>

          <div className="absolute -right-2 sm:-right-4 bottom-10 sm:bottom-16 z-20 scale-[0.7] sm:scale-100 origin-right">
            <FloatCard
              icon={<Users className="h-5 w-5" />}
              label="250+"
              sub="Expert Tutors"
              reverse
            />
          </div>

          {/* Caption */}
          <div className="absolute -right-2 sm:right-[8%] top-[35%] sm:top-[42%] bg-white/95 backdrop-blur-md p-2 sm:p-3 rounded-2xl shadow-elegant border border-primary/10 z-20 scale-[0.7] sm:scale-100 origin-right">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-secondary flex items-center justify-center text-primary">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-primary leading-tight">JAMB Top Scorer</p>
                <p className="text-[8px] sm:text-[10px] text-muted-foreground">Class of 2025</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative border-y border-[#cead60]/10 bg-[#cead60]/5 py-5 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap gap-12 text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#cead60]">
          {[
            "Agricultural Science", "Arts", "Biology", "Chemistry", "Christian Religious Knowledge", 
            "Commercial", "Economics", "English Language", "Financial Accounting", 
            "General Mathematics", "Geography", "Government", "Languages", 
            "Literature in English", "Oral English", "Physics", "Sciences", "Yoruba",
            // Duplicate for seamless loop
            "Agricultural Science", "Arts", "Biology", "Chemistry", "Christian Religious Knowledge", 
            "Commercial", "Economics", "English Language", "Financial Accounting", 
            "General Mathematics", "Geography", "Government", "Languages", 
            "Literature in English", "Oral English", "Physics", "Sciences", "Yoruba"
          ].map((item, idx) => (
            <span key={`${item}-${idx}`} className="flex items-center gap-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#cead60]/40" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FloatCard({
  icon,
  label,
  sub,
  reverse = false,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-elegant border border-primary/8 ${
        reverse ? "flex-row-reverse" : ""
      }`}
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-xl font-bold text-primary">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
