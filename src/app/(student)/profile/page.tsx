"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { User, Save, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/api";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name cannot be empty."); return; }
    setSavingProfile(true);
    try {
      await api.patch("/me", { name: name.trim() });
      await refreshUser();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="animate-fade-in space-y-8 max-w-2xl">
      <PageHeader title="My Profile" description="Manage your account information." />

      {/* Avatar */}
      <div className="rounded-3xl border border-border bg-card shadow-card p-6 flex items-center gap-6">
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-primary text-white text-2xl font-extrabold shadow-glow">
          {initials}
        </div>
        <div>
          <h2 className="font-extrabold text-primary text-xl">{user.name}</h2>
          <span className="inline-flex items-center mt-2 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary capitalize">
            {user.role ?? "Student"}
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <div className="rounded-3xl border border-border bg-card shadow-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
            <User className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-primary text-lg">Personal Information</h3>
        </div>

        <form onSubmit={(e) => void handleSaveProfile(e)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="profile-name">
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
              placeholder="Your full name"
            />
          </div>

          <Button type="submit" variant="hero" className="rounded-full gap-2" disabled={savingProfile}>
            {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {savingProfile ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
