import { style } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const errorPage = style({
  marginInline: "auto",
  maxWidth: theme.layout.contentWidth,
  padding: `${theme.space[16]} ${theme.space[4]} ${theme.space[4]}`,
})

export const stackTrace = style({
  overflowX: "auto",
  padding: theme.space[4],
  width: "100%",
})
