"use client";

import Link from "next/link";
import { Lock, PlayCircle } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useFreeLessons } from "@/hooks/use-catalogue";

export function VideoPreview() {
  const { data, isLoading } = useFreeLessons(1);

  // Nothing to show — stay invisible, don't render an empty section
  if (!isLoading && (!data || data.lessons.length === 0)) return null;

  const lesson = data?.lessons[0];
  const watchHref = lesson ? `/login?next=/watch/${lesson.id}` : "/register";

  return (
    <section
      className="py-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #21205c 0%, #0d0b30 100%)" }}
    >
      <div className="container">
        {/* Section header */}
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#cead60]">
            <span className="h-2 w-2 rounded-full bg-[#cead60] animate-pulse" />
            Free Preview
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            See What You&apos;ll{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#cead60,#b8962a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Learn
            </span>
          </h2>
          <p className="mt-4 text-white/60 leading-relaxed">
            A real lesson from our library. Sign up to unlock the full catalogue
            — WAEC, NECO, JAMB and JSS content.
          </p>
        </ScrollReveal>

        {/* Frame */}
        <ScrollReveal delay={0.2} className="max-w-3xl mx-auto">
          {isLoading ? (
            <Skeleton className="w-full aspect-video rounded-3xl bg-white/10" />
          ) : (
            <div className="rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)] border border-white/10">
              {/* Clickable thumbnail area */}
              <Link
                href={watchHref}
                className="relative block aspect-video bg-gradient-to-br from-[#312f8a] to-[#0d0b30] group cursor-pointer"
                aria-label={lesson?.title ?? "Preview lesson"}
              >
                {/* Thumbnail */}
                {lesson?.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={lesson.thumbnailUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                {/* Dim overlay — deepens on hover */}
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/55 transition-colors duration-300" />

                {/* Bottom gradient so text stays readable */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />

                {/* Lock badge */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-white/90">
                  <Lock className="h-3 w-3" />
                  Members Only
                </div>

                {/* Play button — centred */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-white/25 animate-ping" />
                    <div className="relative grid h-20 w-20 place-items-center rounded-full bg-white/90 backdrop-blur shadow-[0_8px_40px_rgba(0,0,0,0.4)] group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                      <PlayCircle className="h-10 w-10 fill-[#21205c] text-[#21205c]" />
                    </div>
                  </div>
                </div>

                {/* Lesson title bottom-left */}
                {lesson && (
                  <div className="absolute bottom-4 left-5 right-24">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#cead60] mb-1">
                      Free Lesson
                    </p>
                    <p className="text-sm font-bold text-white leading-snug line-clamp-1">
                      {lesson.title}
                    </p>
                  </div>
                )}
              </Link>

              {/* Below-frame bar */}
              <div
                className="flex items-center justify-between gap-4 px-6 py-4"
                style={{ background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="min-w-0">
                  {lesson ? (
                    <>
                      <p className="font-bold text-white text-sm leading-tight truncate">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        Free · Sign in to watch
                      </p>
                    </>
                  ) : (
                    <Skeleton className="h-4 w-48 bg-white/10" />
                  )}
                </div>
                <Button
                  asChild
                  size="sm"
                  className="rounded-full shrink-0 font-bold border-none"
                  style={{ background: "linear-gradient(135deg,#cead60,#b8962a)", color: "white" }}
                >
                  <Link href="/register">Watch Free →</Link>
                </Button>
              </div>
            </div>
          )}
        </ScrollReveal>

        {/* Subtext */}
        <ScrollReveal delay={0.4} className="text-center mt-8">
          <p className="text-sm text-white/40">
            No credit card required &mdash; free lessons are available to all members.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
