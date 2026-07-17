import { afterEach, beforeEach, describe, expect, test } from "vitest"

import {
  claimOwnerSeat,
  countUnreadMessages,
  createChatMessage,
  markConversationRead,
  retrieveConversationForParticipant,
  retrieveConversationMessages,
  retrieveOrCreateConversation,
  retrieveOwnerConversationSummaries,
  updateUserPresence,
} from "./chat-model.server"
import { prisma } from "~/utils/db.server"

async function createUser(id: string) {
  return prisma.user.create({
    data: { email: `${id}@example.com`, emailVerifiedAt: new Date(), id },
  })
}

async function createConversation() {
  const owner = await createUser("owner")
  const user = await createUser("user")
  const conversation = await retrieveOrCreateConversation({
    ownerId: owner.id,
    userId: user.id,
  })
  return { conversation, owner, user }
}

async function cleanChatDatabase() {
  await prisma.chatNotification.deleteMany()
  await prisma.chatAttachment.deleteMany()
  await prisma.chatMessage.deleteMany()
  await prisma.chatConversation.deleteMany()
  await prisma.ownerClaim.deleteMany()
  await prisma.user.deleteMany()
}

beforeEach(cleanChatDatabase)
afterEach(cleanChatDatabase)

describe("owner claims", () => {
  test("given: an owner already exists, should: reject a second claim", async () => {
    const first = await createUser("first-owner")
    const second = await createUser("second-owner")
    await claimOwnerSeat(first.id)

    await expect(claimOwnerSeat(second.id)).rejects.toMatchObject({
      code: "P2002",
    })
  })
})

describe("conversation access", () => {
  test("given: another user, should: not expose the conversation", async () => {
    const { conversation } = await createConversation()
    const outsider = await createUser("outsider")

    const actual = await retrieveConversationForParticipant({
      conversationId: conversation.id,
      requesterId: outsider.id,
    })

    expect(actual).toEqual(null)
  })

  test("given: repeated creation, should: reuse the user's conversation", async () => {
    const { conversation, owner, user } = await createConversation()

    const actual = await retrieveOrCreateConversation({
      ownerId: owner.id,
      userId: user.id,
    })

    expect(actual.id).toEqual(conversation.id)
  })
})

describe("messages and read state", () => {
  test("given: messages from both participants, should: order and paginate them", async () => {
    const { conversation, owner, user } = await createConversation()
    const first = await createChatMessage({
      body: "First",
      conversationId: conversation.id,
      senderId: user.id,
    })
    const second = await createChatMessage({
      body: "Second",
      conversationId: conversation.id,
      senderId: owner.id,
    })
    await createChatMessage({
      body: "Third",
      conversationId: conversation.id,
      senderId: user.id,
    })

    const page = await retrieveConversationMessages({
      before: second?.id,
      conversationId: conversation.id,
      requesterId: user.id,
      take: 1,
    })

    expect(page?.messages.map(({ id }) => id)).toEqual([first?.id])
  })

  test("given: unread messages, should: clear them at the read watermark", async () => {
    const { conversation, owner, user } = await createConversation()
    await createChatMessage({
      body: "Hello",
      conversationId: conversation.id,
      senderId: user.id,
    })

    const before = await countUnreadMessages({
      conversationId: conversation.id,
      readerId: owner.id,
    })
    await markConversationRead({
      conversationId: conversation.id,
      readAt: new Date("2100-01-01T00:00:00.000Z"),
      readerId: owner.id,
    })
    const after = await countUnreadMessages({
      conversationId: conversation.id,
      readerId: owner.id,
    })

    expect({ after, before }).toEqual({ after: 0, before: 1 })
  })

  test("given: owner conversations, should: return unread summaries by activity", async () => {
    const { conversation, owner, user } = await createConversation()
    await createChatMessage({
      body: "Need help",
      conversationId: conversation.id,
      senderId: user.id,
    })

    const actual = await retrieveOwnerConversationSummaries(owner.id)

    expect(actual).toHaveLength(1)
    expect(actual[0]?.latestMessage?.body).toEqual("Need help")
    expect(actual[0]?.unreadCount).toEqual(1)
  })
})

describe("presence", () => {
  test("given: a heartbeat, should: persist last seen time", async () => {
    const user = await createUser("present-user")
    const expected = new Date("2026-07-17T15:00:00.000Z")

    const actual = await updateUserPresence(user.id, expected)

    expect(actual.lastSeenAt).toEqual(expected)
  })
})
