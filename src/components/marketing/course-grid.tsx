"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Play, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

type Course = { title: string; category: string; thumb: string; views: string };

const COURSES: Course[] = [
  { title: "Roles of Non-Governmental Organisations", category: "Government",       thumb: "/courses/english.jpg",   views: "1.2K" },
  { title: "Literary Appreciation (Part 1)",          category: "Literature",       thumb: "/courses/english.jpg",   views: "980" },
  { title: "Proteins",                                category: "Chemistry",        thumb: "/courses/chemistry.jpg", views: "2.4K" },
  { title: "Air Pollution (Part 1)",                  category: "Chemistry",        thumb: "/courses/chemistry.jpg", views: "1.7K" },
  { title: "Flames (Part 1)",                         category: "Chemistry",        thumb: "/courses/chemistry.jpg", views: "3.1K" },
  { title: "Organic Chemistry (Part 1)",              category: "Chemistry",        thumb: "/courses/chemistry.jpg", views: "2.6K" },
  { title: "Concept of Utility",                      category: "Economics",        thumb: "/courses/economics.jpg", views: "1.9K" },
  { title: "Public Finance",                          category: "Economics",        thumb: "/courses/economics.jpg", views: "1.4K" },
  { title: "Labour Market — Part 2",                  category: "Commercial",       thumb: "/courses/economics.jpg", views: "1.1K" },
  { title: "Grammatical Structure Part 3",            category: "English Language", thumb: "/courses/english.jpg",   views: "2.8K" },
  { title: "Transporting System in Man",              category: "Biology",          thumb: "/courses/biology.jpg",   views: "3.4K" },
  { title: "Population Study",                        category: "Biology",          thumb: "/courses/biology.jpg",   views: "1.5K" },
  { title: "Pollination",                             category: "Biology",          thumb: "/courses/biology.jpg",   views: "2.2K" },
  { title: "Newton's Laws of Motion",                 category: "Physics",          thumb: "/courses/physics.jpg",   views: "4.0K" },
  { title: "Algebraic Equations Mastery",             category: "Mathematics",      thumb: "/courses/math.jpg",      views: "5.1K" },
];

export function CourseGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(COURSES.map((c) => c.category))).sort();
    return ["All", ...cats];
  }, []);

  const filteredCourses = useMemo(() => {
    if (activeCategory === "All") return COURSES;
    return COURSES.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="courses" className="py-20 bg-gradient-soft">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            Explore Our Courses
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary">
            Your <span className="text-gradient">Gateway</span> to Excellence
          </h2>
          <p className="mt-4 text-muted-foreground">
            A library of expertly-taught video lessons covering WAEC, NECO and
            JAMB subjects — Sciences, Arts, Languages, Commercial and Trade.
            Tap any lesson to start learning.
          </p>
        </div>

        {/* Filter UI */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300",
                activeCategory === cat
                  ? "bg-gradient-primary text-white shadow-elegant"
                  : "bg-white border border-border text-foreground/70 hover:border-primary/20 hover:bg-primary/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
          {filteredCourses.map((c, i) => (
            <article
              key={c.title}
              style={{ animationDelay: `${(i % 6) * 80}ms` }}
              className="group relative cursor-pointer overflow-hidden rounded-3xl bg-card border border-border shadow-card transition-all duration-500 ease-out hover:shadow-elegant hover:-translate-y-2 hover:border-primary/30 animate-fade-in-up"
            >
              <span className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md" />

              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={c.thumb}
                  alt={c.title}
                  width={768}
                  height={512}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <span className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                </span>

                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <span className="absolute top-3 left-3 rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-[11px] font-semibold text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                  {c.category}
                </span>

                <div className="absolute inset-0 grid place-items-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-background/95 text-primary opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 rotate-[-90deg] group-hover:rotate-0 transition-all duration-500 ease-out shadow-elegant ring-4 ring-white/30">
                    <Play className="h-6 w-6 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-5 relative">
                <h3 className="font-bold text-primary line-clamp-2 min-h-[3rem] transition-colors duration-300 group-hover:text-primary-glow">
                  {c.title}
                </h3>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> {c.views} views
                  </span>
                  <span className="text-primary font-semibold inline-flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                    Subscribe to watch
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-primary group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
