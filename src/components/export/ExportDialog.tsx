import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createExportFilename,
  createThemeExport,
  type ExportFormat,
  type ExportScope,
} from '../../features/export/theme.export'
import type { ThemeProject } from '../../features/theme/theme.types'
import { Icon } from '../ui/Icon'

type ExportDialogProps = {
  open: boolean
  project: ThemeProject
  onClose: () => void
}

type ExportFeedback = 'idle' | 'copied' | 'downloaded' | 'error'

const formats: Array<{ id: ExportFormat; label: string; description: string }> = [
  { id: 'css', label: 'CSS variables', description: 'Drop into any stylesheet' },
  { id: 'json', label: 'JSON tokens', description: 'Portable structured data' },
]

const scopes: Array<{ id: ExportScope; label: string }> = [
  { id: 'both', label: 'Both modes' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
]

export const ExportDialog = ({ open, project, onClose }: ExportDialogProps) => {
  const [format, setFormat] = useState<ExportFormat>('css')
  const [scope, setScope] = useState<ExportScope>('both')
  const [feedback, setFeedback] = useState<ExportFeedback>('idle')
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const output = useMemo(() => createThemeExport(project, format, scope), [format, project, scope])
  const filename = createExportFilename(project.name, format)
  const lineCount = output.split('\n').length
  const sizeInKilobytes = new Blob([output]).size / 1024

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
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
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [onClose, open])

  if (!open) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setFeedback('copied')
    } catch {
      setFeedback('error')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: format === 'css' ? 'text/css' : 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setFeedback('downloaded')
  }

  const feedbackLabel = {
    idle: 'Ready to export',
    copied: 'Copied to clipboard',
    downloaded: `${filename} downloaded`,
    error: 'Could not access the clipboard',
  }[feedback]

  return (
    <div className="export-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="export-dialog" role="dialog" aria-modal="true" aria-labelledby="export-dialog-title" ref={dialogRef}>
        <header className="export-dialog__header">
          <div className="export-dialog__identity">
            <span><Icon name="export" size={18} /></span>
            <div><p className="eyebrow">Package the system</p><h2 id="export-dialog-title">Export production tokens</h2></div>
          </div>
          <button ref={closeButtonRef} type="button" aria-label="Close export dialog" onClick={onClose}><Icon name="close" size={18} /></button>
        </header>

        <div className="export-dialog__body">
          <aside className="export-options" aria-label="Export settings">
            <div className="export-options__section">
              <span className="export-options__label">Format</span>
              <div className="export-format-tabs" role="tablist" aria-label="Export format">
                {formats.map((option) => (
                  <button
                    type="button"
                    role="tab"
                    id={`export-${option.id}-tab`}
                    key={option.id}
                    aria-selected={format === option.id}
                    aria-controls="export-code-panel"
                    onClick={() => {
                      setFormat(option.id)
                      setFeedback('idle')
                    }}
                  >
                    <Icon name={option.id === 'css' ? 'fileCode' : 'braces'} size={16} />
                    <span><strong>{option.label}</strong><small>{option.description}</small></span>
                    <Icon name="chevronRight" size={14} />
                  </button>
                ))}
              </div>
            </div>

            <fieldset className="export-options__section">
              <legend className="export-options__label">Theme scope</legend>
              <div className="export-scope">
                {scopes.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    aria-pressed={scope === option.id}
                    onClick={() => {
                      setScope(option.id)
                      setFeedback('idle')
                    }}
                  >{option.label}</button>
                ))}
              </div>
            </fieldset>

            <div className="export-manifest">
              <span>Manifest</span>
              <dl>
                <div><dt>File</dt><dd>{filename}</dd></div>
                <div><dt>Lines</dt><dd>{lineCount}</dd></div>
                <div><dt>Size</dt><dd>{sizeInKilobytes.toFixed(1)} KB</dd></div>
              </dl>
            </div>
          </aside>

          <div className="export-output" role="tabpanel" id="export-code-panel" aria-labelledby={`export-${format}-tab`}>
            <div className="export-output__bar">
              <span className="export-output__lights" aria-hidden="true"><i /><i /><i /></span>
              <strong>{filename}</strong>
              <span>{scope === 'both' ? 'light + dark' : scope}</span>
            </div>
            <pre tabIndex={0} aria-label={`${format.toUpperCase()} export preview`}><code>{output}</code></pre>
            <div className="export-output__footer">
              <span className="export-feedback" data-state={feedback} aria-live="polite">
                <i aria-hidden="true" />{feedbackLabel}
              </span>
              <div>
                <button type="button" className="export-action export-action--secondary" onClick={handleCopy}>
                  <Icon name={feedback === 'copied' ? 'check' : 'copy'} size={15} />
                  {feedback === 'copied' ? 'Copied' : 'Copy'}
                </button>
                <button type="button" className="export-action export-action--primary" onClick={handleDownload}>
                  <Icon name="download" size={15} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
