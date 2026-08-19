import { useEffect, useMemo, useRef, useState } from 'react'
import { createThemeShareUrl } from '../../features/share/theme.share'
import type { ThemeProject } from '../../features/theme/theme.types'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { Icon } from '../ui/Icon'

type ShareDialogProps = {
  open: boolean
  project: ThemeProject
  onClose: () => void
}

type ShareFeedback = 'idle' | 'copied' | 'error'

export const ShareDialog = ({ open, project, onClose }: ShareDialogProps) => {
  const [feedback, setFeedback] = useState<ShareFeedback>('idle')
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const shareUrl = useMemo(() => createThemeShareUrl(project, window.location.href), [project])
  const colors = project.themes[project.activeMode].colors
  const linkSize = new Blob([shareUrl]).size / 1024

  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFeedback('idle')
        onClose()
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button, input')
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
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [onClose, open])

  if (!open) return null

  const handleClose = () => {
    setFeedback('idle')
    onClose()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setFeedback('copied')
    } catch {
      setFeedback('error')
    }
  }

  return (
    <div className="share-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) handleClose()
    }}>
      <section className="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-dialog-title" ref={dialogRef}>
        <header className="share-dialog__header">
          <div className="share-dialog__identity">
            <span><Icon name="link" size={19} /></span>
            <div><p className="eyebrow">Send a snapshot</p><h2 id="share-dialog-title">Share this system</h2></div>
          </div>
          <button ref={closeButtonRef} type="button" aria-label="Close share dialog" onClick={handleClose}><Icon name="close" /></button>
        </header>

        <div className="share-dialog__body">
          <div className="share-project">
            <div className="share-project__preview" style={{ background: colors.background }} aria-hidden="true">
              <span style={{ background: colors.primary }} />
              <span style={{ background: colors.secondary }} />
              <i style={{ background: colors.text }} />
            </div>
            <div><span>Current snapshot</span><strong>{project.name}</strong><small>{project.activeMode} · {project.originPresetId === null ? 'customized' : `${project.basePresetId} base`}</small></div>
          </div>

          <div className="share-link-field">
            <label htmlFor="share-url">Private share link</label>
            <div><Icon name="link" size={15} /><input id="share-url" value={shareUrl} readOnly onFocus={(event) => event.currentTarget.select()} /></div>
          </div>

          <div className="share-route" aria-hidden="true"><i /><span /><span /><span /><i /></div>

          <div className="share-dialog__note">
            <Icon name="shield" size={17} />
            <div><strong>No account or server required</strong><p>The complete theme is encoded in the link. Anyone with it can import this exact snapshot, but later edits stay private.</p></div>
          </div>
        </div>

        <footer className="share-dialog__footer">
          <span className="share-feedback" data-state={feedback} aria-live="polite">
            <i />{feedback === 'copied' ? 'Link copied' : feedback === 'error' ? 'Clipboard unavailable' : `${linkSize.toFixed(1)} KB self-contained link`}
          </span>
          <button type="button" className="share-action" onClick={handleCopy}>
            <Icon name={feedback === 'copied' ? 'check' : 'copy'} size={15} />
            {feedback === 'copied' ? 'Copied' : 'Copy share link'}
          </button>
        </footer>
      </section>
    </div>
  )
}
