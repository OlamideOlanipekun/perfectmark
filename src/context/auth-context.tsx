"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, ApiError, setAuthExpiredHandler } from "@/lib/api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setRoleHint,
  setTokens,
} from "@/lib/auth";
import { clearDeviceId } from "@/lib/media";
import type { AuthResponse, Stream, User } from "@/types";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  classLevel?: string;
  stream?: Stream;
  consentMarketing?: boolean;
  // Must be true at the call site — the form's Zod schema enforces this.
  consentTos: boolean;
  pin: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hydrated = useRef(false);

  const applyAuthResponse = useCallback((res: AuthResponse) => {
    setTokens({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      accessTokenExpiresIn: res.accessTokenExpiresIn,
    });
    setRoleHint(res.user.role);
    setUser(res.user);
  }, []);

  const refreshUser = useCallback(async () => {
    const at = getAccessToken();
    const rt = getRefreshToken();

    if (!at && !rt) {
      setUser(null);
      setIsLoading(false);
      return;
    }


    try {
      const me = await api.get<User>("/auth/me");
      setUser(me);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearTokens();
        setUser(null);
      } else {
        // Network / 5xx — keep any previous user state, don't silently log out
        // eslint-disable-next-line no-console
        console.error("[auth] failed to hydrate user", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hydrate on mount
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    void refreshUser();
  }, [refreshUser]);

  // Subscribe to global auth-expired events from the api client
  useEffect(() => {
    setAuthExpiredHandler(() => {
      setUser(null);
      router.replace("/login");
    });
    return () => setAuthExpiredHandler(null);
  }, [router]);

  const login = useCallback(
    async (email: string, password: string, mfaCode?: string) => {

      const body: Record<string, string> = { email, password };
      if (mfaCode) body.mfaCode = mfaCode;
      const res = await api.post<AuthResponse>("/auth/login", body);
      applyAuthResponse(res);
      router.push(res.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    },
    [applyAuthResponse, router],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const res = await api.post<AuthResponse>("/auth/register", input);
      applyAuthResponse(res);
      router.push(res.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    },
    [applyAuthResponse, router],
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      await api.post("/auth/logout", refreshToken ? { refreshToken } : {});
    } catch {
      // Best effort — revocation will happen server-side regardless via token expiry
    }
    clearTokens();
    clearDeviceId();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
