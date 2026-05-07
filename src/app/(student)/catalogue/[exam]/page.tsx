import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { STREAMS, STREAM_DESCRIPTIONS, normaliseExam } from "@/lib/streams";

export default function ExamPage({ params }: { params: { exam: string } }) {
  const examType = normaliseExam(params.exam);
  if (!examType) notFound();

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/catalogue" className="hover:text-primary transition-smooth">
          Catalogue
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary font-semibold">{examType}</span>
      </nav>

      <PageHeader
        title={examType}
        description="Choose your class stream to see available subjects."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {STREAMS.map((stream) => (
          <Link key={stream} href={`/catalogue/${params.exam}/${stream.toLowerCase()}`} className="group">
            <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-primary">{stream}</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{STREAM_DESCRIPTIONS[stream]}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
