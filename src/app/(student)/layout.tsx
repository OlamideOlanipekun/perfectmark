import { BookOpen, CreditCard, LayoutDashboard } from "lucide-react";
import { StudentSidebar } from "@/components/layout/student-sidebar";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

const STUDENT_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/catalogue", label: "Catalogue", icon: BookOpen },
  { href: "/subscriptions", label: "Plans", icon: CreditCard },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileTopBar items={STUDENT_NAV_ITEMS} caption="Student Portal" />
        <main className="flex-1 overflow-auto">
          {/* pb-24 reserves space on mobile so the fixed bottom nav doesn't cover content */}
          <div className="container py-6 lg:py-8 pb-24 lg:pb-8 max-w-6xl">
            {children}
          </div>
        </main>
        <MobileBottomNav items={STUDENT_NAV_ITEMS} />
      </div>
    </div>
  );
}
