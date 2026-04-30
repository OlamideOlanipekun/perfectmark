"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CreditCard, LayoutDashboard, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    return (
      <aside className="hidden w-72 shrink-0 lg:flex lg:flex-col bg-background border-r border-border" />
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "relative hidden shrink-0 lg:flex lg:flex-col bg-background border-r border-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-72",
        )}
      >
        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-4 top-24 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-border shadow-card hover:bg-secondary hover:border-primary/20 transition-smooth text-muted-foreground hover:text-primary"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Header — Brand Navy */}
        <div
          className={cn(
            "flex h-24 items-center gap-4 px-6 bg-gradient-primary shadow-elegant select-none transition-all duration-300",
            isCollapsed && "justify-center px-0",
          )}
        >
          <div className="relative shrink-0">
            <Image
              src="/logo.jpg"
              alt="Perfect Mark logo"
              width={48}
              height={48}
              className={cn(
                "object-contain rounded-xl bg-white p-1 ring-2 ring-white/20 transition-all duration-300",
                isCollapsed ? "h-10 w-10" : "h-12 w-12",
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

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-8">
          {!isCollapsed && (
            <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 select-none animate-fade-in">
              Navigation
            </p>
          )}

          <nav className="space-y-1.5">
            {ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);

              const navLink = (
                <Link
                  href={href}
                  className={cn(
                    "relative group flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition-smooth overflow-hidden",
                    active
                      ? "text-white"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-primary",
                    isCollapsed ? "justify-center px-0" : "gap-3.5",
                  )}
                >
                  {active && (
                    <span className="absolute inset-0 bg-gradient-primary shadow-card animate-scale-in" />
                  )}
                  {/* Left accent bar (only expanded) */}
                  {!isCollapsed && (
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full transition-smooth",
                        active ? "bg-accent opacity-100" : "opacity-0",
                      )}
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 h-[18px] w-[18px] shrink-0 transition-transform duration-300",
                      active ? "text-white" : "group-hover:text-primary group-hover:scale-110",
                    )}
                  />
                  {!isCollapsed && (
                    <span className="relative z-10 animate-fade-in">{label}</span>
                  )}
                  {active && !isCollapsed && (
                    <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  )}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={href}>
                    <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={12} className="font-semibold text-sm">
                      {label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={href}>{navLink}</div>;
            })}
          </nav>
        </div>

        {/* User Session Footer */}
        <div
          className={cn(
            "p-4 mt-auto border-t border-border transition-all duration-300",
            isCollapsed && "px-2",
          )}
        >
          <div
            className={cn(
              "rounded-2xl bg-secondary/40 border border-primary/5 p-4 mb-3 transition-all duration-300",
              isCollapsed && "p-2",
            )}
          >
            {user ? (
              <div
                className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "gap-3",
                )}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "relative shrink-0 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-card ring-2 ring-primary/10 cursor-default select-none transition-all duration-300",
                        isCollapsed ? "h-9 w-9" : "h-10 w-10",
                      )}
                    >
                      {user.name.charAt(0)}
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-secondary bg-accent" />
                    </div>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" sideOffset={12}>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role ?? "Scholar"}</p>
                    </TooltipContent>
                  )}
                </Tooltip>

                {!isCollapsed && (
                  <div className="flex-1 overflow-hidden animate-fade-in">
                    <div className="font-bold text-primary text-sm truncate">{user.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">
                      {user.role ?? "Scholar"}
                    </div>
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
              isCollapsed ? "justify-center px-0" : "justify-start px-4",
            )}
            onClick={logout}
            title={isCollapsed ? "Sign out" : ""}
          >
            <LogOut
              className={cn(
                "h-4 w-4 group-hover:scale-110 transition-smooth",
                !isCollapsed && "mr-3",
              )}
            />
            {!isCollapsed && (
              <span className="font-semibold text-sm animate-fade-in">Sign out</span>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
