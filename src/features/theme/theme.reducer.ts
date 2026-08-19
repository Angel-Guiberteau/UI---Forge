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
  | { type: 'project/replace'; project: ThemeProject }
  | { type: 'history/undo' }
  | { type: 'history/redo' }
  | { type: 'view/set-mode'; mode: ThemeMode }
  | { type: 'view/set-viewport'; viewport: PreviewViewport }
  | { type: 'view/set-category'; category: ThemeCategory }

export const createInitialThemeEditorState = (
  project: ThemeProject = createThemeProject(),
): ThemeEditorState => ({
  project,
  past: [],
  future: [],
  viewport: 'desktop',
  selectedCategory: 'colors',
})

const addToHistory = (
  state: ThemeEditorState,
  project: ThemeProject,
): ThemeEditorState => ({
  ...state,
  project,
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
      }
    case 'project/apply-preset':
      return addToHistory(state, {
        ...state.project,
        updatedAt: action.updatedAt,
        originPresetId: action.preset.id,
        themes: cloneThemePair(action.preset.themes),
      })
    case 'project/replace':
      return createInitialThemeEditorState(action.project)
    case 'history/undo': {
      const previousProject = state.past.at(-1)

      return previousProject
        ? {
            ...state,
            project: previousProject,
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
            past: [...state.past, state.project].slice(-HISTORY_LIMIT),
            future: state.future.slice(1),
          }
        : state
    }
    case 'view/set-mode':
      return {
        ...state,
        project: { ...state.project, activeMode: action.mode },
      }
    case 'view/set-viewport':
      return { ...state, viewport: action.viewport }
    case 'view/set-category':
      return { ...state, selectedCategory: action.category }
  }
}
