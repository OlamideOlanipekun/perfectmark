"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface AdminUser {
  id: string;
  name: string;
  role: string;
  classLevel: string | null;
  stream: string | null;
  createdAt: string;
}

interface UsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const users = useQuery<UsersResponse>({
    queryKey: ["admin", "users", page, search],
    queryFn: () => {
      const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) qs.set("search", search);
      return api.get<UsersResponse>(`/admin/users?${qs.toString()}`);
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const totalPages = users.data ? Math.ceil(users.data.total / limit) : 1;

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <>
      <PageHeader title="Users" description="Manage registered students." />

      {users.data && (
        <p className="mb-5 text-sm text-muted-foreground">
          {users.data.total.toLocaleString()} total user{users.data.total !== 1 ? "s" : ""}
        </p>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-2xl border border-border bg-card pl-11 pr-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth shadow-card"
        />
      </div>

      <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/40 hover:bg-secondary/40">
              <TableHead className="font-bold text-primary">Name</TableHead>
              <TableHead className="font-bold text-primary">Class</TableHead>
              <TableHead className="font-bold text-primary">Stream</TableHead>
              <TableHead className="font-bold text-primary">Role</TableHead>
              <TableHead className="font-bold text-primary">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.isLoading && Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((__, j) => (
                  <TableCell key={j}><div className="h-4 rounded bg-secondary animate-pulse" /></TableCell>
                ))}
              </TableRow>
            ))}

            {!users.isLoading && (users.data?.users ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                  <div className="text-4xl mb-3">👥</div>
                  <p className="font-semibold text-primary">{search ? "No users match your search" : "No users yet"}</p>
                </TableCell>
              </TableRow>
            )}

            {!users.isLoading && (users.data?.users ?? []).map((user) => (
              <TableRow key={user.id} className="hover:bg-secondary/20 transition-smooth">
                <TableCell className="font-semibold text-primary">{user.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.classLevel ?? <span className="text-muted-foreground/40">—</span>}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.stream ?? <span className="text-muted-foreground/40">—</span>}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {new Date(user.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || users.isFetching}
            className="rounded-full px-4 py-2 text-sm font-semibold border border-border text-primary hover:bg-secondary disabled:opacity-40 transition-smooth"
          >
            ← Prev
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || users.isFetching}
            className="rounded-full px-4 py-2 text-sm font-semibold border border-border text-primary hover:bg-secondary disabled:opacity-40 transition-smooth"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
