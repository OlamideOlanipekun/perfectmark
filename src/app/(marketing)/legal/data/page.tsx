import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Policy",
  description: "How Perfect Mark Tutors College manages and protects your educational data.",
};

export default function DataPolicyPage() {
  return (
    <div className="container max-w-4xl py-24 pt-32">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-primary mb-8">Data Policy</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <p className="text-lg leading-relaxed">
            Our Data Policy ensures that your educational progress and personal data are managed with the highest standards of integrity.
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">1. Data Storage</h2>
            <p>
              Your course progress, quiz results, and profile information are stored securely on our encrypted cloud servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">2. Data Usage</h2>
            <p>
              We use educational data to personalize your learning path and provide insights into your academic performance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">3. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data at any time through your account settings or by contacting support.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
