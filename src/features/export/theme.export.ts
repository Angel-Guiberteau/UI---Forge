import { createThemeCustomProperties } from '../theme/theme.css'
import type { ThemeMode, ThemeProject, ThemeTokens } from '../theme/theme.types'

export type ExportFormat = 'css' | 'json'
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

export const createThemeExport = (
  project: ThemeProject,
  format: ExportFormat,
  scope: ExportScope,
) => format === 'css'
  ? createCssThemeExport(project, scope)
  : createJsonThemeExport(project, scope)

export const createExportFilename = (projectName: string, format: ExportFormat) => {
  const slug = projectName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `${slug || 'ui-forge-theme'}.${format}`
}
