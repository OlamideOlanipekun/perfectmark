import { BookOpen, Video, Globe, Wallet, TrendingUp, Users, Award, Clock } from "lucide-react";

const FEATURES_DATA = [
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum Coverage",
    desc: "Aligned with WAEC, NECO, and JAMB syllabi across Sciences, Arts, Languages, Commercial and Trade subjects.",
  },
  {
    icon: Video,
    title: "Expertly Designed Video Lessons",
    desc: "Clear, engaging video lessons recorded by experienced and certified Nigerian teachers.",
  },
  {
    icon: Globe,
    title: "Flexible and Accessible Learning",
    desc: "Access lessons anytime, anywhere on any device. Cloud-powered learning that fits your life.",
  },
  {
    icon: Wallet,
    title: "Affordable Subscription Plans",
    desc: "Premium-quality tutorials priced for every student. Pay monthly or yearly — your choice.",
  },
];

const STATS = [
  { icon: TrendingUp, value: "10K+", label: "Active Students" },
  { icon: Video,      value: "2K+",  label: "Video Lessons" },
  { icon: Users,      value: "250+", label: "Expert Tutors" },
  { icon: Award,      value: "98%",  label: "Pass Rate" },
  { icon: Clock,      value: "24/7", label: "Always Available" },
];

export function Features() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="h-2 w-2 rounded-full bg-primary-glow" />
            Why Choose Us
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary">
            Everything You Need to{" "}
            <span className="text-gradient">Excel</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            PerfectMark brings together world-class content, expert teachers,
            and a seamless learning experience designed for Nigerian exam success.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES_DATA.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Subtle gradient hover bg */}
              <div className="absolute inset-0 bg-gradient-soft opacity-0 group-hover:opacity-100 transition-smooth rounded-3xl pointer-events-none" />

              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-card group-hover:shadow-glow transition-smooth group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                {/* Step number */}
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-primary border border-border">
                  {i + 1}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-primary relative">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed relative">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="mt-16 rounded-3xl bg-gradient-primary p-8 shadow-elegant">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">
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
