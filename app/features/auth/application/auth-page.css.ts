import { style } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const page = style({
  marginInline: "auto",
  maxWidth: theme.layout.authWidth,
  padding: `${theme.space[16]} ${theme.space[4]}`,
})

export const logo = style({
  borderRadius: theme.radius.lg,
  height: "3rem",
  margin: `0 auto ${theme.space[8]}`,
  width: "3rem",
})

export const heading = style({
  color: theme.color.text.primary,
  fontSize: theme.font.size["4xl"],
  fontWeight: theme.font.weight.bold,
  lineHeight: theme.font.lineHeight.tight,
  marginBottom: theme.space[2],
  textAlign: "center",
})

export const subcopy = style({
  color: theme.color.text.muted,
  marginBottom: theme.space[8],
  textAlign: "center",
})

export const stack = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[4],
})

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[3],
})

export const fullWidth = style({
  width: "100%",
})

export const icon = style({
  height: "1.25rem",
  width: "1.25rem",
})

export const divider = style({
  alignItems: "center",
  color: theme.color.text.muted,
  display: "flex",
  fontSize: theme.font.size.sm,
  gap: theme.space[3],
  paddingBlock: theme.space[2],
})

export const dividerLine = style({
  background: theme.color.border.default,
  flex: 1,
  height: "1px",
})

export const textAction = style({
  background: "transparent",
  color: theme.color.text.muted,
  marginInline: "auto",
  selectors: {
    "&:hover": {
      background: "transparent",
      color: theme.color.text.primary,
    },
  },
  width: "fit-content",
})

export const footer = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.sm,
  marginTop: theme.space[8],
  textAlign: "center",
})

export const footerLink = style({
  color: theme.color.text.link,
  fontWeight: theme.font.weight.medium,
})
