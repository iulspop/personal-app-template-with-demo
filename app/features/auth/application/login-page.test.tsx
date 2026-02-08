import { createRoutesStub } from "react-router";
import { describe, expect, test } from "vitest";

import { LoginPageComponent } from "./login-page";
import { render, screen } from "~/test/react-test-utils";

describe("LoginPageComponent", () => {
  test("given: the login page, should: render email input and submit button", () => {
    const path = "/login";
    const RouterStub = createRoutesStub([
      {
        Component: () => <LoginPageComponent />,
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send magic link/i }),
    ).toBeInTheDocument();
  });

  test("given: actionData with error, should: display error message", () => {
    const path = "/login";
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <LoginPageComponent
            actionData={{ error: "EMAIL_EMPTY", success: false }}
          />
        ),
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByRole("alert")).toHaveTextContent(/email is required/i);
  });

  test("given: no actionData, should: not display any error", () => {
    const path = "/login";
    const RouterStub = createRoutesStub([
      {
        Component: () => <LoginPageComponent />,
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
