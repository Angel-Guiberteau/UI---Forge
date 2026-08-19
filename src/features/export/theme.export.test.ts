import { describe, expect, it } from 'vitest'
import { createThemeProject } from '../theme/theme.factory'
import {
  createCssThemeExport,
  createExportFilename,
  createJsonThemeExport,
  createTailwindThemeExport,
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
    expect(output).toContain('--type-scale-ratio: 1.2;')
    expect(output).toContain('--color-primary: #171717;')
  })

  it('uses root variables when exporting one mode', () => {
    const output = createCssThemeExport(project, 'dark')

    expect(output).toContain(':root {')
    expect(output).toContain('--color-background: #111210;')
    expect(output).not.toContain('[data-theme="dark"]')
  })

  it('exports portable JSON without internal project metadata', () => {
    const output = JSON.parse(createJsonThemeExport(project, 'light'))

    expect(output).toMatchObject({ formatVersion: 1, name: 'Órbita Design System' })
    expect(output.themes.light.colors.primary).toBe('#171717')
    expect(output.themes.dark).toBeUndefined()
    expect(output.id).toBeUndefined()
  })

  it('exports a Tailwind v4 theme with semantic utilities and both color modes', () => {
    const output = createTailwindThemeExport(project, 'both')

    expect(output).toContain('@import "tailwindcss";')
    expect(output).toContain('@theme inline {')
    expect(output).toContain('--color-primary: var(--ui-forge-color-primary);')
    expect(output).toContain('--spacing: var(--ui-forge-space-unit);')
    expect(output).toContain(':root {')
    expect(output).toContain('[data-theme="dark"] {')
    expect(output).toContain('--ui-forge-color-background: #111210;')
  })

  it('uses the selected mode as root in a scoped Tailwind export', () => {
    const output = createTailwindThemeExport(project, 'dark')

    expect(output).toContain(':root {')
    expect(output).toContain('--ui-forge-color-background: #111210;')
    expect(output).not.toContain('[data-theme="dark"] {')
  })

  it('creates filesystem-safe export names', () => {
    expect(createExportFilename(project.name, 'css')).toBe('orbita-design-system.css')
    expect(createExportFilename('---', 'json')).toBe('ui-forge-theme.json')
    expect(createExportFilename(project.name, 'tailwind')).toBe('orbita-design-system.tailwind.css')
  })
})
