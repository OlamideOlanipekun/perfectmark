"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { cardHover } from "@/lib/animations";

type Course = {
  title: string;
  category: string;
  emoji: string;
  color: string;
  views: string;
  students: string;
  rating: number;
  instructor: string;
  duration: string;
  level: string;
  badge?: "Popular" | "Trending" | "New" | "";
};

const SUBJECT_META: Record<string, { emoji: string; color: string }> = {
  "Agricultural Science":          { emoji: "🌱", color: "#21205c" },
  Arts:                            { emoji: "🎨", color: "#cead60" },
  Biology:                         { emoji: "🧬", color: "#21205c" },
  Chemistry:                       { emoji: "🧪", color: "#cead60" },
  "Christian Religious Knowledge": { emoji: "✝️", color: "#21205c" },
  Commercial:                      { emoji: "💼", color: "#cead60" },
  Economics:                       { emoji: "📊", color: "#21205c" },
  "English Language":              { emoji: "📖", color: "#cead60" },
  "Financial Accounting":          { emoji: "🧮", color: "#21205c" },
  "General Mathematics":           { emoji: "📐", color: "#cead60" },
  Geography:                       { emoji: "🗺️", color: "#21205c" },
  Government:                      { emoji: "🏛️", color: "#cead60" },
  Languages:                       { emoji: "🗣️", color: "#21205c" },
  "Literature in English":         { emoji: "📚", color: "#cead60" },
  "Oral English":                  { emoji: "🎤", color: "#21205c" },
  Physics:                         { emoji: "⚡", color: "#cead60" },
  Sciences:                        { emoji: "🔬", color: "#21205c" },
  Yoruba:                          { emoji: "🌍", color: "#cead60" },
};

const RAW_COURSES: Omit<Course, "emoji" | "color">[] = [
  { title: "Algebraic Equations Mastery",             category: "General Mathematics",      views: "5.1K", students: "1.2K", rating: 4.9, instructor: "Dr. Olamide", duration: "70 min", level: "JAMB/WAEC", badge: "Popular" },
  { title: "Newton's Laws of Motion",                 category: "Physics",          views: "4.0K", students: "850",  rating: 4.8, instructor: "Prof. Ade",    duration: "62 min", level: "SS2",       badge: "Trending" },
  { title: "Organic Chemistry (Part 1)",              category: "Chemistry",        views: "2.6K", students: "920",  rating: 4.9, instructor: "Dr. Chioma",  duration: "58 min", level: "SS3",       badge: "New" },
  { title: "Transporting System in Man",              category: "Biology",          views: "3.4K", students: "1.1K", rating: 4.7, instructor: "Mr. Ibrahim",  duration: "55 min", level: "SS2",       badge: "Popular" },
  { title: "Grammatical Structure Part 3",            category: "English Language", views: "2.8K", students: "760",  rating: 4.8, instructor: "Mrs. Ngozi",  duration: "47 min", level: "SS2",       badge: "" },
  { title: "Concept of Utility",                      category: "Economics",        views: "1.9K", students: "430",  rating: 4.6, instructor: "Mr. Segun",    duration: "40 min", level: "SS2",       badge: "" },
  { title: "Roles of Non-Governmental Organisations", category: "Government",       views: "1.2K", students: "310",  rating: 4.4, instructor: "Barr. Musa",   duration: "38 min", level: "SS3",       badge: "" },
  { title: "Principles of Crop Production",           category: "Agricultural Science", views: "1.5K", students: "400",  rating: 4.5, instructor: "Mr. Tunde",    duration: "45 min", level: "SS1",       badge: "" },
  { title: "Introduction to Visual Arts",             category: "Arts",             views: "800",  students: "250",  rating: 4.7, instructor: "Mrs. Kemi",    duration: "35 min", level: "SS1",       badge: "" },
  { title: "The Life and Ministry of Jesus",          category: "Christian Religious Knowledge", views: "2.1K", students: "650",  rating: 4.9, instructor: "Rev. Peters",  duration: "50 min", level: "SS2",       badge: "" },
  { title: "Business Management Basics",              category: "Commercial",       views: "3.2K", students: "890",  rating: 4.6, instructor: "Mr. Chinedu",  duration: "60 min", level: "SS3",       badge: "" },
  { title: "Ledger Entries & Trial Balance",          category: "Financial Accounting", views: "4.5K", students: "1.5K", rating: 4.8, instructor: "Dr. Ayo",      duration: "75 min", level: "SS3",       badge: "Popular" },
  { title: "Map Reading and Interpretation",          category: "Geography",        views: "2.3K", students: "540",  rating: 4.5, instructor: "Mr. Okafor",   duration: "55 min", level: "SS2",       badge: "" },
  { title: "Introduction to French",                  category: "Languages",        views: "1.1K", students: "300",  rating: 4.4, instructor: "Mme. Sarah",   duration: "40 min", level: "SS1",       badge: "" },
  { title: "Analysis of African Poetry",              category: "Literature in English", views: "3.8K", students: "950",  rating: 4.9, instructor: "Dr. Funmi",    duration: "65 min", level: "SS3",       badge: "Trending" },
  { title: "Vowel and Consonant Sounds",              category: "Oral English",     views: "2.9K", students: "720",  rating: 4.7, instructor: "Mrs. Ngozi",   duration: "45 min", level: "SS2",       badge: "" },
  { title: "Integrated Science Fundamentals",         category: "Sciences",         views: "1.7K", students: "480",  rating: 4.6, instructor: "Mr. Ibrahim",  duration: "50 min", level: "SS1",       badge: "" },
  { title: "Yoruba Proverbs and Meaning",             category: "Yoruba",           views: "1.4K", students: "380",  rating: 4.8, instructor: "Baba Ojo",     duration: "40 min", level: "SS2",       badge: "" },
];

