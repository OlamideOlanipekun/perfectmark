import Link from "next/link";
import { Mail, MapPin, Phone, MessageSquare, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Perfect Mark Tutors College. We're here to help with any questions about our WAEC, NECO and JAMB tutorials.",
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
    value: "+234 800 000 0000",
    href: "tel:+2348000000000",
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

const FAQS = [
  {
    q: "How do I access my lessons after subscribing?",
    a: "After subscribing, go to your Dashboard and click 'Browse catalogue'. All lessons will be unlocked immediately.",
  },
  {
    q: "Can I watch on my phone?",
    a: "Yes! Our platform works on any device — phone, tablet, or computer.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day refund if you haven't watched more than 20% of any lesson.",
  },
  {
    q: "How are tutorials different from other platforms?",
    a: "Our tutors are experienced Nigerian teachers who align lessons precisely to WAEC, NECO and UTME syllabi.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-soft pt-36 pb-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 90% 60%, hsl(43 74% 52% / 0.07), transparent 50%)",
          }}
        />
        <div className="container relative text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary border border-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-primary">
            We&apos;re here to{" "}
            <span className="text-gradient">help you</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Have a question about our tutorials, subscriptions, or need technical support?
            Reach out and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="bg-gradient-soft py-20">
        <div className="container grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          {/* Left: Contact Form */}
          <div className="space-y-8">
            <div className="rounded-3xl border border-border bg-card shadow-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-primary text-xl">Send us a message</h2>
                  <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
                </div>
              </div>

              <form className="space-y-5" action="mailto:support@perfectmarktutorschoolproject.com" method="get" encType="text/plain">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="contact-name">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your full name"
                      className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="contact-email">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="contact-subject">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
                  >
                    <option value="">Select a topic…</option>
                    <option value="subscription">Subscription / Billing</option>
                    <option value="technical">Technical Support</option>
                    <option value="content">Content / Lessons</option>
                    <option value="account">Account Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary mb-1.5" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="body"
                    required
                    rows={5}
                    placeholder="Tell us how we can help you…"
                    className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth resize-none"
                  />
                </div>

                <Button type="submit" variant="hero" className="rounded-full w-full gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-2xl font-extrabold text-primary mb-5">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth"
                  >
                    <h3 className="font-bold text-primary mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Info */}
          <aside className="sticky top-28 space-y-5">
            <div className="rounded-3xl bg-gradient-primary text-white p-8 shadow-elegant relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white, transparent 50%)" }} />
              <h2 className="font-extrabold text-xl mb-2 relative z-10">Contact Information</h2>
              <p className="text-white/70 text-sm mb-6 relative z-10">
                Reach us through any of the channels below.
              </p>
              <div className="space-y-4 relative z-10">
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${item.color} text-white shrink-0`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-white font-semibold hover:text-accent transition-smooth">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm text-white font-semibold">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card shadow-card p-6">
              <h3 className="font-bold text-primary mb-3">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: "Browse Courses", href: "/courses" },
                  { label: "View Pricing", href: "/subscriptions" },
                  { label: "About Us", href: "/about" },
                  { label: "FAQ", href: "/faq" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 bg-secondary/40 text-sm font-semibold text-primary hover:bg-gradient-primary hover:text-white transition-smooth"
                  >
                    {link.label}
                    <span>→</span>
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
