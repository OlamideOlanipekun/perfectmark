import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";

export default function AdminVideosPage() {
  return (
    <>
      <PageHeader
        title="Lessons"
        description="Upload new lessons and manage the catalogue."
        action={
          <Button asChild variant="hero" className="rounded-full">
            <Link href="/admin/videos/upload">
              <Plus className="mr-1 h-4 w-4" />
              Upload lesson
            </Link>
          </Button>
        }
      />

      <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/40 hover:bg-secondary/40">
              <TableHead className="font-bold text-primary">Title</TableHead>
              <TableHead className="font-bold text-primary">Subject</TableHead>
              <TableHead className="font-bold text-primary">Status</TableHead>
              <TableHead className="font-bold text-primary">Uploaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="text-center py-16 text-muted-foreground">
                <div className="text-4xl mb-3">🎬</div>
                <p className="font-semibold text-primary">No lessons yet</p>
                <p className="text-sm mt-1">Upload your first lesson to get started.</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
