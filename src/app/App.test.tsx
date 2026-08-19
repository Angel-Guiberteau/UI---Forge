import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from '../features/theme/ThemeProvider'
import { App } from './App'

describe('UI Forge workspace', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('applies a preset and makes the change reversible', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const corporatePreset = screen.getByRole('button', { name: /Corporate/ })
    const undoButton = screen.getByRole('button', { name: 'Undo last theme change' })

    fireEvent.click(corporatePreset)

    expect(corporatePreset).toHaveAttribute('aria-pressed', 'true')
    expect(undoButton).toBeEnabled()

    fireEvent.click(undoButton)

    expect(screen.getByRole('button', { name: /Minimal/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('changes color mode and preview viewport', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const darkMode = screen.getByRole('button', { name: 'Dark' })
    const mobileViewport = screen.getByRole('button', { name: 'Mobile preview' })

    fireEvent.click(darkMode)
    fireEvent.click(mobileViewport)

    expect(darkMode).toHaveAttribute('aria-pressed', 'true')
    expect(mobileViewport).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('mobile · dark')).toBeInTheDocument()
  })

  it('switches between mobile workspace sections', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const presetsNavigation = screen.getByRole('button', { name: 'Presets' })
    const previewNavigation = screen.getByRole('button', { name: 'Preview' })

    fireEvent.click(presetsNavigation)
    expect(presetsNavigation).toHaveAttribute('aria-current', 'page')

    fireEvent.click(previewNavigation)
    expect(previewNavigation).toHaveAttribute('aria-current', 'page')
  })
})
