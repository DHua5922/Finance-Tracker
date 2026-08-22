import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "./server";

process.env.AUTH_API_BACKEND_BASE_URL ??= "http://localhost:8080";

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
