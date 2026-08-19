import { describe, expect, it } from 'vitest'
import { themePresets } from '../../presets/theme-presets'
import { createThemeProject } from './theme.factory'
import { createInitialThemeEditorState, themeEditorReducer } from './theme.reducer'

const timestamp = '2026-08-19T00:00:00.000Z'

describe('themeEditorReducer', () => {
  it('updates tokens and records the previous project', () => {
    const initialState = createInitialThemeEditorState(
      createThemeProject(themePresets[0], { id: 'project-1', timestamp }),
    )
    const state = themeEditorReducer(initialState, {
      type: 'theme/update-colors',
      mode: 'light',
      values: { primary: '#ff3b30' },
      updatedAt: '2026-08-19T00:01:00.000Z',
    })

    expect(state.project.themes.light.colors.primary).toBe('#ff3b30')
    expect(state.project.originPresetId).toBeNull()
    expect(state.past).toHaveLength(1)
    expect(state.future).toHaveLength(0)
  })

  it('restores token changes with undo and redo', () => {
    const initialState = createInitialThemeEditorState(
      createThemeProject(themePresets[0], { id: 'project-1', timestamp }),
    )
    const changedState = themeEditorReducer(initialState, {
      type: 'theme/update-radius',
      mode: 'dark',
      values: { medium: 18 },
      updatedAt: '2026-08-19T00:01:00.000Z',
    })
    const undoneState = themeEditorReducer(changedState, { type: 'history/undo' })
    const redoneState = themeEditorReducer(undoneState, { type: 'history/redo' })

    expect(undoneState.project.themes.dark.radius.medium).toBe(
      initialState.project.themes.dark.radius.medium,
    )
    expect(redoneState.project.themes.dark.radius.medium).toBe(18)
  })

  it('applies both modes from a preset without sharing its references', () => {
    const initialState = createInitialThemeEditorState(
      createThemeProject(themePresets[0], { id: 'project-1', timestamp }),
    )
    const preset = themePresets[4]
    const state = themeEditorReducer(initialState, {
      type: 'project/apply-preset',
      preset,
      updatedAt: '2026-08-19T00:01:00.000Z',
    })

    expect(state.project.originPresetId).toBe('cyber')
    expect(state.project.themes.dark.colors.primary).toBe(
      preset.themes.dark.colors.primary,
    )
    expect(state.project.themes).not.toBe(preset.themes)
  })
})
