import type { TransferFormValues } from "@/types/transfer";

export function validateTransfer(
  values: TransferFormValues,
  options?: { senderEmail?: string; balance?: number | null },
) {
  const errors: Partial<Record<keyof TransferFormValues, string>> = {};
  const email = values.receiverEmail.trim();

  if (!email) {
    errors.receiverEmail = "L'email du destinataire est requis.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.receiverEmail = "Email invalide.";
  } else if (
    options?.senderEmail &&
    email.toLowerCase() === options.senderEmail.toLowerCase()
  ) {
    errors.receiverEmail = "Vous ne pouvez pas vous envoyer de l'argent.";
  }

  const parsed = Number(values.amount);
  if (!values.amount.trim() || Number.isNaN(parsed) || parsed < 1) {
    errors.amount = "Montant minimum : 1.";
  } else if (
    options?.balance !== null &&
    options?.balance !== undefined &&
    parsed > options.balance
  ) {
    errors.amount = "Solde insuffisant.";
  }

  return errors;
}
