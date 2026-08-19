import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FatalErrorScreen } from './AppErrorBoundary'

describe('fatal application recovery', () => {
  it('makes local data deletion an explicit two-step action', () => {
    const onReload = vi.fn()
    const onReset = vi.fn()

    render(<FatalErrorScreen onReload={onReload} onReset={onReset} />)

    fireEvent.click(screen.getByRole('button', { name: 'Start with a clean workspace' }))

    expect(screen.getByRole('alert')).toHaveTextContent('cannot be undone')
    expect(onReset).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Keep my projects' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reload workspace' }))
    expect(onReload).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByRole('button', { name: 'Start with a clean workspace' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete local projects' }))
    expect(onReset).toHaveBeenCalledOnce()
  })
})
