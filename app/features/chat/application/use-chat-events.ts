import { useEffect } from "react"
import { useRevalidator } from "react-router"

export function useChatEvents(
  onEvent?: (data: { unreadCount: number }) => void,
) {
  const revalidator = useRevalidator()
  useEffect(() => {
    const events = new EventSource("/chat/events")
    const handleEvent = (event: MessageEvent) => {
      const data = JSON.parse(event.data) as { unreadCount: number }
      onEvent?.(data)
      void revalidator.revalidate()
    }
    events.addEventListener("chat", handleEvent)
    return () => events.close()
  }, [onEvent, revalidator])
}
