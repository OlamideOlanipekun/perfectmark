import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using Perfect Mark Tutors College services.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-24 pt-32">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-primary mb-8">Terms & Conditions</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <p className="text-lg leading-relaxed">
            By accessing or using Perfect Mark Tutors College, you agree to be bound by these Terms and Conditions.
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">1. Use of Services</h2>
            <p>
              Our services are intended for students preparing for WAEC, NECO, JAMB, and JSS exams. You agree to use the platform for educational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">3. Intellectual Property</h2>
            <p>
              All content on the platform, including video lessons and study materials, is the property of Perfect Mark Tutors College and is protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">4. Limitation of Liability</h2>
            <p>
              Perfect Mark Tutors College shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the services.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
