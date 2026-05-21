import { apiRequest } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/token";
import type { DepositResponse } from "@/types/transaction";

/** POST /transactions/deposit — créditer le wallet */
export function depositApi(amount: number) {
  return apiRequest<DepositResponse>("/transactions/deposit", {
    method: "POST",
    body: { amount },
    token: getAuthToken(),
  });
}
