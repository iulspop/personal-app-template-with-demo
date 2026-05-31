import { style, styleVariants } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const card = style({
  background: theme.color.background.card,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.xs,
  color: theme.color.text.primary,
  display: "flex",
  flexDirection: "column",
  fontSize: theme.font.size.sm,
  overflow: "hidden",
})

export const cardSize = styleVariants({
  default: { gap: theme.space[6], paddingBlock: theme.space[6] },
  sm: { gap: theme.space[4], paddingBlock: theme.space[4] },
})

export const header = style({
  display: "grid",
  gap: theme.space[1],
  paddingInline: theme.space[6],
})

export const title = style({
  fontSize: theme.font.size.base,
  fontWeight: theme.font.weight.medium,
  lineHeight: theme.font.lineHeight.normal,
})

export const description = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.sm,
})

export const action = style({
  alignSelf: "start",
  gridColumnStart: 2,
  gridRow: "1 / span 2",
  justifySelf: "end",
})

export const content = style({
  paddingInline: theme.space[6],
})

export const footer = style({
  alignItems: "center",
  display: "flex",
  paddingInline: theme.space[6],
})
