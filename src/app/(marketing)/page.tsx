import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { CourseGrid } from "@/components/marketing/course-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Testimonials } from "@/components/marketing/testimonials";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfect Mark Tutors College | Nigeria's Leading Online Secondary School",
  description: "Master JSS 1-3, WAEC, NECO, and JAMB exams with premium video tutorials from Nigeria's top educators. Start your success story today with 2,000+ lessons.",
  keywords: ["WAEC tutorials", "JAMB online classes", "NECO exam prep", "JSS 1-3 video lessons", "Nigerian online school", "Perfect Mark Tutors"],
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ScrollReveal direction="left">
        <HowItWorks />
      </ScrollReveal>
      <ScrollReveal direction="up">
        <Testimonials />
      </ScrollReveal>
      <ScrollReveal direction="right" delay={100}>
        <Features />
      </ScrollReveal>
      <ScrollReveal direction="up">
        <CourseGrid />
      </ScrollReveal>
    </>
  );
}

