import { defaultPreset, themePresets } from '../../presets/theme-presets'
import { cloneThemePair, createThemeProject } from '../theme/theme.factory'
import type { ThemeMode, ThemePair, ThemeProject } from '../theme/theme.types'

const SHARE_VERSION = 1
const MAX_ENCODED_LENGTH = 16_000

type SharePayload = {
  v: number
  n: string
  m: ThemeMode
  b: string
  o: string | null
  t: ThemePair
}

export type SharedTheme = {
  name: string
  activeMode: ThemeMode
  basePresetId: string
  originPresetId: string | null
  themes: ThemePair
}

export type ThemeShareResult =
  | { status: 'none' }
  | { status: 'invalid' }
  | { status: 'ready'; theme: SharedTheme }

const isRecord = (value: unknown): value is Record<string, unknown> => (
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)
)

const hasControlCharacters = (value: string): boolean => (
  Array.from(value).some((character) => character.charCodeAt(0) < 32)
)

const isSafeString = (value: unknown, maxLength = 200): value is string => (
  typeof value === 'string' &&
  value.length > 0 &&
  value.length <= maxLength &&
  !/[{};<>]/u.test(value) &&
  !hasControlCharacters(value) &&
  !/url\s*\(/iu.test(value)
)

const isSafeProjectName = (value: unknown): value is string => (
  typeof value === 'string' &&
  value.length > 0 &&
  value.length <= 80 &&
  !hasControlCharacters(value)
)

const matchesTokenShape = (value: unknown, template: unknown): boolean => {
  if (typeof template === 'number') {
    return typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1_000
  }

  if (typeof template === 'string') {
    return isSafeString(value)
  }

  if (!isRecord(value) || !isRecord(template)) {
    return false
  }

  const templateKeys = Object.keys(template)
  const valueKeys = Object.keys(value)

  return (
    valueKeys.length === templateKeys.length &&
    templateKeys.every((key) => (
      Object.hasOwn(value, key) && matchesTokenShape(value[key], template[key])
    ))
  )
}

const encodeBase64Url = (value: string): string => {
  const bytes = new TextEncoder().encode(value)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

const decodeBase64Url = (value: string): string => {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padding = '='.repeat((4 - normalized.length % 4) % 4)
  const binary = atob(`${normalized}${padding}`)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))

  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}

const toSharedTheme = (value: unknown): SharedTheme | null => {
  if (!isRecord(value)) {
    return null
  }

  const payload = value as Partial<SharePayload>
  const isKnownPreset = themePresets.some((preset) => preset.id === payload.b)
  const isKnownOriginPreset = (
    payload.o === null ||
    payload.o === undefined ||
    themePresets.some((preset) => preset.id === payload.o)
  )

  if (
    payload.v !== SHARE_VERSION ||
    !isSafeProjectName(payload.n) ||
    (payload.m !== 'light' && payload.m !== 'dark') ||
    !isSafeString(payload.b, 40) ||
    !isKnownPreset ||
    !isKnownOriginPreset ||
    !matchesTokenShape(payload.t, defaultPreset.themes)
  ) {
    return null
  }

  return {
    name: payload.n,
    activeMode: payload.m,
    basePresetId: payload.b,
    originPresetId: payload.o ?? null,
    themes: cloneThemePair(payload.t as ThemePair),
  }
}

export const createThemeShareCode = (project: ThemeProject): string => {
  const projectName = project.name.trim().slice(0, 80) || 'Untitled system'
  const payload: SharePayload = {
    v: SHARE_VERSION,
    n: projectName,
    m: project.activeMode,
    b: project.basePresetId,
    o: project.originPresetId,
    t: project.themes,
  }

  return encodeBase64Url(JSON.stringify(payload))
}

export const createThemeShareUrl = (
  project: ThemeProject,
  currentUrl: string,
): string => {
  const url = new URL(currentUrl)
  url.hash = new URLSearchParams({ share: createThemeShareCode(project) }).toString()

  return url.toString()
}

export const readThemeShare = (hash: string): ThemeShareResult => {
  const shareCode = new URLSearchParams(hash.replace(/^#/, '')).get('share')

  if (shareCode === null) {
    return { status: 'none' }
  }

  if (!shareCode || shareCode.length > MAX_ENCODED_LENGTH) {
    return { status: 'invalid' }
  }

  try {
    const sharedTheme = toSharedTheme(JSON.parse(decodeBase64Url(shareCode)))

    return sharedTheme
      ? { status: 'ready', theme: sharedTheme }
      : { status: 'invalid' }
  } catch {
    return { status: 'invalid' }
  }
}

export const createProjectFromSharedTheme = (
  theme: SharedTheme,
  options: { name: string; timestamp?: string },
): ThemeProject => {
  const project = createThemeProject(defaultPreset, options)

  return {
    ...project,
    activeMode: theme.activeMode,
    basePresetId: theme.basePresetId,
    originPresetId: theme.originPresetId,
    themes: cloneThemePair(theme.themes),
  }
}
