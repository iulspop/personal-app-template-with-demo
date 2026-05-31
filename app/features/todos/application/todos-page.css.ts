import { style } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const page = style({
  marginInline: "auto",
  maxWidth: theme.layout.contentWidth,
  padding: `${theme.space[8]} ${theme.space[4]}`,
})

export const header = style({
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.space[8],
})

export const title = style({
  color: theme.color.text.primary,
  fontSize: theme.font.size["3xl"],
  fontWeight: theme.font.weight.bold,
  lineHeight: theme.font.lineHeight.tight,
})

export const notice = style({
  background: theme.color.background.card,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.lg,
  color: theme.color.text.primary,
  marginBottom: theme.space[8],
  padding: theme.space[4],
})

export const noticeTitle = style({
  fontWeight: theme.font.weight.semibold,
})

export const noticeBody = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.sm,
  marginTop: theme.space[1],
})

export const noticeAction = style({
  marginTop: theme.space[3],
})

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[4],
  marginBottom: theme.space[8],
})

export const emptyState = style({
  color: theme.color.text.muted,
  textAlign: "center",
})

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
})

export const footer = style({
  alignItems: "center",
  color: theme.color.text.muted,
  display: "flex",
  fontSize: theme.font.size.sm,
  justifyContent: "space-between",
  marginTop: theme.space[6],
})

export const dangerAction = style({
  color: theme.color.text.danger,
})
