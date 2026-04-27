import { BarChart3, LayoutDashboard, Tag, Users, Video } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";

const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/videos", label: "Lessons", icon: Video },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/pricing", label: "Pricing", icon: Tag },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileTopBar items={ADMIN_NAV_ITEMS} caption="Admin Panel" />
        <main className="flex-1 overflow-auto">
          {/* Admin gets only the top-bar drawer (5 items would crowd a bottom nav) */}
          <div className="container py-6 lg:py-8 max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
