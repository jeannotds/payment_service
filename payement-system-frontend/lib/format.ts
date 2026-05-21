/** Prisma Decimal → string dans le JSON */
export function formatMoney(value: string | number, currency = "USD") {
  const amount = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(amount)) return "—";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const TYPE_LABELS: Record<string, string> = {
  DEPOSIT: "Dépôt",
  WITHDRAW: "Retrait",
  TRANSFER: "Transfert",
};

export function formatTransactionType(type: string) {
  return TYPE_LABELS[type] ?? type;
}

/** Montant affiché avec signe selon le type */
export function formatTransactionAmount(type: string, amount: string | number) {
  const formatted = formatMoney(amount);
  if (type === "DEPOSIT") return `+${formatted}`;
  return `−${formatted}`;
}
