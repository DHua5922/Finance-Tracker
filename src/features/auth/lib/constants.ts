export const AUTH_API_ROUTES = {
  register: "/register",
  login: "/login",
  accessTokenByEmail: "/access-token-by-email",
  refreshTokens: "/tokens/new",
  resetPassword: "/reset-password",
} as const;

export const AUTH_API_BACKEND_BASE_URL = API_BACKEND_BASE_URL;

import { API_BACKEND_BASE_URL } from "@/shared/constants/api.constants";
