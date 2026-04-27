"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api, ApiError } from "@/lib/api";

const schema = z
  .object({
    password: z.string().min(10, "At least 10 characters"),
    confirm: z.string().min(10, "At least 10 characters"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

type Values = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </Shell>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values: Values) => {
    if (!token) return;
    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, password: values.password });
      setDone(true);
      // Forward to login after a beat — user must sign back in (we revoked
      // every refresh token server-side as part of reset).
      setTimeout(() => router.replace("/login"), 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          toast.error("This reset link has expired or already been used. Request a new one.");
        } else if (err.code === "VALIDATION_ERROR") {
          form.setError("password", { message: err.message });
        } else if (err.status === 429) {
          toast.error("Too many attempts. Try again in a few minutes.");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Couldn't reset your password. Check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Shell>
        <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h1 className="text-xl font-extrabold text-primary text-center">No reset token</h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Open this page from the link we sent to your email.
        </p>
        <Button asChild variant="softOutline" className="w-full rounded-full mt-6">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </Shell>
    );
  }

  if (done) {
    return (
      <Shell>
        <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
        <h1 className="text-xl font-extrabold text-primary text-center">Password reset</h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          You&apos;ll be redirected to sign in with your new password.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">
          Choose a new password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;ll need to sign in again on every device after this.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormDescription>At least 10 characters. A passphrase works great.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full mt-4 shadow-glow transition-all active:scale-[0.98]"
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Reset password"}
          </Button>
        </form>
      </Form>

      <div className="mt-5 border-t border-border pt-5">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-primary transition-smooth story-link"
        >
          ← Back to sign in
        </Link>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card border border-border shadow-elegant p-8 animate-fade-in-up">
      {children}
    </div>
  );
}
