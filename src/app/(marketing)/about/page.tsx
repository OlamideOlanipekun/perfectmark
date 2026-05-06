import Image from "next/image";
import Link from "next/link";
import {
  Target,
  CheckCircle2,
  Users,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Our Mission to Redefine Education in Africa",
  description: "Learn about the story behind Perfect Mark Tutors College. We are dedicated to providing high-quality, affordable online education for secondary school students in Nigeria.",
  keywords: ["online education Nigeria", "affordable tutoring", "Nigerian secondary school syllabus", "Perfect Mark story"],
};

/* ────────────────────────────────────────────────────────────── */
/* DATA                                                            */
/* ────────────────────────────────────────────────────────────── */

const WHY_CHOOSE = [
  {
    num: "01",
    title: "Curriculum-Aligned Content",
    body: "Our lessons are expertly crafted by experienced teachers who are familiar with the syllabus. Each tutorial is tailored to align perfectly with the JSS 1-3, WAEC, NECO, and UTME curriculum.",
  },
  {
    num: "02",
    title: "Engaging and Interactive Learning",
    body: "We understand the importance of making learning enjoyable. Our videos use real-life examples, illustrations, and step-by-step explanations.",
  },
  {
    num: "03",
    title: "Flexible Learning Anytime",
    body: "Whether you're revising at home or on the go, our platform is accessible on all devices, giving students the flexibility to learn at their own pace.",
  },
  {
    num: "04",
    title: "Wide Subject Coverage",
    body: "From core subjects to electives, we cover a broad range of topics, ensuring every student finds the resources they need.",
  },
  {
    num: "05",
    title: "Expert Educators",
    body: "Our team comprises passionate and qualified teachers who bring years of experience to help students grasp challenging concepts.",
  },
];

const VALUES = [
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Using modern technology to redefine the learning experience for African students.",
  },
  {
    icon: Target,
    title: "Excellence",
    desc: "Maintaining the highest standards in tutorial quality and academic outcomes.",
  },
  {
    icon: Users,
    title: "Inclusion",
    desc: "Providing affordable access to top-tier education for every student, everywhere.",
  },
];

const STREAMS = [
  {
    label: "Sciences",
    subjects: ["Physics", "Chemistry", "Biology", "General Mathematics", "Further Mathematics", "Agricultural Science"],
  },
  {
    label: "Arts",
    subjects: ["Literature in English", "Government", "History", "Christian Religious Knowledge", "Yoruba", "Arts"],
  },
  {
    label: "Languages",
    subjects: ["English Language", "Oral English", "French", "Yoruba", "Languages"],
  },
  {
    label: "Commercial",
    subjects: ["Financial Accounting", "Economics", "Commerce", "Business Studies", "Geography", "Commercial"],
  },
];

