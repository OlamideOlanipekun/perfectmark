"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  usePlans,
  useMySubscription,
  useInitCheckout,
  useCancelSubscription,
} from "@/hooks/use-billing";
import { formatNaira, type Plan, type Subscription } from "@/lib/billing";
import { ApiError } from "@/lib/api";

export default function SubscriptionsPage() {
  const plansQuery = usePlans();
  const subQuery = useMySubscription();
  const initCheckout = useInitCheckout();
  const cancel = useCancelSubscription();
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  const activeSub = subQuery.data?.subscription ?? null;
  const activePlanId =
    activeSub && (activeSub.status === "active" || activeSub.status === "grace")
      ? activeSub.planId
      : null;

  const handleChoose = async (plan: Plan) => {
    if (plan.priceKobo === "0") {
      toast.info("The Starter plan is free — no checkout needed.");
      return;
    }
    setPendingPlanId(plan.id);
    try {
      const res = await initCheckout.mutateAsync(plan.id);
      window.location.href = res.authorizationUrl;
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.code === "CONFLICT"
            ? err.message
            : "Could not start checkout — please try again."
          : "Could not connect to the billing service.";
      toast.error(msg);
      setPendingPlanId(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Turn off auto-renew? You'll keep access until your expiry date.")) return;
    try {
      await cancel.mutateAsync(undefined);
      toast.success("Auto-renew turned off. You'll keep access until expiry.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't cancel — try again.");
    }
  };

  return (
    <>
      <PageHeader
        title="Subscription"
        description="Manage or renew your access. Cancel any time."
      />

      {activeSub && <CurrentSubscriptionBanner sub={activeSub} onCancel={handleCancel} cancelling={cancel.isPending} />}

      {plansQuery.isLoading && <PlansSkeleton />}

      {plansQuery.error && (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <p className="font-bold text-primary">Couldn't load plans</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check your connection and refresh the page.
          </p>
        </div>
      )}

      {!plansQuery.isLoading && plansQuery.data && (
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {plansQuery.data.plans.map((plan, idx) => {
            const isCurrent = plan.id === activePlanId;
            const isFree = plan.priceKobo === "0";
            const featured = !isFree && idx === 1; // middle tier as default featured
            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                featured={featured}
                isCurrent={isCurrent}
                isPending={pendingPlanId === plan.id && initCheckout.isPending}
                onChoose={() => void handleChoose(plan)}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

function PlansSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3 items-stretch">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-border bg-card p-7 shadow-card space-y-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-1/2" />
          <div className="space-y-2 pt-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-3 w-full" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-full mt-4" />
        </div>
      ))}
    </div>
  );
}

function CurrentSubscriptionBanner({
  sub,
  onCancel,
  cancelling,
}: {
  sub: Subscription;
  onCancel: () => void;
  cancelling: boolean;
}) {
  const statusLabel = statusText(sub);
  const statusVariant =
    sub.status === "active" ? "default" : sub.status === "grace" ? "secondary" : "outline";

  return (
    <section className="mb-8 rounded-3xl border border-border bg-gradient-to-r from-secondary/50 to-transparent p-6 shadow-card">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-extrabold text-primary text-lg">{sub.planName}</h2>
            <Badge variant={statusVariant} className="capitalize">
              {sub.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{statusLabel}</p>
        </div>
        {(sub.status === "active" || sub.status === "grace") && sub.autoRenew && (
          <Button
            variant="softOutline"
            size="sm"
            className="rounded-full"
            onClick={onCancel}
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Cancelling…
              </>
            ) : (
              "Turn off auto-renew"
            )}
          </Button>
        )}
      </div>
    </section>
  );
}

function statusText(sub: Subscription): string {
  if (sub.status === "active" && sub.expiryDate) {
    return sub.autoRenew
      ? `Renews on ${formatDate(sub.expiryDate)}`
      : `Ends on ${formatDate(sub.expiryDate)} — auto-renew is off`;
  }
  if (sub.status === "grace" && sub.graceUntil) {
    return `Payment retry needed — grace period ends ${formatDate(sub.graceUntil)}`;
  }
  if (sub.status === "cancelled" && sub.expiryDate) {
    return `Cancelled, access ends ${formatDate(sub.expiryDate)}`;
  }
  if (sub.status === "expired" && sub.expiryDate) {
    return `Expired on ${formatDate(sub.expiryDate)}`;
  }
  return "Pending payment confirmation.";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PlanCard({
  plan,
  featured,
  isCurrent,
  isPending,
  onChoose,
}: {
  plan: Plan;
  featured: boolean;
  isCurrent: boolean;
  isPending: boolean;
  onChoose: () => void;
}) {
  const isFree = plan.priceKobo === "0";
  const intervalLabel =
    plan.intervalDays >= 365 ? "year" : plan.intervalDays >= 30 ? "month" : `${plan.intervalDays} days`;

  return (
    <div
      className={`relative rounded-3xl border p-7 flex flex-col gap-5 shadow-card transition-smooth hover:shadow-elegant ${
        featured
          ? "bg-gradient-primary text-white border-primary"
          : "bg-card border-border"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent text-primary text-[11px] font-bold uppercase tracking-widest px-3 py-1">
          Most popular
        </span>
      )}
      {isCurrent && (
        <span className="absolute -top-3 right-6 rounded-full bg-accent text-primary text-[11px] font-bold uppercase tracking-widest px-3 py-1">
          Current plan
        </span>
      )}

      <div>
        <h3 className={`text-xl font-extrabold ${featured ? "text-white" : "text-primary"}`}>
          {plan.name}
        </h3>
        <div className="mt-3 flex items-baseline gap-1">
          <span className={`text-4xl font-extrabold ${featured ? "text-white" : "text-primary"}`}>
            {isFree ? "Free" : formatNaira(plan.priceKobo)}
          </span>
          {!isFree && (
            <span className={`text-sm ${featured ? "text-white/70" : "text-muted-foreground"}`}>
              /{intervalLabel}
            </span>
          )}
        </div>
        {plan.description && (
          <p className={`mt-2 text-xs leading-relaxed ${featured ? "text-white/70" : "text-muted-foreground"}`}>
            {plan.description}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check
              className={`h-4 w-4 mt-0.5 shrink-0 ${featured ? "text-accent" : "text-primary"}`}
              strokeWidth={2.5}
            />
            <span className={featured ? "text-white/85" : "text-muted-foreground"}>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={featured ? "softOutline" : "hero"}
        className={`w-full rounded-full ${
          featured ? "bg-white/10 border-white/30 text-white hover:bg-white/20" : ""
        }`}
        disabled={isCurrent || isPending || isFree}
        onClick={onChoose}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Redirecting…
          </>
        ) : isCurrent ? (
          "Current plan"
        ) : isFree ? (
          "Free plan"
        ) : (
          `Get ${plan.name}`
        )}
      </Button>
    </div>
  );
}
