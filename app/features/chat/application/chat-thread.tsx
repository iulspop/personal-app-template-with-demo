import { useEffect, useRef, useState } from "react"
import { Link, useFetcher } from "react-router"

import * as s from "./chat-thread.css"
import { useChatEvents } from "./use-chat-events"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { CHAT_SEND_MESSAGE_INTENT } from "~/features/chat/domain/chat-constants"

export type ChatThreadMessage = {
  attachments: Array<{ id: string; originalName: string }>
  body: string
  createdAt: string
  id: string
  isMine: boolean
  isRead: boolean
}

export function ChatThread({
  backTo,
  messages,
  participant,
  presence,
  title,
}: {
  backTo: string
  messages: ChatThreadMessage[]
  participant: string
  presence: string
  title: string
}) {
  const [announcement, setAnnouncement] = useState("")
  const composerRef = useRef<HTMLFormElement>(null)
  const fetcher = useFetcher<{ error: string | null; messageId?: string }>()
  useChatEvents(() => setAnnouncement("Conversation updated."))

  useEffect(() => {
    if (fetcher.data?.error === null) composerRef.current?.reset()
  }, [fetcher.data])

  return (
    <main className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>{title}</h1>
          <p className={s.presence}>
            {participant} · {presence}
          </p>
        </div>
        <Link className={s.backLink} to={backTo}>
          Back
        </Link>
      </header>
      <ol aria-label="Chat messages" className={s.messages}>
        {messages.length === 0 && (
          <li className={s.empty}>No messages yet. Start the conversation.</li>
        )}
        {messages.map((message) => (
          <li className={message.isMine ? s.mine : s.theirs} key={message.id}>
            {message.body && <p className={s.body}>{message.body}</p>}
            {message.attachments.map((attachment) => (
              <a
                className={s.attachment}
                href={`/chat/attachments/${attachment.id}`}
                key={attachment.id}
              >
                {attachment.originalName}
              </a>
            ))}
            <small className={s.receipt}>
              {new Date(message.createdAt).toLocaleString()}
              {message.isMine && message.isRead ? " · Read" : ""}
            </small>
          </li>
        ))}
      </ol>
      <fetcher.Form
        className={s.composer}
        encType="multipart/form-data"
        method="post"
        ref={composerRef}
      >
        <label className={s.label} htmlFor="chat-message">
          Message
        </label>
        <Textarea id="chat-message" maxLength={4000} name="body" rows={3} />
        <label className={s.label} htmlFor="chat-files">
          Attachments (PNG, JPEG, WebP, or PDF; up to 10 MB each)
        </label>
        <input
          accept="image/png,image/jpeg,image/webp,application/pdf"
          id="chat-files"
          multiple
          name="attachments"
          type="file"
        />
        <Button
          disabled={fetcher.state !== "idle"}
          name="intent"
          type="submit"
          value={CHAT_SEND_MESSAGE_INTENT}
        >
          Send message
        </Button>
      </fetcher.Form>
      <div aria-live="polite" className={s.liveRegion}>
        {announcement}
      </div>
    </main>
  )
}
