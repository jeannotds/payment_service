import { formatMoney } from "@/lib/format";
import type { Wallet } from "@/types/transaction";

type WalletCardProps = {
  wallet: Wallet | null;
  isLoading?: boolean;
};

export function WalletCard({ wallet, isLoading }: WalletCardProps) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Solde disponible
      </p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
        {isLoading ? "…" : wallet ? formatMoney(wallet.balance) : "—"}
      </p>
      {wallet ? (
        <p className="mt-2 text-xs text-muted">Wallet · {wallet.id.slice(0, 8)}…</p>
      ) : null}
    </section>
  );
}
