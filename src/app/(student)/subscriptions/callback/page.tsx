"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePaymentStatus } from "@/hooks/use-billing";

/**
 * Paystack redirects the user here after they pay. The `reference` query
 * parameter is what we issued during /billing/checkout/init.
 *
 * Behaviour:
 *   - Poll GET /billing/payments/:reference every 2s while status === pending.
 *   - Webhook is the source of truth; this page is only UX confirmation.
 *   - After 30 s without a terminal status, show a "still processing" message
 *     and stop polling (user can refresh manually).
 */
export default function PaystackCallbackPage() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");

  const { data, isLoading, error } = usePaymentStatus(reference);

  if (!reference) {
    return (
      <CallbackShell>
        <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-primary">Missing reference</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No payment reference was provided. If you just paid, check your email for confirmation.
        </p>
        <Button asChild variant="hero" className="w-full rounded-full mt-6">
          <Link href="/subscriptions">Back to subscriptions</Link>
        </Button>
      </CallbackShell>
    );
  }

  if (isLoading || !data) {
    return (
      <CallbackShell>
        <Loader2 className="h-10 w-10 text-primary mx-auto mb-4 animate-spin" />
        <h2 className="text-xl font-extrabold text-primary">Loading payment…</h2>
        <p className="mt-2 text-sm text-muted-foreground">One moment while we check the reference.</p>
      </CallbackShell>
    );
  }

  if (error) {
    return (
      <CallbackShell>
        <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-primary">Couldn't verify this payment</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your card may still have been charged. Contact support with reference{" "}
          <code className="font-mono bg-secondary px-1 rounded">{reference}</code>.
        </p>
        <Button asChild variant="softOutline" className="w-full rounded-full mt-6">
          <Link href="/subscriptions">Back to subscriptions</Link>
        </Button>
      </CallbackShell>
    );
  }

  if (data.status === "pending") {
    return (
      <CallbackShell>
        <Loader2 className="h-10 w-10 text-primary mx-auto mb-4 animate-spin" />
        <h2 className="text-xl font-extrabold text-primary">Confirming your payment…</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Paystack has your payment; we're waiting for the webhook to activate your subscription.
          This usually takes a few seconds.
        </p>
      </CallbackShell>
    );
  }

  if (data.status === "success") {
    return (
      <CallbackShell>
        <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-primary">Payment successful</h2>
        {data.subscription && (
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome to <strong>{data.subscription.planName}</strong>! Your access is now active until{" "}
            {data.subscription.expiryDate
              ? new Date(data.subscription.expiryDate).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "your plan expires"}
            .
          </p>
        )}
        <Button asChild variant="hero" className="w-full rounded-full mt-6">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </CallbackShell>
    );
  }

  if (data.status === "failed") {
    return (
      <CallbackShell>
        <XCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-primary">Payment failed</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your card wasn't charged. You can try again from the subscriptions page.
        </p>
        <Button asChild variant="hero" className="w-full rounded-full mt-6">
          <Link href="/subscriptions">Try again</Link>
        </Button>
      </CallbackShell>
    );
  }

  // abandoned / refunded
  return (
    <CallbackShell>
      <XCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-xl font-extrabold text-primary capitalize">Payment {data.status}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Reference <code className="font-mono bg-secondary px-1 rounded">{reference}</code>.
      </p>
      <Button asChild variant="softOutline" className="w-full rounded-full mt-6">
        <Link href="/subscriptions">Back to subscriptions</Link>
      </Button>
    </CallbackShell>
  );
}

function CallbackShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card shadow-card p-8 text-center">
        {children}
      </div>
    </div>
  );
}
