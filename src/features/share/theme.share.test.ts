import { describe, expect, it } from 'vitest'
import { themePresets } from '../../presets/theme-presets'
import { createThemeProject } from '../theme/theme.factory'
import {
  createProjectFromSharedTheme,
  createThemeShareUrl,
  readThemeShare,
} from './theme.share'

const timestamp = '2026-08-19T00:00:00.000Z'

describe('theme sharing', () => {
  it('round-trips a theme through a self-contained URL', () => {
    const project = createThemeProject(themePresets[4], {
      id: 'private-local-id',
      name: 'Neon workspace',
      timestamp,
    })
    const url = createThemeShareUrl(project, 'https://uiforge.test/editor?source=portfolio')
    const result = readThemeShare(new URL(url).hash)

    expect(result.status).toBe('ready')

    if (result.status === 'ready') {
      expect(result.theme.name).toBe('Neon workspace')
      expect(result.theme.themes).toEqual(project.themes)
      expect(url).not.toContain(project.id)
    }
  })

  it('creates a fresh local project from a shared snapshot', () => {
    const sourceProject = createThemeProject(themePresets[1], { id: 'source', timestamp })
    const result = readThemeShare(new URL(createThemeShareUrl(
      sourceProject,
      'https://uiforge.test',
    )).hash)

    expect(result.status).toBe('ready')

    if (result.status === 'ready') {
      const importedProject = createProjectFromSharedTheme(result.theme, {
        name: 'Corporate import',
        timestamp,
      })

      expect(importedProject.name).toBe('Corporate import')
      expect(importedProject.id).not.toBe(sourceProject.id)
      expect(importedProject.themes).toEqual(sourceProject.themes)
      expect(importedProject.themes).not.toBe(sourceProject.themes)
    }
  })

  it('distinguishes regular navigation from malformed share links', () => {
    expect(readThemeShare('')).toEqual({ status: 'none' })
    expect(readThemeShare('#section=colors')).toEqual({ status: 'none' })
    expect(readThemeShare('#share=not-valid-data')).toEqual({ status: 'invalid' })
  })

  it('normalizes an empty local name into an importable shared project', () => {
    const project = createThemeProject(themePresets[0], { name: '   ', timestamp })
    const url = createThemeShareUrl(project, 'https://uiforge.test')
    const result = readThemeShare(new URL(url).hash)

    expect(result).toMatchObject({
      status: 'ready',
      theme: { name: 'Untitled system' },
    })
  })

  it('rejects unsafe token strings from manipulated links', () => {
    const project = createThemeProject(themePresets[0], { timestamp })
    const url = createThemeShareUrl(project, 'https://uiforge.test')
    const validResult = readThemeShare(new URL(url).hash)

    expect(validResult.status).toBe('ready')

    if (validResult.status === 'ready') {
      validResult.theme.themes.light.typography.fontFamily = 'url(https://example.test)'
      const unsafeProject = createThemeProject(themePresets[0], { timestamp })
      unsafeProject.themes = validResult.theme.themes
      const unsafeUrl = createThemeShareUrl(unsafeProject, 'https://uiforge.test')

      expect(readThemeShare(new URL(unsafeUrl).hash)).toEqual({ status: 'invalid' })
    }
  })
})
