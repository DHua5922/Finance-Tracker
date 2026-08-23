import { HttpResponse, http } from "msw";
import { buildAuthApiUrl } from "@/features/auth/lib/config";
import { AUTH_API_ROUTES } from "@/features/auth/lib/constants";
import { server } from "@/shared/test/integration/server";

const SECURE_URL = `*${buildAuthApiUrl(AUTH_API_ROUTES.secure)}`;

export function mockAuthenticatedDashboardUser() {
  server.use(
    http.post(SECURE_URL, () => {
      return HttpResponse.json({
        _id: "user-1",
        username: "Jane",
        email: "jane@example.com",
      });
    }),
  );
}
