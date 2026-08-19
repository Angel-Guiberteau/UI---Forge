import type { PreviewViewport, ThemeMode } from '../../features/theme/theme.types'
import { Icon, type IconName } from '../ui/Icon'

const viewportOptions: Array<{
  value: PreviewViewport
  label: string
  icon: IconName
}> = [
  { value: 'desktop', label: 'Desktop', icon: 'desktop' },
  { value: 'tablet', label: 'Tablet', icon: 'tablet' },
  { value: 'mobile', label: 'Mobile', icon: 'mobile' },
]

type PreviewToolbarProps = {
  mode: ThemeMode
  viewport: PreviewViewport
  onModeChange: (mode: ThemeMode) => void
  onViewportChange: (viewport: PreviewViewport) => void
}

export const PreviewToolbar = ({
  mode,
  viewport,
  onModeChange,
  onViewportChange,
}: PreviewToolbarProps) => (
  <div className="preview-toolbar">
    <div className="preview-toolbar__heading">
      <span className="panel-index" aria-hidden="true">02</span>
      <div>
        <p className="eyebrow">Live material test</p>
        <h2 id="preview-title">System specimen</h2>
      </div>
    </div>

    <div className="preview-toolbar__controls">
      <div className="segmented-control" aria-label="Color mode">
        <button
          type="button"
          aria-pressed={mode === 'light'}
          onClick={() => onModeChange('light')}
        >
          <Icon name="sun" size={15} />
          Light
        </button>
        <button
          type="button"
          aria-pressed={mode === 'dark'}
          onClick={() => onModeChange('dark')}
        >
          <Icon name="moon" size={15} />
          Dark
        </button>
      </div>

      <div className="segmented-control segmented-control--icons" aria-label="Preview viewport">
        {viewportOptions.map((option) => (
          <button
            type="button"
            key={option.value}
            aria-label={`${option.label} preview`}
            data-tooltip={option.label}
            aria-pressed={viewport === option.value}
            onClick={() => onViewportChange(option.value)}
          >
            <Icon name={option.icon} size={16} />
          </button>
        ))}
      </div>
    </div>
  </div>
)
