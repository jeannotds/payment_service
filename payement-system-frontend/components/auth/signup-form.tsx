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
import { signupApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { saveSession } from "@/lib/auth/session";
import { validateSignUp } from "@/lib/validators/auth";
import type { SignUpFormValues } from "@/types/auth";

const initialValues: SignUpFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignUpForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormValues, string>>
  >({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(field: keyof SignUpFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignUp(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsLoading(true);
    setApiError(null);

    try {
      // POST /auth/signup — le backend crée user + wallet + renvoie token
      const data = await signupApi(values);

      saveSession(data.token, data.user);
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
        title="Créer un compte"
        subtitle="Ouvrez votre wallet et commencez à transférer en toute sécurité."
      />

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jean Dupont"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            disabled={isLoading}
          />
        </div>

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
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.password}
            onChange={(e) => handleChange("password", e.target.value)}
            error={errors.password}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={values.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            disabled={isLoading}
          />
        </div>

        {apiError ? <Alert variant="error">{apiError}</Alert> : null}

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? "Création…" : "Créer mon compte"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Déjà inscrit ?{" "}
        <Link
          href={ROUTES.signin}
          className="font-semibold text-primary hover:text-primary-hover"
        >
          Se connecter
        </Link>
      </p>
    </Card>
  );
}
