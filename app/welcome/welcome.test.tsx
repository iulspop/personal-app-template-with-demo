import { expect, test } from "vitest";

import { Welcome } from "./welcome";
import { render, screen } from "~/test/react-test-utils";

test("renders resource links", () => {
  render(<Welcome />);
  expect(screen.getByText("React Router Docs")).toBeInTheDocument();
  expect(screen.getByText("Join Discord")).toBeInTheDocument();
});
