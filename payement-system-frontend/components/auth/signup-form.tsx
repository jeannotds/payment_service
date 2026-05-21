"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthHeader } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/constants/routes";
import { validateSignUp } from "@/lib/validators/auth";
import type { SignUpFormValues } from "@/types/auth";

const initialValues: SignUpFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function SignUpForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormValues, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof SignUpFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSignUp(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    // UI only — branchement API /auth/signup plus tard
    setSubmitted(true);
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
          />
        </div>

        {submitted ? (
          <p className="rounded-xl border border-primary/30 bg-primary-soft px-4 py-3 text-sm text-foreground">
            Formulaire valide. L&apos;appel API d&apos;inscription sera branché
            à l&apos;étape suivante.
          </p>
        ) : null}

        <Button type="submit" fullWidth>
          Créer mon compte
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
