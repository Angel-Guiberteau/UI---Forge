import { describe, expect, it } from 'vitest'
import { createThemeProject } from './theme.factory'
import { loadThemeProject, saveThemeProject, type StorageAdapter } from './theme.storage'

class MemoryStorage implements StorageAdapter {
  private values = new Map<string, string>()

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

describe('theme storage', () => {
  it('round-trips a versioned project', () => {
    const storage = new MemoryStorage()
    const project = createThemeProject(undefined, {
      id: 'project-1',
      timestamp: '2026-08-19T00:00:00.000Z',
    })

    expect(saveThemeProject(storage, project)).toBe(true)
    expect(loadThemeProject(storage)).toEqual(project)
  })

  it('ignores malformed stored data', () => {
    const storage = new MemoryStorage()
    storage.setItem('ui-forge:workspace', '{invalid')

    expect(loadThemeProject(storage)).toBeNull()
  })
})
