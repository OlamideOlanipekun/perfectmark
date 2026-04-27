import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="rounded-3xl bg-card/80 backdrop-blur-xl border border-white/20 shadow-elegant p-10 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Welcome <span className="text-gradient">Back</span>
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Sign in to your account and continue your journey to excellence.
        </p>
      </div>

      {/* Suspense boundary required by Next.js 14: LoginForm reads ?next= via
          useSearchParams() and would otherwise bail out static rendering. */}
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>

      <div className="mt-10 flex flex-col gap-5 text-sm border-t border-border pt-8">
        <Link 
          href="/forgot-password" 
          className="text-muted-foreground hover:text-primary transition-smooth story-link w-fit font-medium"
        >
          Forgot your password?
        </Link>
        <p className="text-muted-foreground">
          New to Perfect Mark?{" "}
          <Link 
            href="/register" 
            className="font-bold text-primary hover:text-primary-glow transition-smooth"
          >
            Create an account for free
          </Link>
        </p>
      </div>
    </div>
  );
}
