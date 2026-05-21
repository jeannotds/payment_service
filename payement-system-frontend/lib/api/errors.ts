import type { ApiErrorBody } from "@/types/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Transforme la réponse NestJS (400, 401…) en message lisible */
export function parseApiError(status: number, body: ApiErrorBody): ApiError {
  const raw = body.message;
  const message = Array.isArray(raw)
    ? raw.join(", ")
    : raw || body.error || `Erreur serveur (${status})`;

  return new ApiError(message, status);
}
