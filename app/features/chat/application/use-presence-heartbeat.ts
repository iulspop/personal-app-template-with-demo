import { useEffect } from "react"

import { CHAT_PRESENCE_HEARTBEAT_MS } from "../domain/chat-constants"

export function usePresenceHeartbeat() {
  useEffect(() => {
    const heartbeat = () => {
      if (document.visibilityState === "visible")
        void fetch("/chat/presence", { method: "post" })
    }
    heartbeat()
    const interval = window.setInterval(heartbeat, CHAT_PRESENCE_HEARTBEAT_MS)
    document.addEventListener("visibilitychange", heartbeat)
    window.addEventListener("focus", heartbeat)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener("visibilitychange", heartbeat)
      window.removeEventListener("focus", heartbeat)
    }
  }, [])
}
