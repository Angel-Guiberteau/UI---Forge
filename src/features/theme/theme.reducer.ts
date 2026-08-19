import { cloneThemePair, createThemeProject } from './theme.factory'
import type {
  ColorTokens,
  ControlTokens,
  PreviewViewport,
  RadiusTokens,
  ShadowTokens,
  SpacingTokens,
  ThemeCategory,
  ThemeEditorState,
  ThemeEditorSection,
  ThemeMode,
  ThemePreset,
  ThemeProject,
  TypographyTokens,
} from './theme.types'

const HISTORY_LIMIT = 50

type TokenUpdateAction =
  | { type: 'theme/update-colors'; mode: ThemeMode; values: Partial<ColorTokens>; updatedAt: string }
  | { type: 'theme/update-typography'; mode: ThemeMode; values: Partial<TypographyTokens>; updatedAt: string }
  | { type: 'theme/update-radius'; mode: ThemeMode; values: Partial<RadiusTokens>; updatedAt: string }
  | { type: 'theme/update-spacing'; mode: ThemeMode; values: Partial<SpacingTokens>; updatedAt: string }
  | { type: 'theme/update-shadows'; mode: ThemeMode; values: Partial<ShadowTokens>; updatedAt: string }
  | { type: 'theme/update-controls'; mode: ThemeMode; values: Partial<ControlTokens>; updatedAt: string }

export type ThemeEditorAction =
  | TokenUpdateAction
  | { type: 'project/rename'; name: string; updatedAt: string }
  | { type: 'project/apply-preset'; preset: ThemePreset; updatedAt: string }
  | { type: 'project/reset-section'; preset: ThemePreset; mode: ThemeMode; section: ThemeCategory; updatedAt: string }
  | { type: 'project/replace'; project: ThemeProject }
  | { type: 'library/create'; project: ThemeProject }
  | { type: 'library/duplicate'; project: ThemeProject }
  | { type: 'library/archive'; projectId: string; archivedAt: string }
  | { type: 'library/restore'; projectId: string; updatedAt: string }
  | { type: 'history/undo' }
  | { type: 'history/redo' }
  | { type: 'view/set-mode'; mode: ThemeMode }
  | { type: 'view/set-viewport'; viewport: PreviewViewport }
  | { type: 'view/set-section'; section: ThemeEditorSection }

export const createInitialThemeEditorState = (
  project: ThemeProject = createThemeProject(),
  projects: ThemeProject[] = [project],
): ThemeEditorState => ({
  project,
  projects,
  past: [],
  future: [],
  viewport: 'desktop',
  selectedSection: 'presets',
})

const replaceStoredProject = (
  projects: ThemeProject[],
  project: ThemeProject,
): ThemeProject[] => projects.map((storedProject) => (
  storedProject.id === project.id ? project : storedProject
))

const addToHistory = (
  state: ThemeEditorState,
  project: ThemeProject,
): ThemeEditorState => ({
  ...state,
  project,
  projects: replaceStoredProject(state.projects, project),
  past: [...state.past, state.project].slice(-HISTORY_LIMIT),
  future: [],
})

const updateTokens = <Section extends keyof ThemeProject['themes'][ThemeMode]>(
  state: ThemeEditorState,
  mode: ThemeMode,
  section: Section,
  values: Partial<ThemeProject['themes'][ThemeMode][Section]>,
  updatedAt: string,
): ThemeEditorState => {
  const currentSection = state.project.themes[mode][section]
  const nextSection = { ...currentSection, ...values }
  const nextProject = {
    ...state.project,
    updatedAt,
    originPresetId: null,
    themes: {
      ...state.project.themes,
      [mode]: {
        ...state.project.themes[mode],
        [section]: nextSection,
      },
    },
  }

  return addToHistory(state, nextProject)
}

