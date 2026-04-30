import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-8 py-8 lg:py-0">
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Create <span className="text-gradient">Account</span>
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Join thousands of students mastering their exams with expert tutorials.
        </p>
      </div>

      <RegisterForm />

      <p className="mt-10 text-sm text-muted-foreground border-t border-border pt-8">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="font-bold text-primary hover:text-primary-glow transition-smooth underline underline-offset-4"
        >
          Sign in here
        </Link>
      </p>
    </div>
  );
}
