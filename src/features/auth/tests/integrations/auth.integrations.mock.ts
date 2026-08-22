import { HttpResponse, http } from "msw";

import { buildAuthApiUrl } from "@/features/auth/lib/config";
import { server } from "@/shared/test/integration/server";
import { AUTH_API_ROUTES } from "../../lib/constants";

const REGISTER_URL = `*${buildAuthApiUrl(AUTH_API_ROUTES.register)}`;

export function mockSuccessfulRegistration(
  onRequest?: (body: unknown) => void,
) {
  server.use(
    http.post(REGISTER_URL, async ({ request }) => {
      const body = await request.json();
      onRequest?.(body);

      return HttpResponse.json(
        {
          _id: "user-1",
          username: "Jane",
          email: "jane@example.com",
        },
        { status: 201 },
      );
    }),
  );
}

export function mockRegistrationFailure(
  message = "Email already exists",
  onRequest?: (body: unknown) => void,
) {
  server.use(
    http.post(REGISTER_URL, async ({ request }) => {
      const body = await request.json();
      onRequest?.(body);

      return HttpResponse.json(
        {
          message,
        },
        { status: 400 },
      );
    }),
  );
}
