import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "./server.integrations";

process.env.AUTH_API_BACKEND_BASE_URL ??= "http://localhost:8080";
process.env.APP_BASE_URL ??= "http://localhost:3000";
process.env.RESEND_API_KEY ??= "test-resend-api-key";
process.env.GUEST_USER_EMAIL ??= "guest@example.com";
process.env.GUEST_USER_PASSWORD ??= "guest-password";

if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal ??= function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.show ??= function show() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close ??= function close() {
    this.open = false;
  };
}

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
  server.close();
});
