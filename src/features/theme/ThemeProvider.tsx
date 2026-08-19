import { useEffect, useReducer, useRef, type PropsWithChildren } from 'react'
import { ThemeContext } from './theme.context'
import { createInitialThemeEditorState, themeEditorReducer } from './theme.reducer'
import { loadThemeWorkspace, saveThemeWorkspace } from './theme.storage'

const getInitialState = () => {
  const workspace = loadThemeWorkspace(window.localStorage)
  const storedProject = workspace?.projects.find((project) => project.id === workspace.activeProjectId)

  return createInitialThemeEditorState(storedProject ?? undefined, workspace?.projects)
}

const STORAGE_WRITE_DELAY = 120

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(themeEditorReducer, undefined, getInitialState)
  const workspaceRef = useRef({
    activeProjectId: state.project.id,
    projects: state.projects,
  })

  useEffect(() => {
    workspaceRef.current = {
      activeProjectId: state.project.id,
      projects: state.projects,
    }

    const timeout = window.setTimeout(() => {
      saveThemeWorkspace(window.localStorage, workspaceRef.current)
    }, STORAGE_WRITE_DELAY)

    return () => window.clearTimeout(timeout)
  }, [state.project.id, state.projects])

  useEffect(() => {
    const saveLatestWorkspace = () => {
      saveThemeWorkspace(window.localStorage, workspaceRef.current)
    }

    window.addEventListener('pagehide', saveLatestWorkspace)
    return () => window.removeEventListener('pagehide', saveLatestWorkspace)
  }, [])

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  )
}
