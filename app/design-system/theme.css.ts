import { createTheme, createThemeContract } from "@vanilla-extract/css"

import {
  colorPaletteContract,
  darkColorPalette,
  lightColorPalette,
} from "./tokens/colors.css"
import { duration, easing } from "./tokens/motion.css"
import { radius } from "./tokens/radii.css"
import { shadow } from "./tokens/shadows.css"
import { layout, space } from "./tokens/spacing.css"
import {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} from "./tokens/typography.css"
import { zIndex } from "./tokens/z-index.css"

export const theme = createThemeContract({
  color: colorPaletteContract,
  duration,
  easing,
  font: {
    family: fontFamily,
    lineHeight,
    size: fontSize,
    weight: fontWeight,
  },
  layout,
  radius,
  shadow,
  space,
  zIndex,
})

export const lightThemeClass = createTheme(theme, {
  color: lightColorPalette,
  duration,
  easing,
  font: {
    family: fontFamily,
    lineHeight,
    size: fontSize,
    weight: fontWeight,
  },
  layout,
  radius,
  shadow,
  space,
  zIndex,
})

export const darkThemeClass = createTheme(theme, {
  color: darkColorPalette,
  duration,
  easing,
  font: {
    family: fontFamily,
    lineHeight,
    size: fontSize,
    weight: fontWeight,
  },
  layout,
  radius,
  shadow,
  space,
  zIndex,
})
