import twilio from "twilio"

import type { ChatDeliveryResult } from "./chat-email.server"

export function isOwnerChatSmsConfigured(recipientPhone?: string) {
  return Boolean(
    recipientPhone &&
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER,
  )
}

export async function sendOwnerChatSms({
  dashboardUrl,
  recipientPhone,
}: {
  dashboardUrl: string
  recipientPhone: string
}): Promise<ChatDeliveryResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER
  if (!isOwnerChatSmsConfigured(recipientPhone))
    return { delivered: false, errorCode: "SMS_NOT_CONFIGURED" }

  try {
    const message = await twilio(accountSid, authToken).messages.create({
      body: `You have a new private chat message. Open the secure dashboard: ${dashboardUrl}`,
      from,
      to: recipientPhone,
    })
    return { delivered: true, providerId: message.sid }
  } catch (error) {
    const errorCode =
      typeof error === "object" && error && "code" in error
        ? `TWILIO_${String(error.code)}`
        : "SMS_FAILED"
    return { delivered: false, errorCode }
  }
}
