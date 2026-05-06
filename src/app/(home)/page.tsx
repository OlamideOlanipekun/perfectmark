"use client";

import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Features } from "@/components/marketing/features";
import { CourseGrid } from "@/components/marketing/course-grid";
import { CTABanner } from "@/components/marketing/cta-banner";

/**
 * Redesigned PerfectMark Landing Page
 * This page uses the newly redesigned modular components for a premium, academic EdTech experience.
 */
export default function PerfectMarkLandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-primary/10 selection:text-primary">
      {/* Navigation */}
      <MarketingHeader />

      <main>
        {/* Hero Section - High Conversion & Trust */}
        <Hero />

        {/* Features Section - Why Choose PerfectMark */}
        <Features />

        {/* How It Works - Step-by-Step Process */}
        <HowItWorks />

        {/* Course Grid - Subject Library & Previews */}
        <CourseGrid />

        {/* Final CTA - Registration Conversion */}
        <CTABanner />
      </main>

      {/* Global Footer */}
      <MarketingFooter />
    </div>
  );
}
