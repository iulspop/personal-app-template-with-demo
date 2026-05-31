import { style } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const input = style({
  background: "transparent",
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.md,
  boxShadow: theme.shadow.xs,
  color: theme.color.text.primary,
  fontSize: theme.font.size.sm,
  minHeight: "2.25rem",
  minWidth: 0,
  outline: "none",
  padding: `${theme.space[1]} ${theme.space[3]}`,
  selectors: {
    "&::placeholder": { color: theme.color.text.muted },
    "&:disabled": {
      opacity: 0.5,
      pointerEvents: "none",
    },
    "&:focus-visible": {
      borderColor: theme.color.focus,
      boxShadow: theme.shadow.focus,
    },
    "&[aria-invalid='true']": {
      borderColor: theme.color.intent.danger.background,
      boxShadow: "0 0 0 3px rgb(220 38 38 / 0.2)",
    },
  },
  transition: `border-color ${theme.duration.normal} ${theme.easing.standard}, box-shadow ${theme.duration.normal} ${theme.easing.standard}`,
  width: "100%",
})

export const textarea = style([
  input,
  {
    minHeight: "4rem",
    paddingBlock: theme.space[2],
    resize: "vertical",
  },
])
