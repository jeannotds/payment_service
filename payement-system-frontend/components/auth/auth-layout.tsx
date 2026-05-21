import Link from "next/link";
import { AuthBrandPanel } from "@/components/auth/auth-brand-panel";
import { ROUTES } from "@/constants/routes";

type AuthLayoutProps = {
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <AuthBrandPanel />

        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
          <div className="mb-8 lg:hidden">
            <Link
              href={ROUTES.home}
              className="text-sm font-semibold tracking-tight text-foreground"
            >
              Payment<span className="text-primary">System</span>
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md">{children}</div>

          <div className="mx-auto mt-8 w-full max-w-md text-center text-sm text-muted">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>
    </div>
  );
}
