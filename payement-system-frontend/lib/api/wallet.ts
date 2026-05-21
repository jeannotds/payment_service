import { apiRequest } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/token";
import type { Wallet } from "@/types/transaction";

/** GET /wallet — solde du compte connecté */
export function getWalletApi() {
  return apiRequest<Wallet>("/wallet", {
    token: getAuthToken(),
  });
}
