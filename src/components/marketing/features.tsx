import { BookOpen, Video, Globe, Wallet } from "lucide-react";

const FEATURES_DATA = [
  { icon: BookOpen, title: "Comprehensive Curriculum Coverage", desc: "Aligned with WAEC, NECO, and JAMB syllabi across Sciences, Arts, Languages, Commercial and Trade subjects." },
  { icon: Video,    title: "Expertly Designed Video Lessons",   desc: "Clear, engaging video lessons recorded by experienced and certified Nigerian teachers." },
  { icon: Globe,    title: "Flexible and Accessible Learning",  desc: "Access lessons anytime, anywhere on any device. Cloud-powered learning that fits your life." },
  { icon: Wallet,   title: "Affordable Subscription Plans",     desc: "Premium-quality tutorials priced for every student. Pay monthly or yearly — your choice." },
];

export function Features() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES_DATA.map((f) => (
          <div
            key={f.title}
            className="group rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
              <f.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-primary">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
