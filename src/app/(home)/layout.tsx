import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Perfect Mark Tutors College | Nigeria's Leading Online Secondary School",
  description: "Master JSS 1-3, WAEC, NECO, and JAMB exams with premium video tutorials.",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
