import { StudentSidebar } from "@/components/layout/student-sidebar";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <StudentSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* variant="student" is a string — safe to cross the server→client boundary.
            The actual nav items (with icon component refs) live in nav-items.ts
            and are imported by the client components themselves. */}
        <MobileTopBar variant="student" />
        <main className="flex-1 overflow-auto">
          {/* pb-24 reserves space on mobile so the fixed bottom nav doesn't cover content */}
          <div className="container py-6 lg:py-8 pb-24 lg:pb-8 max-w-6xl">
            {children}
          </div>
        </main>
        <MobileBottomNav variant="student" />
      </div>
    </div>
  );
}
