"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { transferApi } from "@/lib/api/transactions";
import { getWalletApi } from "@/lib/api/wallet";
import { ApiError } from "@/lib/api/client";
import { formatMoney, formatTransactionAmount } from "@/lib/format";
import { validateTransfer } from "@/lib/validators/transfer";
import type { TransferFormValues } from "@/types/transfer";
import type { Wallet } from "@/types/transaction";

type TransferFormProps = {
  balance?: string | number | null;
  senderEmail?: string;
  onSuccess: (wallet: Wallet) => void;
};

const initialValues: TransferFormValues = {
  receiverEmail: "",
  amount: "",
};

function parseBalance(balance: string | number | null | undefined) {
  if (balance === null || balance === undefined) return null;
  const value = typeof balance === "string" ? parseFloat(balance) : balance;
  return Number.isNaN(value) ? null : value;
}

export function TransferForm({
  balance,
  senderEmail,
  onSuccess,
}: TransferFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransferFormValues, string>>
  >({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const available = parseBalance(balance);

  function handleChange(field: keyof TransferFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
    setSuccess(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setApiError(null);
    setSuccess(null);

    const nextErrors = validateTransfer(values, {
      senderEmail,
      balance: available,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const amount = Number(values.amount);
    setIsLoading(true);

    try {
      const data = await transferApi(values.receiverEmail.trim(), amount);
      const wallet = await getWalletApi();
      onSuccess(wallet);
      setSuccess(
        `${data.message} · ${formatTransactionAmount(data.transaction.type, data.transaction.amount)} vers ${values.receiverEmail} · Solde ${formatMoney(wallet.balance)}`,
      );
      setValues(initialValues);
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(
          err.status === 401
            ? "Session expirée. Reconnectez-vous."
            : err.message,
        );
      } else {
        setApiError("Impossible d'effectuer le transfert.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Transfert</h2>
        <p className="mt-1 text-sm text-muted">
          Envoyez de l&apos;argent à un autre utilisateur via son email.
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
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="receiver-email">Email du destinataire</Label>
            <Input
              id="receiver-email"
              name="receiverEmail"
              type="email"
              autoComplete="email"
              placeholder="destinataire@exemple.com"
              value={values.receiverEmail}
              onChange={(e) => handleChange("receiverEmail", e.target.value)}
              error={errors.receiverEmail}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transfer-amount">Montant</Label>
            <Input
              id="transfer-amount"
              name="amount"
              type="number"
              min={1}
              step="0.01"
              max={available ?? undefined}
              placeholder="25"
              value={values.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              error={errors.amount}
              disabled={isLoading}
            />
          </div>
        </div>

        {apiError ? <Alert variant="error">{apiError}</Alert> : null}
        {success ? <Alert variant="success">{success}</Alert> : null}

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Transfert en cours…" : "Transférer"}
        </Button>
      </form>
    </Card>
  );
}
