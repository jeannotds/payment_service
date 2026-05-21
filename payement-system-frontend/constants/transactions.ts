export const TRANSACTION_TYPES = [
  { value: "", label: "Tous les types" },
  { value: "DEPOSIT", label: "Dépôt" },
  { value: "WITHDRAW", label: "Retrait" },
  { value: "TRANSFER", label: "Transfert" },
] as const;

export type TransactionTypeFilter =
  (typeof TRANSACTION_TYPES)[number]["value"];
