import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Welcome <span className="text-gradient">Back</span>
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Sign in to your account to continue your learning journey.
        </p>
      </div>

      <Suspense fallback={<div className="h-64 animate-pulse bg-secondary/20 rounded-3xl" />}>
        <LoginForm />
      </Suspense>

      <div className="flex flex-col gap-4 text-sm border-t border-border pt-8">
        <Link 
          href="/forgot-password" 
          className="text-muted-foreground hover:text-primary transition-smooth font-medium w-fit"
        >
          Forgot your password?
        </Link>
        <p className="text-muted-foreground">
          New to Perfect Mark?{" "}
          <Link 
            href="/register" 
            className="font-bold text-primary hover:text-primary-glow transition-smooth underline underline-offset-4"
          >
            Create an account for free
          </Link>
        </p>
      </div>
    </div>
  );
}
