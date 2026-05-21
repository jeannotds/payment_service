"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { clearSession } from "@/lib/auth/session";
import type { User } from "@/types/api";

type DashboardShellProps = {
  user: User;
  children: React.ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push(ROUTES.signin);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href={ROUTES.dashboard} className="font-semibold text-foreground">
            Payment<span className="text-primary">System</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
            <Button type="button" variant="secondary" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
