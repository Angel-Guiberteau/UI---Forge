import type { ThemeProject } from './theme.types'

const STORAGE_KEY = 'ui-forge:workspace'
const STORAGE_VERSION = 3

export type ThemeWorkspace = {
  activeProjectId: string
  projects: ThemeProject[]
}

type StoredWorkspace = ThemeWorkspace & {
  version: number
  project?: ThemeProject
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
  archivedAt: project.archivedAt ?? null,
  basePresetId: project.basePresetId ?? project.originPresetId ?? 'minimal',
})

const createWorkspace = (
  projects: ThemeProject[],
  activeProjectId?: string,
): ThemeWorkspace | null => {
  const migratedProjects = projects.filter(isThemeProject).map(migrateThemeProject)
  const requestedProject = migratedProjects.find((project) => (
    project.id === activeProjectId && project.archivedAt === null
  ))
  const activeProject = requestedProject ?? migratedProjects.find((project) => project.archivedAt === null)

  return activeProject
    ? { activeProjectId: activeProject.id, projects: migratedProjects }
    : null
}

export const loadThemeWorkspace = (
  storage: StorageAdapter,
): ThemeWorkspace | null => {
  try {
    const storedValue = storage.getItem(STORAGE_KEY)

    if (!storedValue) {
      return null
    }

    const workspace = JSON.parse(storedValue) as Partial<StoredWorkspace>

    if (workspace.version === STORAGE_VERSION && Array.isArray(workspace.projects)) {
      return createWorkspace(workspace.projects, workspace.activeProjectId)
    }

    if ((workspace.version === 1 || workspace.version === 2) && isThemeProject(workspace.project)) {
      return createWorkspace([workspace.project], workspace.project.id)
    }

    return null
  } catch {
    return null
  }
}

export const saveThemeWorkspace = (
  storage: StorageAdapter,
  workspace: ThemeWorkspace,
): boolean => {
  try {
    const storedWorkspace: StoredWorkspace = {
      version: STORAGE_VERSION,
      activeProjectId: workspace.activeProjectId,
      projects: workspace.projects,
    }

    storage.setItem(STORAGE_KEY, JSON.stringify(storedWorkspace))
    return true
  } catch {
    return false
  }
}
