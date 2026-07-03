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

export const backLink = style({
  alignItems: "center",
  background: theme.color.background.card,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.md,
  color: theme.color.text.primary,
  display: "inline-flex",
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
  height: "2.25rem",
  justifyContent: "center",
  paddingInline: theme.space[3],
  textDecoration: "none",
})

export const title = style({
  color: theme.color.text.primary,
  fontSize: theme.font.size["3xl"],
  fontWeight: theme.font.weight.bold,
  lineHeight: theme.font.lineHeight.tight,
})

export const card = style({
  background: theme.color.background.card,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.lg,
  color: theme.color.text.primary,
  padding: theme.space[4],
})

export const cardHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[1],
  marginBottom: theme.space[4],
})

export const cardTitle = style({
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
})

export const cardBody = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.sm,
})

export const passkeyList = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
  listStyle: "none",
  marginTop: theme.space[4],
  padding: 0,
})

export const passkeyItem = style({
  alignItems: "center",
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.md,
  display: "flex",
  fontSize: theme.font.size.sm,
  gap: theme.space[3],
  justifyContent: "space-between",
  padding: theme.space[3],
})

export const action = style({
  marginTop: theme.space[4],
})

export const status = style({
  fontSize: theme.font.size.sm,
  marginTop: theme.space[3],
})

export const success = style({
  color: theme.color.text.primary,
})