/* ────────────────────────────────────────────────────────────── */
/* PAGE                                                            */
/* ────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-0 overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 bg-background overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-l-[100px] -z-10" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container px-6 md:px-12 lg:px-20 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary border border-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-6">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  Our Story
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-primary mb-6">
                  Redefining <br />
                  <span className="text-gradient">Education</span> in Africa
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mb-10">
                  Perfect Mark Tutors College is an online tutoring platform built for Nigerian secondary school students, dedicated to helping JSS and SS learners achieve academic excellence through premium video tutorials.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild variant="hero" size="xl" className="rounded-full">
                    <Link href="/register">Start Learning Today</Link>
                  </Button>
                  <Button asChild variant="softOutline" size="xl" className="rounded-full">
                    <Link href="/courses">Explore Subjects</Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" className="relative">
              <div className="relative aspect-square md:aspect-[4/5] rounded-[40px] overflow-hidden shadow-elegant border-4 border-white">
                <Image
                  src="/about-expert.jpg"
                  alt="Founder of Perfect Mark Tutors College"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Floating Caption */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-card animate-float">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary">Built in Nigeria</div>
                      <div className="text-xs text-muted-foreground">For Nigerian secondary students</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-24 bg-secondary/30 relative">
        <div className="container px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <ScrollReveal direction="up">
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">Built on <span className="text-gradient">Trust & Innovation</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Our mission is to empower every student with the tools they need to succeed in their examinations and beyond.</p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} direction="up" delay={i * 100}>
                <div className="group p-8 rounded-3xl bg-card border border-border shadow-card hover:shadow-elegant transition-all duration-500 hover:-translate-y-2">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-white mb-6 shadow-glow group-hover:scale-110 transition-transform">
                    <v.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{v.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM & SOLUTION ── */}
      <section className="py-24 bg-background">
        <div className="container px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal direction="left">
              <div className="space-y-6">
                <h2 className="text-4xl font-extrabold text-primary leading-tight">
                  Comprehensive Curriculum <br />
                  <span className="text-accent">From JSS1 to SS3</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We cover everything from basic education to advanced exam preparation. Our platform is designed to be the only academic companion a Nigerian student needs throughout their secondary education.
                </p>
                <div className="space-y-4 pt-4">
                  {STREAMS.map((s) => (
                    <div key={s.label} className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/50 border border-primary/5 hover:border-primary/20 transition-smooth">
                      <div className="mt-1">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{s.label} Stream</h4>
                        <p className="text-sm text-muted-foreground">{s.subjects.join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="aspect-[4/5] rounded-3xl bg-primary overflow-hidden relative shadow-elegant">
                    <Image src="/courses/math.jpg" alt="Maths" fill className="object-cover opacity-60 mix-blend-overlay" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      <div className="text-2xl font-bold">Mathematics</div>
                      <div className="text-xs opacity-80 uppercase tracking-widest font-bold">Sciences Stream</div>
                    </div>
                  </div>
                  <div className="aspect-square rounded-3xl bg-accent overflow-hidden relative shadow-card">
                     <Image src="/courses/chemistry.jpg" alt="Science" fill className="object-cover opacity-60 mix-blend-overlay" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-square rounded-3xl bg-secondary overflow-hidden relative shadow-card">
                    <Image src="/courses/physics.jpg" alt="Physics" fill className="object-cover opacity-40 mix-blend-overlay" />
                  </div>
                  <div className="aspect-[4/5] rounded-3xl bg-primary overflow-hidden relative shadow-elegant">
                    <Image src="/courses/economics.jpg" alt="Economics" fill className="object-cover opacity-60 mix-blend-overlay" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      <div className="text-2xl font-bold">Economics</div>
                      <div className="text-xs opacity-80 uppercase tracking-widest font-bold">Commercial Stream</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US LIST ── */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container px-6 md:px-12 lg:px-20 relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <ScrollReveal direction="up">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Why Students <span className="text-accent">Choose Us</span></h2>
              <p className="text-white/70">Built around what Nigerian secondary students actually need to pass their exams. Here is why.</p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE.map((item, i) => (
              <ScrollReveal key={item.num} direction="up" delay={i * 100}>
                <div className="group h-full p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-smooth">
                  <div className="text-4xl font-black text-accent/20 mb-4 group-hover:text-accent/40 transition-smooth">{item.num}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-background">
        <div className="container px-6 md:px-12 lg:px-20">
          <ScrollReveal direction="up">
            <div className="rounded-[40px] bg-gradient-primary p-12 md:p-20 text-center text-white shadow-elegant relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--accent),transparent_70%)] opacity-20" />
               <div className="relative z-10 max-w-2xl mx-auto">
                  <h2 className="text-4xl md:text-6xl font-extrabold mb-8">Ready to Start Your <span className="text-accent">Success Story?</span></h2>
                  <p className="text-white/80 text-lg mb-10 leading-relaxed">Be part of the next generation of Nigerian students mastering WAEC, NECO and JAMB with Perfect Mark Tutors College.</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button asChild size="xl" className="rounded-full bg-white text-primary hover:bg-white/90 shadow-glow font-extrabold px-10">
                      <Link href="/register">Register Now</Link>
                    </Button>
                    <Button asChild size="xl" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/20 bg-white/10 backdrop-blur-md px-10 font-bold">
                      <Link href="/courses">Browse Catalog</Link>
                    </Button>
                  </div>
               </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
