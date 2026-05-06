"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { useTestimonials } from "@/hooks/use-testimonials";
import type { Testimonial } from "@/lib/testimonials";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-[#cead60] text-[#cead60]" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const letters = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0].slice(0, 2);
  return (
    <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold uppercase select-none shrink-0">
      {letters}
    </div>
  );
}

function TestimonialCard({ item, index }: { item: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      className="flex flex-col gap-4 rounded-2xl border border-primary/8 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <StarRating rating={item.rating} />
      <p className="text-sm text-foreground/80 leading-relaxed flex-1">
        &ldquo;{item.body}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-muted/30">
        {item.avatarUrl ? (
          <img
            src={item.avatarUrl}
            alt={item.studentName}
            className="h-11 w-11 rounded-full object-cover shrink-0"
          />
        ) : (
          <Initials name={item.studentName} />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary truncate">{item.studentName}</p>
          {item.studentClass && (
            <p className="text-xs text-muted-foreground truncate">{item.studentClass}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const { data: items, isLoading } = useTestimonials();

  if (isLoading || !items || items.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <ScrollReveal className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#cead60] mb-3">
            Student Stories
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
            What our students are saying
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Real results from real students across Nigeria.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <TestimonialCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
