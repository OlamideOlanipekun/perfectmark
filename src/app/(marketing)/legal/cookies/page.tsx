import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie policy for Perfect Mark Tutors College.",
};

export default function CookiesPage() {
  return (
    <div className="container max-w-4xl py-24 pt-32">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-primary mb-8">Cookie Policy</h1>
        <div className="prose prose-slate max-w-none text-muted-foreground space-y-6">
          <p className="text-lg leading-relaxed">
            This Cookie Policy explains how Perfect Mark Tutors College uses cookies and similar
            technologies when you visit our platform.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help
              us remember your preferences and improve your experience on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>
                <strong>Authentication:</strong> To keep you signed in securely across sessions.
              </li>
              <li>
                <strong>Preferences:</strong> To remember your settings and personalisation choices.
              </li>
              <li>
                <strong>Security:</strong> To detect and prevent fraudulent activity.
              </li>
              <li>
                <strong>Analytics:</strong> To understand how students use the platform so we can
                improve it.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">3. Types of Cookies We Use</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Strictly necessary cookies:</strong> Required for the platform to function.
                You cannot opt out of these.
              </li>
              <li>
                <strong>Functional cookies:</strong> Enable enhanced features such as video playback
                preferences.
              </li>
              <li>
                <strong>Analytics cookies:</strong> Help us measure how students interact with
                lessons and study materials.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">4. Managing Cookies</h2>
            <p>
              You can control and delete cookies through your browser settings. Note that disabling
              cookies may affect your ability to log in and use certain features of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary mb-4">5. Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at{" "}
              <a
                href="mailto:support@perfectmarktutorschoolproject.com"
                className="text-primary underline underline-offset-2"
              >
                support@perfectmarktutorschoolproject.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