export const themeEditorReducer = (
  state: ThemeEditorState,
  action: ThemeEditorAction,
): ThemeEditorState => {
  switch (action.type) {
    case 'theme/update-colors':
      return updateTokens(state, action.mode, 'colors', action.values, action.updatedAt)
    case 'theme/update-typography':
      return updateTokens(state, action.mode, 'typography', action.values, action.updatedAt)
    case 'theme/update-radius':
      return updateTokens(state, action.mode, 'radius', action.values, action.updatedAt)
    case 'theme/update-spacing':
      return updateTokens(state, action.mode, 'spacing', action.values, action.updatedAt)
    case 'theme/update-shadows':
      return updateTokens(state, action.mode, 'shadows', action.values, action.updatedAt)
    case 'theme/update-controls':
      return updateTokens(state, action.mode, 'controls', action.values, action.updatedAt)
    case 'project/rename':
      return {
        ...state,
        project: { ...state.project, name: action.name, updatedAt: action.updatedAt },
        projects: replaceStoredProject(state.projects, {
          ...state.project,
          name: action.name,
          updatedAt: action.updatedAt,
        }),
      }
    case 'project/apply-preset':
      return addToHistory(state, {
        ...state.project,
        updatedAt: action.updatedAt,
        basePresetId: action.preset.id,
        originPresetId: action.preset.id,
        themes: cloneThemePair(action.preset.themes),
      })
    case 'project/reset-section':
      return addToHistory(state, {
        ...state.project,
        updatedAt: action.updatedAt,
        originPresetId: null,
        themes: {
          ...state.project.themes,
          [action.mode]: {
            ...state.project.themes[action.mode],
            [action.section]: structuredClone(
              action.preset.themes[action.mode][action.section],
            ),
          },
        },
      })
    case 'project/replace':
      return {
        ...createInitialThemeEditorState(action.project, state.projects),
        viewport: state.viewport,
        selectedSection: state.selectedSection,
      }
    case 'library/create':
    case 'library/duplicate':
      return {
        ...createInitialThemeEditorState(action.project, [...state.projects, action.project]),
        viewport: state.viewport,
        selectedSection: state.selectedSection,
      }
    case 'library/archive': {
      const activeProjects = state.projects.filter((project) => project.archivedAt === null)

      if (activeProjects.length <= 1) {
        return state
      }

      const projects = state.projects.map((project) => (
        project.id === action.projectId
          ? { ...project, archivedAt: action.archivedAt, updatedAt: action.archivedAt }
          : project
      ))

      if (state.project.id !== action.projectId) {
        return { ...state, projects }
      }

      const nextProject = projects.find((project) => project.archivedAt === null)

      return nextProject
        ? {
            ...createInitialThemeEditorState(nextProject, projects),
            viewport: state.viewport,
            selectedSection: state.selectedSection,
          }
        : state
    }
    case 'library/restore': {
      const projects = state.projects.map((project) => (
        project.id === action.projectId
          ? { ...project, archivedAt: null, updatedAt: action.updatedAt }
          : project
      ))

      return { ...state, projects }
    }
    case 'history/undo': {
      const previousProject = state.past.at(-1)

      return previousProject
        ? {
            ...state,
            project: previousProject,
            projects: replaceStoredProject(state.projects, previousProject),
            past: state.past.slice(0, -1),
            future: [state.project, ...state.future],
          }
        : state
    }
    case 'history/redo': {
      const nextProject = state.future[0]

      return nextProject
        ? {
            ...state,
            project: nextProject,
            projects: replaceStoredProject(state.projects, nextProject),
            past: [...state.past, state.project].slice(-HISTORY_LIMIT),
            future: state.future.slice(1),
          }
        : state
    }
    case 'view/set-mode':
      return {
        ...state,
        project: { ...state.project, activeMode: action.mode },
        projects: replaceStoredProject(state.projects, {
          ...state.project,
          activeMode: action.mode,
        }),
      }
    case 'view/set-viewport':
      return { ...state, viewport: action.viewport }
    case 'view/set-section':
      return { ...state, selectedSection: action.section }
  }
}
