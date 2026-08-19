import { createContext, type Dispatch } from 'react'
import type { ThemeEditorAction } from './theme.reducer'
import type { ThemeEditorState } from './theme.types'

export type ThemeContextValue = {
  state: ThemeEditorState
  dispatch: Dispatch<ThemeEditorAction>
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
