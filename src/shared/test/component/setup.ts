import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import * as axe from "axe-core";
import { afterAll, afterEach, beforeAll, expect } from "vitest";

import { server } from "../integration/server";

export async function expectNoA11yViolations(
  container: HTMLElement | Document,
) {
  const results: axe.AxeResults = await axe.run(
    container as axe.ElementContext,
    {
      rules: {
        "color-contrast": { enabled: true },
        "link-name": { enabled: true },
        "button-name": { enabled: true },
        label: { enabled: true },
        "aria-allowed-attr": { enabled: true },
        "aria-required-attr": { enabled: true },
        "aria-valid-attr-value": { enabled: true },
      },
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    },
  );

  expect(results.violations).toHaveLength(0);
}

if (typeof HTMLDialogElement !== "undefined") {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.open = true;
    };
  }

  if (!HTMLDialogElement.prototype.show) {
    HTMLDialogElement.prototype.show = function show() {
      this.open = true;
    };
  }

  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function close() {
      this.open = false;
    };
  }
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
