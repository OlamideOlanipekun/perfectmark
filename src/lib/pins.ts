import { api } from "@/lib/api";
import type { GeneratePinsResponse, PinsListResponse, PinStatus } from "@/types";

export interface GeneratePinsBody {
  quantity: number;
  batchLabel?: string;
}

export interface ListPinsParams {
  page?: number;
  limit?: number;
  status?: PinStatus | "";
  search?: string;
}

export const adminPins = {
  generate: (body: GeneratePinsBody) =>
    api.post<GeneratePinsResponse>("/admin/pins/generate", body),

  list: (params: ListPinsParams = {}) => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    if (params.status) qs.set("status", params.status);
    if (params.search) qs.set("search", params.search);
    return api.get<PinsListResponse>(`/admin/pins?${qs.toString()}`);
  },

  revoke: (id: string) => api.del<void>(`/admin/pins/${id}`),
};

/** "47293816" → "4729-3816" */
export function formatPinDisplay(code: string): string {
  const digits = code.replace(/\D/g, "");
  if (digits.length !== 8) return code;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

/** Strip hyphens/spaces from user input, keep digits only */
export function normalisePinInput(input: string): string {
  return input.replace(/\D/g, "");
}

/** Client-side CSV export from a pin array */
export function exportPinsCsv(pins: GeneratePinsResponse["pins"]): void {
  const header = "PIN,Status,Batch Label,Created At,Used By,Used At";
  const rows = pins.map((p) =>
    [
      p.displayCode,
      p.status,
      p.batchLabel ?? "",
      p.createdAt,
      p.usedBy ? p.usedBy.name : "",
      p.usedAt ?? "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pins-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
