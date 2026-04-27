import { PageHeader } from "@/components/shared/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Users" description="Registered students and their subscription status." />

      <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/40 hover:bg-secondary/40">
              <TableHead className="font-bold text-primary">Name</TableHead>
              <TableHead className="font-bold text-primary">Email</TableHead>
              <TableHead className="font-bold text-primary">Plan</TableHead>
              <TableHead className="font-bold text-primary">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} className="text-center py-16 text-muted-foreground">
                <div className="text-4xl mb-3">👥</div>
                <p className="font-semibold text-primary">No users yet</p>
                <p className="text-sm mt-1">Students will appear here once they register.</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
