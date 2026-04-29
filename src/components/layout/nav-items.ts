"use client";

import {
  BarChart3,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Tag,
  UserCircle,
  Users,
  Video,
} from "lucide-react";

export interface MobileNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Nav-item arrays live in a "use client" module so the lucide-react icon
 * components (which are forwardRef functions) are never serialized across
 * the server→client boundary. Passing them as props from a server-component
 * layout would crash Next.js at static-page-generation time:
 *
 *   "Functions cannot be passed directly to Client Components"
 *
 * Client components import these arrays directly via NAV_ITEMS[variant], so
 * the icons stay on the client where they belong.
 */
export const NAV_ITEMS: Record<"student" | "admin", MobileNavItem[]> = {
  student: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/catalogue", label: "Catalogue", icon: BookOpen },
    { href: "/subscriptions", label: "Plans", icon: CreditCard },
    { href: "/profile", label: "Profile", icon: UserCircle },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/videos", label: "Lessons", icon: Video },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/pricing", label: "Pricing", icon: Tag },
    { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  ],
};

export type NavVariant = "student" | "admin";
