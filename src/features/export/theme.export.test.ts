import { describe, expect, it } from 'vitest'
import { createThemeProject } from '../theme/theme.factory'
import {
  createCssThemeExport,
  createExportFilename,
  createJsonThemeExport,
} from './theme.export'

describe('theme export', () => {
  const project = createThemeProject(undefined, {
    id: 'project-export',
    name: 'Órbita Design System',
    timestamp: '2026-08-19T10:00:00.000Z',
  })

  it('exports both CSS modes with stable selectors and units', () => {
    const output = createCssThemeExport(project, 'both')

    expect(output).toContain(':root {')
    expect(output).toContain('[data-theme="dark"] {')
    expect(output).toContain('--font-size-base: 16px;')
    expect(output).toContain('--color-primary: #181917;')
  })

  it('uses root variables when exporting one mode', () => {
    const output = createCssThemeExport(project, 'dark')

    expect(output).toContain(':root {')
    expect(output).toContain('--color-background: #121311;')
    expect(output).not.toContain('[data-theme="dark"]')
  })

  it('exports portable JSON without internal project metadata', () => {
    const output = JSON.parse(createJsonThemeExport(project, 'light'))

    expect(output).toMatchObject({ formatVersion: 1, name: 'Órbita Design System' })
    expect(output.themes.light.colors.primary).toBe('#181917')
    expect(output.themes.dark).toBeUndefined()
    expect(output.id).toBeUndefined()
  })

  it('creates filesystem-safe export names', () => {
    expect(createExportFilename(project.name, 'css')).toBe('orbita-design-system.css')
    expect(createExportFilename('---', 'json')).toBe('ui-forge-theme.json')
  })
})
