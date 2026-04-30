import Link from "next/link";
import { Star, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet Our Expert Tutors | Certified Nigerian Educators",
  description:
    "Learn from the best. Our certified and experienced Nigerian teachers provide clear, high-impact video tutorials for JSS 1-3, WAEC, NECO and JAMB success.",
  keywords: ["certified teachers Nigeria", "expert tutors", "online math tutor Nigeria", "WAEC subject experts", "JAMB teachers"],
};

const TUTORS = [
  {
    name: "Mr. Adebayo Okafor",
    subject: "Mathematics & Further Maths",
    exams: ["JSS", "WAEC", "NECO", "UTME"],
    experience: "15 years",
    bio: "Head of Mathematics at a leading Lagos secondary school. Known for breaking down complex algebra and calculus into simple, easy-to-follow steps.",
    rating: 4.9,
    lessons: 48,
    color: "from-[#1a3a8f] to-[#2563eb]",
    initials: "AO",
  },
  {
    name: "Mrs. Chidinma Eze",
    subject: "English Language & Literature",
    exams: ["JSS", "WAEC", "NECO", "UTME"],
    experience: "12 years",
    bio: "A passionate English teacher with over a decade of experience helping students master comprehension, essay writing, and oral English.",
    rating: 4.8,
    lessons: 36,
    color: "from-[#065f46] to-[#10b981]",
    initials: "CE",
  },
  {
    name: "Dr. Emeka Nwosu",
    subject: "Physics",
    exams: ["WAEC", "NECO", "UTME"],
    experience: "10 years",
    bio: "PhD in Physics from University of Nigeria, Nsukka. Specialises in making difficult mechanics and electricity topics accessible to SS3 students.",
    rating: 4.9,
    lessons: 42,
    color: "from-[#7c3aed] to-[#a78bfa]",
    initials: "EN",
  },
  {
    name: "Mrs. Fatimah Abdullahi",
    subject: "Chemistry & Biology",
    exams: ["WAEC", "NECO"],
    experience: "8 years",
    bio: "Science teacher with a talent for visual learning — her animated explanations of chemical reactions and cell biology are student favourites.",
    rating: 4.7,
    lessons: 55,
    color: "from-[#92400e] to-[#d97706]",
    initials: "FA",
  },
  {
    name: "Mr. Seun Adeleke",
    subject: "Economics & Commerce",
    exams: ["WAEC", "NECO", "UTME"],
    experience: "11 years",
    bio: "Former banker turned teacher. Brings real-world financial examples to economic theory, making concepts like supply-demand instantly click.",
    rating: 4.8,
    lessons: 31,
    color: "from-[#be185d] to-[#ec4899]",
    initials: "SA",
  },
  {
    name: "Mrs. Grace Obinna",
    subject: "Government & CRK",
    exams: ["WAEC", "NECO"],
    experience: "9 years",
    bio: "Combines deep knowledge of Nigerian politics and governance with compelling storytelling to make Government one of the most-watched subjects.",
    rating: 4.6,
    lessons: 28,
    color: "from-[#0e7490] to-[#22d3ee]",
    initials: "GO",
  },
];

const STREAMS = ["Sciences", "Arts", "Languages", "Commercial", "Trade"];

export default function TutorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-soft pt-36 pb-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 90% 60%, hsl(43 74% 52% / 0.07), transparent 50%)",
          }}
        />
        <div className="container relative text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary border border-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Expert Educators
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-primary">
            Meet our <span className="text-gradient">Tutors</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Every tutor at Perfect Mark is a qualified, experienced Nigerian teacher who knows
            exactly what it takes to pass JSS, WAEC, NECO and JAMB exams.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Button asChild variant="hero" className="rounded-full">
              <Link href="/register">Start Learning Free</Link>
            </Button>
            <Button asChild variant="softOutline" className="rounded-full">
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gradient-primary py-10">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            ["37+", "Expert Tutors"],
            ["240+", "Video Lessons"],
            ["10K+", "Students Taught"],
            ["4", "Exam Boards Covered"],
          ].map(([val, label]) => (
            <div key={label}>
              <div className="text-3xl font-extrabold">{val}</div>
              <div className="text-sm text-white/70 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Subject Streams Filter */}
      <section className="bg-gradient-soft py-16">
        <div className="container">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <span className="inline-flex items-center rounded-full bg-gradient-primary text-white px-4 py-1.5 text-xs font-semibold shadow-glow">
              All Subjects
            </span>
            {STREAMS.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary hover:bg-gradient-primary hover:text-white hover:border-primary transition-smooth cursor-pointer"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Tutors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TUTORS.map((tutor, i) => (
              <div
                key={tutor.name}
                style={{ animationDelay: `${i * 80}ms` }}
                className="animate-fade-in-up group rounded-3xl border border-border bg-card shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth overflow-hidden"
              >
                {/* Coloured banner */}
                <div className={`h-3 w-full bg-gradient-to-r ${tutor.color}`} />
                <div className="p-6">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${tutor.color} text-white text-xl font-extrabold shadow-glow shrink-0`}
                    >
                      {tutor.initials}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-primary">{tutor.name}</h3>
                      <p className="text-xs text-muted-foreground font-semibold">
                        {tutor.subject}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-xs font-bold text-primary">{tutor.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {tutor.bio}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutor.exams.map((e) => (
                      <span
                        key={e}
                        className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary"
                      >
                        {e}
                      </span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                      {tutor.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      {tutor.experience} experience
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-primary py-20">
        <div className="container text-center text-white max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Learn from Nigeria&apos;s best teachers
          </h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            Join 10,000+ students already benefiting from our expert-led video tutorials.
            Get started today — your first lessons are free.
          </p>
          <Button asChild className="rounded-full bg-white text-primary hover:bg-white/90 font-bold">
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
