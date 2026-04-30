import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund policy for Perfect Mark Tutors College subscriptions.",
};

export default function RefundPage() {
  return (
    <div className="container max-w-4xl py-24 pt-32">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-primary mb-8">Refund Policy</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <p className="text-lg leading-relaxed">
            We want you to be completely satisfied with your learning experience. This policy outlines our refund conditions.
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">1. Subscription Refunds</h2>
            <p>
              We offer a 7-day money-back guarantee for new subscriptions. If you are not satisfied with our services, you can request a full refund within 7 days of your initial purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">2. Non-Refundable Items</h2>
            <p>
              Refunds are not available for subscriptions that have been active for more than 7 days or where significant content has already been consumed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">3. Process</h2>
            <p>
              To request a refund, please email our support team at support@perfectmarktutors.com with your account details and reason for the request.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
