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
    id: 'forge',
    name: 'Forge',
    category: 'Product OS',
    description: 'Quiet precision, warm neutrals, and a decisive ember signal.',
    themes: {
      light: createTokens(
        {
          primary: '#ad241d', secondary: '#5f615d', background: '#f6f4f1',
          surface: '#ffffff', surfaceElevated: '#ebe8e3', text: '#191917',
          textMuted: '#62625e', border: '#85847f', success: '#216b48',
          warning: '#80550e', danger: '#a52d35',
        },
        {
          typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 16, scaleRatio: 1.24, lineHeight: 1.5, headingWeight: 720, bodyWeight: 420 },
          radius: { small: 7, medium: 11, large: 18, pill: 999 },
          spacing: { baseUnit: 4, density: 0.94 },
          shadows: { color: '#28241f', opacity: 0.11, blur: 24, spread: -10, offsetY: 12 },
        },
      ),
      dark: createTokens(
        {
          primary: '#ff8178', secondary: '#b2b2aa', background: '#101012',
          surface: '#19191c', surfaceElevated: '#242428', text: '#f7f5f2',
          textMuted: '#b0ada8', border: '#68676b', success: '#6fd09a',
          warning: '#e9bc67', danger: '#ff918e',
        },
        {
          typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 16, scaleRatio: 1.24, lineHeight: 1.5, headingWeight: 720, bodyWeight: 420 },
          radius: { small: 7, medium: 11, large: 18, pill: 999 },
          spacing: { baseUnit: 4, density: 0.94 },
          shadows: { color: '#000000', opacity: 0.38, blur: 32, spread: -12, offsetY: 16 },
        },
      ),
    },
  },
  {
    id: 'orbit',
    name: 'Orbit',
    category: 'Fintech',
    description: 'Cobalt structure, crisp data density, and controlled depth.',
    themes: {
      light: createTokens(
        {
          primary: '#1554c0', secondary: '#17616e', background: '#f1f5fa',
          surface: '#ffffff', surfaceElevated: '#e8eef7', text: '#101b2d',
          textMuted: '#566984', border: '#7489a5', success: '#13704a',
          warning: '#875709', danger: '#b52f3b',
        },
        {
          typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 15, scaleRatio: 1.2, lineHeight: 1.46, headingWeight: 700, bodyWeight: 420 },
          radius: { small: 6, medium: 10, large: 15, pill: 999 },
          spacing: { baseUnit: 4, density: 0.88 },
          shadows: { color: '#142b50', opacity: 0.13, blur: 26, spread: -10, offsetY: 12 },
          controls: { height: 38, borderWidth: 1, focusRingWidth: 3 },
        },
      ),
      dark: createTokens(
        {
          primary: '#8ab2ff', secondary: '#72d5df', background: '#08111f',
          surface: '#111d2d', surfaceElevated: '#1a2a3f', text: '#f1f6fd',
          textMuted: '#aebdd0', border: '#536b87', success: '#67d19f',
          warning: '#f0c36e', danger: '#f38991',
        },
        {
          typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 15, scaleRatio: 1.2, lineHeight: 1.46, headingWeight: 700, bodyWeight: 420 },
          radius: { small: 6, medium: 10, large: 15, pill: 999 },
          spacing: { baseUnit: 4, density: 0.88 },
          shadows: { color: '#000814', opacity: 0.4, blur: 32, spread: -12, offsetY: 16 },
          controls: { height: 38, borderWidth: 1, focusRingWidth: 3 },
        },
      ),
    },
  },
  {
    id: 'bloom',
    name: 'Bloom',
    category: 'Consumer',
    description: 'Optimistic color, soft geometry, and expressive hierarchy.',
    themes: {
      light: createTokens(
        {
          primary: '#6732c7', secondary: '#bd345f', background: '#fff7ed',
          surface: '#ffffff', surfaceElevated: '#f4eafd', text: '#292033',
          textMuted: '#695d73', border: '#8d8098', success: '#247550',
          warning: '#895600', danger: '#ad3152',
        },
        {
          typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 16, scaleRatio: 1.3, lineHeight: 1.54, headingWeight: 790, bodyWeight: 440 },
          radius: { small: 13, medium: 20, large: 30, pill: 999 },
          spacing: { baseUnit: 4, density: 1.02 },
          shadows: { color: '#6b36a8', opacity: 0.16, blur: 34, spread: -12, offsetY: 16 },
        },
      ),
      dark: createTokens(
        {
          primary: '#b99cff', secondary: '#ff91b5', background: '#17111f',
          surface: '#241a30', surfaceElevated: '#332241', text: '#fff9f2',
          textMuted: '#c4b6ce', border: '#766487', success: '#70d8a6',
          warning: '#ffd079', danger: '#ff91a9',
        },
        {
          typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 16, scaleRatio: 1.3, lineHeight: 1.54, headingWeight: 790, bodyWeight: 440 },
          radius: { small: 13, medium: 20, large: 30, pill: 999 },
          spacing: { baseUnit: 4, density: 1.02 },
          shadows: { color: '#c084fc', opacity: 0.2, blur: 38, spread: -14, offsetY: 16 },
        },
      ),
    },
  },
  {
    id: 'atelier',
    name: 'Atelier',
    category: 'Editorial',
    description: 'Ivory space, oxblood detail, and gallery-led typography.',
    themes: {
      light: createTokens(
        {
          primary: '#743f13', secondary: '#70434d', background: '#f3eee5',
          surface: '#fcf9f3', surfaceElevated: '#e8dfd2', text: '#211b15',
          textMuted: '#6a6056', border: '#8d8174', success: '#456d50',
          warning: '#7d571d', danger: '#8f3936',
        },
        {
          typography: { fontFamily: systemSans, displayFontFamily: editorialSerif, baseSize: 16, scaleRatio: 1.4, lineHeight: 1.6, headingWeight: 600, bodyWeight: 400 },
          radius: { small: 1, medium: 3, large: 7, pill: 999 },
          spacing: { baseUnit: 5, density: 1.02 },
          shadows: { color: '#3b2b19', opacity: 0.11, blur: 34, spread: -13, offsetY: 16 },
        },
      ),
      dark: createTokens(
        {
          primary: '#e1b777', secondary: '#d39aaa', background: '#120f0c',
          surface: '#1e1813', surfaceElevated: '#2b2119', text: '#f5ecdf',
          textMuted: '#b9ac9d', border: '#7c6a56', success: '#8aba94',
          warning: '#e1b777', danger: '#df8881',
        },
        {
          typography: { fontFamily: systemSans, displayFontFamily: editorialSerif, baseSize: 16, scaleRatio: 1.4, lineHeight: 1.6, headingWeight: 600, bodyWeight: 400 },
          radius: { small: 1, medium: 3, large: 7, pill: 999 },
          spacing: { baseUnit: 5, density: 1.02 },
          shadows: { color: '#000000', opacity: 0.48, blur: 44, spread: -15, offsetY: 20 },
        },
      ),
    },
  },
  {
    id: 'grid',
    name: 'Grid',
    category: 'Neo brutal',
    description: 'Hard rules, acid contrast, and poster-like information density.',
    themes: {
      light: createTokens(
        {
          primary: '#171717', secondary: '#a9362d', background: '#f1efe8',
          surface: '#fffdf6', surfaceElevated: '#e3e0d5', text: '#171717',
          textMuted: '#5f5d56', border: '#77746b', success: '#286a42',
          warning: '#795600', danger: '#9f302d',
        },
        {
          typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 15, scaleRatio: 1.3, lineHeight: 1.42, headingWeight: 850, bodyWeight: 500 },
          radius: { small: 0, medium: 0, large: 0, pill: 0 },
          spacing: { baseUnit: 4, density: 0.9 },
          shadows: { color: '#171717', opacity: 1, blur: 0, spread: 0, offsetY: 4 },
          controls: { height: 38, borderWidth: 2, focusRingWidth: 3 },
        },
      ),
      dark: createTokens(
        {
          primary: '#d6ff56', secondary: '#ff786c', background: '#10110e',
          surface: '#191b16', surfaceElevated: '#26291f', text: '#f4f5eb',
          textMuted: '#b4b8aa', border: '#74796a', success: '#8bd27c',
          warning: '#f3ca55', danger: '#ff827d',
        },
        {
          typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 15, scaleRatio: 1.3, lineHeight: 1.42, headingWeight: 850, bodyWeight: 500 },
          radius: { small: 0, medium: 0, large: 0, pill: 0 },
          spacing: { baseUnit: 4, density: 0.9 },
          shadows: { color: '#d6ff56', opacity: 0.35, blur: 0, spread: 0, offsetY: 4 },
          controls: { height: 38, borderWidth: 2, focusRingWidth: 3 },
        },
      ),
    },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    category: 'Developer',
    description: 'Monospace telemetry, mint signal, and compact technical rhythm.',
    themes: {
      light: createTokens(
        {
          primary: '#006357', secondary: '#315d75', background: '#e9f1ef',
          surface: '#f8fbfa', surfaceElevated: '#dce9e5', text: '#0d2421',
          textMuted: '#47645f', border: '#5f847d', success: '#08734e',
          warning: '#795900', danger: '#ac2c41',
        },
        {
          typography: { fontFamily: mono, displayFontFamily: mono, baseSize: 14, scaleRatio: 1.17, lineHeight: 1.46, headingWeight: 700, bodyWeight: 400 },
          radius: { small: 2, medium: 4, large: 6, pill: 4 },
          spacing: { baseUnit: 4, density: 0.84 },
          shadows: { color: '#063b34', opacity: 0.12, blur: 18, spread: -8, offsetY: 8 },
          controls: { height: 36, borderWidth: 1, focusRingWidth: 2 },
        },
      ),
      dark: createTokens(
        {
          primary: '#55f5cd', secondary: '#73b8ff', background: '#050d0c',
          surface: '#0a1815', surfaceElevated: '#10241f', text: '#e2fff7',
          textMuted: '#90bbb0', border: '#456d64', success: '#55f5cd',
          warning: '#ffe071', danger: '#ff7188',
        },
        {
          typography: { fontFamily: mono, displayFontFamily: mono, baseSize: 14, scaleRatio: 1.17, lineHeight: 1.46, headingWeight: 700, bodyWeight: 400 },
          radius: { small: 2, medium: 4, large: 6, pill: 4 },
          spacing: { baseUnit: 4, density: 0.84 },
          shadows: { color: '#55f5cd', opacity: 0.18, blur: 30, spread: -11, offsetY: 0 },
          controls: { height: 36, borderWidth: 1, focusRingWidth: 2 },
        },
      ),
    },
  },
] satisfies ThemePreset[]

export const defaultPreset = themePresets[0]
