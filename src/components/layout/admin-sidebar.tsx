"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, LayoutDashboard, LogOut, Tag, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin/dashboard", label: "Overview",  icon: LayoutDashboard },
  { href: "/admin/videos",    label: "Lessons",   icon: Video },
  { href: "/admin/users",     label: "Users",     icon: Users },
  { href: "/admin/pricing",   label: "Pricing",   icon: Tag },
  { href: "/admin/reports",   label: "Reports",   icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 lg:flex lg:flex-col bg-gradient-soft border-r border-border">
      {/* Header */}
      <div className="flex h-20 items-center gap-3 px-5 border-b border-border bg-gradient-primary">
        <div className="relative shrink-0">
          <Image
            src="/logo.jpg"
            alt="Perfect Mark logo"
            width={36}
            height={36}
            className="h-9 w-9 object-contain rounded-full ring-2 ring-white/25"
          />
          {/* Online indicator */}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-primary bg-accent" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold text-white tracking-tight">
            Perfect<span className="text-accent">Mark</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.18em] text-white/60 font-semibold">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        {/* Section label */}
        <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 select-none">
          Navigation
        </p>

        <div className="space-y-1">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-smooth overflow-hidden",
                  active
                    ? "bg-gradient-primary text-white shadow-card"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary",
                )}
              >
                {/* Left accent bar */}
                <span
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full transition-smooth",
                    active ? "bg-accent opacity-100" : "opacity-0",
                  )}
                />
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-smooth",
                    active ? "text-white" : "text-muted-foreground",
                  )}
                />
                <span>{label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent/80 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {/* Section label */}
        <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 select-none">
          Account
        </p>

        {user && (
          <div className="mb-3 rounded-2xl bg-secondary/60 border border-primary/5 p-3">
            <div className="flex items-center gap-2.5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-white font-bold text-sm shadow-card ring-2 ring-primary/10">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-secondary bg-accent" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-primary leading-tight">
                  {user.name}
                </div>
                <div className="truncate text-[10px] text-muted-foreground mt-0.5">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth group"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-smooth" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
