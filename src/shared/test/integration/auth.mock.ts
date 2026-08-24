import { HttpResponse, http } from "msw";
import { buildAuthApiUrl } from "@/features/auth/lib/api/config.api";
import { AUTH_API_ROUTES } from "@/features/auth/lib/constants";
import { server } from "./server";

const ME_URL = `*${buildAuthApiUrl(AUTH_API_ROUTES.me)}`;

export function mockAuthenticatedUser() {
  server.use(
    http.get(ME_URL, () =>
      HttpResponse.json({
        _id: "user-1",
        username: "Jane",
        email: "jane@example.com",
      }),
    ),
  );
}
