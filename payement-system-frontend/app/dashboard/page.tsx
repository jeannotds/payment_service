"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { clearSession, getStoredUser } from "@/lib/auth/session";
import type { User } from "@/types/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.replace(ROUTES.signin);
      return;
    }
    setUser(stored);
  }, [router]);

  function handleLogout() {
    clearSession();
    router.push(ROUTES.signin);
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center text-muted">
        Chargement…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-lg rounded-[var(--radius-xl)] border border-border bg-surface p-8 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Espace connecté
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Bonjour, {user.name}
        </h1>
        <p className="mt-2 text-sm text-muted">{user.email}</p>
        <p className="mt-6 text-sm text-muted">
          Prochaine étape : wallet, dépôts et transactions.
        </p>
        <div className="mt-8 flex gap-3">
          <Button type="button" variant="secondary" onClick={handleLogout}>
            Se déconnecter
          </Button>
          <Link
            href={ROUTES.home}
            className="inline-flex h-11 items-center text-sm font-medium text-primary"
          >
            Accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
