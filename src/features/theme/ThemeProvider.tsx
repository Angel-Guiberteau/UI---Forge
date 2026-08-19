import { useEffect, useReducer, type PropsWithChildren } from 'react'
import { ThemeContext } from './theme.context'
import { createInitialThemeEditorState, themeEditorReducer } from './theme.reducer'
import { loadThemeProject, saveThemeProject } from './theme.storage'

const getInitialState = () => {
  const storedProject = loadThemeProject(window.localStorage)

  return createInitialThemeEditorState(storedProject ?? undefined)
}

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(themeEditorReducer, undefined, getInitialState)

  useEffect(() => {
    saveThemeProject(window.localStorage, state.project)
  }, [state.project])

  return (
    <ThemeContext.Provider value={{ state, dispatch }}>
      {children}
    </ThemeContext.Provider>
  )
}
