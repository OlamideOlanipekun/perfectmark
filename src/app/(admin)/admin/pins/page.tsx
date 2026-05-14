"use client";

import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  KeyRound,
  Loader2,
  ShieldOff,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminPins, useGeneratePins, useRevokePin } from "@/hooks/use-pins";
import { exportPinsCsv } from "@/lib/pins";
import type { Pin, PinStatus } from "@/types";

const STATUS_TABS: { label: string; value: PinStatus | "" }[] = [
  { label: "All",     value: "" },
  { label: "Unused",  value: "unused" },
  { label: "Used",    value: "used" },
  { label: "Revoked", value: "revoked" },
];

const STATUS_BADGE: Record<PinStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  unused:  { label: "Unused",  variant: "default" },
  used:    { label: "Used",    variant: "secondary" },
  revoked: { label: "Revoked", variant: "destructive" },
};

export default function AdminPinsPage() {
  // ── Generate panel state ──────────────────────────────────────────────
  const [quantity, setQuantity] = useState(10);
  const [batchLabel, setBatchLabel] = useState("");
  const [lastGenerated, setLastGenerated] = useState<Pin[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ── Table filters ─────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<PinStatus | "">("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 50;

  // ── Revoke confirm ────────────────────────────────────────────────────
  const [revokeTarget, setRevokeTarget] = useState<Pin | null>(null);

  const pins = useAdminPins({ page, limit: LIMIT, status: statusFilter, search });
  const generate = useGeneratePins();
  const revoke = useRevokePin();

  const totalPages = pins.data ? Math.ceil(pins.data.total / LIMIT) : 1;

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (quantity < 1 || quantity > 500) return;
    try {
      const res = await generate.mutateAsync({ quantity, batchLabel: batchLabel.trim() || undefined });
      setLastGenerated(res.pins);
      setBatchLabel("");
      toast.success(`${res.count} PIN${res.count !== 1 ? "s" : ""} generated`);
    } catch {
      toast.error("Failed to generate PINs. Please try again.");
    }
  };

  const copyPin = (pin: Pin) => {
    navigator.clipboard.writeText(pin.displayCode).then(() => {
      setCopiedId(pin.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const copyAll = () => {
    const text = lastGenerated.map((p) => p.displayCode).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      toast.success("All PINs copied to clipboard");
    });
  };

  const handleRevoke = async (pin: Pin) => {
    try {
      await revoke.mutateAsync(pin.id);
      toast.success(`PIN ${pin.displayCode} revoked`);
      setRevokeTarget(null);
    } catch {
      toast.error("Failed to revoke PIN.");
    }
  };

  return (
    <>
      <PageHeader
        title="PIN Codes"
        description="Generate and manage student access PINs."
      />

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* ── Generate Panel ─────────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="rounded-3xl border border-border bg-card shadow-card p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                <KeyRound className="h-5 w-5" />
              </div>
              <h2 className="font-extrabold text-primary text-lg">Generate PINs</h2>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">
                How many PINs?
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(500, Math.max(1, Number(e.target.value))))}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-primary font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">Max 500 per batch</p>
            </div>

            {/* Batch label */}
            <div>
              <label className="text-xs font-bold text-primary uppercase tracking-wider block mb-1.5">
                Batch label <span className="font-normal text-muted-foreground normal-case">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. SS1 — May 2026 batch"
                maxLength={80}
                value={batchLabel}
                onChange={(e) => setBatchLabel(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
              />
            </div>

            <Button
              variant="hero"
              className="w-full rounded-full"
              onClick={handleGenerate}
              disabled={generate.isPending || quantity < 1 || quantity > 500}
            >
              {generate.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Generating…</>
              ) : (
                <><KeyRound className="h-4 w-4 mr-2" />Generate {quantity} PIN{quantity !== 1 ? "s" : ""}</>
              )}
            </Button>
          </div>

          {/* ── Last Generated Results ─────────────────────────────── */}
          {lastGenerated.length > 0 && (
            <div className="rounded-3xl border border-border bg-card shadow-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-primary">
                  {lastGenerated.length} PIN{lastGenerated.length !== 1 ? "s" : ""} ready
                </h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="softOutline" className="rounded-full text-xs gap-1.5" onClick={copyAll}>
                    <Copy className="h-3.5 w-3.5" />
                    Copy all
                  </Button>
                  <Button
                    size="sm"
                    variant="softOutline"
                    className="rounded-full text-xs gap-1.5"
                    onClick={() => exportPinsCsv(lastGenerated)}
                  >
                    <Download className="h-3.5 w-3.5" />
                    CSV
                  </Button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                {lastGenerated.map((pin) => (
                  <div
                    key={pin.id}
                    className="flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-2.5"
                  >
                    <span className="font-mono font-bold text-primary tracking-widest text-sm">
                      {pin.displayCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyPin(pin)}
                      className="text-muted-foreground hover:text-primary transition-smooth p-1"
                      aria-label="Copy PIN"
                    >
                      {copiedId === pin.id ? (
                        <Check className="h-4 w-4 text-accent" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── PIN Table ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Summary stats */}
          {pins.data && (
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-muted-foreground">
              <span>{pins.data.total.toLocaleString()} total</span>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status tabs */}
            <div className="flex rounded-2xl border border-border bg-card overflow-hidden shadow-card">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => { setStatusFilter(tab.value); setPage(1); }}
                  className={`px-4 py-2 text-xs font-bold transition-smooth ${
                    statusFilter === tab.value
                      ? "bg-gradient-primary text-white"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search by PIN…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="rounded-2xl border border-border bg-card px-4 py-2 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-smooth shadow-card min-w-48"
            />
          </div>

          {/* Table */}
          <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                  <TableHead className="font-bold text-primary">PIN Code</TableHead>
                  <TableHead className="font-bold text-primary">Status</TableHead>
                  <TableHead className="font-bold text-primary">Batch Label</TableHead>
                  <TableHead className="font-bold text-primary">Created</TableHead>
                  <TableHead className="font-bold text-primary">Used By</TableHead>
                  <TableHead className="font-bold text-primary">Used At</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pins.isLoading &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j}>
                          <div className="h-4 rounded bg-secondary animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                {!pins.isLoading && (pins.data?.pins ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                      <div className="text-4xl mb-3">🔑</div>
                      <p className="font-semibold text-primary">
                        {search || statusFilter ? "No PINs match your filters" : "No PINs generated yet"}
                      </p>
                      {!search && !statusFilter && (
                        <p className="text-sm mt-1">Use the panel on the left to generate your first batch.</p>
                      )}
                    </TableCell>
                  </TableRow>
                )}

                {!pins.isLoading &&
                  (pins.data?.pins ?? []).map((pin) => {
                    const badge = STATUS_BADGE[pin.status];
                    return (
                      <TableRow key={pin.id} className="hover:bg-secondary/20 transition-smooth">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-primary tracking-widest">
                              {pin.displayCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyPin(pin)}
                              className="text-muted-foreground hover:text-primary transition-smooth"
                              aria-label="Copy PIN"
                            >
                              {copiedId === pin.id ? (
                                <Check className="h-3.5 w-3.5 text-accent" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={badge.variant} className="text-[10px]">
                            {badge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {pin.batchLabel ?? <span className="text-muted-foreground/40">—</span>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(pin.createdAt).toLocaleDateString("en-NG", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {pin.usedBy ? (
                            <div className="font-semibold text-primary text-xs">{pin.usedBy.name}</div>
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {pin.usedAt ? (
                            new Date(pin.usedAt).toLocaleDateString("en-NG", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          ) : (
                            <span className="text-muted-foreground/40">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {pin.status === "unused" && (
                            revokeTarget?.id === pin.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleRevoke(pin)}
                                  disabled={revoke.isPending}
                                  className="text-xs font-bold text-destructive hover:underline disabled:opacity-50"
                                >
                                  {revoke.isPending ? "Revoking…" : "Confirm"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRevokeTarget(null)}
                                  className="text-xs text-muted-foreground hover:text-primary"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setRevokeTarget(pin)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-smooth"
                              >
                                <ShieldOff className="h-3.5 w-3.5" />
                                Revoke
                              </button>
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || pins.isFetching}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold border border-border text-primary hover:bg-secondary disabled:opacity-40 transition-smooth"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || pins.isFetching}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold border border-border text-primary hover:bg-secondary disabled:opacity-40 transition-smooth"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
              {pins.isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
          )}
        </div>
      </div>

    </>
  );
}
