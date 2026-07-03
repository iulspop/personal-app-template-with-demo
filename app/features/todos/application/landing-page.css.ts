import { style, styleVariants } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const page = style({
  background: theme.color.background.canvas,
  color: theme.color.text.primary,
  minHeight: "100vh",
})

export const shell = style({
  marginInline: "auto",
  maxWidth: "72rem",
  padding: `${theme.space[6]} ${theme.space[4]} ${theme.space[12]}`,
})

export const nav = style({
  alignItems: "center",
  display: "flex",
  gap: theme.space[4],
  justifyContent: "space-between",
  marginBottom: theme.space[12],
})

export const brand = style({
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.bold,
  letterSpacing: "-0.02em",
})

export const navActions = style({
  alignItems: "center",
  display: "flex",
  gap: theme.space[3],
})

const linkButtonBase = style({
  alignItems: "center",
  border: "1px solid transparent",
  borderRadius: theme.radius.md,
  display: "inline-flex",
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
  justifyContent: "center",
  lineHeight: theme.font.lineHeight.normal,
  minHeight: "2.25rem",
  padding: `0 ${theme.space[3]}`,
  selectors: {
    "&:focus-visible": {
      borderColor: theme.color.focus,
      boxShadow: theme.shadow.focus,
      outline: "none",
    },
  },
  textDecoration: "none",
  transition: `background ${theme.duration.normal} ${theme.easing.standard}, border-color ${theme.duration.normal} ${theme.easing.standard}, color ${theme.duration.normal} ${theme.easing.standard}, box-shadow ${theme.duration.normal} ${theme.easing.standard}`,
  whiteSpace: "nowrap",
})

export const linkButton = styleVariants({
  default: [
    linkButtonBase,
    {
      background: theme.color.intent.primary.background,
      color: theme.color.intent.primary.foreground,
      selectors: {
        "&:hover": { background: theme.color.intent.primary.hover },
      },
    },
  ],
  ghost: [
    linkButtonBase,
    {
      background: "transparent",
      color: theme.color.text.secondary,
      selectors: {
        "&:hover": {
          background: theme.color.background.subtle,
          color: theme.color.text.primary,
        },
      },
    },
  ],
  outline: [
    linkButtonBase,
    {
      background: theme.color.background.card,
      borderColor: theme.color.border.default,
      boxShadow: theme.shadow.xs,
      color: theme.color.text.primary,
      selectors: {
        "&:hover": { background: theme.color.background.subtle },
      },
    },
  ],
})

export const largeLinkButton = style({
  minHeight: "2.5rem",
  padding: `0 ${theme.space[4]}`,
})

export const hero = style({
  "@media": {
    "(min-width: 900px)": {
      gridTemplateColumns: "minmax(0, 1.05fr) minmax(20rem, 0.95fr)",
    },
  },
  display: "grid",
  gap: theme.space[10],
  gridTemplateColumns: "minmax(0, 1fr)",
})

export const eyebrow = style({
  color: theme.color.text.link,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.semibold,
  marginBottom: theme.space[3],
})

export const title = style({
  fontSize: "clamp(2.25rem, 7vw, 4.75rem)",
  fontWeight: theme.font.weight.bold,
  letterSpacing: "-0.06em",
  lineHeight: "0.95",
  marginBottom: theme.space[5],
})

export const lead = style({
  color: theme.color.text.secondary,
  fontSize: theme.font.size.lg,
  lineHeight: theme.font.lineHeight.relaxed,
  marginBottom: theme.space[6],
  maxWidth: "38rem",
})

export const ctaRow = style({
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: theme.space[3],
  marginBottom: theme.space[4],
})

export const reassurance = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.sm,
})

export const previewCard = style({
  background: theme.color.background.card,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.sm,
  padding: theme.space[5],
})

export const previewHeader = style({
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.space[5],
})

export const previewTitle = style({
  fontWeight: theme.font.weight.semibold,
})

export const previewMeta = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.sm,
})

export const taskList = style({
  display: "grid",
  gap: theme.space[3],
})

export const task = style({
  alignItems: "center",
  background: theme.color.background.subtle,
  borderRadius: theme.radius.lg,
  display: "grid",
  gap: theme.space[3],
  gridTemplateColumns: "auto 1fr auto",
  padding: theme.space[3],
})

export const checkbox = style({
  background: theme.color.intent.primary.background,
  borderRadius: theme.radius.sm,
  height: "1rem",
  width: "1rem",
})

export const taskText = style({
  fontWeight: theme.font.weight.medium,
})

export const taskStatus = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.xs,
})

export const sections = style({
  "@media": {
    "(min-width: 760px)": {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    },
  },
  display: "grid",
  gap: theme.space[4],
  gridTemplateColumns: "minmax(0, 1fr)",
  marginTop: theme.space[12],
})

export const sectionCard = style({
  background: theme.color.background.card,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.lg,
  padding: theme.space[5],
})

export const sectionTitle = style({
  fontSize: theme.font.size.lg,
  fontWeight: theme.font.weight.semibold,
  marginBottom: theme.space[2],
})

export const sectionCopy = style({
  color: theme.color.text.secondary,
  lineHeight: theme.font.lineHeight.relaxed,
})
