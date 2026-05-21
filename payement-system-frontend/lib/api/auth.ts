import { apiRequest } from "@/lib/api/client";
import type { AuthResponse } from "@/types/api";
import type { SignInFormValues, SignUpFormValues } from "@/types/auth";

/**
 * POST /auth/login — connexion (signin côté frontend)
 * Body aligné sur CreateLoginDto du backend
 */
export function loginApi(values: SignInFormValues) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: {
      email: values.email,
      password: values.password,
    },
  });
}

/**
 * POST /auth/signup — inscription
 * Body aligné sur CreateSignupDto (sans confirmPassword)
 */
export function signupApi(values: SignUpFormValues) {
  return apiRequest<AuthResponse>("/auth/signup", {
    method: "POST",
    body: {
      name: values.name,
      email: values.email,
      password: values.password,
    },
  });
}
