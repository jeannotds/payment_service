"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TRANSACTION_TYPES, TransactionTypeFilter } from "@/constants/transactions";
import { getTransactionsApi } from "@/lib/api/transactions";
import { ApiError } from "@/lib/api/client";
import {
  formatDate,
  formatTransactionAmount,
  formatTransactionType,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TransactionListItem } from "@/types/transaction";

type TransactionHistoryProps = {
  /** Incrémenté après dépôt/retrait pour recharger la liste */
  refreshKey?: number;
};

const TYPE_STYLES: Record<string, string> = {
  DEPOSIT: "bg-success/15 text-success",
  WITHDRAW: "bg-danger/15 text-danger",
  TRANSFER: "bg-accent/15 text-accent",
};

const STATUS_STYLES: Record<string, string> = {
  SUCCESS: "text-success",
  PENDING: "text-muted",
  FAILED: "text-danger",
};

export function TransactionHistory({ refreshKey = 0 }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<TransactionListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTransactionsApi({
        page,
        limit: 10,
        type: typeFilter || undefined,
      });
      setTransactions(data.transactions);
      setTotalPages(data.meta.totalPages);
      setTotal(data.meta.total);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Impossible de charger l'historique.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions, refreshKey]);

  function handleTypeChange(value: string) {
    setTypeFilter(value as TransactionTypeFilter);
    setPage(1);
  }

  return (
    <Card className="!p-0 overflow-hidden">
      <div className="border-b border-border px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Historique des transactions
            </h2>
            <p className="mt-1 text-sm text-muted">
              {total} transaction{total !== 1 ? "s" : ""} au total
            </p>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            aria-label="Filtrer par type"
          >
            {TRANSACTION_TYPES.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-6 py-4">
        {error ? (
          <Alert variant="error">{error}</Alert>
        ) : isLoading ? (
          <p className="py-8 text-center text-sm text-muted">Chargement…</p>
        ) : transactions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            Aucune transaction pour ce filtre.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold",
                      TYPE_STYLES[tx.type] ?? "bg-surface-muted text-muted",
                    )}
                  >
                    {formatTransactionType(tx.type)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(tx.createdAt)}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted">
                      {tx.id.slice(0, 8)}…
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:text-right">
                  <span
                    className={cn(
                      "text-xs font-medium uppercase",
                      STATUS_STYLES[tx.status] ?? "text-muted",
                    )}
                  >
                    {tx.status}
                  </span>
                  <p
                    className={cn(
                      "text-base font-semibold tabular-nums",
                      tx.type === "DEPOSIT" ? "text-success" : "text-foreground",
                    )}
                  >
                    {formatTransactionAmount(tx.type, tx.amount)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="secondary"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted">
            Page {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
