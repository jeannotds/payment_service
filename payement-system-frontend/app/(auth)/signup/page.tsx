import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUpForm } from "@/components/auth/signup-form";
import { ROUTES } from "@/constants/routes";

export default function SignUpPage() {
  return (
    <AuthLayout
      footer={
        <>
          Vous avez déjà un compte ?{" "}
          <Link href={ROUTES.signin} className="font-medium text-primary">
            Se connecter
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthLayout>
  );
}
