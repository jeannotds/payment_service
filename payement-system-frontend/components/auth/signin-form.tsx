"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthHeader } from "@/components/auth/auth-layout";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { loginApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { saveSession } from "@/lib/auth/session";
import { validateSignIn } from "@/lib/validators/auth";
import type { SignInFormValues } from "@/types/auth";

const initialValues: SignInFormValues = {
  email: "",
  password: "",
};

export function SignInForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInFormValues, string>>
  >({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(field: keyof SignInFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignIn(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    setApiError(null);

    try {
      // Étape 1 : appel POST /auth/login
      const data = await loginApi(values);

      // Étape 2 : sauvegarder token + user (pour les routes protégées)
      saveSession(data.token, data.user);

      // Étape 3 : redirection vers le dashboard
      router.push(ROUTES.dashboard);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Impossible de joindre le serveur. Vérifiez que l'API tourne.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <AuthHeader
        title="Connexion"
        subtitle="Accédez à votre portefeuille et à vos transactions."
      />

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:text-primary-hover"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
            disabled={isLoading}
          />
        </div>

        {apiError ? <Alert variant="error">{apiError}</Alert> : null}

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Pas encore de compte ?{" "}
        <Link
          href={ROUTES.signup}
          className="font-semibold text-primary hover:text-primary-hover"
        >
          Créer un compte
        </Link>
      </p>
    </Card>
  );
}
