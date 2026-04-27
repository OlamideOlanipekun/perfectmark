"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CreditCard, LayoutDashboard, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
  { href: "/catalogue",     label: "Catalogue",    icon: BookOpen },
  { href: "/subscriptions", label: "Subscription", icon: CreditCard },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setIsCollapsed(JSON.parse(saved));
    setIsMounted(true);
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  if (!isMounted) {
    return <aside className="hidden w-72 shrink-0 lg:flex lg:flex-col bg-background border-r border-border" />;
  }

  return (
    <aside 
      className={cn(
        "relative hidden shrink-0 lg:flex lg:flex-col bg-background border-r border-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-secondary transition-smooth text-muted-foreground"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Header - Brand Navy */}
      <div className={cn(
        "flex h-24 items-center gap-4 px-6 bg-gradient-primary shadow-elegant select-none transition-all duration-300",
        isCollapsed && "justify-center px-0"
      )}>
        <div className="relative shrink-0">
          <Image
            src="/logo.jpg"
            alt="Perfect Mark logo"
            width={48}
            height={48}
            className={cn(
              "object-contain rounded-xl bg-white p-1 transition-all duration-300",
              isCollapsed ? "h-10 w-10" : "h-12 w-12"
            )}
          />
          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-primary bg-accent" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col leading-tight animate-fade-in">
            <span className="text-base font-extrabold text-white tracking-tight">
              Perfect<span className="text-accent">Mark</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold">
              Student Portal
            </span>
          </div>
        )}
      </div>

      {/* Navigation Space */}
      <div className="flex-1 overflow-y-auto px-3 py-8">
        <nav className="space-y-1.5">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                title={isCollapsed ? label : ""}
                className={cn(
                  "relative group flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition-smooth overflow-hidden",
                  active
                    ? "text-white"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-primary",
                  isCollapsed ? "justify-center px-0" : "gap-3.5"
                )}
              >
                {active && (
                  <span className="absolute inset-0 bg-gradient-primary shadow-card animate-scale-in" />
                )}
                <Icon className={cn(
                  "relative z-10 h-[18px] w-[18px] shrink-0 transition-transform duration-300",
                  active ? "text-white" : "group-hover:text-primary group-hover:scale-110",
                  isCollapsed ? "m-0" : ""
                )} />
                {!isCollapsed && (
                  <span className="relative z-10 animate-fade-in">{label}</span>
                )}
                {active && !isCollapsed && (
                   <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer */}
      <div className={cn("p-4 mt-auto transition-all duration-300", isCollapsed && "px-2")}>
        <div className={cn(
          "rounded-2xl bg-secondary/40 border border-primary/5 p-4 mb-3 transition-all duration-300",
          isCollapsed && "p-2"
        )}>
          {user ? (
            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
              <div className={cn(
                "shrink-0 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-card transition-all duration-300",
                isCollapsed ? "h-9 w-9" : "h-10 w-10"
              )}>
                {user.name.charAt(0)}
              </div>
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden animate-fade-in">
                  <div className="font-bold text-primary text-sm truncate">{user.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">{user.role || 'Scholar'}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-10 animate-pulse bg-primary/5 rounded-xl" />
          )}
        </div>

        <Button
          variant="ghost"
          className={cn(
            "w-full rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth group",
            isCollapsed ? "justify-center px-0" : "justify-start px-4"
          )}
          onClick={logout}
          title={isCollapsed ? "Sign out" : ""}
        >
          <LogOut className={cn(
            "h-4 w-4 group-hover:scale-110 transition-smooth text-muted-foreground/60",
            !isCollapsed && "mr-3"
          )} />
          {!isCollapsed && <span className="font-semibold text-sm animate-fade-in">Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}
