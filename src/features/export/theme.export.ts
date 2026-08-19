import { createThemeCustomProperties } from '../theme/theme.css'
import type { ThemeMode, ThemeProject, ThemeTokens } from '../theme/theme.types'

export type ExportFormat = 'css' | 'json' | 'tailwind'
export type ExportScope = 'both' | ThemeMode

const formatCssBlock = (selector: string, tokens: ThemeTokens) => {
  const properties = createThemeCustomProperties(tokens)
  const declarations = Object.entries(properties)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n')

  return `${selector} {\n${declarations}\n}`
}

export const createCssThemeExport = (project: ThemeProject, scope: ExportScope) => {
  if (scope === 'light') {
    return formatCssBlock(':root', project.themes.light)
  }

  if (scope === 'dark') {
    return formatCssBlock(':root', project.themes.dark)
  }

  return [
    formatCssBlock(':root', project.themes.light),
    formatCssBlock('[data-theme="dark"]', project.themes.dark),
  ].join('\n\n')
}

export const createJsonThemeExport = (project: ThemeProject, scope: ExportScope) => {
  const themes = scope === 'both'
    ? project.themes
    : { [scope]: project.themes[scope] }

  return JSON.stringify({
    formatVersion: 1,
    name: project.name,
    themes,
  }, null, 2)
}

const tailwindThemeAliases: Record<string, string> = {
  '--color-primary': '--ui-forge-color-primary',
  '--color-secondary': '--ui-forge-color-secondary',
  '--color-background': '--ui-forge-color-background',
  '--color-surface': '--ui-forge-color-surface',
  '--color-surface-elevated': '--ui-forge-color-surface-elevated',
  '--color-content': '--ui-forge-color-text',
  '--color-content-muted': '--ui-forge-color-text-muted',
  '--color-border': '--ui-forge-color-border',
  '--color-success': '--ui-forge-color-success',
  '--color-warning': '--ui-forge-color-warning',
  '--color-danger': '--ui-forge-color-danger',
  '--font-body': '--ui-forge-font-family-body',
  '--font-display': '--ui-forge-font-family-display',
  '--text-base': '--ui-forge-font-size-base',
  '--leading-body': '--ui-forge-line-height-body',
  '--font-weight-heading': '--ui-forge-font-weight-heading',
  '--font-weight-body': '--ui-forge-font-weight-body',
  '--radius-sm': '--ui-forge-radius-sm',
  '--radius-md': '--ui-forge-radius-md',
  '--radius-lg': '--ui-forge-radius-lg',
  '--radius-pill': '--ui-forge-radius-pill',
  '--spacing': '--ui-forge-space-unit',
  '--shadow-forge': '--ui-forge-shadow',
}

const formatTailwindTheme = () => {
  const declarations = Object.entries(tailwindThemeAliases)
    .map(([property, source]) => `  ${property}: var(${source});`)
    .join('\n')

  return `@theme inline {\n${declarations}\n}`
}

const formatTailwindRuntimeBlock = (selector: string, tokens: ThemeTokens) => {
  const properties = createThemeCustomProperties(tokens)
  const declarations = Object.entries(properties)
    .map(([property, value]) => `  --ui-forge-${property.slice(2)}: ${value};`)

  const color = tokens.shadows.color.replace('#', '')
  const channels = [0, 2, 4]
    .map((index) => Number.parseInt(color.slice(index, index + 2), 16))
    .join(' ')
  const opacity = Math.round(tokens.shadows.opacity * 100)
  const shadow = `0 ${tokens.shadows.offsetY}px ${tokens.shadows.blur}px ${tokens.shadows.spread}px rgb(${channels} / ${opacity}%)`

  declarations.push(`  --ui-forge-shadow: ${shadow};`)

  return `${selector} {\n${declarations.join('\n')}\n}`
}

export const createTailwindThemeExport = (project: ThemeProject, scope: ExportScope) => {
  const themeBlocks = scope === 'both'
    ? [
        formatTailwindRuntimeBlock(':root', project.themes.light),
        formatTailwindRuntimeBlock('[data-theme="dark"]', project.themes.dark),
      ]
    : [formatTailwindRuntimeBlock(':root', project.themes[scope])]

  return [
    '@import "tailwindcss";',
    '@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));',
    formatTailwindTheme(),
    ...themeBlocks,
  ].join('\n\n')
}

export const createThemeExport = (
  project: ThemeProject,
  format: ExportFormat,
  scope: ExportScope,
) => {
  if (format === 'css') return createCssThemeExport(project, scope)
  if (format === 'tailwind') return createTailwindThemeExport(project, scope)

  return createJsonThemeExport(project, scope)
}

export const createExportFilename = (projectName: string, format: ExportFormat) => {
  const slug = projectName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const extension = format === 'tailwind' ? 'tailwind.css' : format

  return `${slug || 'ui-forge-theme'}.${extension}`
}
