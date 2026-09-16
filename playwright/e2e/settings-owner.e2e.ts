import { expect, test } from "@playwright/test"

import {
  deleteAllChatData,
  loginAsTestUser,
  setupChatOwner,
} from "../auth-utils"

test.describe("settings owner access", () => {
  test.beforeEach(async () => deleteAllChatData())
  test.afterEach(async () => deleteAllChatData())

  test("given: a regular user, should: hide founder chat settings", async ({
    page,
  }) => {
    await loginAsTestUser(page)
    await page.goto("/settings")
    await expect(
      page.getByRole("heading", { exact: true, name: "Settings" }),
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { name: "Founder chat" }),
    ).toBeHidden()
    await expect(
      page.getByRole("link", { exact: true, name: "Founder chat" }),
    ).toBeHidden()
    await expect(
      page.getByRole("link", { name: /claim owner access/i }),
    ).toBeHidden()
    await expect(page.getByText(/regular user/i)).toBeHidden()
  })

  test("given: a claimed owner, should: show dashboard and notification settings", async ({
    page,
  }) => {
    const { email } = await setupChatOwner(
      `settings-owner-${Date.now()}@example.com`,
    )
    await loginAsTestUser(page, { email })
    await page.goto("/settings")
    await expect(page.getByText("Status: Owner", { exact: true })).toBeVisible()
    await expect(page.getByText(/email notifications:/i)).toBeVisible()
    await expect(
      page.getByRole("link", { name: /claim owner access/i }),
    ).toBeHidden()
    await page.getByRole("link", { name: "Open chat dashboard" }).click()
    await expect(page).toHaveURL(/\/owner\/chats$/)
  })
})
