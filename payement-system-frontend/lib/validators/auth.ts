import type { SignInFormValues, SignUpFormValues } from "@/types/auth";

export function validateSignIn(values: SignInFormValues) {
  const errors: Partial<Record<keyof SignInFormValues, string>> = {};

  if (!values.email.trim()) {
    errors.email = "L'email est requis.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Email invalide.";
  }

  if (!values.password) {
    errors.password = "Le mot de passe est requis.";
  } else if (values.password.length < 6) {
    errors.password = "Minimum 6 caractères.";
  }

  return errors;
}

export function validateSignUp(values: SignUpFormValues) {
  const errors: Partial<Record<keyof SignUpFormValues, string>> = {};

  if (!values.name.trim()) {
    errors.name = "Le nom est requis.";
  }

  if (!values.email.trim()) {
    errors.email = "L'email est requis.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Email invalide.";
  }

  if (!values.password) {
    errors.password = "Le mot de passe est requis.";
  } else if (values.password.length < 6) {
    errors.password = "Minimum 6 caractères.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirmez le mot de passe.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  }

  return errors;
}
