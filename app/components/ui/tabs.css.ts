import { style, styleVariants } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const root = style({
  display: "flex",
  gap: theme.space[2],
  selectors: {
    '&[data-orientation="horizontal"]': {
      flexDirection: "column",
    },
  },
})

export const list = style({
  alignItems: "center",
  borderRadius: theme.radius.lg,
  color: theme.color.text.muted,
  display: "inline-flex",
  justifyContent: "center",
  padding: "3px",
  width: "fit-content",
})

export const listVariant = styleVariants({
  default: {
    background: theme.color.background.subtle,
  },
  line: {
    background: "transparent",
    borderRadius: 0,
    gap: theme.space[1],
  },
})

export const trigger = style({
  alignItems: "center",
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: theme.radius.md,
  color: theme.color.text.muted,
  display: "inline-flex",
  flex: 1,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
  gap: theme.space[2],
  justifyContent: "center",
  outline: "none",
  padding: `${theme.space[1]} ${theme.space[2]}`,
  position: "relative",
  selectors: {
    "&:disabled": {
      opacity: 0.5,
      pointerEvents: "none",
    },
    "&:focus-visible": {
      borderColor: theme.color.focus,
      boxShadow: theme.shadow.focus,
    },
    "&:hover": { color: theme.color.text.primary },
    "&[data-active]": {
      background: theme.color.background.card,
      boxShadow: theme.shadow.sm,
      color: theme.color.text.primary,
    },
  },
  transition: `background ${theme.duration.normal} ${theme.easing.standard}, color ${theme.duration.normal} ${theme.easing.standard}`,
  whiteSpace: "nowrap",
})

export const content = style({
  flex: 1,
  fontSize: theme.font.size.sm,
  outline: "none",
})
