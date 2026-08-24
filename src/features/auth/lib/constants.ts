export const AUTH_API_ROUTES = {
  register: "/register",
  login: "/login",
  accessTokenByEmail: "/access-token-by-email",
  refreshTokens: "/tokens/new",
  me: "/me",
  resetPassword: "/reset-password",
  closeAccount: (userId: string) => `/close-account/${userId}`,
} as const;

export const AUTH_API_BACKEND_BASE_URL =
  process.env.AUTH_API_BACKEND_BASE_URL ?? "http://localhost:8080";
