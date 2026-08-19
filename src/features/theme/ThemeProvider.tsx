import { useEffect, useReducer, type PropsWithChildren } from 'react'
import { ThemeContext } from './theme.context'
import { createInitialThemeEditorState, themeEditorReducer } from './theme.reducer'
import { loadThemeWorkspace, saveThemeWorkspace } from './theme.storage'

const getInitialState = () => {
  const workspace = loadThemeWorkspace(window.localStorage)
  const storedProject = workspace?.projects.find((project) => project.id === workspace.activeProjectId)

  return createInitialThemeEditorState(storedProject ?? undefined, workspace?.projects)
}

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(themeEditorReducer, undefined, getInitialState)

  useEffect(() => {
    saveThemeWorkspace(window.localStorage, {
      activeProjectId: state.project.id,
      projects: state.projects,
    })
  }, [state.project.id, state.projects])

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  )
}
