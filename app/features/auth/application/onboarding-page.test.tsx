import { createRoutesStub } from "react-router";
import { describe, expect, test } from "vitest";

import { OnboardingPageComponent } from "./onboarding-page";
import { render, screen } from "~/test/react-test-utils";

describe("OnboardingPageComponent", () => {
  test("given: the onboarding page, should: render name input and submit button", () => {
    const path = "/onboarding";
    const RouterStub = createRoutesStub([
      {
        Component: () => <OnboardingPageComponent email="alice@example.com" />,
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  test("given: an email, should: populate the hidden email field", () => {
    const path = "/onboarding";
    const RouterStub = createRoutesStub([
      {
        Component: () => <OnboardingPageComponent email="alice@example.com" />,
        path,
      },
    ]);

    render(<RouterStub initialEntries={[path]} />);

    const hiddenInput = document.querySelector(
      'input[name="email"][type="hidden"]',
    ) as HTMLInputElement;
    expect(hiddenInput).toBeTruthy();
    expect(hiddenInput.value).toBe("alice@example.com");
  });
});
