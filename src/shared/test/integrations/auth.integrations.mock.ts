import { HttpResponse, http } from "msw";
import { server } from "./server.integrations";

const ME_URL = "*/api/v1/users/me";

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
