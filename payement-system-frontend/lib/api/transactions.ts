import { apiRequest } from "@/lib/api/client";
import { getAuthToken } from "@/lib/auth/token";
import type { TransactionTypeFilter } from "@/constants/transactions";
import type {
  Transaction,
  TransactionMutationResponse,
  TransactionsListResponse,
} from "@/types/transaction";

type ListParams = {
  page?: number;
  limit?: number;
  type?: TransactionTypeFilter;
};

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

/** GET /transactions — historique paginé */
export function getTransactionsApi(params: ListParams = {}) {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 1));
  search.set("limit", String(params.limit ?? 10));
  if (params.type) search.set("type", params.type);

  return apiRequest<TransactionsListResponse>(
    `/transactions?${search.toString()}`,
    { token: getAuthToken() },
  );
}

/** GET /transactions/:id — détail d'une transaction */
export function getTransactionByIdApi(id: string) {
  return apiRequest<Transaction>(`/transactions/${id}`, {
    token: getAuthToken(),
  });
}
