import { Suspense } from "react";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Admin <span className="text-gradient">Access</span>
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Administrator sign-in.
        </p>
      </div>

      <Suspense fallback={<div className="h-64 animate-pulse bg-secondary/20 rounded-3xl" />}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
