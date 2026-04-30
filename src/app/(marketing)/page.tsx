import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { CourseGrid } from "@/components/marketing/course-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ScrollReveal>
        <HowItWorks />
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <Features />
      </ScrollReveal>
      <ScrollReveal>
        <CourseGrid />
      </ScrollReveal>
    </>
  );
}
