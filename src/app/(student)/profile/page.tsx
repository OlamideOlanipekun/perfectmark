"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { User, Mail, Lock, Save, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/api";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("New passwords do not match."); return; }
    if (newPassword.length < 10) { toast.error("Password must be at least 10 characters."); return; }
    setSavingPassword(true);
    try {
      await api.post("/me/change-password", { currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to change password.");
    } finally {
      setSavingPassword(false);
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
      <PageHeader title="My Profile" description="Manage your account information and password." />

      {/* Avatar */}
      <div className="rounded-3xl border border-border bg-card shadow-card p-6 flex items-center gap-6">
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-primary text-white text-2xl font-extrabold shadow-glow">
          {initials}
        </div>
        <div>
          <h2 className="font-extrabold text-primary text-xl">{user.name}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
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

          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="profile-email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="profile-email"
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-2xl border border-border bg-secondary/10 px-4 py-3 pl-11 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">Email cannot be changed. Contact support if needed.</p>
          </div>

          <Button type="submit" variant="hero" className="rounded-full gap-2" disabled={savingProfile}>
            {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {savingProfile ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </div>

      {/* Password Form */}
      <div className="rounded-3xl border border-border bg-card shadow-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] text-white shadow-glow">
            <Lock className="h-5 w-5" />
          </div>
          <h3 className="font-extrabold text-primary text-lg">Change Password</h3>
        </div>

        <form onSubmit={(e) => void handleChangePassword(e)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="current-password">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={10}
              className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
              placeholder="Minimum 10 characters"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="confirm-password">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
              placeholder="Re-enter new password"
            />
          </div>
          <Button type="submit" variant="hero" className="rounded-full gap-2" disabled={savingPassword}>
            {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {savingPassword ? "Updating…" : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
