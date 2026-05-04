import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Side: Brand Panel (Visible on Desktop) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
        
        {/* Decorative Circles */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full border border-white/5 animate-pulse" />
        <div className="absolute -right-20 bottom-1/4 h-64 w-64 rounded-full border border-white/5 animate-float" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/logo.jpg" 
              alt="Perfect Mark logo" 
              width={48} 
              height={48} 
              className="h-12 w-12 object-contain rounded-xl" 
            />
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Perfect<span className="text-accent">Mark</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
                Tutors College
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Empowering the next generation of <span className="text-accent">African Scholars</span>.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Join 10,000+ students mastering WAEC, NECO, and JAMB with Nigeria&apos;s most effective video tutorials.
          </p>
        </div>

        <div className="relative z-10 text-white/40 text-sm">
          © {new Date().getFullYear()} Perfect Mark Tutors College. Built for Excellence.
        </div>
      </div>

      {/* Right Side: Form Area */}
      <div className="flex items-center justify-center p-6 md:p-12 relative">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: "radial-gradient(circle at 50% 50%, var(--primary), transparent 70%)" }} />
        
        <div className="w-full max-w-[440px] animate-fade-in">
          <div className="lg:hidden flex justify-center mb-10">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="h-10 w-10 object-contain rounded-lg" />
              <span className="font-extrabold text-primary text-xl">Perfect<span className="text-accent">Mark</span></span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
