import { describe, expect, it } from 'vitest'
import { createThemeProject } from './theme.factory'
import {
  clearThemeWorkspace,
  loadThemeWorkspace,
  saveThemeWorkspace,
  type StorageAdapter,
} from './theme.storage'

class MemoryStorage implements StorageAdapter {
  private values = new Map<string, string>()

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }

  removeItem(key: string) {
    this.values.delete(key)
  }
}

describe('theme storage', () => {
  it('round-trips a versioned project library', () => {
    const storage = new MemoryStorage()
    const projects = [
      createThemeProject(undefined, { id: 'project-1', timestamp: '2026-08-19T00:00:00.000Z' }),
      createThemeProject(undefined, { id: 'project-2', timestamp: '2026-08-19T00:01:00.000Z' }),
    ]
    const workspace = { activeProjectId: 'project-2', projects }

    expect(saveThemeWorkspace(storage, workspace)).toBe(true)
    expect(loadThemeWorkspace(storage)).toEqual(workspace)
  })

  it('ignores malformed stored data', () => {
    const storage = new MemoryStorage()
    storage.setItem('ui-forge:workspace', '{invalid')

    expect(loadThemeWorkspace(storage)).toBeNull()
  })

  it('migrates a version one project into the local library', () => {
    const storage = new MemoryStorage()
    const project = createThemeProject(undefined, {
      id: 'project-1',
      timestamp: '2026-08-19T00:00:00.000Z',
    })
    const legacyProject: Partial<typeof project> = { ...project }
    delete legacyProject.basePresetId
    delete legacyProject.archivedAt

    storage.setItem('ui-forge:workspace', JSON.stringify({
      version: 1,
      project: legacyProject,
    }))

    expect(loadThemeWorkspace(storage)).toEqual({
      activeProjectId: 'project-1',
      projects: [{ ...project, basePresetId: 'forge', archivedAt: null }],
    })
  })

  it('falls back to the first active project when the stored selection is archived', () => {
    const storage = new MemoryStorage()
    const archivedProject = {
      ...createThemeProject(undefined, { id: 'project-1' }),
      archivedAt: '2026-08-19T00:02:00.000Z',
    }
    const activeProject = createThemeProject(undefined, { id: 'project-2' })

    saveThemeWorkspace(storage, {
      activeProjectId: archivedProject.id,
      projects: [archivedProject, activeProject],
    })

    expect(loadThemeWorkspace(storage)?.activeProjectId).toBe(activeProject.id)
  })

  it('clears only the UI Forge workspace', () => {
    const storage = new MemoryStorage()
    storage.setItem('unrelated-preference', 'keep')
    saveThemeWorkspace(storage, {
      activeProjectId: 'project-1',
      projects: [createThemeProject(undefined, { id: 'project-1' })],
    })

    expect(clearThemeWorkspace(storage)).toBe(true)
    expect(loadThemeWorkspace(storage)).toBeNull()
    expect(storage.getItem('unrelated-preference')).toBe('keep')
  })
})
