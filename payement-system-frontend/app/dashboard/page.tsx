"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DepositForm } from "@/components/dashboard/deposit-form";
import { WalletCard } from "@/components/dashboard/wallet-card";
import { WithdrawForm } from "@/components/dashboard/withdraw-form";
import { ROUTES } from "@/constants/routes";
import { getWalletApi } from "@/lib/api/wallet";
import { ApiError } from "@/lib/api/client";
import { getStoredUser } from "@/lib/auth/session";
import type { User } from "@/types/api";
import type { Wallet } from "@/types/transaction";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);

  const loadWallet = useCallback(async () => {
    setWalletLoading(true);
    setWalletError(null);
    try {
      const data = await getWalletApi();
      setWallet(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace(ROUTES.signin);
        return;
      }
      setWalletError(
        err instanceof ApiError ? err.message : "Impossible de charger le wallet.",
      );
    } finally {
      setWalletLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace(ROUTES.signin);
      return;
    }
    setUser(stored);
    loadWallet();
  }, [router, loadWallet]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center text-muted">
        Chargement…
      </main>
    );
  }

  return (
    <DashboardShell user={user}>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-muted">
          Gérez votre solde et vos opérations.
        </p>
      </div>

      {walletError ? (
        <p className="mb-6 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {walletError}
        </p>
      ) : null}

      <div className="space-y-6">
        <WalletCard wallet={wallet} isLoading={walletLoading} />
        <div className="grid gap-6 lg:grid-cols-2">
          <DepositForm onSuccess={setWallet} />
          <WithdrawForm balance={wallet?.balance} onSuccess={setWallet} />
        </div>
      </div>
    </DashboardShell>
  );
}
