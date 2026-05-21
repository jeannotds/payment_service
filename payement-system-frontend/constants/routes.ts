export const ROUTES = {
  home: "/",
  signin: "/signin",
  signup: "/signup",
  dashboard: "/dashboard",
} as const;

/** Endpoints backend auth (Nest) */
export const AUTH_API = {
  login: "/auth/login",
  signup: "/auth/signup",
  me: "/auth/me",
} as const;
