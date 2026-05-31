import { createRoutesStub } from "react-router";
import { describe, expect, test } from "vitest";

import { SignUpPageComponent } from "./signup-page";
import { render, screen, userEvent } from "~/test/react-test-utils";

describe("SignUpPageComponent", () => {
  test("given: the sign up page, should: render create labeled passkey and email link options", () => {
    const path = "/auth/signup";
    const RouterStub = createRoutesStub([
      {
        Component: () => <SignUpPageComponent />,
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(
      screen.getByRole("heading", { name: /sign up/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create with passkey/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up with email link/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/auth/signin",
    );
  });

  test("given: clicking create with passkey, should: start passkey signup without revealing email", async () => {
    const user = userEvent.setup();
    const path = "/auth/signup";
    const RouterStub = createRoutesStub([
      {
        Component: () => <SignUpPageComponent />,
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);
    await user.click(
      screen.getByRole("button", { name: /create with passkey/i }),
    );

    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /send signup link/i }),
    ).not.toBeInTheDocument();
  });

  test("given: clicking email signup, should: replace the email-link button with the magic-link form", async () => {
    const user = userEvent.setup();
    const path = "/auth/signup";
    const RouterStub = createRoutesStub([
      {
        Component: () => <SignUpPageComponent />,
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);
    await user.click(
      screen.getByRole("button", { name: /sign up with email link/i }),
    );

    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      "autocomplete",
      "email",
    );
    expect(
      screen.getByRole("button", { name: /send signup link/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /sign up with email link/i }),
    ).not.toBeInTheDocument();
  });
});
