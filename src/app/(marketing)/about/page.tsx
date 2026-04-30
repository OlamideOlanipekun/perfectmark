import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Globe,
  Layers,
  GraduationCap,
  Target,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ────────────────────────────────────────────────────────────── */
/* DATA                                                            */
/* ────────────────────────────────────────────────────────────── */

const WHY_CHOOSE = [
  {
    num: "01",
    title: "Curriculum-Aligned Content",
    body: "Our lessons are expertly crafted by experienced teachers who are familiar with the syllabus. Each tutorial is tailored to align perfectly with the JSS 1-3, WAEC, NECO, and UTME curriculum, ensuring students are well-prepared for their exams.",
  },
  {
    num: "02",
    title: "Engaging and Interactive Learning",
    body: "We understand the importance of making learning enjoyable. Our videos are designed to simplify complex topics, using real-life examples, illustrations, and step-by-step explanations to enhance understanding.",
  },
  {
    num: "03",
    title: "Flexible Learning Anytime, Anywhere",
    body: "Whether you're revising at home or on the go, our platform is accessible on all devices, giving students the flexibility to learn at their own pace and convenience.",
  },
  {
    num: "04",
    title: "Wide Subject Coverage",
    body: "From core subjects to electives, we cover a broad range of topics, ensuring that every student finds the resources they need for their chosen path.",
  },
  {
    num: "05",
    title: "Expert Educators",
    body: "Our team comprises passionate and qualified teachers who bring years of experience to the table, helping students grasp challenging concepts with ease.",
  },
];

const CORE_FEATURES = [
  {
    icon: Layers,
    title: "Comprehensive Curriculum Coverage",
    body: "We provide video tutorials aligned with the JSS 1-3, WAEC, NECO, and UTME syllabi, covering all subjects for Junior and Senior Secondary School (JSS1 to SS3) across Sciences, Arts, Languages, Commercial, and Trade classes.",
  },
  {
    icon: BookOpen,
    title: "Expertly Designed Video Lessons",
    body: "Our tutorials are prepared by seasoned teachers who break down complex concepts into clear, easy-to-understand explanations. Each video incorporates visuals, animations, and practical examples tailored to enhance learning.",
  },
  {
    icon: Globe,
    title: "Flexible and Accessible Learning",
    body: "Access our platform anytime, anywhere, on any device. Whether on a phone, tablet, or computer, students can learn at their convenience, fitting education into their busy schedules.",
  },
  {
    icon: GraduationCap,
    title: "Affordable Subscription Plans",
    body: "We are committed to providing high-quality education at affordable rates, ensuring every student can access the resources they need without financial strain.",
  },
];

const SUBJECTS = [
  "Agricultural Science",
  "Arts",
  "Basic Science",
  "Basic Technology",
  "Biology",
  "Business Studies",
  "Chemistry",
  "Christian Religious Knowledge",
  "Civic Education",
  "Commercial",
  "Computer Studies (ICT)",
  "Creative Arts",
  "Economics",
  "English Language",
  "Financial Accounting",
  "General Mathematics",
  "Geography",
  "Government",
  "Home Economics",
  "Languages",
  "Literature in English",
  "Oral English",
  "Physics",
  "Sciences",
  "Social Studies",
  "Yoruba",
];

const STREAMS = [
  {
    label: "Sciences",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics", "Further Mathematics"],
  },
  {
    label: "Arts",
    subjects: ["Literature-in-English", "History", "Government", "Christian/Muslim Religious Studies"],
  },
  {
    label: "Languages",
    subjects: ["English Language", "French", "Yoruba", "Igbo", "Hausa"],
  },
  {
    label: "Commercial",
    subjects: ["Accounting", "Economics", "Commerce", "Business Studies"],
  },
  {
    label: "Trade Subjects",
    subjects: ["Catering", "Data Processing", "Technical Drawing", "and more"],
  },
];

