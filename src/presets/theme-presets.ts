import type { ThemePreset, ThemeTokens } from '../features/theme/theme.types'

const systemSans = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
const editorialSerif = 'Georgia, "Times New Roman", serif'
const mono = '"SFMono-Regular", Consolas, "Liberation Mono", monospace'

const createTokens = (
  colors: ThemeTokens['colors'],
  overrides: Partial<Omit<ThemeTokens, 'colors'>> = {},
): ThemeTokens => ({
  colors,
  typography: {
    fontFamily: systemSans,
    displayFontFamily: systemSans,
    baseSize: 16,
    scaleRatio: 1.2,
    lineHeight: 1.5,
    headingWeight: 650,
    bodyWeight: 400,
    ...overrides.typography,
  },
  radius: {
    small: 6,
    medium: 10,
    large: 16,
    pill: 999,
    ...overrides.radius,
  },
  spacing: {
    baseUnit: 4,
    density: 1,
    ...overrides.spacing,
  },
  shadows: {
    color: '#10110f',
    opacity: 0.12,
    blur: 24,
    spread: -8,
    offsetY: 12,
    ...overrides.shadows,
  },
  controls: {
    height: 40,
    borderWidth: 1,
    focusRingWidth: 3,
    ...overrides.controls,
  },
})

