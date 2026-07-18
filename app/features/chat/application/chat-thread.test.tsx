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
  title: "Chat with founder",
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

  test("given: files are selected, should: show and remove them before sending", async () => {
    const user = userEvent.setup()
    const RouterStub = createRoutesStub([
      {
        action: () => ({ error: null, messageId: "message-id" }),
        Component: () => <ChatThread {...createProps()} />,
        path: "/chat",
      },
    ])
    render(<RouterStub initialEntries={["/chat"]} />)
    const fileInput = screen.getByLabelText(/attach files/i)
    const screenshot = new File(["image"], "roadmap.png", {
      type: "image/png",
    })

    await user.upload(fileInput, screenshot)

    expect(
      screen.getByRole("list", { name: /files ready to send/i }),
    ).toBeVisible()
    expect(screen.getByText("roadmap.png")).toBeVisible()

    await user.click(
      screen.getByRole("button", { name: /remove roadmap.png/i }),
    )

    expect(screen.queryByText("roadmap.png")).not.toBeInTheDocument()
    expect((fileInput as HTMLInputElement).files).toHaveLength(0)
  })

  test("given: a composed message, should: send when Enter is pressed", async () => {
    const user = userEvent.setup()
    const action = vi.fn(() => ({ error: null, messageId: "message-id" }))
    const RouterStub = createRoutesStub([
      {
        action,
        Component: () => <ChatThread {...createProps()} />,
        path: "/chat",
      },
    ])
    render(<RouterStub initialEntries={["/chat"]} />)
    const messageInput = screen.getByRole("textbox", { name: /message/i })

    await user.type(messageInput, "Send with Enter{Enter}")

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(messageInput).toHaveValue(""))
  })

  test("given: a composed message, should: add a newline with Shift+Enter", async () => {
    const user = userEvent.setup()
    const action = vi.fn(() => ({ error: null, messageId: "message-id" }))
    const RouterStub = createRoutesStub([
      {
        action,
        Component: () => <ChatThread {...createProps()} />,
        path: "/chat",
      },
    ])
    render(<RouterStub initialEntries={["/chat"]} />)
    const messageInput = screen.getByRole("textbox", { name: /message/i })

    await user.type(
      messageInput,
      "First line{Shift>}{Enter}{/Shift}Second line",
    )

    expect(messageInput).toHaveValue("First line\nSecond line")
    expect(action).not.toHaveBeenCalled()
  })
})
