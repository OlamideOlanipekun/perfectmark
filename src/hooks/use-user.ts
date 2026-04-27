"use client";

import { useAuth } from "@/context/auth-context";

export function useUser() {
  const { user, isLoading } = useAuth();
  return { user, isLoading };
}
