"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

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
  {
    name: "Fatima Yusuf",
    role: "JSS 3 Student, Abuja",
    content: "The JSS curriculum is so well organized. I used PerfectMark for my BECE and I passed with straight A's in all my science subjects. The animations make learning fun!",
    avatar: "https://i.pravatar.cc/100?u=fatima",
    rating: 5,
  },
  {
    name: "Emeka Nwosu",
    role: "SS 2 Student, Port Harcourt",
    content: "Economics and Commerce were my toughest subjects, but the way they are explained here is simply the best. I highly recommend it to any serious student.",
    avatar: "https://i.pravatar.cc/100?u=emeka",
    rating: 5,
  },
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10" />

      <div className="container px-[5%]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm border border-primary/5">
              <Quote className="h-3 w-3" />
              Success Stories
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary leading-tight">
              Trusted by <span className="text-gradient">Thousands</span> of Students
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Don&apos;t just take our word for it. Hear from the students who are
              smashing their exams and achieving their dreams with PerfectMark.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={scrollPrev}
              className="h-12 w-12 rounded-full border border-primary/10 bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollNext}
              className="h-12 w-12 rounded-full border border-primary/10 bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-6 first:pl-0"
              >
                <div className="group h-full relative bg-card p-8 rounded-3xl shadow-card border border-border hover:shadow-elegant transition-all duration-500">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  
                  <p className="text-foreground/80 italic leading-relaxed mb-8 relative z-10 text-sm md:text-base">
                    &ldquo;{t.content}&rdquo;
                  </p>

                  <div className="flex items-center gap-4 border-t border-border/50 pt-6 mt-auto">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={48}
                      height={48}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
