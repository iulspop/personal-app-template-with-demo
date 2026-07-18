import { globalStyle, style } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const page = style({
  "@media": {
    "(max-width: 40rem)": {
      borderInline: 0,
      borderRadius: 0,
      height: "calc(100dvh - 6.75rem - env(safe-area-inset-bottom))",
      minHeight: "26rem",
    },
    "(min-width: 64.01rem)": {
      height: "min(46rem, calc(100dvh - 4rem))",
      maxWidth: "52rem",
    },
  },
  background: theme.color.background.card,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.lg,
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr) auto",
  height: "calc(100dvh - 7rem - env(safe-area-inset-bottom))",
  marginInline: "auto",
  minHeight: "34rem",
  overflow: "hidden",
  width: "100%",
})

export const header = style({
  alignItems: "center",
  borderBottom: `1px solid ${theme.color.border.subtle}`,
  display: "grid",
  gap: theme.space[3],
  gridTemplateColumns: "2.25rem 2rem minmax(0, 1fr)",
  minHeight: "3.75rem",
  padding: `${theme.space[2]} ${theme.space[3]}`,
})

export const backLink = style({
  alignItems: "center",
  borderRadius: theme.radius.md,
  color: theme.color.icon.default,
  display: "inline-flex",
  height: "2.25rem",
  justifyContent: "center",
  selectors: {
    "&:hover": { background: theme.color.background.subtle },
  },
  textDecoration: "none",
  width: "2.25rem",
})

export const avatar = style({
  alignItems: "center",
  background: theme.color.background.subtle,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.full,
  color: theme.color.text.secondary,
  display: "inline-flex",
  fontSize: theme.font.role.supporting,
  fontWeight: theme.font.weight.semibold,
  height: "2rem",
  justifyContent: "center",
  width: "2rem",
})

export const identity = style({ minWidth: 0 })
export const title = style({
  color: theme.color.text.primary,
  fontSize: theme.font.role.sectionTitle,
  fontWeight: theme.font.weight.semibold,
  lineHeight: theme.font.lineHeight.compact,
})
export const presence = style({
  alignItems: "center",
  color: theme.color.text.muted,
  display: "flex",
  fontSize: theme.font.role.metadata,
  gap: theme.space[1],
  lineHeight: theme.font.lineHeight.compact,
  minWidth: 0,
})
export const participant = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})
export const presenceDot = style({
  background: theme.color.intent.success.background,
  borderRadius: theme.radius.full,
  flex: "0 0 auto",
  height: "0.4rem",
  marginRight: theme.space[1],
  width: "0.4rem",
})

export const messages = style({
  "@media": {
    "(max-width: 40rem)": {
      padding: `${theme.space[4]} ${theme.space[3]}`,
    },
    "(prefers-reduced-motion: reduce)": { scrollBehavior: "auto" },
  },
  display: "flex",
  flexDirection: "column",
  gap: theme.space[1],
  listStyle: "none",
  overflowY: "auto",
  padding: `${theme.space[5]} clamp(${theme.space[4]}, 6vw, 3.5rem)`,
  scrollBehavior: "smooth",
})

globalStyle(`${messages} > li:first-child`, { marginTop: "auto" })

const message = {
  display: "flex",
  flexDirection: "column" as const,
  marginTop: theme.space[2],
  maxWidth: "min(76%, 30rem)",
}

export const mine = style({
  ...message,
  alignItems: "flex-end",
  alignSelf: "flex-end",
})
export const theirs = style({
  ...message,
  alignItems: "flex-start",
  alignSelf: "flex-start",
})

export const bubble = style({
  borderRadius: theme.radius.lg,
  display: "flex",
  flexDirection: "column",
  gap: theme.space[2],
  padding: `${theme.space[2]} ${theme.space[3]}`,
})

globalStyle(`${mine} > ${bubble}`, {
  background: theme.color.intent.primary.background,
  borderBottomRightRadius: theme.radius.xs,
  color: theme.color.intent.primary.foreground,
})
globalStyle(`${theirs} > ${bubble}`, {
  background: theme.color.background.subtle,
  border: `1px solid ${theme.color.border.subtle}`,
  borderBottomLeftRadius: theme.radius.xs,
  color: theme.color.text.primary,
})

