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
    description: 'Quiet contrast, precise spacing, and almost no decoration.',
    themes: {
      light: createTokens(
        {
          primary: '#181917', secondary: '#696c66', background: '#f4f4f0',
          surface: '#ffffff', surfaceElevated: '#ffffff', text: '#181917',
          textMuted: '#686a65', border: '#d9dad4', success: '#27744b',
          warning: '#93651c', danger: '#b23838',
        },
        { radius: { small: 2, medium: 4, large: 8, pill: 999 }, shadows: { color: '#181917', opacity: 0.08, blur: 16, spread: -8, offsetY: 8 } },
      ),
      dark: createTokens(
        {
          primary: '#f1f2ed', secondary: '#a4a69f', background: '#121311',
          surface: '#1a1b18', surfaceElevated: '#22231f', text: '#f1f2ed',
          textMuted: '#a4a69f', border: '#343630', success: '#67bd8b',
          warning: '#e2b760', danger: '#ef7c78',
        },
        { radius: { small: 2, medium: 4, large: 8, pill: 999 }, shadows: { color: '#000000', opacity: 0.32, blur: 20, spread: -8, offsetY: 10 } },
      ),
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Structured, dependable, and tuned for data-heavy products.',
    themes: {
      light: createTokens({ primary: '#1456d9', secondary: '#50627d', background: '#f2f5fa', surface: '#ffffff', surfaceElevated: '#ffffff', text: '#142033', textMuted: '#607089', border: '#cfdaea', success: '#14734b', warning: '#9a6412', danger: '#bd3037' }, { radius: { small: 4, medium: 7, large: 12, pill: 999 }, spacing: { baseUnit: 4, density: 0.95 } }),
      dark: createTokens({ primary: '#78a6ff', secondary: '#9cabc1', background: '#0c1420', surface: '#131e2d', surfaceElevated: '#1a283a', text: '#edf3fc', textMuted: '#9cabc1', border: '#2a3c54', success: '#5fc798', warning: '#efbd61', danger: '#f27d83' }, { radius: { small: 4, medium: 7, large: 12, pill: 999 }, spacing: { baseUnit: 4, density: 0.95 } }),
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Buoyant color, generous curves, and a relaxed rhythm.',
    themes: {
      light: createTokens({ primary: '#6c3cf0', secondary: '#ec5e9c', background: '#fff8e8', surface: '#ffffff', surfaceElevated: '#fffdf7', text: '#292239', textMuted: '#746b82', border: '#e5d9f0', success: '#25845a', warning: '#a86605', danger: '#c83b5c' }, { typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 16, scaleRatio: 1.25, lineHeight: 1.55, headingWeight: 750, bodyWeight: 450 }, radius: { small: 10, medium: 16, large: 28, pill: 999 }, spacing: { baseUnit: 5, density: 1.05 } }),
      dark: createTokens({ primary: '#a98bff', secondary: '#ff8cba', background: '#191425', surface: '#241d33', surfaceElevated: '#302641', text: '#fff8f0', textMuted: '#bdb0cb', border: '#463855', success: '#62d49b', warning: '#ffc66a', danger: '#ff849d' }, { typography: { fontFamily: systemSans, displayFontFamily: systemSans, baseSize: 16, scaleRatio: 1.25, lineHeight: 1.55, headingWeight: 750, bodyWeight: 450 }, radius: { small: 10, medium: 16, large: 28, pill: 999 }, spacing: { baseUnit: 5, density: 1.05 } }),
    },
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Editorial restraint with warm metal accents and deep surfaces.',
    themes: {
      light: createTokens({ primary: '#7c5325', secondary: '#766c60', background: '#f3efe7', surface: '#fbf9f4', surfaceElevated: '#ffffff', text: '#241f19', textMuted: '#746c62', border: '#d9d0c3', success: '#4d7458', warning: '#8c6529', danger: '#943f3a' }, { typography: { fontFamily: systemSans, displayFontFamily: editorialSerif, baseSize: 16, scaleRatio: 1.333, lineHeight: 1.6, headingWeight: 600, bodyWeight: 400 }, radius: { small: 0, medium: 2, large: 4, pill: 999 }, spacing: { baseUnit: 5, density: 1.1 } }),
      dark: createTokens({ primary: '#d5ad6d', secondary: '#aaa096', background: '#15120f', surface: '#1d1915', surfaceElevated: '#28221c', text: '#f2eadf', textMuted: '#aaa096', border: '#3e352c', success: '#81a98a', warning: '#d5ad6d', danger: '#ce7770' }, { typography: { fontFamily: systemSans, displayFontFamily: editorialSerif, baseSize: 16, scaleRatio: 1.333, lineHeight: 1.6, headingWeight: 600, bodyWeight: 400 }, radius: { small: 0, medium: 2, large: 4, pill: 999 }, spacing: { baseUnit: 5, density: 1.1 }, shadows: { color: '#000000', opacity: 0.4, blur: 36, spread: -12, offsetY: 18 } }),
    },
  },
  {
    id: 'cyber',
    name: 'Cyber',
    description: 'Dense technical surfaces with electric, high-signal accents.',
    themes: {
      light: createTokens({ primary: '#005f54', secondary: '#425c62', background: '#e7f0ed', surface: '#f7fbf9', surfaceElevated: '#ffffff', text: '#112522', textMuted: '#536965', border: '#b8ccc7', success: '#08754f', warning: '#8a6500', danger: '#b72f43' }, { typography: { fontFamily: mono, displayFontFamily: mono, baseSize: 15, scaleRatio: 1.18, lineHeight: 1.5, headingWeight: 700, bodyWeight: 400 }, radius: { small: 0, medium: 0, large: 0, pill: 0 }, spacing: { baseUnit: 4, density: 0.9 } }),
      dark: createTokens({ primary: '#4dffd2', secondary: '#60a5fa', background: '#07100f', surface: '#0c1917', surfaceElevated: '#11231f', text: '#dffef5', textMuted: '#81aaa0', border: '#21423b', success: '#4dffd2', warning: '#ffe16a', danger: '#ff627d' }, { typography: { fontFamily: mono, displayFontFamily: mono, baseSize: 15, scaleRatio: 1.18, lineHeight: 1.5, headingWeight: 700, bodyWeight: 400 }, radius: { small: 0, medium: 0, large: 0, pill: 0 }, spacing: { baseUnit: 4, density: 0.9 }, shadows: { color: '#4dffd2', opacity: 0.16, blur: 28, spread: -10, offsetY: 0 } }),
    },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Typographic hierarchy, crisp rules, and measured whitespace.',
    themes: {
      light: createTokens({ primary: '#b53a27', secondary: '#536376', background: '#f4f0e8', surface: '#faf8f3', surfaceElevated: '#ffffff', text: '#191816', textMuted: '#6c6861', border: '#cec8bd', success: '#3d7652', warning: '#92621c', danger: '#b53a27' }, { typography: { fontFamily: systemSans, displayFontFamily: editorialSerif, baseSize: 17, scaleRatio: 1.414, lineHeight: 1.65, headingWeight: 700, bodyWeight: 400 }, radius: { small: 0, medium: 0, large: 0, pill: 999 }, spacing: { baseUnit: 6, density: 1.05 }, shadows: { color: '#191816', opacity: 0.07, blur: 0, spread: 0, offsetY: 1 } }),
      dark: createTokens({ primary: '#f0785e', secondary: '#93a6ba', background: '#171614', surface: '#201e1b', surfaceElevated: '#292621', text: '#f3eee5', textMuted: '#aaa49b', border: '#403c36', success: '#77b48c', warning: '#e1b263', danger: '#f0785e' }, { typography: { fontFamily: systemSans, displayFontFamily: editorialSerif, baseSize: 17, scaleRatio: 1.414, lineHeight: 1.65, headingWeight: 700, bodyWeight: 400 }, radius: { small: 0, medium: 0, large: 0, pill: 999 }, spacing: { baseUnit: 6, density: 1.05 }, shadows: { color: '#000000', opacity: 0.25, blur: 0, spread: 0, offsetY: 1 } }),
    },
  },
] satisfies ThemePreset[]

export const defaultPreset = themePresets[0]
