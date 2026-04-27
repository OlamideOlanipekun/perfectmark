import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth";
import type { ApiErrorBody, AuthResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

if (!BASE_URL && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.warn(
    "[api] NEXT_PUBLIC_API_URL is not set — requests will go to the current origin",
  );
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;
  public readonly requestId?: string;

  constructor(opts: {
    status: number;
    code: string;
    message: string;
    details?: Record<string, unknown>;
    requestId?: string;
  }) {
    super(opts.message);
    this.name = "ApiError";
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details;
    this.requestId = opts.requestId;
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  /** Skip the refresh-on-401 dance. Used by /auth/refresh itself to avoid loops. */
  skipAuthRefresh?: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
// Single-flight refresh
// ────────────────────────────────────────────────────────────────────────────
//
// When an access token expires, multiple in-flight requests will all get 401.
// Without coordination, each would independently call /auth/refresh, burning
// refresh-token rotations (each refresh rotates the token, so concurrent
// refreshes trigger our server-side REUSE DETECTION and kill the session).
//
// So: at most one /auth/refresh in flight at a time; everyone else awaits it.

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Listener called when refresh fails and the user has been logged out.
 * AuthProvider subscribes so it can update context + redirect.
 */
let onAuthExpired: (() => void) | null = null;

export function setAuthExpiredHandler(handler: (() => void) | null): void {
  onAuthExpired = handler;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await request<AuthResponse>(
      "POST",
      "/auth/refresh",
      { refreshToken },
      { skipAuthRefresh: true },
    );
    setTokens({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      accessTokenExpiresIn: res.accessTokenExpiresIn,
    });
    return true;
  } catch {
    clearTokens();
    onAuthExpired?.();
    return false;
  }
}

function refreshOnce(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = tryRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

// ────────────────────────────────────────────────────────────────────────────
// Core request
// ────────────────────────────────────────────────────────────────────────────

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  opts: RequestOptions = {},
): Promise<T> {
  const res = await executeFetch(method, path, body, opts);

  if (res.status === 401 && !opts.skipAuthRefresh) {
    const refreshed = await refreshOnce();
    if (refreshed) {
      const retry = await executeFetch(method, path, body, opts);
      return toResult<T>(retry);
    }
    // Fall through to throw 401
  }

  return toResult<T>(res);
}

async function executeFetch(
  method: Method,
  path: string,
  body: unknown,
  opts: RequestOptions,
): Promise<Response> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers ?? {}),
  };
  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    signal: opts.signal,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  });
}

async function toResult<T>(res: Response): Promise<T> {
  if (res.ok) {
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    payload = await res.text().catch(() => null);
  }

  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    (payload as ApiErrorBody).error
  ) {
    const { error } = payload as ApiErrorBody;
    throw new ApiError({
      status: res.status,
      code: error.code,
      message: error.message,
      details: error.details,
      requestId: error.requestId,
    });
  }

  throw new ApiError({
    status: res.status,
    code: "HTTP_ERROR",
    message: typeof payload === "string" && payload ? payload : res.statusText,
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Public surface
// ────────────────────────────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>("GET", path, undefined, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("POST", path, body, opts),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("PUT", path, body, opts),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>("PATCH", path, body, opts),
  del: <T>(path: string, opts?: RequestOptions) =>
    request<T>("DELETE", path, undefined, opts),
};
