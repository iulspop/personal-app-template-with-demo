import { style } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const item = style({
  alignItems: "center",
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.lg,
  display: "flex",
  gap: theme.space[3],
  padding: theme.space[4],
})

export const content = style({
  flex: 1,
})

export const completedTitle = style({
  color: theme.color.text.muted,
  textDecoration: "line-through",
})

export const description = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.sm,
  marginTop: theme.space[1],
})

export const toggleChecked = style({
  background: theme.color.intent.primary.background,
  borderColor: theme.color.intent.primary.background,
  color: theme.color.intent.primary.foreground,
})

export const checkIcon = style({
  height: "0.75rem",
  width: "0.75rem",
})

export const actionIcon = style({
  height: "1rem",
  width: "1rem",
})
