import { parseApiError, ApiError } from "@/lib/api/errors";
import type { ApiErrorBody } from "@/types/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

/**
 * Client HTTP unique : toutes les requêtes backend passent par ici.
 * - Préfixe NEXT_PUBLIC_API_URL
 * - JSON automatique
 * - Bearer token optionnel (routes protégées, plus tard)
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!response.ok) {
    throw parseApiError(response.status, data);
  }

  return data as T;
}

export { API_URL, ApiError };
