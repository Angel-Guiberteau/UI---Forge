import { fireEvent, render, screen, within } from '@testing-library/react'
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

  it('navigates through the specimen and exposes project actions', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const specimenNavigation = screen.getByRole('navigation', { name: 'Northstar navigation' })
    fireEvent.click(within(specimenNavigation).getByRole('button', { name: 'Projects' }))

    expect(screen.getByRole('table', { name: 'Active projects' })).toBeInTheDocument()
    const actions = screen.getByRole('button', { name: 'Actions for Atlas research' })
    fireEvent.click(actions)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Open project' })).toBeInTheDocument()
  })

  it('creates a report through an accessible modal and announces success', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const createButton = screen.getByRole('button', { name: 'Create report' })
    fireEvent.click(createButton)
    const dialog = screen.getByRole('dialog', { name: 'Turn progress into a story.' })
    const title = within(dialog).getByLabelText('Report title')

    expect(title).toHaveFocus()
    fireEvent.change(title, { target: { value: 'Portfolio health' } })
    fireEvent.submit(title.closest('form')!)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Portfolio health is ready to review.')
    expect(createButton).toHaveFocus()
  })

  it('previews loading, empty, and error application states', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const stateSelect = screen.getByLabelText('State')
    fireEvent.change(stateSelect, { target: { value: 'loading' } })
    expect(screen.getByLabelText('Loading dashboard')).toHaveAttribute('aria-busy', 'true')

    fireEvent.change(stateSelect, { target: { value: 'empty' } })
    expect(screen.getByRole('heading', { name: 'No projects need your attention.' })).toBeInTheDocument()

    fireEvent.change(stateSelect, { target: { value: 'error' } })
    expect(screen.getByRole('alert')).toHaveTextContent('We couldn’t load this workspace.')
  })

  it('switches between mobile workspace sections', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const presetsNavigation = screen.getByRole('button', { name: 'Design' })
    const previewNavigation = screen.getByRole('button', { name: 'Preview' })

    fireEvent.click(presetsNavigation)
    expect(presetsNavigation).toHaveAttribute('aria-current', 'page')

    fireEvent.click(previewNavigation)
    expect(previewNavigation).toHaveAttribute('aria-current', 'page')
  })

  it('edits a color token and marks the theme as customized', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Colors' }))
    const primaryValue = screen.getByLabelText('Primary hexadecimal value')

    fireEvent.focus(primaryValue)
    fireEvent.change(primaryValue, { target: { value: '#123456' } })
    fireEvent.blur(primaryValue)

    expect(primaryValue).toHaveValue('#123456')
    expect(screen.getByText('Customized')).toBeInTheDocument()
  })

  it('audits semantic color pairs against WCAG thresholds', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Audit' }))

    expect(screen.getByRole('heading', { name: 'Semantic pairs' })).toBeInTheDocument()
    expect(screen.getByText('WCAG 2.2')).toBeInTheDocument()
    expect(screen.getByLabelText(/Primary text contrast ratio/)).toBeInTheDocument()
  })

  it('flags failing contrast and links back to the color editor', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Colors' }))
    const primaryValue = screen.getByLabelText('Primary hexadecimal value')
    fireEvent.focus(primaryValue)
    fireEvent.change(primaryValue, { target: { value: '#F4F4F0' } })
    fireEvent.blur(primaryValue)
    fireEvent.click(screen.getByRole('button', { name: 'Audit' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Contrast risk detected.')
    expect(screen.getByLabelText('Primary action contrast ratio 1.00 to 1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Edit colors' }))
    expect(screen.getByRole('button', { name: 'Colors' })).toHaveAttribute('aria-current', 'page')
  })

  it('resets a section to the base preset values', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Radius' }))
    const mediumRadius = screen.getByRole('spinbutton', { name: 'Medium radius value' })

    fireEvent.change(mediumRadius, { target: { value: '20' } })
    expect(mediumRadius).toHaveValue(20)

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(mediumRadius).toHaveValue(4)
  })

  it('confirms a full theme reset in an accessible dialog', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Colors' }))
    const primaryValue = screen.getByLabelText('Primary hexadecimal value')
    fireEvent.focus(primaryValue)
    fireEvent.change(primaryValue, { target: { value: '#654321' } })
    fireEvent.blur(primaryValue)
    fireEvent.click(screen.getByRole('button', { name: 'Reset theme' }))
    const dialog = screen.getByRole('dialog', { name: 'Reset the entire theme?' })

    expect(dialog).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Reset theme' }))
    expect(dialog).not.toBeInTheDocument()
  })
})
