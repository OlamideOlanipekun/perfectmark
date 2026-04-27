import { api } from "@/lib/api";
import type { ExamType, Stream } from "@/types";

export interface Plan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  priceKobo: string;
  priceNaira: number;
  currency: string;
  intervalDays: number;
  examType: ExamType | null;
  stream: Stream | null;
  features: string[];
  sortOrder: number;
  isActive: boolean;
}

export type SubscriptionStatus =
  | "pending"
  | "active"
  | "grace"
  | "cancelled"
  | "expired";

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planCode: string;
  planName: string;
  status: SubscriptionStatus;
  startDate: string | null;
  expiryDate: string | null;
  graceUntil: string | null;
  autoRenew: boolean;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
}

export interface CheckoutInitResponse {
  reference: string;
  authorizationUrl: string;
  amountKobo: string;
  currency: string;
  expiresIn: number;
}

export interface PaymentStatusResponse {
  status: "pending" | "success" | "failed" | "abandoned" | "refunded";
  subscription: Subscription | null;
}

export const billing = {
  listPlans: () => api.get<{ plans: Plan[] }>("/billing/plans"),

  getMySubscription: () =>
    api.get<{ subscription: Subscription | null }>("/billing/subscriptions/me"),

  cancel: (reason?: string) =>
    api.post<{ subscription: Subscription }>(
      "/billing/subscriptions/me/cancel",
      reason ? { reason } : {},
    ),

  initCheckout: (planId: string) =>
    api.post<CheckoutInitResponse>("/billing/checkout/init", { planId }),

  getPaymentStatus: (reference: string) =>
    api.get<PaymentStatusResponse>(`/billing/payments/${encodeURIComponent(reference)}`),
};

export function formatNaira(priceKobo: string | number | bigint): string {
  const kobo = typeof priceKobo === "bigint" ? priceKobo : BigInt(priceKobo);
  const naira = Number(kobo) / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(naira);
}
