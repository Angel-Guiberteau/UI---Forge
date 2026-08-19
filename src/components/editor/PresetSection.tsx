import { themePresets } from '../../presets/theme-presets'
import type { ThemeMode, ThemePreset } from '../../features/theme/theme.types'
import { Icon } from '../ui/Icon'

type PresetSectionProps = {
  basePresetId: string
  isCustomized: boolean
  activeMode: ThemeMode
  onSelect: (preset: ThemePreset) => void
}

export const PresetSection = ({
  basePresetId,
  isCustomized,
  activeMode,
  onSelect,
}: PresetSectionProps) => (
  <>
    <p className="forge-panel__description">
      Start with a considered system. Every preset changes rhythm, shape,
      typography, and depth.
    </p>

    <div className="preset-list">
      {themePresets.map((preset) => {
        const isBase = basePresetId === preset.id
        const colors = preset.themes[activeMode].colors
        const radius = preset.themes[activeMode].radius.medium

        return (
          <button
            className="preset-card"
            data-active={isBase}
            type="button"
            key={preset.id}
            aria-pressed={isBase}
            onClick={() => onSelect(preset)}
          >
            <span className="preset-card__swatches" aria-hidden="true">
              <span style={{ backgroundColor: colors.primary }} />
              <span style={{ backgroundColor: colors.secondary }} />
              <span style={{ backgroundColor: colors.surface }} />
            </span>
            <span className="preset-card__copy">
              <span className="preset-card__title">
                <span>
                  <small>{preset.category}</small>
                  <strong>{preset.name}</strong>
                </span>
                {isBase && (
                  <span
                    className="preset-card__selected"
                    data-customized={isCustomized}
                    aria-label={isCustomized ? 'Customized base' : 'Selected'}
                  >
                    {isCustomized ? <span>Edited</span> : <Icon name="check" size={14} />}
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
  </>
)
