import { HttpResponse, http } from "msw";

import { server } from "@/shared/test/integrations";
import { buildAuthApiUrl } from "../../lib/api/config.api";
import { AUTH_API_ROUTES } from "../../lib/constants";

const REGISTER_URL = `*${buildAuthApiUrl(AUTH_API_ROUTES.register)}`;
const LOGIN_URL = `*${buildAuthApiUrl(AUTH_API_ROUTES.login)}`;
const ACCESS_TOKEN_BY_EMAIL_URL = `*${buildAuthApiUrl(
  AUTH_API_ROUTES.accessTokenByEmail,
)}`;
const RESET_PASSWORD_URL = `*${buildAuthApiUrl(AUTH_API_ROUTES.resetPassword)}`;
const RESEND_EMAIL_URL = "https://api.resend.com/emails";

const badRequestStatusCode = 400;

export function mockSuccessfulRegistration(
  onRequest?: (body: unknown) => void,
) {
  server.use(
    http.post(REGISTER_URL, async ({ request }) => {
      const body = await request.json();
      onRequest?.(body);

      return HttpResponse.json(
        {
          user: {
            _id: "user-1",
            username: "Jane",
            email: "jane@example.com",
          },
          accessToken: "access-token",
          refreshToken: "refresh-token",
          accessTokenExpireTime: "15m",
          refreshTokenExpireTime: "7d",
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
        { status: badRequestStatusCode },
      );
    }),
  );
}

export function mockSuccessfulLogin(onRequest?: (body: unknown) => void) {
  server.use(
    http.post(LOGIN_URL, async ({ request }) => {
      onRequest?.(await request.json());
      return HttpResponse.json(
        {
          user: {
            _id: "user-1",
            username: "Jane",
            email: "jane@example.com",
          },
          accessToken: "access-token",
          refreshToken: "refresh-token",
          accessTokenExpireTime: "15m",
          refreshTokenExpireTime: "7d",
        },
        { status: 200 },
      );
    }),
  );
}

export function mockErrorLogin() {
  server.use(
    http.post(LOGIN_URL, async () => {
      return HttpResponse.text("Invalid credentials", {
        status: badRequestStatusCode,
      });
    }),
  );
}

export function mockSuccessfulPasswordResetRequest(
  onTokenRequest?: (body: unknown) => void,
  onEmailRequest?: (body: unknown) => void,
) {
  server.use(
    http.post(ACCESS_TOKEN_BY_EMAIL_URL, async ({ request }) => {
      onTokenRequest?.(await request.json());
      return HttpResponse.json({
        accessToken: "password-reset-token",
        accessTokenExpireTime: "15m",
      });
    }),
    http.post(RESEND_EMAIL_URL, async ({ request }) => {
      onEmailRequest?.(await request.json());
      return HttpResponse.json({ id: "email-1" });
    }),
  );
}

export function mockPasswordResetRequestFailure() {
  server.use(
    http.post(ACCESS_TOKEN_BY_EMAIL_URL, () =>
      HttpResponse.json(
        { message: "User not found" },
        { status: badRequestStatusCode },
      ),
    ),
  );
}

export function mockSuccessfulPasswordReset(
  onRequest?: (body: unknown, authorization: string | null) => void,
) {
  server.use(
    http.post(RESET_PASSWORD_URL, async ({ request }) => {
      onRequest?.(await request.json(), request.headers.get("authorization"));
      return HttpResponse.json({
        _id: "user-1",
        username: "Jane",
        email: "jane@example.com",
      });
    }),
  );
}

export function mockPasswordResetFailure() {
  server.use(
    http.post(RESET_PASSWORD_URL, () =>
      HttpResponse.json(
        { message: "Reset link expired" },
        { status: badRequestStatusCode },
      ),
    ),
  );
}
