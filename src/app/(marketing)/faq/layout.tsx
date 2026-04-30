import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Perfect Mark Support",
  description: "Find answers to common questions about Perfect Mark Tutors College, our subscription plans, exam coverage (WAEC, JAMB, NECO), and how to start learning.",
  keywords: ["online school FAQ", "JAMB help", "WAEC study tips", "Perfect Mark pricing", "how to use Perfect Mark"],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
