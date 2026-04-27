import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PLACEHOLDER_PLANS = [
  { name: "Starter",  price: "Free",     interval: "forever", subs: "—" },
  { name: "Scholar",  price: "₦1,800",   interval: "month",   subs: "—" },
  { name: "Mentor",   price: "₦4,500",   interval: "month",   subs: "—" },
];

export default function AdminPricingPage() {
  return (
    <>
      <PageHeader
        title="Pricing"
        description="Create and adjust subscription plans."
        action={
          <Button variant="hero" className="rounded-full">
            <Plus className="h-4 w-4 mr-1" />
            New plan
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        {PLACEHOLDER_PLANS.map((plan) => (
          <div key={plan.name} className="rounded-3xl border border-border bg-card p-6 shadow-card flex flex-col gap-4">
            <div>
              <h3 className="font-extrabold text-primary text-lg">{plan.name}</h3>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-primary">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/{plan.interval}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Active subscribers: <span className="font-semibold text-primary">{plan.subs}</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button variant="softOutline" size="sm" className="rounded-full flex-1">Edit</Button>
              <Button variant="ghost" size="sm" className="rounded-full flex-1 text-destructive hover:text-destructive">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
