"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export interface MobileNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileTopBarProps {
  items: MobileNavItem[];
  /** "Student Portal" / "Admin Panel" — small caption under the wordmark in the drawer header */
  caption: string;
}

/**
 * Mobile-only top bar (hidden at `lg` breakpoint and above where the desktop
 * sidebar takes over). Sticky to top, contains the hamburger menu + logo +
 * user avatar. Drawer opens from the left and shows the same nav items as
 * the desktop sidebar.
 */
export function MobileTopBar({ items, caption }: MobileTopBarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/90 backdrop-blur px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary hover:bg-secondary/70 transition-smooth"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>

        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetTitle className="sr-only">Navigation</SheetTitle>

          {/* Drawer header — matches the desktop sidebar's gradient header */}
          <div className="flex h-20 items-center gap-3 px-5 bg-gradient-primary shrink-0">
            <Image
              src="/logo.jpg"
              alt="Perfect Mark logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain rounded-xl bg-white p-1"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-extrabold text-white tracking-tight">
                Perfect<span className="text-accent">Mark</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold">
                {caption}
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-smooth overflow-hidden",
                    active
                      ? "text-white"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-primary",
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 bg-gradient-primary shadow-card" />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 h-[18px] w-[18px] shrink-0",
                      active ? "text-white" : "text-muted-foreground",
                    )}
                  />
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4 shrink-0">
            {user && (
              <div className="mb-3 flex items-center gap-3 rounded-2xl bg-secondary/40 border border-primary/5 p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-white font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-primary text-sm truncate">{user.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">
                    {user.role}
                  </div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full justify-start rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                setOpen(false);
                void logout();
              }}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-semibold text-sm">Sign out</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Center: compact wordmark */}
      <Link href={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} className="flex items-center gap-2">
        <Image
          src="/logo.jpg"
          alt="Perfect Mark"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
        <span className="text-sm font-extrabold text-primary tracking-tight">
          Perfect<span className="text-accent">Mark</span>
        </span>
      </Link>

      {/* Right: avatar (decorative, no menu — drawer handles all actions) */}
      <div
        aria-hidden
        className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-white font-bold text-sm shadow-card"
      >
        {user ? user.name.charAt(0).toUpperCase() : "·"}
      </div>
    </header>
  );
}
