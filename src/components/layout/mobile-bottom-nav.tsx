"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { MobileNavItem } from "./mobile-top-bar";

interface MobileBottomNavProps {
  items: MobileNavItem[];
}

/**
 * Mobile-only bottom navigation, fixed at the viewport bottom. Hidden at
 * `lg` and above where the desktop sidebar provides navigation.
 *
 * Tap targets are 56px tall (above the 44px iOS minimum). The active item
 * is highlighted with a navy pill so the current section is unambiguous on
 * a small screen.
 *
 * Pages that use the student/admin layout get extra bottom padding from the
 * layout wrapper so content isn't obscured by this bar.
 */
export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 flex items-stretch border-t border-border bg-background/95 backdrop-blur lg:hidden"
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
              active ? "text-primary" : "text-muted-foreground active:text-primary",
            )}
            aria-current={active ? "page" : undefined}
          >
            <span
              className={cn(
                "grid h-9 w-12 place-items-center rounded-xl transition-smooth",
                active ? "bg-secondary" : "",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
