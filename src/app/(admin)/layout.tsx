import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* variant="admin" is a string — safe to cross the server→client boundary. */}
        <MobileTopBar variant="admin" />
        <main className="flex-1 overflow-auto">
          {/* Admin gets only the top-bar drawer (5 items would crowd a bottom nav) */}
          <div className="container py-6 lg:py-8 max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