const COURSES: Course[] = RAW_COURSES.map((c) => ({
  ...c,
  emoji: SUBJECT_META[c.category]?.emoji ?? "📘",
  color: SUBJECT_META[c.category]?.color ?? "#21205c",
})) as Course[];

export function CourseGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(COURSES.map((c) => c.category))).sort();
    return ["All", ...cats];
  }, []);

  const filteredCourses = useMemo(
    () =>
      activeCategory === "All"
        ? COURSES
        : COURSES.filter((c) => c.category === activeCategory),
    [activeCategory],
  );

  return (
    <section id="courses" className="py-24 bg-white relative overflow-hidden">
      <div className="container relative">
        {/* ── Section header ── */}
        <ScrollReveal className="mx-auto max-w-2xl text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/8">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Explore Our Courses
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            Curated <span className="text-gradient">Learning</span> Paths
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            High-conversion tutorials designed for Nigerian students. 
            Detailed explanations, practical examples, and exam-focused insights.
          </p>
        </ScrollReveal>

        {/* ── Filter pills ── */}
        <ScrollReveal delay={0.2} className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border",
                activeCategory === cat
                  ? "bg-primary text-white shadow-md border-transparent"
                  : "bg-white border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </ScrollReveal>

        {/* ── Course grid ── */}
        <div className="flex flex-nowrap overflow-x-auto pb-8 gap-6 snap-x lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((c, i) => (
              <div key={c.title} className="min-w-[85vw] sm:min-w-[400px] lg:min-w-0 snap-center">
                <CourseCard course={c} index={i} />
              </div>
            ))}
          </AnimatePresence>
        </div>

        <ScrollReveal delay={0.4} className="mt-16 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-bold border-primary text-primary hover:bg-primary hover:text-white">
            <Link href="/courses">View All Subjects →</Link>
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CourseCard({ course: c }: { course: Course; index: number }) {
  return (
    <motion.article 
      layout
      variants={cardHover}
      whileHover="hover"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video flex items-center justify-center bg-secondary/30">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
         <span className="text-5xl group-hover:scale-110 transition-transform duration-500 z-10">{c.emoji}</span>
         
         {/* Badges */}
         {c.badge && (
           <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#cead60] text-white shadow-sm">
             {c.badge}
           </span>
         )}
         
         <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 text-primary border border-primary/5 shadow-sm uppercase tracking-wider">
           {c.category}
         </span>
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-1">
             <Star className="h-3.5 w-3.5 fill-accent text-accent" />
             <span className="text-xs font-bold text-primary">{c.rating}</span>
           </div>
           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-full">
             {c.level}
           </span>
        </div>

        <h3 className="font-bold text-primary leading-snug group-hover:text-primary-glow transition-colors line-clamp-2 min-h-[2.5rem]">
          {c.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span className="font-medium text-primary/80">{c.instructor}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {c.students}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {c.duration}
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.article>
  );
}
