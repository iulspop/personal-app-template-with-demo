import { createRoutesStub } from "react-router";
import { describe, expect, test } from "vitest";

import { FilterTabsComponent } from "./filter-tabs";
import { render, screen } from "~/test/react-test-utils";

describe("FilterTabsComponent", () => {
  test("given: filter 'all', should: mark All tab as current", () => {
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => <FilterTabsComponent currentFilter="all" />,
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByText("All")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Active")).not.toHaveAttribute("aria-current");
    expect(screen.getByText("Completed")).not.toHaveAttribute("aria-current");
  });

  test("given: filter 'active', should: mark Active tab as current", () => {
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => <FilterTabsComponent currentFilter="active" />,
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByText("Active")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("All")).not.toHaveAttribute("aria-current");
  });

  test("given: filter 'completed', should: mark Completed tab as current", () => {
    const path = "/";
    const RouterStub = createRoutesStub([
      {
        Component: () => <FilterTabsComponent currentFilter="completed" />,
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByText("Completed")).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByText("All")).not.toHaveAttribute("aria-current");
  });
});
