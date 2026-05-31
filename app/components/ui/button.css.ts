import { style, styleVariants } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const button = style({
  alignItems: "center",
  border: "1px solid transparent",
  borderRadius: theme.radius.md,
  display: "inline-flex",
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
  gap: theme.space[2],
  justifyContent: "center",
  lineHeight: theme.font.lineHeight.normal,
  outline: "none",
  selectors: {
    "&:disabled": {
      opacity: 0.5,
      pointerEvents: "none",
    },
    "&:focus-visible": {
      borderColor: theme.color.focus,
      boxShadow: theme.shadow.focus,
    },
  },
  transition: `background ${theme.duration.normal} ${theme.easing.standard}, border-color ${theme.duration.normal} ${theme.easing.standard}, color ${theme.duration.normal} ${theme.easing.standard}, box-shadow ${theme.duration.normal} ${theme.easing.standard}`,
  userSelect: "none",
  whiteSpace: "nowrap",
})

export const variant = styleVariants({
  default: {
    background: theme.color.intent.primary.background,
    color: theme.color.intent.primary.foreground,
    selectors: {
      "&:hover": { background: theme.color.intent.primary.hover },
    },
  },
  destructive: {
    background: theme.color.background.subtle,
    color: theme.color.text.danger,
    selectors: {
      "&:hover": {
        background: theme.color.intent.danger.background,
        color: theme.color.intent.danger.foreground,
      },
    },
  },
  ghost: {
    background: "transparent",
    color: theme.color.text.secondary,
    selectors: {
      "&:hover": {
        background: theme.color.background.subtle,
        color: theme.color.text.primary,
      },
    },
  },
  link: {
    background: "transparent",
    color: theme.color.text.link,
    height: "auto",
    padding: 0,
    selectors: {
      "&:hover": { textDecoration: "underline" },
    },
  },
  outline: {
    background: theme.color.background.card,
    borderColor: theme.color.border.default,
    boxShadow: theme.shadow.xs,
    color: theme.color.text.primary,
    selectors: {
      "&:hover": { background: theme.color.background.subtle },
    },
  },
  secondary: {
    background: theme.color.background.subtle,
    color: theme.color.text.primary,
    selectors: {
      "&:hover": { background: theme.color.border.default },
    },
  },
})

export const size = styleVariants({
  default: { minHeight: "2.25rem", padding: `0 ${theme.space[3]}` },
  icon: { height: "2.25rem", padding: 0, width: "2.25rem" },
  "icon-lg": { height: "2.5rem", padding: 0, width: "2.5rem" },
  "icon-sm": { height: "2rem", padding: 0, width: "2rem" },
  "icon-xs": { height: "1.5rem", padding: 0, width: "1.5rem" },
  lg: { minHeight: "2.5rem", padding: `0 ${theme.space[4]}` },
  sm: { minHeight: "2rem", padding: `0 ${theme.space[3]}` },
  xs: {
    fontSize: theme.font.size.xs,
    minHeight: "1.5rem",
    padding: `0 ${theme.space[2]}`,
  },
})
