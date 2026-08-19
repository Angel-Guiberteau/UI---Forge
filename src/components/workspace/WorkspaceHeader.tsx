import { ForgeMark } from '../brand/ForgeMark'
import { Icon } from '../ui/Icon'

type WorkspaceHeaderProps = {
  projectName: string
  canUndo: boolean
  canRedo: boolean
  statusLabel: string
  statusTone: 'base' | 'custom'
  onRename: (name: string) => void
  onUndo: () => void
  onRedo: () => void
}

export const WorkspaceHeader = ({
  projectName,
  canUndo,
  canRedo,
  statusLabel,
  statusTone,
  onRename,
  onUndo,
  onRedo,
}: WorkspaceHeaderProps) => (
  <header className="forge-header">
    <a className="brand" href="/" aria-label="UI Forge home">
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

    <div className="history-actions" aria-label="Edit history">
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
    </div>
  </header>
)
