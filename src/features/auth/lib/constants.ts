export const AUTH_API_ROUTES = {
  register: "/register",
  login: "/login",
  closeAccount: (userId: string) => `/close-account/${userId}`,
} as const;

export const AUTH_API_BACKEND_BASE_URL =
  process.env.AUTH_API_BACKEND_BASE_URL ?? "http://localhost:8080";
