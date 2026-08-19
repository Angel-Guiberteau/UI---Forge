import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createThemeShareUrl, readThemeShare } from '../features/share/theme.share'
import { createThemeProject } from '../features/theme/theme.factory'
import { ThemeProvider } from '../features/theme/ThemeProvider'
import { themePresets } from '../presets/theme-presets'
import { App } from './App'

describe('UI Forge workspace', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState({}, '', '/')
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

  it('exports the selected theme scope as CSS, JSON, or Tailwind', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Export current project' }))
    const dialog = screen.getByRole('dialog', { name: 'Export production tokens' })

    expect(within(dialog).getByLabelText('CSS export preview')).toHaveTextContent('[data-theme="dark"]')
    fireEvent.click(within(dialog).getByRole('tab', { name: /Tailwind v4/ }))
    expect(within(dialog).getByLabelText('TAILWIND export preview')).toHaveTextContent('@theme inline')
    fireEvent.click(within(dialog).getByRole('tab', { name: /JSON tokens/ }))
    fireEvent.click(within(dialog).getByRole('button', { name: 'Dark' }))
    fireEvent.click(within(dialog).getByRole('button', { name: 'Copy' }))

    await waitFor(() => expect(writeText).toHaveBeenCalledOnce())
    expect(writeText.mock.calls[0][0]).toContain('"dark"')
    expect(writeText.mock.calls[0][0]).not.toContain('"light"')
    expect(within(dialog).getByText('Copied to clipboard')).toBeInTheDocument()
  })

  it('creates and copies a validated self-contained share link', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const shareButton = screen.getByRole('button', { name: 'Share current project' })
    shareButton.focus()
    fireEvent.click(shareButton)
    const dialog = screen.getByRole('dialog', { name: 'Share this system' })
    const shareUrl = within(dialog).getByLabelText('Private share link')

    expect(readThemeShare(new URL((shareUrl as HTMLInputElement).value).hash).status).toBe('ready')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Copy share link' }))

    await waitFor(() => expect(writeText).toHaveBeenCalledOnce())
    expect(within(dialog).getByText('Link copied')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(shareButton).toHaveFocus()
  })

  it('imports a shared theme as a new local project', () => {
    const sharedProject = createThemeProject(themePresets[4], {
      name: 'Shared cyber system',
    })
    const shareUrl = createThemeShareUrl(sharedProject, window.location.href)
    window.history.replaceState({}, '', new URL(shareUrl).hash)

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Add Shared cyber system to your forge?' })
    expect(within(dialog).getByLabelText('Shared light and dark theme preview')).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Add to library' }))

    expect(screen.getByDisplayValue('Shared cyber system')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('was added to your local library')
    expect(window.location.hash).toBe('')
  })

  it('handles an invalid shared theme without changing the workspace', () => {
    window.history.replaceState({}, '', '/#share=damaged')

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const dialog = screen.getByRole('dialog', { name: 'This theme link can’t be opened.' })
    expect(within(dialog).getByText(/existing projects have not been changed/)).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Continue to UI Forge' }))

    expect(screen.getByDisplayValue('Untitled system')).toBeInTheDocument()
    expect(window.location.hash).toBe('')
  })

  it('creates and switches between locally stored theme projects', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open project library, 1 active' }))
    const library = screen.getByRole('dialog', { name: 'Project library' })
    expect(within(library).getByText('Untitled system')).toBeInTheDocument()

    fireEvent.click(within(library).getByRole('button', { name: 'New system' }))
    expect(screen.getByDisplayValue('Untitled system 2')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Open project library, 2 active' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open project' }))
    expect(screen.getByDisplayValue('Untitled system')).toBeInTheDocument()
  })

  it('duplicates, archives, and restores a project', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open project library, 1 active' }))
    fireEvent.click(screen.getByRole('button', { name: 'Duplicate Untitled system' }))
    expect(screen.getByText('Untitled system copy')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Archive Untitled system copy' }))
    const confirmation = screen.getByRole('dialog', { name: 'Archive Untitled system copy?' })
    fireEvent.click(within(confirmation).getByRole('button', { name: 'Archive project' }))
    fireEvent.click(screen.getByRole('tab', { name: /Archived/ }))
    expect(screen.getByText('Untitled system copy')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Restore project' }))
    expect(screen.getByText('No archived projects')).toBeInTheDocument()
  })

  it('restores focus after closing the export dialog', () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    const exportButton = screen.getByRole('button', { name: 'Export current project' })
    exportButton.focus()
    fireEvent.click(exportButton)
    expect(screen.getByRole('button', { name: 'Close export dialog' })).toHaveFocus()
    expect(document.body.style.overflow).toBe('hidden')

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('dialog', { name: 'Export production tokens' })).not.toBeInTheDocument()
    expect(exportButton).toHaveFocus()
    expect(document.body.style.overflow).toBe('')
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
    fireEvent.change(primaryValue, { target: { value: '#F5F5F3' } })
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
