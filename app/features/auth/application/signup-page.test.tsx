import { createRoutesStub } from "react-router";
import { afterEach, describe, expect, test, vi } from "vitest";

import { SignUpPageComponent } from "./signup-page";
import { render, screen, userEvent } from "~/test/react-test-utils";

vi.mock("@simplewebauthn/browser", () => ({
  startRegistration: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

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
    const passkeyButton = screen.getByRole("button", {
      name: /create with passkey/i,
    });
    expect(passkeyButton.querySelector("svg")).toBeInTheDocument();
    const magicLinkButton = screen.getByRole("button", {
      name: /sign up with email link/i,
    });
    expect(magicLinkButton).toHaveClass(
      "w-fit",
      "text-muted-foreground",
      "hover:bg-transparent",
      "hover:text-foreground",
    );
    expect(magicLinkButton.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/auth/signin",
    );
  });

  test("given: clicking create with passkey, should: replace the button with an email form", async () => {
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

    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      "autocomplete",
      "email",
    );
    expect(
      screen.getByRole("button", { name: /^continue$/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /create with passkey/i }),
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

  test("given: passkey signup with an existing email, should: show the server error", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: "An account already exists for this email. Log in instead.",
        }),
        { status: 409 },
      ),
    );
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
    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.click(screen.getByRole("button", { name: /^continue$/i }));

    expect(
      await screen.findByText(
        "An account already exists for this email. Log in instead.",
      ),
    ).toBeInTheDocument();
  });
});
