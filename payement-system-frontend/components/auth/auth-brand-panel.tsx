export function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden lg:flex lg:w-[48%] lg:flex-col lg:justify-between lg:p-12">
      <div className="auth-glow absolute inset-0" />
      <div className="auth-grid absolute inset-0 opacity-60" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Fintech DS · Payment System
        </div>
        <h1 className="mt-8 max-w-md text-4xl font-semibold tracking-tight text-foreground">
          Gérez vos paiements avec clarté et confiance.
        </h1>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
          Dépôts, retraits, transferts et historique — une expérience
          bancaire moderne, pensée pour la simplicité.
        </p>
      </div>

      <div className="relative z-10 grid gap-4 sm:grid-cols-2">
        <StatCard label="Transactions" value="Temps réel" />
        <StatCard label="Sécurité" value="JWT + Wallet" />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/70 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
