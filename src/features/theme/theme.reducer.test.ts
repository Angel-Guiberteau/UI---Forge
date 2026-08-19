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

  it('resets one section without replacing the rest of the mode', () => {
    const preset = themePresets[0]
    const initialState = createInitialThemeEditorState(
      createThemeProject(preset, { id: 'project-1', timestamp }),
    )
    const changedState = themeEditorReducer(initialState, {
      type: 'theme/update-radius',
      mode: 'light',
      values: { medium: 28 },
      updatedAt: '2026-08-19T00:01:00.000Z',
    })
    const state = themeEditorReducer(changedState, {
      type: 'project/reset-section',
      preset,
      mode: 'light',
      section: 'radius',
      updatedAt: '2026-08-19T00:02:00.000Z',
    })

    expect(state.project.themes.light.radius).toEqual(preset.themes.light.radius)
    expect(state.project.themes.light.colors).toEqual(changedState.project.themes.light.colors)
    expect(state.past).toHaveLength(2)
  })

  it('creates, switches, and duplicates projects without sharing history', () => {
    const firstProject = createThemeProject(themePresets[0], { id: 'project-1', timestamp })
    const secondProject = createThemeProject(themePresets[1], { id: 'project-2', timestamp })
    const duplicateProject = createThemeProject(themePresets[1], {
      id: 'project-3',
      name: 'Corporate copy',
      timestamp,
    })
    const initialState = createInitialThemeEditorState(firstProject)
    const createdState = themeEditorReducer(initialState, {
      type: 'library/create',
      project: secondProject,
    })
    const switchedState = themeEditorReducer(createdState, {
      type: 'project/replace',
      project: firstProject,
    })
    const duplicatedState = themeEditorReducer(switchedState, {
      type: 'library/duplicate',
      project: duplicateProject,
    })

    expect(createdState.project.id).toBe('project-2')
    expect(switchedState.project.id).toBe('project-1')
    expect(duplicatedState.project.id).toBe('project-3')
    expect(duplicatedState.projects).toHaveLength(3)
    expect(duplicatedState.past).toHaveLength(0)
  })

  it('archives the active project, selects another, and restores it later', () => {
    const firstProject = createThemeProject(themePresets[0], { id: 'project-1', timestamp })
    const secondProject = createThemeProject(themePresets[1], { id: 'project-2', timestamp })
    const initialState = createInitialThemeEditorState(firstProject, [firstProject, secondProject])
    const archivedState = themeEditorReducer(initialState, {
      type: 'library/archive',
      projectId: firstProject.id,
      archivedAt: '2026-08-19T00:02:00.000Z',
    })
    const restoredState = themeEditorReducer(archivedState, {
      type: 'library/restore',
      projectId: firstProject.id,
      updatedAt: '2026-08-19T00:03:00.000Z',
    })

    expect(archivedState.project.id).toBe(secondProject.id)
    expect(archivedState.projects[0].archivedAt).not.toBeNull()
    expect(restoredState.projects[0].archivedAt).toBeNull()
  })

  it('keeps at least one active project', () => {
    const project = createThemeProject(themePresets[0], { id: 'project-1', timestamp })
    const initialState = createInitialThemeEditorState(project)
    const state = themeEditorReducer(initialState, {
      type: 'library/archive',
      projectId: project.id,
      archivedAt: '2026-08-19T00:02:00.000Z',
    })

    expect(state).toBe(initialState)
  })
})
