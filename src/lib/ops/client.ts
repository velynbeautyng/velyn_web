import "server-only";
import { isOpsConfigured, opsConfig } from "./config";

/**
 * Thin client for the UltimatePOS Connector API (Laravel Passport OAuth2).
 * Handles password-grant token retrieval with in-memory caching and exposes a
 * typed `opsFetch` helper. All failures throw `OpsError`; callers decide
 * whether to fall back to the demo catalogue.
 */

export class OpsError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "OpsError";
  }
}

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 30_000) {
    return tokenCache.token;
  }

  const res = await fetch(`${opsConfig.baseUrl}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      grant_type: "password",
      client_id: opsConfig.clientId,
      client_secret: opsConfig.clientSecret,
      username: opsConfig.username,
      password: opsConfig.password,
      scope: "",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new OpsError(
      `ops auth failed (${res.status})`,
      res.status,
    );
  }

  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) {
    throw new OpsError("ops auth returned no access_token");
  }

  tokenCache = {
    token: data.access_token,
    expiresAt: now + (data.expires_in ?? 31_536_000) * 1000,
  };
  return tokenCache.token;
}

type FetchOptions = {
  query?: Record<string, string | number | boolean | undefined>;
  revalidate?: number;
  method?: "GET" | "POST";
  body?: unknown;
};

/** Call a Connector API endpoint (path relative to `/connector/api`). */
export async function opsFetch<T>(
  path: string,
  { query, revalidate, method = "GET", body }: FetchOptions = {},
): Promise<T> {
  if (!isOpsConfigured()) {
    throw new OpsError("ops API not configured");
  }

  const token = await getAccessToken();
  const url = new URL(
    `${opsConfig.baseUrl}/${opsConfig.apiPrefix}/${path.replace(/^\//, "")}`,
  );
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...(method === "GET"
      ? { next: { revalidate: revalidate ?? opsConfig.revalidate } }
      : { cache: "no-store" }),
  });

  if (res.status === 401) {
    // Token may have been revoked — clear cache so the next call re-auths.
    tokenCache = null;
    throw new OpsError("ops unauthorized", 401);
  }
  if (!res.ok) {
    throw new OpsError(`ops request failed: ${path} (${res.status})`, res.status);
  }

  return (await res.json()) as T;
}
