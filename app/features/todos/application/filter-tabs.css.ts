import { style } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const nav = style({
  display: "flex",
  gap: theme.space[2],
  marginBottom: theme.space[6],
})

export const link = style({
  background: theme.color.background.subtle,
  borderRadius: theme.radius.lg,
  color: theme.color.text.secondary,
  fontSize: theme.font.size.sm,
  padding: `${theme.space[1]} ${theme.space[3]}`,
  selectors: {
    "&:hover": {
      background: theme.color.border.default,
    },
  },
})

export const activeLink = style({
  background: theme.color.intent.primary.background,
  color: theme.color.intent.primary.foreground,
  selectors: {
    "&:hover": {
      background: theme.color.intent.primary.hover,
    },
  },
})
