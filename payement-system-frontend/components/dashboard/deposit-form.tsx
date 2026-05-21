"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { depositApi } from "@/lib/api/transactions";
import { ApiError } from "@/lib/api/client";
import { formatMoney } from "@/lib/format";
import type { Wallet } from "@/types/transaction";

type DepositFormProps = {
  onSuccess: (wallet: Wallet) => void;
};

export function DepositForm({ onSuccess }: DepositFormProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      const data = await depositApi(parsed);
      onSuccess(data.wallet);
      setSuccess(
        `Dépôt réussi · +${formatMoney(data.transaction.amount)} · Nouveau solde ${formatMoney(data.wallet.balance)}`,
      );
      setAmount("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.status === 401) {
          setError("Session expirée. Reconnectez-vous.");
        }
      } else {
        setError("Impossible d'effectuer le dépôt.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Dépôt</h2>
        <p className="mt-1 text-sm text-muted">
          Créditez votre portefeuille (POST /transactions/deposit).
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="deposit-amount">Montant</Label>
          <Input
            id="deposit-amount"
            name="amount"
            type="number"
            min={1}
            step="0.01"
            placeholder="100"
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

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Traitement…" : "Déposer"}
        </Button>
      </form>
    </Card>
  );
}
