"use client";

import Image from "next/image";
import Link from "next/link";
import { MonitorPlay, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-soft"
    >
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      {/* decorative rings */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[600px] w-[600px] rounded-full border border-primary/10" />
      <div className="pointer-events-none absolute -left-20 top-40 h-[420px] w-[420px] rounded-full border border-primary/10" />
      <div className="pointer-events-none absolute left-20 top-60 h-[260px] w-[260px] rounded-full border border-primary/10" />

      <div className="container px-[5%] relative grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24 pt-32 lg:pt-32">
        <div className="animate-fade-in-up space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-2 w-2 rounded-full bg-primary-glow" />
            Cloud Based School
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-primary">
            Master Your <span className="text-gradient">Exams</span>
            <br />
            With <span className="text-gradient">Expert</span> Tutorials
          </h1>
          <p className="max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Prepare seamlessly with WAEC, NECO, and JAMB-tailored video
            lessons crafted by experienced teachers. One click away from
            mastering every subject — Sciences, Arts, Languages, Commercial,
            and Trade.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="hero" size="xl">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="softOutline" size="xl">
              <Link href="/register">Get Free Trial</Link>
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full bg-gradient-primary ring-2 ring-background"
                />
              ))}
            </div>
            <span>
              <strong className="text-primary">10,000+</strong> students
              learning today
            </span>
          </div>
        </div>

        <div className="relative h-[520px] lg:h-[620px]">
          {/* Big blue circle behind student */}
          <div className="absolute right-4 top-8 h-[440px] w-[440px] lg:h-[520px] lg:w-[520px] rounded-full bg-gradient-primary shadow-elegant" />
          <div className="absolute right-2 bottom-6 h-24 w-24 rounded-full bg-primary-glow/30" />

          <Image
            src="/hero-student.png"
            alt="Smiling student holding books"
            width={1024}
            height={1024}
            priority
            className="absolute right-0 bottom-0 h-[540px] lg:h-[640px] w-auto object-contain drop-shadow-2xl"
          />

          {/* Floating cards */}
          <div className="absolute left-0 top-24 animate-float">
            <FloatCard
              icon={<MonitorPlay className="h-5 w-5" />}
              label="2K+"
              sub="Video Courses"
            />
          </div>
          <div
            className="absolute right-0 top-4 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <StatRing value="5K+" sub="Online Courses" />
          </div>
          <div
            className="absolute right-2 bottom-10 animate-float"
            style={{ animationDelay: "2s" }}
          >
            <FloatCard
              icon={<Users className="h-5 w-5" />}
              label="250+"
              sub="Tutors"
              reverse
            />
          </div>
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
      className={`flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-card border border-border ${
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

function StatRing({ value, sub }: { value: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card border border-border w-36">
      <div className="relative mx-auto mb-2 grid h-16 w-16 place-items-center rounded-full border-4 border-secondary">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary rotate-45" />
        <GraduationCap className="h-6 w-6 text-primary" />
      </div>
      <div className="text-center">
        <div className="text-lg font-bold text-primary">{value}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
    </div>
  );
}
