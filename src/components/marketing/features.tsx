import { BookOpen, Video, Globe, Wallet, TrendingUp, Users, Award, Clock } from "lucide-react";

const FEATURES_DATA = [
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum Coverage",
    desc: "Aligned with WAEC, NECO, and JAMB syllabi across Sciences, Arts, Languages, Commercial and Trade subjects — every topic, fully covered.",
    tags: ["WAEC", "NECO", "JAMB"],
    featured: true,
  },
  {
    icon: Video,
    title: "Expertly Designed Video Lessons",
    desc: "Clear, engaging lessons recorded by experienced and certified Nigerian teachers.",
    tags: ["HD Video", "Certified Tutors"],
    featured: false,
  },
  {
    icon: Globe,
    title: "Flexible & Accessible Learning",
    desc: "Access lessons anytime, on any device. Cloud-powered learning that fits your schedule.",
    tags: ["Mobile", "Desktop", "24/7"],
    featured: false,
  },
  {
    icon: Wallet,
    title: "Affordable Subscription Plans",
    desc: "Premium-quality tutorials priced for every student. Pay monthly or yearly — your choice, your pace.",
    tags: ["Monthly", "Yearly", "Free Trial"],
    featured: true,
  },
] as const;

const STATS = [
  { icon: TrendingUp, value: "10K+", label: "Active Students" },
  { icon: Video,      value: "2K+",  label: "Video Lessons" },
  { icon: Users,      value: "250+", label: "Expert Tutors" },
  { icon: Award,      value: "98%",  label: "Pass Rate" },
  { icon: Clock,      value: "24/7", label: "Always Available" },
];

export function Features() {
  return (
    <section
      id="about"
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Subtle dot-grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(hsl(222 65% 22% / 0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Radial fade so edges stay clean */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, hsl(0 0% 100%) 100%)",
        }}
      />

      <div className="container relative">
        {/* ── Section header ── */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-2 w-2 rounded-full bg-primary-glow animate-pulse" />
            Why Choose Us
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary">
            Everything You Need to{" "}
            <span className="text-gradient">Excel</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            PerfectMark brings together world-class content, expert teachers,
            and a seamless learning experience — built for Nigerian exam success.
          </p>
        </div>

        {/* ── Bento card grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">
          {FEATURES_DATA.map((f, i) => (
            <FeatureCard key={f.title} f={f} index={i} />
          ))}
        </div>

        {/* ── Stats strip ── */}
        <div className="mt-16 rounded-3xl bg-gradient-primary p-8 shadow-elegant overflow-hidden relative">
          {/* Decorative blobs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-white/5"
          />

          <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="group flex flex-col items-center text-center gap-3 rounded-2xl bg-white/10 hover:bg-white/[0.17] border border-white/10 p-5 transition-smooth"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white transition-smooth group-hover:scale-110 group-hover:bg-white/25">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-extrabold text-white leading-none">
                  {s.value}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold leading-tight">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── sub-component ─────────────────────────── */
type FeatureDatum = (typeof FEATURES_DATA)[number];

function FeatureCard({
  f,
  index,
}: {
  f: FeatureDatum;
  index: number;
}) {
  return (
    <div
      className={
        /* Featured cards span 2 cols on large screens */
        `group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-smooth hover:shadow-elegant hover:-translate-y-1.5 flex flex-col` +
        (f.featured ? " lg:col-span-2" : "")
      }
    >
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-primary rounded-t-3xl" />

      {/* Decorative background number */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute right-5 top-3 text-[6rem] font-black leading-none text-primary/[0.04]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Hover soft glow fill */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-soft opacity-0 group-hover:opacity-100 transition-smooth rounded-3xl" />

      <div className={`relative flex flex-col flex-1 ${f.featured ? "p-9" : "p-8"}`}>
        {/* Icon + glow */}
        <div className="relative mb-7 self-start">
          <div
            className={`grid place-items-center rounded-2xl bg-gradient-primary text-white shadow-card transition-smooth group-hover:scale-110 group-hover:shadow-glow ${
              f.featured ? "h-16 w-16" : "h-14 w-14"
            }`}
          >
            <f.icon className={f.featured ? "h-8 w-8" : "h-7 w-7"} />
          </div>
          {/* Icon ambient glow */}
          <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl opacity-0 group-hover:opacity-60 transition-smooth" />
        </div>

        <h3
          className={`font-extrabold text-primary mb-3 leading-tight ${
            f.featured ? "text-2xl" : "text-xl"
          }`}
        >
          {f.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {f.desc}
        </p>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {f.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom fill line on hover */}
      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-primary group-hover:w-full transition-all duration-500 ease-out rounded-b-3xl" />
    </div>
  );
}
