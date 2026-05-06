import Link from "next/link";
import { Mail, MapPin, Phone, MessageSquare, Clock, Send, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get Support for Your Academic Journey",
  description:
    "Have questions about our WAEC, NECO or JAMB tutorials? Reach out to the Perfect Mark Tutors College support team. We're here to help you succeed.",
  keywords: ["contact Perfect Mark", "student support Nigeria", "educational help", "exam preparation support"],
};

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "support@perfectmarktutorschoolproject.com",
    href: "mailto:support@perfectmarktutorschoolproject.com",
    color: "from-[#1a3a8f] to-[#2563eb]",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 916 206 2050",
    href: "tel:+2349162062050",
    color: "from-[#065f46] to-[#10b981]",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "Nigeria, West Africa",
    href: null,
    color: "from-[#7c3aed] to-[#a78bfa]",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon – Sat, 8am – 6pm WAT",
    href: null,
    color: "from-[#92400e] to-[#d97706]",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-soft pt-28 pb-12 md:pt-36 md:pb-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 90% 60%, hsl(43 53% 59% / 0.07), transparent 50%)",
          }}
        />
        <div className="container relative text-center max-w-2xl mx-auto px-[5%]">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary border border-primary/10 px-4 py-1.5 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-primary mb-4 md:mb-6">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-6xl font-extrabold leading-tight tracking-tight text-primary">
            We&apos;re here to{" "}
            <span className="text-gradient">help you</span>
          </h1>
          <p className="mt-4 md:mt-5 text-sm md:text-lg text-muted-foreground leading-relaxed">
            Have a question about our tutorials, subscriptions, or need technical support?
            Reach out and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="bg-gradient-soft pb-20 pt-4">
        <div className="container grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 md:gap-12 items-start px-[5%]">
          
          {/* Mobile Order: Info first, then Form */}
          <div className="order-2 lg:order-1 space-y-8 md:space-y-12">
            <div className="rounded-[24px] md:rounded-3xl border border-border bg-card shadow-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="grid h-10 w-10 md:h-11 md:w-11 place-items-center rounded-xl md:rounded-2xl bg-gradient-primary text-white shadow-glow">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-primary text-lg md:text-xl leading-tight">Send us a message</h2>
                  <p className="text-[11px] md:text-sm text-muted-foreground">We reply within 24 hours</p>
                </div>
              </div>

              <form className="space-y-5" action="mailto:support@perfectmarktutorschoolproject.com" method="get" encType="text/plain">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-primary/60 ml-1" htmlFor="contact-name">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className="w-full rounded-xl md:rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-primary/60 ml-1" htmlFor="contact-email">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl md:rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-primary/60 ml-1" htmlFor="contact-subject">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    className="w-full rounded-xl md:rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth appearance-none cursor-pointer"
                  >
                    <option value="">Select a topic…</option>
                    <option value="subscription">Subscription / Billing</option>
                    <option value="technical">Technical Support</option>
                    <option value="content">Content / Lessons</option>
                    <option value="account">Account Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-primary/60 ml-1" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="body"
                    required
                    rows={5}
                    placeholder="Tell us how we can help you…"
                    className="w-full rounded-xl md:rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth resize-none"
                  />
                </div>

                <Button type="submit" size="xl" className="rounded-xl w-full gap-2 font-extrabold shadow-elegant" style={{ background: "linear-gradient(135deg,#cead60,#b8962a)", color: "white" }}>
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Link to FAQ page (single source of truth) */}
            <div className="rounded-[24px] md:rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow shrink-0">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-extrabold text-primary mb-1">
                  Looking for answers?
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse our full FAQ — covers access, devices, billing and lesson content.
                </p>
              </div>
              <Button asChild variant="softOutline" className="rounded-full shrink-0">
                <Link href="/faq" className="inline-flex items-center gap-2">
                  Read FAQ <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Contact Info (order-1 on mobile) */}
          <aside className="lg:sticky lg:top-28 space-y-6 order-1 lg:order-2">
            <div className="rounded-[24px] md:rounded-3xl bg-gradient-primary text-white p-7 md:p-8 shadow-elegant relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 50%)" }} />
              <h2 className="font-extrabold text-lg md:text-xl mb-2 relative z-10">Contact Information</h2>
              <p className="text-white/70 text-xs md:text-sm mb-8 relative z-10 leading-relaxed">
                Reach us through any of the channels below. We&apos;re here to help.
              </p>
              <div className="space-y-6 relative z-10">
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${item.color} text-white shrink-0 shadow-lg`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-0.5">
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} className="text-sm md:text-base text-white font-bold hover:text-accent transition-smooth">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm md:text-base text-white font-bold">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] md:rounded-3xl border border-border bg-card shadow-card p-6">
              <h3 className="font-bold text-primary text-sm md:text-base mb-4 ml-1">Quick Links</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {[
                  { label: "Courses", href: "/courses" },
                  { label: "Pricing", href: "/subscriptions" },
                  { label: "About Us", href: "/about" },
                  { label: "FAQ", href: "/faq" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl px-4 py-3 bg-secondary/40 text-[13px] font-bold text-primary hover:bg-gradient-primary hover:text-white transition-smooth"
                  >
                    {link.label}
                    <span className="opacity-50">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
