import { ApiError } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

/** Token requis pour les routes protégées (wallet, transactions…) */
export function getAuthToken(): string {
  const token = getToken();
  if (!token) {
    throw new ApiError("Session expirée. Reconnectez-vous.", 401);
  }
  return token;
}
