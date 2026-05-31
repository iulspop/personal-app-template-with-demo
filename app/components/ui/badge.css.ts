import { style, styleVariants } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const badge = style({
  alignItems: "center",
  border: "1px solid transparent",
  borderRadius: theme.radius.full,
  display: "inline-flex",
  flexShrink: 0,
  fontSize: theme.font.size.xs,
  fontWeight: theme.font.weight.medium,
  gap: theme.space[1],
  height: "1.25rem",
  justifyContent: "center",
  overflow: "hidden",
  padding: `0 ${theme.space[2]}`,
  selectors: {
    "&:focus-visible": {
      borderColor: theme.color.focus,
      boxShadow: theme.shadow.focus,
    },
  },
  transition: `background ${theme.duration.normal} ${theme.easing.standard}, color ${theme.duration.normal} ${theme.easing.standard}`,
  whiteSpace: "nowrap",
  width: "fit-content",
})

export const variant = styleVariants({
  default: {
    background: theme.color.intent.primary.background,
    color: theme.color.intent.primary.foreground,
  },
  destructive: {
    background: theme.color.background.subtle,
    color: theme.color.text.danger,
  },
  ghost: {
    color: theme.color.text.secondary,
  },
  link: {
    color: theme.color.text.link,
    textDecoration: "underline",
    textUnderlineOffset: "4px",
  },
  outline: {
    borderColor: theme.color.border.default,
    color: theme.color.text.primary,
  },
  secondary: {
    background: theme.color.background.subtle,
    color: theme.color.text.secondary,
  },
})
