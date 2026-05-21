import { apiRequest } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/token";
import type { TransactionMutationResponse } from "@/types/transaction";

/** POST /transactions/deposit — créditer le wallet */
export function depositApi(amount: number) {
  return apiRequest<TransactionMutationResponse>("/transactions/deposit", {
    method: "POST",
    body: { amount },
    token: getAuthToken(),
  });
}

/** POST /transactions/withdraw — débiter le wallet */
export function withdrawApi(amount: number) {
  return apiRequest<TransactionMutationResponse>("/transactions/withdraw", {
    method: "POST",
    body: { amount },
    token: getAuthToken(),
  });
}
