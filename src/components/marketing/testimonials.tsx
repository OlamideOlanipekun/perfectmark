import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Olawale Adeyemi",
    role: "SS3 Student, Lagos",
    content: "PerfectMark changed how I prepare for JAMB. The video lessons are so clear, it feels like having a private tutor in my pocket. I moved from struggling with Physics to scoring 85 in my mocks!",
    avatar: "https://i.pravatar.cc/100?u=olawale",
    rating: 5,
  },
  {
    name: "Chinyere Okafor",
    role: "WAEC Candidate, Enugu",
    content: "The curriculum coverage is amazing. I finally understand Mathematics topics that used to confuse me in class. The flexibility to learn at night is perfect for my schedule.",
    avatar: "https://i.pravatar.cc/100?u=chinyere",
    rating: 5,
  },
  {
    name: "Abubakar Ibrahim",
    role: "Science Student, Kano",
    content: "I love the trade and technical subjects coverage. It's rare to find such high-quality tutorials for Nigerian trade courses online. PerfectMark is a lifesaver!",
    avatar: "https://i.pravatar.cc/100?u=abubakar",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10" />

      <div className="container px-[5%]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm border border-primary/5">
            <Quote className="h-3 w-3" />
            Success Stories
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary">
            Trusted by <span className="text-gradient">Thousands</span> of Students
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Don't just take our word for it. Hear from the students who are
            smashing their exams and achieving their dreams with PerfectMark.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={t.name}
              className="group relative bg-card p-8 rounded-3xl shadow-card border border-border hover:shadow-elegant hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              
              <p className="text-foreground/80 italic leading-relaxed mb-8 relative z-10">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
                />
                <div>
                  <h4 className="font-bold text-primary">{t.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {t.role}
                  </p>
                </div>
              </div>

              {/* Decorative quote icon */}
              <Quote className="absolute top-8 right-8 h-12 w-12 text-primary/5 -z-0 group-hover:text-primary/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
