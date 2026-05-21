"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { withdrawApi } from "@/lib/api/transactions";
import { ApiError } from "@/lib/api/client";
import { formatMoney } from "@/lib/format";
import type { Wallet } from "@/types/transaction";

type WithdrawFormProps = {
  balance?: string | number | null;
  onSuccess: (wallet: Wallet) => void;
};

function parseBalance(balance: string | number | null | undefined) {
  if (balance === null || balance === undefined) return null;
  const value = typeof balance === "string" ? parseFloat(balance) : balance;
  return Number.isNaN(value) ? null : value;
}

export function WithdrawForm({ balance, onSuccess }: WithdrawFormProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const available = parseBalance(balance);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setFieldError(undefined);

    const parsed = Number(amount);
    if (!amount.trim() || Number.isNaN(parsed) || parsed < 1) {
      setFieldError("Montant minimum : 1.");
      return;
    }

    if (available !== null && parsed > available) {
      setFieldError(`Solde insuffisant (disponible : ${formatMoney(available)}).`);
      return;
    }

    setIsLoading(true);

    try {
      const data = await withdrawApi(parsed);
      onSuccess(data.wallet);
      setSuccess(
        `Retrait réussi · −${formatMoney(data.transaction.amount)} · Nouveau solde ${formatMoney(data.wallet.balance)}`,
      );
      setAmount("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? "Session expirée. Reconnectez-vous."
            : err.message,
        );
      } else {
        setError("Impossible d'effectuer le retrait.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Retrait</h2>
        <p className="mt-1 text-sm text-muted">
          Débitez votre portefeuille.
        </p>
        {available !== null ? (
          <p className="mt-2 text-xs text-muted">
            Disponible :{" "}
            <span className="font-medium text-foreground">
              {formatMoney(available)}
            </span>
          </p>
        ) : null}
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="withdraw-amount">Montant</Label>
          <Input
            id="withdraw-amount"
            name="amount"
            type="number"
            min={1}
            step="0.01"
            max={available ?? undefined}
            placeholder="50"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setFieldError(undefined);
              setError(null);
              setSuccess(null);
            }}
            error={fieldError}
            disabled={isLoading}
          />
        </div>

        {error ? <Alert variant="error">{error}</Alert> : null}
        {success ? <Alert variant="success">{success}</Alert> : null}

        <Button type="submit" variant="secondary" fullWidth disabled={isLoading}>
          {isLoading ? "Traitement…" : "Retirer"}
        </Button>
      </form>
    </Card>
  );
}
