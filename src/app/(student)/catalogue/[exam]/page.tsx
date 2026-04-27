import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import type { Stream } from "@/types";

const STREAMS: { stream: Stream; desc: string }[] = [
  { stream: "Sciences",   desc: "Physics, Chemistry, Biology, Further Maths and more." },
  { stream: "Arts",       desc: "Literature, Government, History, CRS and more." },
  { stream: "Languages",  desc: "English Language, French, Yoruba, Igbo and more." },
  { stream: "Commercial", desc: "Economics, Accounting, Commerce, Marketing and more." },
  { stream: "Trade",      desc: "Agricultural Science, Technical Drawing, Food Science." },
];

export default function ExamPage({ params }: { params: { exam: string } }) {
  const examLabel = params.exam.toUpperCase();
  return (
    <>
      <PageHeader
        title={examLabel}
        description="Choose your class stream to see available subjects."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {STREAMS.map(({ stream, desc }) => (
          <Link key={stream} href={`/catalogue/${params.exam}/${stream.toLowerCase()}`} className="group">
            <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-primary">{stream}</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
