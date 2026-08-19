import { themePresets } from '../../presets/theme-presets'
import type { ThemeMode, ThemePreset } from '../../features/theme/theme.types'
import { Icon } from '../ui/Icon'

type PresetPanelProps = {
  activePresetId: string | null
  activeMode: ThemeMode
  onSelect: (preset: ThemePreset) => void
}

export const PresetPanel = ({
  activePresetId,
  activeMode,
  onSelect,
}: PresetPanelProps) => (
  <aside className="forge-panel" aria-labelledby="presets-title">
    <div className="forge-panel__header">
      <span className="panel-index" aria-hidden="true">01</span>
      <div>
        <p className="eyebrow">Starting material</p>
        <h1 id="presets-title">Choose a character</h1>
      </div>
    </div>
    <p className="forge-panel__description">
      Start with a considered system. Every preset changes rhythm, shape,
      typography, and depth.
    </p>

    <div className="preset-list">
      {themePresets.map((preset) => {
        const isActive = activePresetId === preset.id
        const colors = preset.themes[activeMode].colors
        const radius = preset.themes[activeMode].radius.medium

        return (
          <button
            className="preset-card"
            data-active={isActive}
            type="button"
            key={preset.id}
            aria-pressed={isActive}
            onClick={() => onSelect(preset)}
          >
            <span className="preset-card__swatches" aria-hidden="true">
              <span style={{ backgroundColor: colors.primary }} />
              <span style={{ backgroundColor: colors.secondary }} />
              <span style={{ backgroundColor: colors.surface }} />
            </span>
            <span className="preset-card__copy">
              <span className="preset-card__title">
                <strong>{preset.name}</strong>
                {isActive && (
                  <span className="preset-card__selected" aria-label="Selected">
                    <Icon name="check" size={14} />
                  </span>
                )}
              </span>
              <small>{preset.description}</small>
              <span className="preset-card__meta">
                {radius === 0 ? 'Square geometry' : `${radius}px radius`}
                <span aria-hidden="true">·</span>
                {preset.themes[activeMode].spacing.density < 1 ? 'Compact' : 'Balanced'}
              </span>
            </span>
          </button>
        )
      })}
    </div>

    <div className="forge-panel__footnote">
      <span className="forge-panel__spark" aria-hidden="true" />
      <p><strong>Live foundation</strong> Changes are stored in this browser.</p>
    </div>
  </aside>
)
