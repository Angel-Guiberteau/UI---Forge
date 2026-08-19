import { Icon } from '../ui/Icon'

export type MobileWorkspaceView = 'presets' | 'preview'

type MobileWorkspaceNavProps = {
  view: MobileWorkspaceView
  onChange: (view: MobileWorkspaceView) => void
}

export const MobileWorkspaceNav = ({ view, onChange }: MobileWorkspaceNavProps) => (
  <nav className="mobile-workspace-nav" aria-label="Workspace sections">
    <button
      type="button"
      aria-current={view === 'presets' ? 'page' : undefined}
      onClick={() => onChange('presets')}
    >
      <Icon name="palette" />
      Presets
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
