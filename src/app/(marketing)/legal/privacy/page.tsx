import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Perfect Mark Tutors College handles and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-24 pt-32">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-primary mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <p className="text-lg leading-relaxed">
            At Perfect Mark Tutors College, your privacy is our priority. This policy outlines how we collect, use, and safeguard your personal information.
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, subscribe to our services, or communicate with us. This may include your name, email address, phone number, and academic level.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">2. How We Use Your Data</h2>
            <p>
              We use your data to provide, maintain, and improve our services, process transactions, and send you technical notices and support messages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">4. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@perfectmarktutorschoolproject.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