/* ────────────────────────────────────────────────────────────── */
/* PAGE                                                            */
/* ────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ── split layout on light bg ── */}
      <section className="relative overflow-hidden bg-gradient-soft pt-36 pb-20">
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 90% 60%, hsl(43 74% 52% / 0.07), transparent 50%)" }} />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: text */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary border border-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
                <span className="h-2 w-2 rounded-full bg-accent" />
                About Us
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-primary">
                Achieve Academic<br />
                <span className="text-gradient">Excellence</span> with Us
              </h1>
              <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Premier online tutorial videos helping Nigerian students excel in JSS 1-3, WAEC, NECO, and UTME — trusted by 10,000+ learners across West Africa.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="hero" className="rounded-full">
                  <Link href="/register">
                    Get started free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="softOutline" className="rounded-full">
                  <Link href="/courses">Browse courses</Link>
                </Button>
              </div>
              <div className="mt-10 flex items-center gap-10 border-t border-border pt-8">
                {[["10K+", "Students"], ["240+", "Tutorials"], ["37", "Tutors"]].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-2xl font-extrabold text-primary">{v}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: decorative navy card */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl bg-gradient-primary p-10 shadow-elegant overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 50%)" }} />
                <Image
                  src="/logo.jpg"
                  alt="Perfect Mark"
                  width={160}
                  height={160}
                  className="h-36 w-36 object-contain mx-auto relative z-10"
                  priority
                />
                <div className="mt-6 grid grid-cols-4 gap-2 relative z-10">
                  {["JSS", "WAEC", "NECO", "JAMB"].map((e) => (
                    <div key={e} className="rounded-2xl bg-white/10 border border-white/20 px-2 py-3 text-center">
                      <div className="text-white font-extrabold text-[11px]">{e}</div>
                      <div className="text-white/60 text-[9px] mt-0.5">Covered</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-2.5 relative z-10">
                  {["Sciences", "Arts", "Languages", "Commercial", "Trade"].map((s) => (
                    <div key={s} className="flex items-center gap-2 text-sm text-white/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT + CATEGORIES (two-column) ── */}
      <section className="bg-gradient-soft py-20">
        <div className="container grid lg:grid-cols-[1fr_280px] gap-10 items-start">

          {/* Left: about content */}
          <div className="space-y-10">

            {/* Reach New Heights */}
            <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
              <div className="relative aspect-[16/7] w-full overflow-hidden">
                <Image
                  src="/courses/economics.jpg"
                  alt="Student studying online"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-6 left-8 right-8">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    Reach New Heights with<br />
                    <span className="text-accent">Perfect Mark Tutors College</span>
                  </h2>
                  <p className="mt-2 text-sm text-white/80">
                    Your go-to source for top-notch online tutorial videos.
                  </p>
                </div>
              </div>
              <div className="p-8 space-y-5">
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to <strong className="text-primary">Perfect Mark Tutors College</strong>, your ultimate
                  destination for high-quality online tutorial videos designed to help students excel in their academic
                  journey and achieve outstanding results in the West African Examination Council (WAEC), National
                  Examination Council (NECO), and Unified Tertiary Matriculation Examination (UTME).
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  At Perfect Mark Tutors College, we are committed to providing students with the tools and resources
                  they need to succeed. Our comprehensive video tutorials cover all subjects for Junior and Senior Secondary School
                  (JSS1 to SS3) across diverse disciplines, including:
                </p>
                <ul className="space-y-2.5">
                  {STREAMS.map(({ label, subjects }) => (
                    <li key={label} className="flex items-start gap-3 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-glow shrink-0" />
                      <span>
                        <strong className="text-primary">{label}:</strong>{" "}
                        <span className="text-muted-foreground">{subjects.join(", ")}.</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Why Choose Us */}
            <div id="why">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                  Why Choose Us?
                </span>
                <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
                  Five reasons students <span className="text-gradient">trust us</span>
                </h2>
              </div>
              <div className="space-y-4">
                {WHY_CHOOSE.map((item) => (
                  <div
                    key={item.num}
                    className="group rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-0.5 flex gap-5"
                  >
                    <div className="shrink-0 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-white text-sm font-extrabold shadow-glow">
                      {item.num}
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-base group-hover:text-primary-glow transition-smooth">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Mission */}
            <div className="rounded-3xl bg-gradient-primary text-white p-8 shadow-elegant relative overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 50%)" }}
              />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 border border-white/20">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white">Our Mission</h2>
                </div>
                <p className="text-white/85 leading-relaxed mb-4">
                  To empower students across West Africa with affordable, accessible, and effective learning resources
                  that drive academic excellence and open doors to future opportunities.
                </p>
                <p className="text-white/85 leading-relaxed">
                  Join thousands of students who are transforming their education journey with our platform. Together,
                  let&apos;s make learning easier, more engaging, and more successful!
                </p>
              </div>
            </div>

            {/* Core Features */}
            <div id="how">
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                  Core Features
                </span>
                <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
                  What makes us{" "}
                  <span className="text-gradient">different</span>
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {CORE_FEATURES.map((f, i) => (
                  <div
                    key={f.title}
                    className="group rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow shrink-0">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-muted-foreground">0{i + 1}</span>
                    </div>
                    <h3 className="font-bold text-primary text-base mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground text-center">
                These core features make Perfect Mark Tutors College a trusted partner for students aiming for academic excellence.
              </p>
            </div>

            {/* CTA */}
            <div className="rounded-3xl border border-border bg-card shadow-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-extrabold text-primary">Ready to get started?</h3>
                <p className="mt-1 text-sm text-muted-foreground">Join 10,000+ students learning on Perfect Mark today.</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Button asChild variant="hero" className="rounded-full">
                  <Link href="/register">
                    Get started free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="softOutline" className="rounded-full">
                  <Link href="#courses">Browse courses</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Video Categories sidebar */}
          <aside className="sticky top-28 space-y-6">
            <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
              <div className="bg-gradient-primary px-5 py-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <h3 className="font-bold text-white text-sm">Video Categories</h3>
              </div>
              <div className="p-5 flex flex-wrap gap-2">
                {SUBJECTS.map((s) => (
                  <Link
                    key={s}
                    href={`/catalogue?subject=${encodeURIComponent(s)}`}
                    className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-gradient-primary hover:text-white hover:border-primary transition-smooth"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>

            {/* Exam boards mini widget */}
            <div className="rounded-3xl border border-border bg-card shadow-card p-5 space-y-3">
              <h3 className="font-bold text-primary text-sm mb-3">Exam Boards Covered</h3>
              {[
                { name: "WAEC",      desc: "G.C.E + S.S.C.E", color: "from-[#1a3a8f] to-[#2563eb]" },
                { name: "NECO",      desc: "Internal + External", color: "from-[#065f46] to-[#10b981]" },
                { name: "JAMB/UTME", desc: "UTME 2025", color: "from-[#7c3aed] to-[#a78bfa]" },
              ].map((b) => (
                <div key={b.name} className="flex items-center gap-3">
                  <div className={`grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br ${b.color} text-white text-[10px] font-extrabold shrink-0`}>
                    {b.name.split("/")[0].slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary">{b.name}</div>
                    <div className="text-[10px] text-muted-foreground">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stat */}
            <div className="rounded-3xl bg-gradient-primary text-white p-5 shadow-elegant text-center">
              <div className="text-4xl font-extrabold">10K+</div>
              <div className="text-sm text-white/80 mt-1">Students enrolled</div>
              <div className="mt-3 h-px bg-white/10" />
              <div className="mt-3 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-xl font-extrabold">240+</div>
                  <div className="text-[11px] text-white/70">Tutorials</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold">37</div>
                  <div className="text-[11px] text-white/70">Tutors</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
