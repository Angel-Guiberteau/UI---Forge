import { useEffect, useMemo, useRef, useState } from 'react'
import type { ThemeProject } from '../../features/theme/theme.types'
import { Icon } from '../ui/Icon'

type LibraryView = 'active' | 'archived'

type ProjectLibraryDialogProps = {
  open: boolean
  activeProjectId: string
  projects: ThemeProject[]
  onClose: () => void
  onCreate: () => void
  onSelect: (project: ThemeProject) => void
  onDuplicate: (project: ThemeProject) => void
  onArchive: (project: ThemeProject) => void
  onRestore: (project: ThemeProject) => void
}

const formatUpdatedAt = (updatedAt: string) => new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date(updatedAt))

export const ProjectLibraryDialog = ({
  open,
  activeProjectId,
  projects,
  onClose,
  onCreate,
  onSelect,
  onDuplicate,
  onArchive,
  onRestore,
}: ProjectLibraryDialogProps) => {
  const [view, setView] = useState<LibraryView>('active')
  const [archiveCandidate, setArchiveCandidate] = useState<ThemeProject | null>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const visibleProjects = useMemo(() => projects
    .filter((project) => view === 'active' ? project.archivedAt === null : project.archivedAt !== null)
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt)), [projects, view])
  const activeCount = projects.filter((project) => project.archivedAt === null).length
  const archivedCount = projects.length - activeCount

  useEffect(() => {
    if (!open) {
      return
    }

    const previousFocus = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (archiveCandidate) {
          setArchiveCandidate(null)
        } else {
          onClose()
        }
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>('button:not(:disabled)')
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
  }, [archiveCandidate, onClose, open])

  if (!open) {
    return null
  }

  if (archiveCandidate) {
    return (
      <div className="project-library-backdrop">
        <section className="archive-confirm" role="dialog" aria-modal="true" aria-labelledby="archive-confirm-title" ref={dialogRef}>
          <span className="archive-confirm__icon"><Icon name="archive" size={20} /></span>
          <p className="eyebrow">Move out of the workspace</p>
          <h2 id="archive-confirm-title">Archive {archiveCandidate.name}?</h2>
          <p>The theme stays on this device and can be restored from the archived view at any time.</p>
          <div className="archive-confirm__actions">
            <button ref={closeButtonRef} type="button" className="project-action project-action--secondary" onClick={() => setArchiveCandidate(null)}>Keep project</button>
            <button type="button" className="project-action project-action--danger" onClick={() => {
              onArchive(archiveCandidate)
              setArchiveCandidate(null)
            }}><Icon name="archive" size={15} /> Archive project</button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="project-library-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="project-library" role="dialog" aria-modal="true" aria-labelledby="project-library-title" ref={dialogRef}>
        <header className="project-library__header">
          <div className="project-library__identity">
            <span><Icon name="folder" size={19} /></span>
            <div><p className="eyebrow">Local workspace</p><h2 id="project-library-title">Project library</h2></div>
          </div>
          <button ref={closeButtonRef} type="button" aria-label="Close project library" onClick={onClose}><Icon name="close" /></button>
        </header>

        <div className="project-library__toolbar">
          <div className="project-library__tabs" role="tablist" aria-label="Project status">
            <button type="button" role="tab" aria-selected={view === 'active'} onClick={() => setView('active')}>Active <span>{activeCount}</span></button>
            <button type="button" role="tab" aria-selected={view === 'archived'} onClick={() => setView('archived')}>Archived <span>{archivedCount}</span></button>
          </div>
          <button type="button" className="project-action project-action--primary" onClick={onCreate}><Icon name="plus" size={15} /> New system</button>
        </div>

        <div className="project-library__body">
          {visibleProjects.length > 0 ? (
            <div className="project-grid">
              {visibleProjects.map((project) => {
                const colors = project.themes[project.activeMode].colors
                const isActive = project.id === activeProjectId

                return (
                  <article className="project-card" data-current={isActive} key={project.id}>
                    <div className="project-card__preview" style={{ background: colors.background }} aria-hidden="true">
                      <span style={{ background: colors.primary }} />
                      <span style={{ background: colors.secondary }} />
                      <span style={{ background: colors.surface }} />
                      <i style={{ background: colors.text }} />
                    </div>
                    <div className="project-card__copy">
                      <div>
                        <h3>{project.name}</h3>
                        {isActive && <span className="project-card__current"><i /> Editing</span>}
                      </div>
                      <p>{project.originPresetId === null ? 'Custom system' : `${project.basePresetId} foundation`} · {project.activeMode}</p>
                      <time dateTime={project.updatedAt}>Updated {formatUpdatedAt(project.updatedAt)}</time>
                    </div>
                    <div className="project-card__actions">
                      {view === 'active' ? (
                        <>
                          <button type="button" className="project-action project-action--secondary" disabled={isActive} onClick={() => onSelect(project)}>{isActive ? 'Open' : 'Open project'}</button>
                          <button type="button" className="project-icon-action" aria-label={`Duplicate ${project.name}`} data-tooltip="Duplicate" onClick={() => onDuplicate(project)}><Icon name="copy" size={15} /></button>
                          <button type="button" className="project-icon-action project-icon-action--danger" aria-label={`Archive ${project.name}`} data-tooltip={activeCount <= 1 ? 'Keep one active project' : 'Archive'} disabled={activeCount <= 1} onClick={() => setArchiveCandidate(project)}><Icon name="archive" size={15} /></button>
                        </>
                      ) : (
                        <button type="button" className="project-action project-action--secondary" onClick={() => onRestore(project)}><Icon name="refresh" size={14} /> Restore project</button>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="project-library__empty">
              <span><Icon name="archive" size={22} /></span>
              <h3>No archived projects</h3>
              <p>Projects you archive will stay safely available here.</p>
              <button type="button" className="project-action project-action--secondary" onClick={() => setView('active')}>Back to active projects</button>
            </div>
          )}
        </div>

        <footer className="project-library__footer">
          <span><i /> Stored locally in this browser</span>
          <span>{projects.length} {projects.length === 1 ? 'system' : 'systems'} total</span>
        </footer>
      </section>
    </div>
  )
}
