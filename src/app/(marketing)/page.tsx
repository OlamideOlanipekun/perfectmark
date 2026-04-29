import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { CourseGrid } from "@/components/marketing/course-grid";
import { HowItWorks } from "@/components/marketing/how-it-works";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <CourseGrid />
    </>
  );
}
