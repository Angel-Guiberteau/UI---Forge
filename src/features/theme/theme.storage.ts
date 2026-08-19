import type { ThemeProject } from './theme.types'

const STORAGE_KEY = 'ui-forge:workspace'
const STORAGE_VERSION = 2

type StoredWorkspace = {
  version: number
  project: ThemeProject
}

export type StorageAdapter = Pick<Storage, 'getItem' | 'setItem'>

const isThemeProject = (value: unknown): value is ThemeProject => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const project = value as Partial<ThemeProject>

  return (
    typeof project.id === 'string' &&
    typeof project.name === 'string' &&
    (project.activeMode === 'light' || project.activeMode === 'dark') &&
    Boolean(project.themes?.light) &&
    Boolean(project.themes?.dark)
  )
}

const migrateThemeProject = (project: ThemeProject): ThemeProject => ({
  ...project,
  basePresetId: project.basePresetId ?? project.originPresetId ?? 'minimal',
})

export const loadThemeProject = (
  storage: StorageAdapter,
): ThemeProject | null => {
  try {
    const storedValue = storage.getItem(STORAGE_KEY)

    if (!storedValue) {
      return null
    }

    const workspace = JSON.parse(storedValue) as Partial<StoredWorkspace>

    const canMigrate = workspace.version === 1 || workspace.version === STORAGE_VERSION

    return canMigrate && isThemeProject(workspace.project)
      ? migrateThemeProject(workspace.project)
      : null
  } catch {
    return null
  }
}

export const saveThemeProject = (
  storage: StorageAdapter,
  project: ThemeProject,
): boolean => {
  try {
    const workspace: StoredWorkspace = {
      version: STORAGE_VERSION,
      project,
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(workspace))
    return true
  } catch {
    return false
  }
}
