import { style } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const page = style({
  marginInline: "auto",
  maxWidth: "56rem",
  padding: `${theme.space[8]} ${theme.space[4]}`,
})
export const header = style({
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.space[6],
})
export const title = style({
  color: theme.color.text.primary,
  fontSize: theme.font.size["3xl"],
  fontWeight: theme.font.weight.bold,
})
export const subtitle = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.sm,
  marginTop: theme.space[1],
})
export const backLink = style({
  color: theme.color.text.primary,
  fontSize: theme.font.size.sm,
})
export const empty = style({
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.lg,
  color: theme.color.text.muted,
  padding: theme.space[8],
  textAlign: "center",
})
export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
  listStyle: "none",
  padding: 0,
})
export const conversation = style({
  alignItems: "center",
  background: theme.color.background.card,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.lg,
  color: theme.color.text.primary,
  display: "flex",
  gap: theme.space[4],
  justifyContent: "space-between",
  padding: theme.space[4],
  textDecoration: "none",
})
export const conversationMain = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[1],
  minWidth: 0,
})
export const preview = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.sm,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})
export const metadata = style({
  alignItems: "flex-end",
  color: theme.color.text.muted,
  display: "flex",
  flexDirection: "column",
  fontSize: theme.font.size.xs,
  gap: theme.space[2],
})
export const badge = style({
  background: theme.color.background.subtle,
  borderRadius: theme.radius.full,
  color: theme.color.text.primary,
  padding: `${theme.space[1]} ${theme.space[2]}`,
})
