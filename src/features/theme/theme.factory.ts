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
    archivedAt: null,
    activeMode: 'light',
    basePresetId: preset.id,
    originPresetId: preset.id,
    themes: cloneThemePair(preset.themes),
  }
}

export const duplicateThemeProject = (
  project: ThemeProject,
  options: { id?: string; name?: string; timestamp?: string } = {},
): ThemeProject => {
  const timestamp = options.timestamp ?? new Date().toISOString()

  return {
    ...project,
    id: options.id ?? createProjectId(),
    name: options.name ?? `${project.name} copy`,
    createdAt: timestamp,
    updatedAt: timestamp,
    archivedAt: null,
    themes: cloneThemePair(project.themes),
  }
}

export const createUniqueProjectName = (
  preferredName: string,
  projects: ThemeProject[],
): string => {
  const existingNames = new Set(projects.map((project) => project.name.trim().toLocaleLowerCase()))

  if (!existingNames.has(preferredName.toLocaleLowerCase())) {
    return preferredName
  }

  let suffix = 2
  let candidate = `${preferredName} ${suffix}`

  while (existingNames.has(candidate.toLocaleLowerCase())) {
    suffix += 1
    candidate = `${preferredName} ${suffix}`
  }

  return candidate
}
