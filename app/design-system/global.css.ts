import { globalFontFace, globalStyle } from "@vanilla-extract/css"

import { darkThemeClass, lightThemeClass, theme } from "./theme.css"

globalFontFace("Inter", {
  fontDisplay: "swap",
  fontStyle: "normal",
  fontWeight: "400",
  src: 'url("/fonts/inter/Inter-Regular.woff2") format("woff2")',
})

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
})

globalStyle("*", {
  margin: 0,
})

globalStyle("html", {
  background: theme.color.background.canvas,
  color: theme.color.text.primary,
  fontFamily: theme.font.family.sans,
  lineHeight: theme.font.lineHeight.normal,
})

globalStyle(`html.${lightThemeClass}`, {
  colorScheme: "light",
})

globalStyle(`html.${darkThemeClass}`, {
  colorScheme: "dark",
})

globalStyle("body", {
  background: theme.color.background.canvas,
  color: theme.color.text.primary,
  minHeight: "100vh",
})

globalStyle("button, input, textarea, select", {
  font: "inherit",
})

globalStyle("button", {
  cursor: "pointer",
})

globalStyle("button:disabled", {
  cursor: "not-allowed",
})

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
})

globalStyle("img, picture, video, canvas, svg", {
  display: "block",
  maxWidth: "100%",
})

globalStyle("ul, ol", {
  listStyle: "none",
  padding: 0,
})

globalStyle("code, pre", {
  fontFamily: theme.font.family.mono,
})
