"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billing } from "@/lib/billing";

const FIVE_MINUTES = 5 * 60 * 1000;

export const billingKeys = {
  all: ["billing"] as const,
  plans: () => [...billingKeys.all, "plans"] as const,
  me: () => [...billingKeys.all, "me"] as const,
  payment: (reference: string) => [...billingKeys.all, "payment", reference] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: billingKeys.plans(),
    queryFn: () => billing.listPlans(),
    staleTime: FIVE_MINUTES,
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: billingKeys.me(),
    queryFn: () => billing.getMySubscription(),
    staleTime: 30_000,
  });
}

export function usePaymentStatus(reference: string | null | undefined) {
  return useQuery({
    queryKey: billingKeys.payment(reference ?? ""),
    queryFn: () => billing.getPaymentStatus(reference!),
    enabled: !!reference,
    // Poll while pending — callback page relies on this to reflect webhook activation.
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2_000;
      return data.status === "pending" ? 2_000 : false;
    },
    staleTime: 0,
  });
}

export function useInitCheckout() {
  return useMutation({
    mutationFn: (planId: string) => billing.initCheckout(planId),
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) => billing.cancel(reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: billingKeys.me() });
    },
  });
}
