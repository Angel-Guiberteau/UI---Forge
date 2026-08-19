import { useEffect, useRef } from 'react'
import { Icon } from './Icon'

type ConfirmResetDialogProps = {
  open: boolean
  presetName: string
  onCancel: () => void
  onConfirm: () => void
}

export const ConfirmResetDialog = ({
  open,
  presetName,
  onCancel,
  onConfirm,
}: ConfirmResetDialogProps) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const previousFocus = document.activeElement as HTMLElement | null
    cancelButtonRef.current?.focus()

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      previousFocus?.focus()
    }
  }, [onCancel, open])

  if (!open) {
    return null
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onCancel}>
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') {
            return
          }

          if (event.shiftKey && document.activeElement === cancelButtonRef.current) {
            event.preventDefault()
            confirmButtonRef.current?.focus()
          } else if (!event.shiftKey && document.activeElement === confirmButtonRef.current) {
            event.preventDefault()
            cancelButtonRef.current?.focus()
          }
        }}
      >
        <span className="confirm-dialog__icon" aria-hidden="true">
          <Icon name="reset" size={22} />
        </span>
        <p className="eyebrow">Return to base</p>
        <h2 id="reset-dialog-title">Reset the entire theme?</h2>
        <p id="reset-dialog-description">
          Light and dark values will return to the {presetName} preset. You can
          still undo this action afterwards.
        </p>
        <div className="confirm-dialog__actions">
          <button ref={cancelButtonRef} type="button" onClick={onCancel}>Keep changes</button>
          <button
            ref={confirmButtonRef}
            className="confirm-dialog__confirm"
            type="button"
            onClick={onConfirm}
          >
            Reset theme
          </button>
        </div>
      </section>
    </div>
  )
}
