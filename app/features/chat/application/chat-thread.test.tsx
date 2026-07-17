import { createRoutesStub } from "react-router"
import { describe, expect, test, vi } from "vitest"

import type { ChatThreadMessage } from "./chat-thread"
import { ChatThread } from "./chat-thread"
import { render, screen, userEvent, waitFor } from "~/test/react-test-utils"

vi.mock("./use-chat-events", () => ({
  useChatEvents: vi.fn(),
}))

const createProps = (
  overrides: Partial<{
    backTo: string
    messages: ChatThreadMessage[]
    participant: string
    presence: string
    title: string
  }> = {},
) => ({
  backTo: "/",
  messages: [],
  participant: "owner@example.com",
  presence: "Online",
  title: "Chat with owner",
  ...overrides,
})

describe("ChatThread", () => {
  test("given: a message is sent successfully, should: clear the composer", async () => {
    const user = userEvent.setup()
    const RouterStub = createRoutesStub([
      {
        action: () => ({ error: null, messageId: "message-id" }),
        Component: () => <ChatThread {...createProps()} />,
        path: "/chat",
      },
    ])
    render(<RouterStub initialEntries={["/chat"]} />)
    const messageInput = screen.getByRole("textbox", { name: /message/i })

    await user.type(messageInput, "Hello owner")
    await user.click(screen.getByRole("button", { name: /send message/i }))

    await waitFor(() => expect(messageInput).toHaveValue(""))
  })

  test("given: sending fails, should: preserve the message", async () => {
    const user = userEvent.setup()
    const RouterStub = createRoutesStub([
      {
        action: () => ({ error: "Message could not be sent." }),
        Component: () => <ChatThread {...createProps()} />,
        path: "/chat",
      },
    ])
    render(<RouterStub initialEntries={["/chat"]} />)
    const messageInput = screen.getByRole("textbox", { name: /message/i })

    await user.type(messageInput, "Try again")
    await user.click(screen.getByRole("button", { name: /send message/i }))

    await waitFor(() => expect(messageInput).toHaveValue("Try again"))
  })
})
