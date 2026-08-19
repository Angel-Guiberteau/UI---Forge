export const THEME_MODES = ['light', 'dark'] as const

export type ThemeMode = (typeof THEME_MODES)[number]

export const PREVIEW_VIEWPORTS = ['desktop', 'tablet', 'mobile'] as const

export type PreviewViewport = (typeof PREVIEW_VIEWPORTS)[number]

export type ColorTokens = {
  primary: string
  secondary: string
  background: string
  surface: string
  surfaceElevated: string
  text: string
  textMuted: string
  border: string
  success: string
  warning: string
  danger: string
}

export type TypographyTokens = {
  fontFamily: string
  displayFontFamily: string
  baseSize: number
  scaleRatio: number
  lineHeight: number
  headingWeight: number
  bodyWeight: number
}

export type RadiusTokens = {
  small: number
  medium: number
  large: number
  pill: number
}

export type SpacingTokens = {
  baseUnit: number
  density: number
}

export type ShadowTokens = {
  color: string
  opacity: number
  blur: number
  spread: number
  offsetY: number
}

export type ControlTokens = {
  height: number
  borderWidth: number
  focusRingWidth: number
}

export type ThemeTokens = {
  colors: ColorTokens
  typography: TypographyTokens
  radius: RadiusTokens
  spacing: SpacingTokens
  shadows: ShadowTokens
  controls: ControlTokens
}

export type ThemePair = Record<ThemeMode, ThemeTokens>

export type ThemeProject = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  activeMode: ThemeMode
  basePresetId: string
  originPresetId: string | null
  themes: ThemePair
}

export type ThemePreset = {
  id: string
  name: string
  description: string
  themes: ThemePair
}

export type ThemeCategory = keyof ThemeTokens

export type ThemeEditorSection = 'presets' | ThemeCategory

export type ThemeEditorState = {
  project: ThemeProject
  past: ThemeProject[]
  future: ThemeProject[]
  viewport: PreviewViewport
  selectedSection: ThemeEditorSection
}
