import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

import {
  deleteAllChatData,
  loginAsTestUser,
  setupChatOwner,
} from "../auth-utils"

test.describe("owner live chat", () => {
  test.beforeEach(async () => {
    await deleteAllChatData()
  })

  test.afterEach(async () => {
    await deleteAllChatData()
  })

  test("given: a user and owner, should: exchange private messages", async ({
    browser,
  }) => {
    const suffix = Date.now()
    const ownerEmail = `owner-${suffix}@example.com`
    const userEmail = `user-${suffix}@example.com`
    await setupChatOwner(ownerEmail)

    const userContext = await browser.newContext()
    const ownerContext = await browser.newContext()
    const userPage = await userContext.newPage()
    const ownerPage = await ownerContext.newPage()

    try {
      await loginAsTestUser(userPage, { email: userEmail })
      await loginAsTestUser(ownerPage, { email: ownerEmail })

      await test.step("user sends a message", async () => {
        await userPage.goto("/chat")
        await userPage
          .getByRole("textbox", { name: /message/i })
          .fill("Hello owner")
        await userPage.getByRole("button", { name: /send message/i }).click()
        await expect(userPage.getByText("Hello owner")).toBeVisible()
      })

      await test.step("owner receives and replies", async () => {
        await ownerPage.goto("/owner/chats")
        await expect(ownerPage.getByText(userEmail)).toBeVisible()
        await ownerPage
          .getByRole("link", { name: new RegExp(userEmail, "i") })
          .click()
        await expect(ownerPage.getByText("Hello owner")).toBeVisible()
        await ownerPage
          .getByRole("textbox", { name: /message/i })
          .fill("Hello user")
        await ownerPage.getByRole("button", { name: /send message/i }).click()
        await expect(ownerPage.getByText("Hello user")).toBeVisible()
      })

      await test.step("user receives the reply", async () => {
        await userPage.reload()
        await expect(userPage.getByText("Hello user")).toBeVisible()
      })
    } finally {
      await userContext.close()
      await ownerContext.close()
    }
  })

  test("given: the chat composer, should: have no automatic accessibility violations", async ({
    page,
  }) => {
    const suffix = Date.now()
    await setupChatOwner(`owner-a11y-${suffix}@example.com`)
    await loginAsTestUser(page, { email: `user-a11y-${suffix}@example.com` })
    await page.goto("/chat")

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
})
