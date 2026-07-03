import { startRegistration } from "@simplewebauthn/browser"
import { createRoutesStub } from "react-router"
import { afterEach, describe, expect, test, vi } from "vitest"

import { SettingsPageComponent } from "./settings-page"
import { render, screen, userEvent } from "~/test/react-test-utils"

vi.mock("@simplewebauthn/browser", () => ({
  startRegistration: vi.fn(() => ({ id: "credential-id" })),
}))

afterEach(() => {
  vi.restoreAllMocks()
})

describe("SettingsPageComponent", () => {
  test("given: an email-only user, should: show passkey setup", () => {
    const path = "/settings"
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <SettingsPageComponent passkeys={[]} userEmail="user@example.com" />
        ),
        path,
      },
    ])

    render(<RouterStub initialEntries={[path]} />)

    expect(
      screen.getByRole("heading", { name: /settings/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/email sign-in only/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /add passkey/i }),
    ).toBeInTheDocument()
  })

  test("given: a user with a passkey, should: show enabled status", () => {
    const path = "/settings"
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <SettingsPageComponent
            passkeys={[
              { createdAt: "2026-05-31T00:00:00.000Z", id: "passkey-id" },
            ]}
            userEmail="user@example.com"
          />
        ),
        path,
      },
    ])

    render(<RouterStub initialEntries={[path]} />)

    expect(screen.getByText(/passkey enabled/i)).toBeInTheDocument()
    expect(screen.getByText(/passkey added/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /add passkey/i }),
    ).toBeInTheDocument()
  })

  test("given: passkey registration succeeds, should: show success", async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ challenge: "challenge" }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ verified: true }), { status: 200 }),
      )
    const path = "/settings"
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <SettingsPageComponent passkeys={[]} userEmail="user@example.com" />
        ),
        path,
      },
    ])

    render(<RouterStub initialEntries={[path]} />)

    await user.click(screen.getByRole("button", { name: /add passkey/i }))

    expect(startRegistration).toHaveBeenCalledWith({
      optionsJSON: { challenge: "challenge" },
    })
    expect(await screen.findByText(/passkey added/i)).toBeInTheDocument()
  })

  test("given: passkey deletion fails, should: show route error", () => {
    const path = "/settings"
    const RouterStub = createRoutesStub([
      {
        Component: () => (
          <SettingsPageComponent
            actionData={{ error: "Invalid form data", success: false }}
            passkeys={[]}
            userEmail="user@example.com"
          />
        ),
        path,
      },
    ])

    render(<RouterStub initialEntries={[path]} />)

    expect(screen.getByRole("alert")).toHaveTextContent(/invalid form data/i)
  })
})
