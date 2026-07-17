import { redirect } from "react-router"

import type { Route } from "./+types/chat"
import { requireUserId } from "~/features/auth/application/auth-session.server"
import {
  formatPresence,
  handleChatMessageAction,
  markConversationRead,
  serializeChatThread,
} from "~/features/chat/application/chat-route.server"
import { ChatThread } from "~/features/chat/application/chat-thread"
import {
  retrieveConversationMessages,
  retrieveOrCreateConversation,
  retrieveOwnerClaim,
  retrieveOwnerStatusForUser,
} from "~/features/chat/infrastructure/chat-model.server"
import { notifyOwnerOfChatMessage } from "~/features/chat/infrastructure/chat-notifications.server"
import { retrieveUserFromDatabaseById } from "~/features/users/infrastructure/users-model.server"

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request)
  if (await retrieveOwnerStatusForUser(userId)) throw redirect("/owner/chats")
  const ownerClaim = await retrieveOwnerClaim()
  if (!ownerClaim)
    return { ownerAvailable: false as const, pageTitle: "Chat with owner" }

  const conversation = await retrieveOrCreateConversation({
    ownerId: ownerClaim.userId,
    userId,
  })
  const thread = await retrieveConversationMessages({
    conversationId: conversation.id,
    requesterId: userId,
  })
  if (!thread) throw new Response("Not found", { status: 404 })
  await markConversationRead({
    conversationId: conversation.id,
    readerId: userId,
  })
  return {
    messages: serializeChatThread({ ...thread, requesterId: userId }),
    ownerAvailable: true as const,
    ownerEmail: ownerClaim.user.email,
    ownerPresence: formatPresence(ownerClaim.user.lastSeenAt),
    pageTitle: "Chat with owner",
  }
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await requireUserId(request)
  const ownerClaim = await retrieveOwnerClaim()
  if (!ownerClaim || ownerClaim.userId === userId)
    throw new Response("Not found", { status: 404 })
  const conversation = await retrieveOrCreateConversation({
    ownerId: ownerClaim.userId,
    userId,
  })
  const result = await handleChatMessageAction({
    conversationId: conversation.id,
    request,
    senderId: userId,
  })
  if (result.data.error === null) {
    const sender = await retrieveUserFromDatabaseById(userId)
    if (sender)
      void notifyOwnerOfChatMessage({
        dashboardUrl: `${process.env.APP_URL ?? new URL(request.url).origin}/owner/chats/${conversation.id}`,
        messageId: result.data.messageId,
        ownerEmail: ownerClaim.user.email,
        ownerId: ownerClaim.userId,
        senderEmail: sender.email,
      })
  }
  return result
}

export default function ChatRoute({ loaderData }: Route.ComponentProps) {
  if (!loaderData.ownerAvailable)
    return (
      <main>
        <h1>Chat with owner</h1>
        <p>The owner has not enabled chat yet.</p>
      </main>
    )
  return (
    <ChatThread
      backTo="/"
      messages={loaderData.messages}
      participant={loaderData.ownerEmail}
      presence={loaderData.ownerPresence}
      title="Chat with owner"
    />
  )
}