export const body = style({
  color: "inherit",
  fontSize: theme.font.role.body,
  lineHeight: "1.45",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
})
export const attachment = style({
  alignItems: "center",
  background: "rgb(255 255 255 / 0.12)",
  border: "1px solid currentColor",
  borderRadius: theme.radius.md,
  color: "inherit",
  display: "flex",
  fontSize: theme.font.role.supporting,
  gap: theme.space[2],
  maxWidth: "20rem",
  padding: `${theme.space[2]} ${theme.space[3]}`,
  textDecoration: "none",
})
globalStyle(`${attachment} span`, {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})
export const receipt = style({
  color: theme.color.text.muted,
  fontSize: theme.font.role.metadata,
  lineHeight: theme.font.lineHeight.compact,
  marginTop: theme.space[1],
  paddingInline: theme.space[1],
})
export const empty = style({
  alignItems: "center",
  color: theme.color.text.muted,
  display: "flex",
  flexDirection: "column",
  fontSize: theme.font.role.supporting,
  gap: theme.space[1],
  margin: "auto",
  textAlign: "center",
})
globalStyle(`${empty} strong`, {
  color: theme.color.text.primary,
  fontSize: theme.font.role.body,
  fontWeight: theme.font.weight.semibold,
})

export const composer = style({
  alignItems: "center",
  background: theme.color.background.card,
  borderTop: `1px solid ${theme.color.border.subtle}`,
  display: "grid",
  gap: theme.space[2],
  gridTemplateColumns: "2.5rem minmax(0, 1fr) 2.5rem",
  padding: theme.space[3],
  position: "relative",
})
export const selectedFiles = style({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.space[2],
  gridColumn: "1 / -1",
})
export const selectedFile = style({
  alignItems: "center",
  background: theme.color.background.subtle,
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.md,
  color: theme.color.text.secondary,
  display: "inline-flex",
  fontSize: theme.font.role.supporting,
  gap: theme.space[2],
  maxWidth: "100%",
  minHeight: "2rem",
  paddingBlock: theme.space[1],
  paddingInline: theme.space[2],
})
export const selectedFileName = style({
  maxWidth: "18rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
})
export const removeFileButton = style({
  alignItems: "center",
  background: "transparent",
  border: 0,
  borderRadius: theme.radius.sm,
  color: theme.color.icon.muted,
  cursor: "pointer",
  display: "inline-flex",
  justifyContent: "center",
  marginInlineEnd: `-${theme.space[1]}`,
  padding: theme.space[1],
  selectors: {
    "&:focus-visible": { boxShadow: theme.shadow.focus, outline: 0 },
    "&:hover": {
      background: theme.color.background.elevated,
      color: theme.color.icon.default,
    },
  },
})
export const fileButton = style({
  alignItems: "center",
  borderRadius: theme.radius.md,
  color: theme.color.icon.muted,
  cursor: "pointer",
  display: "inline-flex",
  height: "2.5rem",
  justifyContent: "center",
  selectors: {
    "&:focus-within": { boxShadow: theme.shadow.focus },
    "&:hover": {
      background: theme.color.background.subtle,
      color: theme.color.icon.default,
    },
  },
  width: "2.5rem",
})
export const fileInput = style({
  height: "1px",
  opacity: 0,
  overflow: "hidden",
  position: "absolute",
  width: "1px",
})
export const messageInput = style({
  maxHeight: "7rem",
  resize: "none",
})
globalStyle(`${composer} textarea`, {
  background: theme.color.background.subtle,
  borderColor: theme.color.border.default,
  borderRadius: theme.radius.lg,
  boxShadow: "none",
  height: "2.75rem",
  minHeight: "2.75rem",
  padding: `0.7rem ${theme.space[3]}`,
})
export const sendButton = style({ borderRadius: theme.radius.md })
export const error = style({
  color: theme.color.text.danger,
  fontSize: theme.font.role.supporting,
  gridColumn: "2 / -1",
})
export const visuallyHidden = style({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
})
export const liveRegion = style({
  clip: "rect(0 0 0 0)",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  width: "1px",
})
