import type { SubscriptionPlan } from "@/types";

export function buildCallbackUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/subscriptions/callback`;
}

export interface PaystackCheckoutRequest {
  planId: SubscriptionPlan["id"];
  email: string;
}

export function paystackPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? null;
}