export const themePresets = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Swiss restraint, optical spacing, and disciplined monochrome.',
    themes: {
      light: createTokens(
        {
          primary: '#171717', secondary: '#606060', background: '#f5f5f3',
          surface: '#ffffff', surfaceElevated: '#fafaf8', text: '#171717',
          textMuted: '#62625f', border: '#898985', success: '#25704a',
          warning: '#895b12', danger: '#aa3333',
        },
        { radius: { small: 2, medium: 4, large: 8, pill: 999 }, shadows: { color: '#181917', opacity: 0.08, blur: 16, spread: -8, offsetY: 8 } },
      ),
      dark: createTokens(
        {
          primary: '#f3f3ef', secondary: '#b4b4ad', background: '#111210',
          surface: '#1a1b18', surfaceElevated: '#242521', text: '#f3f3ef',
          textMuted: '#aaa9a3', border: '#666861', success: '#72c996',
          warning: '#e5bc6e', danger: '#f18a86',
        },
        { radius: { small: 2, medium: 4, large: 8, pill: 999 }, shadows: { color: '#000000', opacity: 0.32, blur: 20, spread: -8, offsetY: 10 } },
      ),
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Confident blue, compact data density, and executive clarity.',
    themes: {
      light: createTokens({ primary: '#1554c0', secondary: '#4c617f', background: '#f3f6fb', surface: '#ffffff', surfaceElevated: '#f9fbff', text: '#111c2f', textMuted: '#566a86', border: '#758aa5', success: '#13704a', warning: '#875709', danger: '#b52f3b' }, { radius: { small: 5, medium: 8, large: 14, pill: 999 }, spacing: { baseUnit: 4, density: 0.92 }, shadows: { color: '#142b50', opacity: 0.13, blur: 22, spread: -9, offsetY: 10 } }),
      dark: createTokens({ primary: '#8ab2ff', secondary: '#a6b7ce', background: '#09111e', surface: '#111d2c', surfaceElevated: '#19283b', text: '#f0f5fc', textMuted: '#aab8cb', border: '#53677f', success: '#67d19f', warning: '#f0c36e', danger: '#f38991' }, { radius: { small: 5, medium: 8, large: 14, pill: 999 }, spacing: { baseUnit: 4, density: 0.92 }, shadows: { color: '#000814', opacity: 0.36, blur: 28, spread: -10, offsetY: 14 } }),
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Candy color, expressive scale, and soft tactile geometry.',
    themes: {
      light: createTokens({ primary: '#6831cf', secondary: '#c83278', background: '#fff7e8', surface: '#ffffff', surfaceElevated: '#fffaf1', text: '#282034', textMuted: '#695e75', border: '#8e829b', success: '#247550', warning: '#8c5800', danger: '#b83256' }, { typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 16, scaleRatio: 1.28, lineHeight: 1.55, headingWeight: 780, bodyWeight: 450 }, radius: { small: 12, medium: 19, large: 32, pill: 999 }, spacing: { baseUnit: 5, density: 1.08 }, shadows: { color: '#6b36a8', opacity: 0.15, blur: 30, spread: -10, offsetY: 14 } }),
      dark: createTokens({ primary: '#b69aff', secondary: '#ff8fbd', background: '#171120', surface: '#231a30', surfaceElevated: '#30213f', text: '#fff9f2', textMuted: '#c1b4cb', border: '#756486', success: '#6cd8a3', warning: '#ffd079', danger: '#ff8fa8' }, { typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 16, scaleRatio: 1.28, lineHeight: 1.55, headingWeight: 780, bodyWeight: 450 }, radius: { small: 12, medium: 19, large: 32, pill: 999 }, spacing: { baseUnit: 5, density: 1.08 }, shadows: { color: '#c084fc', opacity: 0.19, blur: 34, spread: -12, offsetY: 14 } }),
    },
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Gallery restraint, bronze accents, and tailored proportions.',
    themes: {
      light: createTokens({ primary: '#704510', secondary: '#6e6254', background: '#f3eee5', surface: '#fbf8f2', surfaceElevated: '#ffffff', text: '#211b15', textMuted: '#6a6056', border: '#8d8174', success: '#456d50', warning: '#7d571d', danger: '#8f3936' }, { typography: { fontFamily: systemSans, displayFontFamily: editorialSerif, baseSize: 16, scaleRatio: 1.38, lineHeight: 1.62, headingWeight: 600, bodyWeight: 400 }, radius: { small: 1, medium: 3, large: 6, pill: 999 }, spacing: { baseUnit: 5, density: 1.12 }, shadows: { color: '#3b2b19', opacity: 0.11, blur: 34, spread: -13, offsetY: 16 } }),
      dark: createTokens({ primary: '#e0b875', secondary: '#b7aa9a', background: '#120f0c', surface: '#1d1813', surfaceElevated: '#292119', text: '#f5ecdf', textMuted: '#b8ab9c', border: '#7c6a56', success: '#8aba94', warning: '#e0b875', danger: '#d9827b' }, { typography: { fontFamily: systemSans, displayFontFamily: editorialSerif, baseSize: 16, scaleRatio: 1.38, lineHeight: 1.62, headingWeight: 600, bodyWeight: 400 }, radius: { small: 1, medium: 3, large: 6, pill: 999 }, spacing: { baseUnit: 5, density: 1.12 }, shadows: { color: '#000000', opacity: 0.46, blur: 42, spread: -14, offsetY: 20 } }),
    },
  },
  {
    id: 'cyber',
    name: 'Cyber',
    description: 'Terminal precision, luminous signal, and zero-radius density.',
    themes: {
      light: createTokens({ primary: '#006357', secondary: '#315d67', background: '#e9f1ef', surface: '#f8fbfa', surfaceElevated: '#ffffff', text: '#0d2421', textMuted: '#47645f', border: '#5f847d', success: '#08734e', warning: '#795900', danger: '#ac2c41' }, { typography: { fontFamily: mono, displayFontFamily: mono, baseSize: 15, scaleRatio: 1.16, lineHeight: 1.48, headingWeight: 700, bodyWeight: 400 }, radius: { small: 0, medium: 0, large: 0, pill: 0 }, spacing: { baseUnit: 4, density: 0.86 }, controls: { height: 38, borderWidth: 1, focusRingWidth: 2 } }),
      dark: createTokens({ primary: '#55f5cd', secondary: '#73b8ff', background: '#050d0c', surface: '#0a1815', surfaceElevated: '#10241f', text: '#e2fff7', textMuted: '#8fb9af', border: '#456d64', success: '#55f5cd', warning: '#ffe071', danger: '#ff7188' }, { typography: { fontFamily: mono, displayFontFamily: mono, baseSize: 15, scaleRatio: 1.16, lineHeight: 1.48, headingWeight: 700, bodyWeight: 400 }, radius: { small: 0, medium: 0, large: 0, pill: 0 }, spacing: { baseUnit: 4, density: 0.86 }, shadows: { color: '#55f5cd', opacity: 0.18, blur: 30, spread: -11, offsetY: 0 }, controls: { height: 38, borderWidth: 1, focusRingWidth: 2 } }),
    },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Newspaper hierarchy, inked rules, and generous reading rhythm.',
    themes: {
      light: createTokens({ primary: '#a82f24', secondary: '#465e78', background: '#f2eee5', surface: '#faf8f2', surfaceElevated: '#ffffff', text: '#181714', textMuted: '#625f59', border: '#89847c', success: '#376e4c', warning: '#805618', danger: '#a82f24' }, { typography: { fontFamily: systemSans, displayFontFamily: editorialSerif, baseSize: 17, scaleRatio: 1.44, lineHeight: 1.68, headingWeight: 700, bodyWeight: 400 }, radius: { small: 0, medium: 0, large: 0, pill: 999 }, spacing: { baseUnit: 6, density: 1.08 }, shadows: { color: '#191816', opacity: 0.09, blur: 0, spread: 0, offsetY: 1 } }),
      dark: createTokens({ primary: '#ff8972', secondary: '#9eb5cb', background: '#151412', surface: '#201e1b', surfaceElevated: '#2a2722', text: '#f5efe6', textMuted: '#b5aea3', border: '#676159', success: '#82bf96', warning: '#e6b96d', danger: '#ff8972' }, { typography: { fontFamily: systemSans, displayFontFamily: editorialSerif, baseSize: 17, scaleRatio: 1.44, lineHeight: 1.68, headingWeight: 700, bodyWeight: 400 }, radius: { small: 0, medium: 0, large: 0, pill: 999 }, spacing: { baseUnit: 6, density: 1.08 }, shadows: { color: '#000000', opacity: 0.3, blur: 0, spread: 0, offsetY: 1 } }),
    },
  },
] satisfies ThemePreset[]

export const defaultPreset = themePresets[0]
