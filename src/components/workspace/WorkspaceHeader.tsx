import { ForgeMark } from '../brand/ForgeMark'
import { Icon } from '../ui/Icon'

type WorkspaceHeaderProps = {
  projectName: string
  canUndo: boolean
  canRedo: boolean
  statusLabel: string
  statusTone: 'base' | 'custom'
  projectCount: number
  onRename: (name: string) => void
  onUndo: () => void
  onRedo: () => void
  onOpenLibrary: () => void
  onShare: () => void
  onExport: () => void
}

export const WorkspaceHeader = ({
  projectName,
  canUndo,
  canRedo,
  statusLabel,
  statusTone,
  projectCount,
  onRename,
  onUndo,
  onRedo,
  onOpenLibrary,
  onShare,
  onExport,
}: WorkspaceHeaderProps) => (
  <header className="forge-header">
    <a className="brand" href={import.meta.env.BASE_URL} aria-label="UI Forge home">
      <ForgeMark />
      <span className="brand__copy">
        <strong>UI Forge</strong>
        <small>Design system lab</small>
      </span>
    </a>

    <label className="project-name">
      <span className="project-name__label">Project</span>
      <input value={projectName} onChange={(event) => onRename(event.target.value)} />
      <span className="project-name__status" data-status={statusTone}>
        <span aria-hidden="true" />
        {statusLabel}
      </span>
    </label>

    <div className="history-actions" aria-label="Workspace actions">
      <button
        className="icon-button"
        type="button"
        aria-label="Undo last theme change"
        data-tooltip="Undo"
        disabled={!canUndo}
        onClick={onUndo}
      >
        <Icon name="undo" />
      </button>
      <button
        className="icon-button"
        type="button"
        aria-label="Redo last theme change"
        data-tooltip="Redo"
        disabled={!canRedo}
        onClick={onRedo}
      >
        <Icon name="redo" />
      </button>
      <span className="history-actions__separator" aria-hidden="true" />
      <button className="library-trigger" type="button" aria-label={`Open project library, ${projectCount} active`} onClick={onOpenLibrary}>
        <Icon name="folder" size={16} />
        <span>Projects</span>
        <strong aria-hidden="true">{projectCount}</strong>
      </button>
      <button className="icon-button share-trigger" type="button" aria-label="Share current project" data-tooltip="Share" onClick={onShare}>
        <Icon name="link" size={17} />
      </button>
      <button className="export-trigger" type="button" onClick={onExport}>
        <Icon name="export" size={16} />
        <span>Export</span>
      </button>
    </div>
  </header>
)
