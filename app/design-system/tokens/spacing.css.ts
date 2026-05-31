export const space = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
} as const

export const layout = {
  authWidth: "28rem",
  contentWidth: "42rem",
  pagePadding: space[4],
  sectionGap: space[8],
} as const
