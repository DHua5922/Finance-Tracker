import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "@/shared/test/component/setup.component";
import StatCard from "./StatCard";

describe("StatCard", () => {
  it("presents a formatted amount, transaction count, and details link", async () => {
    const label = "Total income";
    const { container } = render(
      <StatCard
        label={label}
        amount={1234.5}
        count={2}
        href="/transaction"
        valueAccent="accent"
      />,
    );

    expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
    expect(screen.getByText("$1,234.50")).toBeInTheDocument();
    expect(screen.getByText("2 transactions")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /view total income/i }),
    ).toHaveAttribute("href", "/transaction");
    await expectNoA11yViolations(container);
  });

  it("uses singular transaction copy and omits the link when no href is given", () => {
    render(<StatCard label="Net savings" amount={-25} count={1} />);

    expect(screen.getByText("-$25.00")).toBeInTheDocument();
    expect(screen.getByText("1 transaction")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("omits transaction copy when no count is given", () => {
    render(<StatCard label="Net savings" amount={500} />);

    expect(screen.queryByText(/transactions?/i)).not.toBeInTheDocument();
  });
});
