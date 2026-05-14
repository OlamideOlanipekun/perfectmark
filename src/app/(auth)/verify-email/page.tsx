"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="rounded-3xl bg-card border border-border shadow-elegant p-8 text-center animate-fade-in-up">
      <h1 className="text-xl font-extrabold text-primary">Page not available</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Email verification is not used on this platform.
      </p>
      <Button asChild variant="hero" className="w-full rounded-full mt-6">
        <Link href="/login">Back to sign in</Link>
      </Button>
    </div>
  );
}
