import { defaultPreset } from '../../presets/theme-presets'
import type { ThemePair, ThemePreset, ThemeProject } from './theme.types'

export const cloneThemePair = (themes: ThemePair): ThemePair => structuredClone(themes)

const createProjectId = () => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  return `project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const createThemeProject = (
  preset: ThemePreset = defaultPreset,
  options: { id?: string; name?: string; timestamp?: string } = {},
): ThemeProject => {
  const timestamp = options.timestamp ?? new Date().toISOString()

  return {
    id: options.id ?? createProjectId(),
    name: options.name ?? 'Untitled system',
    createdAt: timestamp,
    updatedAt: timestamp,
    activeMode: 'light',
    originPresetId: preset.id,
    themes: cloneThemePair(preset.themes),
  }
}
