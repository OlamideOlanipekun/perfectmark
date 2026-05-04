"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { cardHover, buttonClick } from "@/lib/animations";

const TESTIMONIALS = [
  {
    name: "Olawale Adeyemi",
    role: "SS3 Student",
    location: "Lagos",
    content: "PerfectMark changed how I prepare for JAMB. The video lessons are so clear — I moved from struggling with Physics to scoring 85 in my mocks!",
    highlight: "scoring 85 in my mocks",
    avatar: "https://i.pravatar.cc/100?u=olawale",
    rating: 5,
    exam: "JAMB",
  },
  {
    name: "Chinyere Okafor",
    role: "WAEC Candidate",
    location: "Enugu",
    content: "I finally understand Mathematics topics that used to confuse me in class. The flexibility to learn at night is perfect for my schedule.",
    highlight: "I finally understand Mathematics",
    avatar: "https://i.pravatar.cc/100?u=chinyere",
    rating: 5,
    exam: "WAEC",
  },
  {
    name: "Abubakar Ibrahim",
    role: "Science Student",
    location: "Kano",
    content: "I love the trade and technical subjects coverage. It's rare to find such high-quality tutorials for Nigerian trade courses. PerfectMark is a lifesaver!",
    highlight: "high-quality tutorials",
    avatar: "https://i.pravatar.cc/100?u=abubakar",
    rating: 5,
    exam: "NECO",
  },
  {
    name: "Fatima Yusuf",
    role: "JSS 3 Student",
    location: "Abuja",
    content: "I used PerfectMark for my BECE and passed with straight A's in all my science subjects. The animations make learning fun!",
    highlight: "straight A's in all my science subjects",
    avatar: "https://i.pravatar.cc/100?u=fatima",
    rating: 5,
    exam: "BECE",
  },
  {
    name: "Emeka Nwosu",
    role: "SS 2 Student",
    location: "Port Harcourt",
    content: "Economics and Commerce were my toughest subjects, but the way they are explained here is simply the best. I highly recommend PerfectMark.",
    highlight: "simply the best",
    avatar: "https://i.pravatar.cc/100?u=emeka",
    rating: 5,
    exam: "WAEC",
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
    <section className="py-24 relative overflow-hidden" style={{ background: "#f8f7fb" }}>
      {/* Decorative blobs */}
      <div
        className="absolute top-0 left-1/4 w-80 h-80 rounded-full -z-10"
        style={{ background: "radial-gradient(circle,rgba(33,32,92,.04) 0%,transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full -z-10"
        style={{ background: "radial-gradient(circle,rgba(206,173,96,.05) 0%,transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="container px-[5%]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <ScrollReveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary shadow-sm border border-primary/8">
              <Quote className="h-3 w-3 text-accent" />
              Success Stories
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary leading-tight">
              Trusted by{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#cead60,#b8962a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Thousands
              </span>{" "}
              of Students
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Don&apos;t just take our word for it. Hear from students who are
              acing their exams and achieving their dreams with PerfectMark.
            </p>
          </ScrollReveal>

          <div className="flex gap-3 shrink-0">
            <motion.button
              {...buttonClick}
              onClick={scrollPrev}
              className="h-12 w-12 rounded-full border border-primary/10 bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            <motion.button
              {...buttonClick}
              onClick={scrollNext}
              className="h-12 w-12 rounded-full border border-primary/10 bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="flex-[0_0_85%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6"
                >
                  <motion.div 
                    variants={cardHover}
                    whileHover="whileHover"
                    className="group h-full relative bg-white p-6 md:p-8 rounded-[24px] md:rounded-3xl shadow-card border border-primary/5 flex flex-col transition-all duration-500"
                  >
                    {/* Star rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                      ))}
                    </div>

                    {/* Exam badge */}
                    <span
                      className="absolute top-6 right-6 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        background: "linear-gradient(135deg,#21205c,#312f8a)",
                        color: "white",
                      }}
                    >
                      {t.exam}
                    </span>

                    {/* Content */}
                    <p className="text-foreground/80 leading-relaxed mb-6 relative z-10 text-sm md:text-base flex-1 line-clamp-4 md:line-clamp-none italic">
                      &ldquo;
                      {t.content.split(t.highlight).map((part, idx, arr) => (
                        <React.Fragment key={idx}>
                          {part}
                          {idx < arr.length - 1 && (
                            <strong className="text-primary font-bold">{t.highlight}</strong>
                          )}
                        </React.Fragment>
                      ))}
                      &rdquo;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 md:gap-4 border-t border-border/50 pt-5 mt-auto">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={44}
                        height={44}
                        className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-primary/10"
                      />
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-primary">{t.name}</h4>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
