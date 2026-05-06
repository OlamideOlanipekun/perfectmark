import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Tutors | Perfect Mark Tutors College",
  description:
    "Tutor profiles for Perfect Mark Tutors College — coming soon. Certified Nigerian educators teaching JSS 1-3, WAEC, NECO and JAMB curricula.",
};

export default function TutorsPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-32 pb-20 px-6">
      <div className="max-w-2xl text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white mb-8">
          <GraduationCap className="h-8 w-8" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">
          Meet Our Tutors — <span className="text-accent">Coming Soon</span>
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-10">
          We&apos;re onboarding our team of certified Nigerian educators. Tutor profiles, qualifications and subject specialisms will appear here shortly. In the meantime, browse our growing lesson catalogue.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="hero" size="xl" className="rounded-full">
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild variant="softOutline" size="xl" className="rounded-full">
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
