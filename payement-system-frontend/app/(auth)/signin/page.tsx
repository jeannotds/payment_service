import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignInForm } from "@/components/auth/signin-form";
import { ROUTES } from "@/constants/routes";

export default function SignInPage() {
  return (
    <AuthLayout
      footer={
        <>
          En continuant, vous acceptez nos conditions d&apos;utilisation.{" "}
          <Link href={ROUTES.signup} className="font-medium text-primary">
            Créer un compte
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthLayout>
  );
}
