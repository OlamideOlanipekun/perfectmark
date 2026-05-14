import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminPins, type GeneratePinsBody, type ListPinsParams } from "@/lib/pins";
import type { GeneratePinsResponse } from "@/types";

export function useAdminPins(params: ListPinsParams = {}) {
  return useQuery({
    queryKey: ["admin", "pins", params],
    queryFn: () => adminPins.list(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useGeneratePins() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GeneratePinsBody) => adminPins.generate(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "pins"] });
    },
  });
}

export function useRevokePin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminPins.revoke(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "pins"] });
    },
  });
}

export type GeneratedPins = GeneratePinsResponse["pins"];
