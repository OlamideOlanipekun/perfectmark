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
        <Image
          src="/logo.jpg"
          alt="Perfect Mark logo"
          width={36}
          height={36}
          className="h-9 w-9 object-contain rounded-full ring-2 ring-white/20"
        />
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
      <nav className="flex-1 space-y-1 p-4">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-smooth",
                active
                  ? "bg-gradient-primary text-white shadow-card"
                  : "text-muted-foreground hover:bg-secondary hover:text-primary",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {user && (
          <div className="mb-3 rounded-2xl bg-secondary/60 px-3 py-2.5 text-xs">
            <div className="font-semibold text-primary truncate">{user.name}</div>
            <div className="text-muted-foreground truncate">{user.email}</div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start rounded-2xl text-muted-foreground hover:text-primary hover:bg-secondary"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
