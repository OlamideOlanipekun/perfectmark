"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavVariant } from "./nav-items";

interface MobileBottomNavProps {
  /** String discriminator so server-component layouts can pass it. */
  variant: NavVariant;
}

/**
 * Mobile-only bottom navigation, fixed at the viewport bottom. Hidden at
 * `lg` and above where the desktop sidebar provides navigation.
 */
export function MobileBottomNav({ variant }: MobileBottomNavProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS[variant];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 flex items-stretch border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-smooth min-h-[56px]",
              active ? "text-primary" : "text-muted-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            {/* Icon pill */}
            <span
              className={cn(
                "grid h-9 w-12 place-items-center rounded-xl transition-smooth",
                active
                  ? "bg-gradient-primary shadow-card"
                  : "hover:bg-secondary/60",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  active ? "text-white scale-110" : "text-muted-foreground",
                )}
              />
            </span>
            <span className={cn(active ? "text-primary font-bold" : "")}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
