import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements from reference Hero */}
      <div className="pointer-events-none fixed -left-40 top-20 h-[600px] w-[600px] rounded-full border border-primary/10 animate-float" />
      <div className="pointer-events-none fixed -left-20 top-40 h-[420px] w-[420px] rounded-full border border-primary/10 animate-float" style={{ animationDelay: "1s" }} />
      <div className="pointer-events-none fixed right-20 top-60 h-[260px] w-[260px] rounded-full border border-primary/10 animate-float" style={{ animationDelay: "2s" }} />
      
      <div
        className="pointer-events-none fixed right-0 top-0 h-[600px] w-[600px] opacity-30 bg-gradient-hero"
      />

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-4 mb-10 group">
          <div className="relative">
            <Image 
              src="/logo.jpg" 
              alt="Perfect Mark logo" 
              width={64} 
              height={64} 
              className="h-16 w-16 object-contain" 
            />
            <span className="absolute inset-0 rounded-full bg-primary-glow/30 blur-xl opacity-0 group-hover:opacity-100 transition-smooth -z-10" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-extrabold text-primary tracking-tight">
              Perfect<span className="text-accent">Mark</span>
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">
              Tutors College
            </span>
          </div>
        </Link>
        {children}
      </div>
    </div>
  );
}
