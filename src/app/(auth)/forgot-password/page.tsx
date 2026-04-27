"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api, ApiError } from "@/lib/api";

const schema = z.object({ email: z.string().email("Enter a valid email") });
type Values = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  const onSubmit = async ({ email }: Values) => {
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send reset email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-card border border-border shadow-card p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">Reset your password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll email you a link to set a new password.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-2xl bg-secondary/60 border border-border p-5 text-sm text-primary">
          If an account exists for that email, a reset link is on its way. Check your inbox.
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary font-semibold">Email address</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" placeholder="you@example.com" className="rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="hero" className="w-full rounded-full h-12" disabled={submitting}>
              {submitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </Form>
      )}

      <div className="mt-5 border-t border-border pt-5">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-smooth story-link">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
