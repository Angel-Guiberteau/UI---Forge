import { useEffect, useRef } from 'react'
import type { ThemeShareResult } from '../../features/share/theme.share'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { Icon } from '../ui/Icon'

type SharedThemeDialogProps = {
  result: Exclude<ThemeShareResult, { status: 'none' }>
  onDismiss: () => void
  onImport: () => void
}

export const SharedThemeDialog = ({ result, onDismiss, onImport }: SharedThemeDialogProps) => {
  const dialogRef = useRef<HTMLElement>(null)
  const firstActionRef = useRef<HTMLButtonElement>(null)

  useBodyScrollLock(true)

  useEffect(() => {
    firstActionRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button')
      const first = focusable.item(0)
      const last = focusable.item(focusable.length - 1)

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onDismiss])

  if (result.status === 'invalid') {
    return (
      <div className="share-backdrop">
        <section className="shared-theme-dialog shared-theme-dialog--invalid" role="dialog" aria-modal="true" aria-labelledby="invalid-share-title" ref={dialogRef}>
          <span className="shared-theme-dialog__icon"><Icon name="alert" size={21} /></span>
          <p className="eyebrow">Link validation failed</p>
          <h2 id="invalid-share-title">This theme link can’t be opened.</h2>
          <p>It may be incomplete, outdated, or modified. Your existing projects have not been changed.</p>
          <button ref={firstActionRef} type="button" className="shared-theme-action shared-theme-action--primary" onClick={onDismiss}>Continue to UI Forge</button>
        </section>
      </div>
    )
  }

  const { theme } = result
  const lightColors = theme.themes.light.colors
  const darkColors = theme.themes.dark.colors

  return (
    <div className="share-backdrop">
      <section className="shared-theme-dialog" role="dialog" aria-modal="true" aria-labelledby="shared-theme-title" ref={dialogRef}>
        <header className="shared-theme-dialog__header">
          <div><p className="eyebrow">Theme received</p><h2 id="shared-theme-title">Add {theme.name} to your forge?</h2></div>
          <span><Icon name="link" size={18} /></span>
        </header>

        <div className="shared-theme-preview" aria-label="Shared light and dark theme preview">
          <div style={{ background: lightColors.background }}>
            <span>Light</span><i style={{ background: lightColors.primary }} /><i style={{ background: lightColors.secondary }} /><strong style={{ color: lightColors.text }}>Aa</strong>
          </div>
          <div style={{ background: darkColors.background }}>
            <span>Dark</span><i style={{ background: darkColors.primary }} /><i style={{ background: darkColors.secondary }} /><strong style={{ color: darkColors.text }}>Aa</strong>
          </div>
        </div>

        <div className="shared-theme-dialog__details">
          <div><span>Foundation</span><strong>{theme.basePresetId}</strong></div>
          <div><span>Opens in</span><strong>{theme.activeMode} mode</strong></div>
          <div><span>Import</span><strong>New local project</strong></div>
        </div>

        <p className="shared-theme-dialog__assurance"><Icon name="shield" size={16} /> Your current systems will stay untouched.</p>

        <footer className="shared-theme-dialog__actions">
          <button ref={firstActionRef} type="button" className="shared-theme-action shared-theme-action--secondary" onClick={onDismiss}>Not now</button>
          <button type="button" className="shared-theme-action shared-theme-action--primary" onClick={onImport}><Icon name="plus" size={15} /> Add to library</button>
        </footer>
      </section>
    </div>
  )
}
