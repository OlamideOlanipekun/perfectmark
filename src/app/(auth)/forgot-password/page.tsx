import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-3xl bg-card border border-border shadow-card p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">
          Need help signing in?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your PIN is your password. If you&apos;ve lost it, contact your school administrator.
        </p>
      </div>

      <div className="rounded-2xl bg-secondary/60 border border-border p-5 text-sm text-primary">
        Your Access PIN is the 8-digit code you received when you purchased portal access.
        It is also the credential you use to sign in — there is no separate password to reset.
      </div>

      <div className="mt-5 border-t border-border pt-5">
        <Button asChild variant="hero" className="w-full rounded-full h-12">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    </div>
  );
}
