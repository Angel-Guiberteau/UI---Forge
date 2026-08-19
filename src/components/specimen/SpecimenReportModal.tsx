import { useEffect, useRef, useState, type RefObject } from 'react'
import { Icon } from '../ui/Icon'

type SpecimenReportModalProps = {
  returnFocusRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
  onCreated: (reportName: string) => void
}

export const SpecimenReportModal = ({
  returnFocusRef,
  onClose,
  onCreated,
}: SpecimenReportModalProps) => {
  const dialog = useRef<HTMLDivElement>(null)
  const titleInput = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const returnFocusElement = returnFocusRef.current
    titleInput.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialog.current) return

      const focusable = dialog.current.querySelectorAll<HTMLElement>('button, input, select, textarea')
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
      returnFocusElement?.focus()
    }
  }, [onClose, returnFocusRef])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    const formData = new FormData(event.currentTarget)
    const reportName = String(formData.get('title'))
    setIsSubmitting(true)
    onCreated(reportName)
  }

  return (
    <div className="specimen-dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div className="specimen-dialog" role="dialog" aria-modal="true" aria-labelledby="report-dialog-title" ref={dialog}>
        <div className="specimen-dialog__heading">
          <div><span>New report</span><h4 id="report-dialog-title">Turn progress into a story.</h4></div>
          <button type="button" aria-label="Close report form" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Report title</span>
            <input ref={titleInput} name="title" type="text" defaultValue="Weekly operations pulse" required />
          </label>
          <div className="specimen-form-row">
            <label>
              <span>Reporting period</span>
              <select name="period" defaultValue="week"><option value="week">This week</option><option value="month">This month</option><option value="quarter">This quarter</option></select>
            </label>
            <label>
              <span>Audience</span>
              <select name="audience" defaultValue="leadership"><option value="leadership">Leadership</option><option value="team">Project team</option><option value="company">Company</option></select>
            </label>
          </div>
          <label>
            <span>Focus note <small>Optional</small></span>
            <textarea name="focus" rows={3} placeholder="Add context for this report" />
          </label>
          <div className="specimen-dialog__actions">
            <button type="button" className="specimen-button specimen-button--secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="specimen-button specimen-button--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
