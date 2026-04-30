"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Eye, Clock, Flame, ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Course = {
  title: string;
  category: string;
  thumb: string;
  views: string;
  viewsNum: number;
  duration: string;
  level: string;
};

const COURSES: Course[] = [
  { title: "Roles of Non-Governmental Organisations", category: "Government",       thumb: "/courses/english.jpg",   views: "1.2K", viewsNum: 1200, duration: "38 min", level: "SS3"       },
  { title: "Literary Appreciation (Part 1)",          category: "Literature",       thumb: "/courses/english.jpg",   views: "980",  viewsNum: 980,  duration: "42 min", level: "SS2"       },
  { title: "Proteins",                                category: "Chemistry",        thumb: "/courses/chemistry.jpg", views: "2.4K", viewsNum: 2400, duration: "51 min", level: "SS2"       },
  { title: "Air Pollution (Part 1)",                  category: "Chemistry",        thumb: "/courses/chemistry.jpg", views: "1.7K", viewsNum: 1700, duration: "35 min", level: "SS1"       },
  { title: "Flames (Part 1)",                         category: "Chemistry",        thumb: "/courses/chemistry.jpg", views: "3.1K", viewsNum: 3100, duration: "44 min", level: "SS3"       },
  { title: "Organic Chemistry (Part 1)",              category: "Chemistry",        thumb: "/courses/chemistry.jpg", views: "2.6K", viewsNum: 2600, duration: "58 min", level: "SS3"       },
  { title: "Concept of Utility",                      category: "Economics",        thumb: "/courses/economics.jpg", views: "1.9K", viewsNum: 1900, duration: "40 min", level: "SS2"       },
  { title: "Public Finance",                          category: "Economics",        thumb: "/courses/economics.jpg", views: "1.4K", viewsNum: 1400, duration: "33 min", level: "SS3"       },
  { title: "Labour Market — Part 2",                  category: "Commercial",       thumb: "/courses/economics.jpg", views: "1.1K", viewsNum: 1100, duration: "29 min", level: "SS3"       },
  { title: "Grammatical Structure Part 3",            category: "English Language", thumb: "/courses/english.jpg",   views: "2.8K", viewsNum: 2800, duration: "47 min", level: "SS2"       },
  { title: "Transporting System in Man",              category: "Biology",          thumb: "/courses/biology.jpg",   views: "3.4K", viewsNum: 3400, duration: "55 min", level: "SS2"       },
  { title: "Population Study",                        category: "Biology",          thumb: "/courses/biology.jpg",   views: "1.5K", viewsNum: 1500, duration: "38 min", level: "SS3"       },
  { title: "Pollination",                             category: "Biology",          thumb: "/courses/biology.jpg",   views: "2.2K", viewsNum: 2200, duration: "31 min", level: "SS1"       },
  { title: "Newton's Laws of Motion",                 category: "Physics",          thumb: "/courses/physics.jpg",   views: "4.0K", viewsNum: 4000, duration: "62 min", level: "SS2"       },
  { title: "Algebraic Equations Mastery",             category: "Mathematics",      thumb: "/courses/math.jpg",      views: "5.1K", viewsNum: 5100, duration: "70 min", level: "JAMB/WAEC" },
  { title: "Introduction to Basic Science",           category: "Science",          thumb: "/courses/physics.jpg",   views: "1.2K", viewsNum: 1200, duration: "25 min", level: "JSS1"      },
  { title: "Number Bases and Fractions",              category: "Mathematics",      thumb: "/courses/math.jpg",      views: "2.1K", viewsNum: 2100, duration: "32 min", level: "JSS2"      },
  { title: "Basic Electronics — Part 1",              category: "Trade",            thumb: "/courses/physics.jpg",   views: "850",  viewsNum: 850,  duration: "40 min", level: "JSS3"      },
];

const POPULAR_THRESHOLD = 2500;

