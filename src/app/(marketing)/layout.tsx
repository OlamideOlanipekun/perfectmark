import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="animate-fade-in">{children}</main>
      <MarketingFooter />
      <WhatsAppButton />
    </div>
  );
}
