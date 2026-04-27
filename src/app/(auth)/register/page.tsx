import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="rounded-3xl bg-card/80 backdrop-blur-xl border border-white/20 shadow-elegant p-10 animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Create <span className="text-gradient">Account</span>
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Join thousands of students mastering their exams with expert tutorials.
        </p>
      </div>

      <RegisterForm />

      <p className="mt-10 text-sm text-muted-foreground border-t border-border pt-8 text-center sm:text-left">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="font-bold text-primary hover:text-primary-glow transition-smooth"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