export function CourseGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: COURSES.length };
    COURSES.forEach((c) => {
      counts[c.category] = (counts[c.category] ?? 0) + 1;
    });
    return counts;
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(COURSES.map((c) => c.category))).sort();
    return ["All", ...cats];
  }, []);

  const filteredCourses = useMemo(
    () => (activeCategory === "All" ? COURSES : COURSES.filter((c) => c.category === activeCategory)),
    [activeCategory],
  );

  return (
    <section
      id="courses"
      className="py-24 bg-gradient-soft relative overflow-hidden"
    >
      {/* Subtle dot-grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(hsl(222 65% 22% / 0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, transparent 30%, hsl(213 100% 97%) 100%)",
        }}
      />

      <div className="container relative">
        {/* ── Section header ── */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-2 w-2 rounded-full bg-primary-glow animate-pulse" />
            Explore Our Courses
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary">
            Your <span className="text-gradient">Gateway</span> to Excellence
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            A library of expertly-taught video lessons covering WAEC, NECO and
            JAMB subjects — Sciences, Arts, Languages, Commercial and Trade.
          </p>
          {/* Dynamic count */}
          <p className="mt-3 text-sm font-semibold text-muted-foreground">
            Showing{" "}
            <span className="text-primary font-extrabold">{filteredCourses.length}</span>{" "}
            {filteredCourses.length === 1 ? "course" : "courses"}
            {activeCategory !== "All" && (
              <> in <span className="text-primary">{activeCategory}</span></>
            )}
          </p>
        </div>

        {/* ── Filter pills (horizontally scrollable) ── */}
        <div className="relative mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-start lg:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap shrink-0 border",
                  activeCategory === cat
                    ? "bg-gradient-primary text-white shadow-elegant border-transparent"
                    : "bg-background border-border text-foreground/70 hover:border-primary/20 hover:bg-secondary hover:text-primary",
                )}
              >
                {cat}
                <span
                  className={cn(
                    "text-[10px] font-bold rounded-full min-w-[1.25rem] px-1.5 py-0.5 text-center leading-none",
                    activeCategory === cat
                      ? "bg-white/25 text-white"
                      : "bg-secondary text-primary",
                  )}
                >
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            ))}
          </div>
          {/* Right fade scrim for overflow hint (mobile) */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-[hsl(213_100%_97%)] to-transparent lg:hidden" />
        </div>

        {/* ── Course grid ── */}
        {filteredCourses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
            {filteredCourses.map((c, i) => (
              <CourseCard key={c.title} course={c} index={i} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-primary">
              <BookOpen className="h-8 w-8" />
            </div>
            <p className="text-lg font-bold text-primary">No courses in this category yet</p>
            <p className="text-sm text-muted-foreground">Check back soon — we add new content weekly.</p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-2 text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-glow transition-colors"
            >
              View all courses
            </button>
          </div>
        )}

        {/* ── Premium CTA panel ── */}
        <div className="mt-16 rounded-3xl bg-gradient-primary shadow-elegant overflow-hidden relative">
          {/* Decorative orbs */}
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/5" />
          <div aria-hidden className="pointer-events-none absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-white/5" />

          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8 p-8 md:p-10">
            {/* Left copy */}
            <div className="text-center sm:text-left">
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/50 mb-1">
                Ready to get started?
              </p>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Unlock 2,000+ Video Lessons
              </h3>
              <p className="mt-2 text-white/60 text-sm leading-relaxed max-w-sm">
                Sciences, Arts, Commerce, Languages &amp; more — all WAEC, NECO and JAMB aligned.
                New content added every week.
              </p>
              {/* Mini stats */}
              <div className="flex items-center gap-6 mt-5 justify-center sm:justify-start">
                {[
                  { icon: GraduationCap, label: "15+ subjects" },
                  { icon: Clock, label: "2,000+ lessons" },
                  { icon: Flame, label: "Updated weekly" },
                ].map((s) => (
                  <span key={s.label} className="flex items-center gap-1.5 text-xs font-semibold text-white/70">
                    <s.icon className="h-3.5 w-3.5 text-accent" />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right CTA */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white text-primary hover:bg-white/90 font-bold shadow-elegant group px-8"
              >
                <Link href="/courses">
                  Browse All Courses
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <p className="text-[11px] text-white/40 font-medium">
                No credit card required · Free trial available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── CourseCard ─────────────────────────── */
function CourseCard({ course: c, index: i }: { course: Course; index: number }) {
  const isPopular = c.viewsNum >= POPULAR_THRESHOLD;

  return (
    <article
      style={{ animationDelay: `${(i % 6) * 80}ms` }}
      className="group relative cursor-pointer overflow-hidden rounded-3xl bg-card border border-border shadow-card transition-all duration-500 ease-out hover:shadow-elegant hover:-translate-y-2 hover:border-primary/20 animate-fade-in-up flex flex-col"
    >
      {/* Outer glow on hover */}
      <span className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500" />

      {/* ── Thumbnail ── */}
      <div className="relative aspect-[16/10] overflow-hidden shrink-0">
        <Image
          src={c.thumb}
          alt={c.title}
          width={768}
          height={512}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Always-visible bottom gradient for overlay text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Hover tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/75 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shimmer sweep */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
        </span>

        {/* Category pill — top left */}
        <span className="absolute top-3 left-3 rounded-full bg-primary/95 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold text-white transition-transform duration-300 group-hover:scale-105">
          {c.category}
        </span>

        {/* Popular badge — top right */}
        {isPopular && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-2.5 py-1 text-[10px] font-bold shadow-card">
            <Flame className="h-3 w-3" />
            Popular
          </span>
        )}

        {/* Play button — center on hover */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-background/95 text-primary opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 rotate-[-90deg] group-hover:rotate-0 transition-all duration-500 ease-out shadow-elegant ring-4 ring-white/30">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="relative flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-bold text-primary text-base line-clamp-2 leading-snug min-h-[2.75rem] transition-colors duration-300 group-hover:text-primary-glow">
          {c.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 shrink-0">
            <Eye className="h-3.5 w-3.5" />
            {c.views} views
          </span>
          <span className="h-3 w-px bg-border shrink-0" />
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="h-3.5 w-3.5" />
            {c.duration}
          </span>
          <span className="ml-auto rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wide whitespace-nowrap shrink-0">
            {c.level}
          </span>
        </div>

        {/* Bottom CTA row */}
        <div className="flex items-center justify-between mt-auto pt-1 border-t border-border">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Subscribe to access
          </span>
          <span className="text-xs font-bold text-primary flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
            Watch now
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Bottom fill line on hover */}
      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-primary group-hover:w-full transition-all duration-500 ease-out" />
    </article>
  );
}
