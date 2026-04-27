"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type Values = z.infer<typeof schema>;

/**
 * Two-step login:
 *   Step 1 — email + password.
 *     If account has MFA the backend returns 401 "MFA code required". We then
 *     reveal the MFA input and keep the password in state for the second submit.
 *   Step 2 — same fields + 6-digit MFA code.
 */
export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  const [submitting, setSubmitting] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState<string | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (values: Values) => {
    setSubmitting(true);
    setMfaError(null);
    try {
      await login(values.email, values.password, mfaRequired ? mfaCode : undefined);
      if (next && next.startsWith("/")) {
        router.replace(next);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // Distinguish MFA-required (401 with that specific message) from
        // generic invalid credentials (also 401) so we don't tell the admin
        // their password is wrong when it isn't.
        if (err.status === 401 && /mfa code required/i.test(err.message)) {
          setMfaRequired(true);
        } else if (err.status === 401 && mfaRequired && /authenticator code/i.test(err.message)) {
          setMfaError("That code didn't work. Try again.");
        } else if (err.status === 401) {
          setMfaRequired(false);
          setMfaCode("");
          form.setError("password", { message: "Incorrect email or password." });
        } else if (err.status === 429) {
          toast.error("Too many attempts — please try again in a few minutes.");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Could not sign in. Check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={mfaRequired}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  disabled={mfaRequired}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mfaRequired && (
          <div className="rounded-2xl border border-primary/15 bg-secondary/40 p-4 space-y-3 animate-fade-in-up">
            <div>
              <FormLabel htmlFor="mfa-code" className="text-primary">
                Authenticator code
              </FormLabel>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>
            <Input
              id="mfa-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              value={mfaCode}
              onChange={(e) => {
                setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                if (mfaError) setMfaError(null);
              }}
              placeholder="123456"
              autoFocus
              className="tracking-[0.4em] text-center font-mono text-lg"
            />
            {mfaError && (
              <p className="text-xs font-medium text-destructive">{mfaError}</p>
            )}
            <button
              type="button"
              onClick={() => {
                setMfaRequired(false);
                setMfaCode("");
                setMfaError(null);
              }}
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-smooth"
            >
              Use a different account
            </button>
          </div>
        )}

        <Button
          type="submit"
          variant="hero"
          size="xl"
          className="w-full mt-6 shadow-glow transition-all active:scale-[0.98]"
          disabled={submitting || (mfaRequired && mfaCode.length !== 6)}
        >
          {submitting
            ? mfaRequired
              ? "Verifying…"
              : "Signing in…"
            : mfaRequired
              ? "Verify code"
              : "Sign in to Dashboard"}
        </Button>
      </form>
    </Form>
  );
}
