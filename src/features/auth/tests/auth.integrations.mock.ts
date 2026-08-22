import { HttpResponse, http } from "msw";

import { server } from "@/shared/test/server";

const REGISTER_URL = "*/api/v1/auth/register";

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
