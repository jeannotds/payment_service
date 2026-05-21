export const ROUTES = {
  home: "/",
  signin: "/signin",
  signup: "/signup",
  dashboard: "/dashboard",
} as const;

/** Endpoints backend (Nest) */
export const API_PATHS = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    me: "/auth/me",
  },
  wallet: "/wallet",
  transactions: {
    deposit: "/transactions/deposit",
    withdraw: "/transactions/withdraw",
    transfer: "/transactions/transfer",
    list: "/transactions",
  },
} as const;
