import { style } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const item = style({
  border: `1px solid ${theme.color.focus}`,
  borderRadius: theme.radius.lg,
  padding: theme.space[4],
})

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[3],
})

export const actions = style({
  display: "flex",
  gap: theme.space[2],
})
