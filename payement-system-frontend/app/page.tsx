import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="auth-glow absolute inset-0 pointer-events-none" />
      <div className="relative z-10 w-full max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Fintech DS
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
          Payment System
        </h1>
        <p className="mt-3 text-muted">
          Portefeuille numérique — dépôts, retraits, transferts et historique.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.signin}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-hover"
          >
            Se connecter
          </Link>
          <Link
            href={ROUTES.signup}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-foreground hover:bg-surface-muted"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </main>
  );
}
