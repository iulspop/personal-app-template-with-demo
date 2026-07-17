import { useCallback, useState } from "react"

import { useChatEvents } from "./use-chat-events"
import { usePresenceHeartbeat } from "./use-presence-heartbeat"

export function ChatNotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [announcement, setAnnouncement] = useState("")
  const handleEvent = useCallback((data: { unreadCount: number }) => {
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
      <div
        aria-live="polite"
        style={{
          height: 1,
          overflow: "hidden",
          position: "absolute",
          width: 1,
        }}
      >
        {announcement}
      </div>
    </>
  )
}
