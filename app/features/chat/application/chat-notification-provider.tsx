import { useCallback, useState } from "react"

import * as s from "./chat-notification-provider.css"
import { useChatEvents } from "./use-chat-events"
import { usePresenceHeartbeat } from "./use-presence-heartbeat"

export function ChatNotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [announcement, setAnnouncement] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)

  const handleEvent = useCallback((data: { unreadCount: number }) => {
    setUnreadCount(data.unreadCount)
    setAnnouncement(
      data.unreadCount > 0
        ? `You have ${data.unreadCount} unread chat messages.`
        : "Chat updated.",
    )
  }, [])

  useChatEvents(handleEvent)
  usePresenceHeartbeat()

  return (
    <>
      {children}
      <div aria-live="polite" className={s.visuallyHidden}>
        {announcement}
      </div>
      {unreadCount > 0 && (
        <aside aria-label="Chat notification" className={s.toast}>
          <p className={s.title}>New founder chat activity</p>
          <p className={s.detail}>
            {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
          </p>
          <button
            className={s.dismiss}
            onClick={() => setUnreadCount(0)}
            type="button"
          >
            Dismiss
          </button>
        </aside>
      )}
    </>
  )
}
