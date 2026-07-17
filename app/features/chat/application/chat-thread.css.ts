import { style } from "@vanilla-extract/css"

import { theme } from "~/design-system/theme.css"

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[4],
  marginInline: "auto",
  maxWidth: theme.layout.contentWidth,
  padding: `${theme.space[6]} ${theme.space[4]}`,
})
export const header = style({
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
})
export const title = style({
  color: theme.color.text.primary,
  fontSize: theme.font.size.xl,
  fontWeight: theme.font.weight.bold,
})
export const presence = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.sm,
  marginTop: theme.space[1],
})
export const backLink = style({ color: theme.color.text.primary })
export const messages = style({
  display: "flex",
  flexDirection: "column",
  gap: theme.space[3],
  listStyle: "none",
  minHeight: "20rem",
  padding: 0,
})
const bubble = {
  border: `1px solid ${theme.color.border.default}`,
  borderRadius: theme.radius.lg,
  display: "flex",
  flexDirection: "column" as const,
  gap: theme.space[2],
  maxWidth: "85%",
  padding: theme.space[3],
}
export const mine = style({
  ...bubble,
  alignSelf: "flex-end",
  background: theme.color.background.subtle,
})
export const theirs = style({
  ...bubble,
  alignSelf: "flex-start",
  background: theme.color.background.card,
})
export const body = style({
  color: theme.color.text.primary,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
})
export const attachment = style({
  color: theme.color.text.primary,
  fontSize: theme.font.size.sm,
})
export const receipt = style({
  color: theme.color.text.muted,
  fontSize: theme.font.size.xs,
})
export const empty = style({
  color: theme.color.text.muted,
  marginBlock: "auto",
  textAlign: "center",
})
export const composer = style({
  borderTop: `1px solid ${theme.color.border.default}`,
  display: "flex",
  flexDirection: "column",
  gap: theme.space[3],
  paddingTop: theme.space[4],
})
export const label = style({
  color: theme.color.text.primary,
  fontSize: theme.font.size.sm,
  fontWeight: theme.font.weight.medium,
})
export const liveRegion = style({
  clip: "rect(0 0 0 0)",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  width: "1px",
})
