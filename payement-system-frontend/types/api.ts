export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

/** Réponse commune login + signup */
export type AuthResponse = {
  user: User;
  token: string;
};

export type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
  error?: string;
};
