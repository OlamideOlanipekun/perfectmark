"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";

type State =
  | { phase: "missing" }
  | { phase: "verifying" }
  | { phase: "success" }
  | { phase: "expired" }
  | { phase: "invalid" }
  | { phase: "error"; message: string };

/**
 * Landing page for the verify link sent in the welcome email.
 * Token comes via ?token=… query param. We POST it to /auth/verify-email
 * and render a clear success / expired / invalid state.
 */
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Shell><Spinner label="Loading…" /></Shell>}>
      <VerifyEmailInner />
    </Suspense>
  );
}

function VerifyEmailInner() {
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>(() =>
    token ? { phase: "verifying" } : { phase: "missing" },
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        await api.post("/auth/verify-email", { token });
        if (!cancelled) setState({ phase: "success" });
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError) {
          if (err.status === 401) {
            setState({ phase: "expired" });
          } else if (err.status === 400) {
            setState({ phase: "invalid" });
          } else {
            setState({ phase: "error", message: err.message });
          }
        } else {
          setState({ phase: "error", message: "Network error — try the link again later." });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state.phase === "missing") {
    return (
      <Shell>
        <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h1 className="text-xl font-extrabold text-primary">No verification token</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Open this page from the link we sent to your email.
        </p>
        <Button asChild variant="softOutline" className="w-full rounded-full mt-6">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </Shell>
    );
  }

  if (state.phase === "verifying") {
    return (
      <Shell>
        <Spinner label="Confirming your email…" />
      </Shell>
    );
  }

  if (state.phase === "success") {
    return (
      <Shell>
        <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
        <h1 className="text-xl font-extrabold text-primary">Email confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for confirming. You're all set.
        </p>
        <Button asChild variant="hero" className="w-full rounded-full mt-6">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </Shell>
    );
  }

  if (state.phase === "expired") {
    return (
      <Shell>
        <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h1 className="text-xl font-extrabold text-primary">Link expired</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Verification links are valid for 24 hours. Sign in and we'll send a fresh one.
        </p>
        <Button asChild variant="hero" className="w-full rounded-full mt-6">
          <Link href="/login">Sign in</Link>
        </Button>
      </Shell>
    );
  }

  if (state.phase === "invalid") {
    return (
      <Shell>
        <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h1 className="text-xl font-extrabold text-primary">Invalid link</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This token isn't recognised. Check that you opened the most recent verification
          email.
        </p>
        <Button asChild variant="softOutline" className="w-full rounded-full mt-6">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </Shell>
    );
  }

  return (
    <Shell>
      <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
      <h1 className="text-xl font-extrabold text-primary">Couldn't verify</h1>
      <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
      <Button asChild variant="softOutline" className="w-full rounded-full mt-6">
        <Link href="/login">Back to sign in</Link>
      </Button>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card border border-border shadow-elegant p-8 text-center animate-fade-in-up">
      {children}
    </div>
  );
}

function Spinner({ label }: { label: string }) {
  return (
    <>
      <Loader2 className="h-10 w-10 text-primary mx-auto mb-4 animate-spin" />
      <h1 className="text-xl font-extrabold text-primary">{label}</h1>
    </>
  );
}
