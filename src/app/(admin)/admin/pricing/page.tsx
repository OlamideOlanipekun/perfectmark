"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit2, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/api";
import type { Plan } from "@/lib/billing";

interface PlansResponse { plans: Plan[] }

function formatNaira(kobo: string): string {
  if (kobo === "0") return "Free";
  return new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 0,
  }).format(Number(kobo) / 100);
}

export default function AdminPricingPage() {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const plans = useQuery<PlansResponse>({
    queryKey: ["admin", "plans"],
    queryFn: () => api.get<PlansResponse>("/admin/billing/plans"),
    staleTime: 60_000,
  });

  // Fallback to public plans if admin endpoint unavailable
  const publicPlans = useQuery<PlansResponse>({
    queryKey: ["billing", "plans"],
    queryFn: () => api.get<PlansResponse>("/billing/plans"),
    enabled: !!plans.error,
    staleTime: 60_000,
  });

  const displayPlans = plans.data?.plans ?? publicPlans.data?.plans ?? [];

  const updatePlan = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; priceKobo?: string } }) =>
      api.patch(`/admin/billing/plans/${id}`, data),
    onSuccess: () => {
      toast.success("Plan updated!");
      void qc.invalidateQueries({ queryKey: ["admin", "plans"] });
      void qc.invalidateQueries({ queryKey: ["billing", "plans"] });
      setEditingId(null);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to update plan.");
    },
  });

  const startEdit = (plan: Plan) => {
    setEditingId(plan.id);
    setEditName(plan.name);
    setEditPrice(String(Number(plan.priceKobo) / 100));
  };

  const saveEdit = (planId: string) => {
    updatePlan.mutate({
      id: planId,
      data: {
        name: editName,
        priceKobo: String(Math.round(Number(editPrice) * 100)),
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Pricing"
        description="Manage subscription plans and pricing."
        action={
          <Button variant="hero" className="rounded-full gap-2" disabled>
            <Plus className="h-4 w-4" />
            New plan (coming soon)
          </Button>
        }
      />

      {(plans.isLoading || publicPlans.isLoading) && (
        <div className="flex items-center gap-3 text-muted-foreground py-12 justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading plans…</span>
        </div>
      )}

      {plans.error && !publicPlans.data && (
        <div className="rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive text-center mb-6">
          Could not load plans — make sure the API is running.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {displayPlans.map((plan) => {
          const isEditing = editingId === plan.id;
          const isFree = plan.priceKobo === "0";
          const interval = plan.intervalDays >= 365 ? "year" : plan.intervalDays >= 30 ? "month" : `${plan.intervalDays} days`;

          return (
            <div
              key={plan.id}
              className="rounded-3xl border border-border bg-card shadow-card p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="rounded-xl border border-border bg-secondary/30 px-3 py-1.5 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 w-full mr-2"
                  />
                ) : (
                  <h3 className="font-extrabold text-primary text-lg">{plan.name}</h3>
                )}
                <Badge variant="outline" className="capitalize text-[10px] shrink-0">
                  {isFree ? "Free" : interval}
                </Badge>
              </div>

              {isEditing ? (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    disabled={isFree}
                    className="rounded-xl border border-border bg-secondary/30 px-3 py-1.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 w-full"
                  />
                </div>
              ) : (
                <div className="text-3xl font-extrabold text-primary">
                  {formatNaira(plan.priceKobo)}
                  {!isFree && <span className="text-sm font-normal text-muted-foreground">/{interval}</span>}
                </div>
              )}

              <ul className="flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 mt-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="hero"
                      size="sm"
                      className="rounded-full flex-1 gap-1"
                      disabled={updatePlan.isPending}
                      onClick={() => saveEdit(plan.id)}
                    >
                      {updatePlan.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Save
                    </Button>
                    <Button
                      variant="softOutline"
                      size="sm"
                      className="rounded-full gap-1"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="softOutline"
                    size="sm"
                    className="rounded-full w-full gap-2"
                    onClick={() => startEdit(plan)}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit plan
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
