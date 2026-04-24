/**
 * Design tokens — Forage for All
 * Earthy, botanical, field-guide palette.
 * Change these ONCE here; the whole app picks it up.
 */

export const palette = {
  // Earth
  cream: "#F4EDDC",
  paper: "#FBF5E3",
  sand:  "#EFE6CC",
  bark:  "#6B5440",
  soil:  "#3E2E1F",

  // Foliage
  moss:      "#4A7C2E",
  mossDeep:  "#2F5520",
  mossLight: "#8FB36E",
  sage:      "#B8C89A",

  // Fruit / accent
  terra:    "#B8573A",
  ember:    "#D97706",
  berry:    "#7A2E4A",
  sun:      "#E8A838",

  // Ripeness ramp (0..4 — unripe → overripe)
  ripeness: [
    "#A8B59C", // 0 unripe
    "#C8B86A", // 1 forming
    "#E8A838", // 2 approaching
    "#D97706", // 3 ripe now
    "#9B3E1F", // 4 past
  ],

  // Neutrals / text
  ink:        "#1F1710",
  inkSoft:    "#5A4634",
  inkMuted:   "#8B7457",
  line:       "#D4C49E",
  lineSoft:   "#E7D9B4",

  // Status
  danger:  "#B8573A",
  warn:    "#D97706",
  ok:      "#4A7C2E",
};

export const colors = {
  bg:          palette.cream,
  bgElevated:  palette.paper,
  bgInset:     palette.sand,
  text:        palette.ink,
  textSoft:    palette.inkSoft,
  textMuted:   palette.inkMuted,
  line:        palette.line,
  lineSoft:    palette.lineSoft,
  primary:     palette.moss,
  primaryDeep: palette.mossDeep,
  accent:      palette.terra,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const type = {
  // Default pairing: serif for display, sans for body.
  // Override in src/theme/typography.ts to try another.
  display: { fontFamily: "serif", fontWeight: "600" as const },
  body:    { fontFamily: "System",  fontWeight: "400" as const },
  mono:    { fontFamily: "Courier", fontWeight: "400" as const },

  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 22,
    xxl: 28,
    display: 36,
  },
};

export const shadow = {
  card: {
    shadowColor: "#3E2E1F",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  floating: {
    shadowColor: "#3E2E1F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const theme = {
  palette,
  colors,
  spacing,
  radius,
  type,
  shadow,
};

export type Theme = typeof theme;
