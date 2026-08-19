import { Icon } from '../ui/Icon'

export type MobileWorkspaceView = 'design' | 'preview'

type MobileWorkspaceNavProps = {
  view: MobileWorkspaceView
  onChange: (view: MobileWorkspaceView) => void
}

export const MobileWorkspaceNav = ({ view, onChange }: MobileWorkspaceNavProps) => (
  <nav className="mobile-workspace-nav" aria-label="Workspace sections">
    <button
      type="button"
      aria-current={view === 'design' ? 'page' : undefined}
      onClick={() => onChange('design')}
    >
      <Icon name="palette" />
      Design
    </button>
    <button
      type="button"
      aria-current={view === 'preview' ? 'page' : undefined}
      onClick={() => onChange('preview')}
    >
      <Icon name="preview" />
      Preview
    </button>
  </nav>
)
