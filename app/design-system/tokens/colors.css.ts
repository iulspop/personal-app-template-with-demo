export const colorToken = {
  amber100: "#fef3c7",
  amber600: "#d97706",
  amber700: "#b45309",
  blue600: "#2563eb",
  blue700: "#1d4ed8",
  red50: "#fef2f2",
  red600: "#dc2626",
  red700: "#b91c1c",
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",
  slate950: "#020617",
  white: "#ffffff",
} as const

export const colorPaletteContract = {
  background: {
    canvas: null,
    card: null,
    subtle: null,
  },
  border: {
    default: null,
    strong: null,
  },
  focus: null,
  icon: {
    muted: null,
  },
  intent: {
    danger: {
      background: null,
      foreground: null,
    },
    primary: {
      background: null,
      foreground: null,
      hover: null,
    },
  },
  text: {
    danger: null,
    inverse: null,
    link: null,
    muted: null,
    primary: null,
    secondary: null,
  },
}

export const lightColorPalette = {
  background: {
    canvas: colorToken.slate50,
    card: colorToken.white,
    subtle: colorToken.slate100,
  },
  border: {
    default: colorToken.slate200,
    strong: colorToken.slate300,
  },
  focus: colorToken.blue600,
  icon: {
    muted: colorToken.slate500,
  },
  intent: {
    danger: {
      background: colorToken.red600,
      foreground: colorToken.white,
    },
    primary: {
      background: colorToken.blue600,
      foreground: colorToken.white,
      hover: colorToken.blue700,
    },
  },
  text: {
    danger: colorToken.red600,
    inverse: colorToken.white,
    link: colorToken.blue600,
    muted: colorToken.slate500,
    primary: colorToken.slate950,
    secondary: colorToken.slate700,
  },
} as const

export const darkColorPalette = {
  background: {
    canvas: colorToken.slate950,
    card: colorToken.slate900,
    subtle: colorToken.slate800,
  },
  border: {
    default: colorToken.slate800,
    strong: colorToken.slate700,
  },
  focus: colorToken.blue600,
  icon: {
    muted: colorToken.slate500,
  },
  intent: {
    danger: {
      background: colorToken.red700,
      foreground: colorToken.white,
    },
    primary: {
      background: colorToken.blue600,
      foreground: colorToken.white,
      hover: colorToken.blue700,
    },
  },
  text: {
    danger: colorToken.red600,
    inverse: colorToken.white,
    link: colorToken.blue600,
    muted: colorToken.slate500,
    primary: colorToken.slate50,
    secondary: colorToken.slate300,
  },
} as const
