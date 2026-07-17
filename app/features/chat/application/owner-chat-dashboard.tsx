import { Link } from "react-router"

import { formatPresence } from "../domain/chat-domain"
import * as s from "./owner-chat-dashboard.css"

export type OwnerConversationSummary = {
  id: string
  latestMessage: { body: string; createdAt: string } | null
  unreadCount: number
  user: { email: string; lastSeenAt: string | null }
}

export function OwnerChatDashboard({
  conversations,
}: {
  conversations: OwnerConversationSummary[]
}) {
  return (
    <main className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>Chat dashboard</h1>
          <p className={s.subtitle}>Private conversations with your users</p>
        </div>
        <Link className={s.backLink} to="/">
          Back to todos
        </Link>
      </header>

      {conversations.length === 0 ? (
        <p className={s.empty}>No user conversations yet.</p>
      ) : (
        <ul className={s.list}>
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Link
                className={s.conversation}
                to={`/owner/chats/${conversation.id}`}
              >
                <span className={s.conversationMain}>
                  <strong>{conversation.user.email}</strong>
                  <span className={s.preview}>
                    {conversation.latestMessage?.body || "Attachment"}
                  </span>
                </span>
                <span className={s.metadata}>
                  <span>
                    {formatPresence(
                      conversation.user.lastSeenAt
                        ? new Date(conversation.user.lastSeenAt)
                        : null,
                    )}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <span className={s.badge}>
                      {conversation.unreadCount} unread
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
