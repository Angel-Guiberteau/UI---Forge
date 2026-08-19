import type { Dispatch } from 'react'
import type { ThemeEditorAction } from '../../features/theme/theme.reducer'
import type {
  ColorTokens,
  ThemeCategory,
  ThemeMode,
  ThemeTokens,
} from '../../features/theme/theme.types'
import { ColorField, RangeField, SelectField } from './TokenFields'

const systemSans = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
const editorialSerif = 'Georgia, "Times New Roman", serif'
const mono = '"SFMono-Regular", Consolas, "Liberation Mono", monospace'

const fontOptions = [
  { label: 'System Sans', value: systemSans },
  { label: 'Editorial Serif', value: editorialSerif },
  { label: 'Technical Mono', value: mono },
]

const colorFields: Array<{
  key: keyof ColorTokens
  label: string
  description: string
}> = [
  { key: 'primary', label: 'Primary', description: 'Main actions and emphasis' },
  { key: 'secondary', label: 'Secondary', description: 'Supporting accents' },
  { key: 'background', label: 'Background', description: 'Application canvas' },
  { key: 'surface', label: 'Surface', description: 'Cards and navigation' },
  { key: 'surfaceElevated', label: 'Raised surface', description: 'Menus and overlays' },
  { key: 'text', label: 'Text', description: 'Primary readable content' },
  { key: 'textMuted', label: 'Muted text', description: 'Secondary information' },
  { key: 'border', label: 'Border', description: 'Structure and dividers' },
  { key: 'success', label: 'Success', description: 'Positive status' },
  { key: 'warning', label: 'Warning', description: 'Attention states' },
  { key: 'danger', label: 'Danger', description: 'Errors and destructive actions' },
]

type ThemeTokenEditorProps = {
  section: ThemeCategory
  mode: ThemeMode
  tokens: ThemeTokens
  dispatch: Dispatch<ThemeEditorAction>
}

export const ThemeTokenEditor = ({
  section,
  mode,
  tokens,
  dispatch,
}: ThemeTokenEditorProps) => {
  const updatedAt = () => new Date().toISOString()

  if (section === 'colors') {
    return (
      <div className="token-fields">
        {colorFields.map((field) => (
          <ColorField
            key={field.key}
            label={field.label}
            description={field.description}
            value={tokens.colors[field.key]}
            onChange={(value) => dispatch({
              type: 'theme/update-colors',
              mode,
              values: { [field.key]: value },
              updatedAt: updatedAt(),
            })}
          />
        ))}
      </div>
    )
  }

  if (section === 'typography') {
    return (
      <div className="token-fields">
        <SelectField label="Body family" description="Interface and long-form copy" value={tokens.typography.fontFamily} options={fontOptions} onChange={(fontFamily) => dispatch({ type: 'theme/update-typography', mode, values: { fontFamily }, updatedAt: updatedAt() })} />
        <SelectField label="Display family" description="Headings and metric values" value={tokens.typography.displayFontFamily} options={fontOptions} onChange={(displayFontFamily) => dispatch({ type: 'theme/update-typography', mode, values: { displayFontFamily }, updatedAt: updatedAt() })} />
        <RangeField label="Base size" description="Root text size" value={tokens.typography.baseSize} min={12} max={20} step={1} unit="px" onChange={(baseSize) => dispatch({ type: 'theme/update-typography', mode, values: { baseSize }, updatedAt: updatedAt() })} />
        <RangeField label="Type scale" description="Ratio between heading levels" value={tokens.typography.scaleRatio} min={1.1} max={1.5} step={0.01} onChange={(scaleRatio) => dispatch({ type: 'theme/update-typography', mode, values: { scaleRatio }, updatedAt: updatedAt() })} />
        <RangeField label="Line height" description="Vertical reading rhythm" value={tokens.typography.lineHeight} min={1.2} max={1.8} step={0.05} onChange={(lineHeight) => dispatch({ type: 'theme/update-typography', mode, values: { lineHeight }, updatedAt: updatedAt() })} />
        <RangeField label="Heading weight" description="Emphasis for display text" value={tokens.typography.headingWeight} min={400} max={800} step={50} onChange={(headingWeight) => dispatch({ type: 'theme/update-typography', mode, values: { headingWeight }, updatedAt: updatedAt() })} />
        <RangeField label="Body weight" description="Weight for readable copy" value={tokens.typography.bodyWeight} min={300} max={600} step={50} onChange={(bodyWeight) => dispatch({ type: 'theme/update-typography', mode, values: { bodyWeight }, updatedAt: updatedAt() })} />
      </div>
    )
  }

  if (section === 'radius') {
    return (
      <div className="token-fields">
        <RangeField label="Small radius" description="Badges and compact controls" value={tokens.radius.small} min={0} max={24} step={1} unit="px" onChange={(small) => dispatch({ type: 'theme/update-radius', mode, values: { small }, updatedAt: updatedAt() })} />
        <RangeField label="Medium radius" description="Buttons and inputs" value={tokens.radius.medium} min={0} max={32} step={1} unit="px" onChange={(medium) => dispatch({ type: 'theme/update-radius', mode, values: { medium }, updatedAt: updatedAt() })} />
        <RangeField label="Large radius" description="Cards and large surfaces" value={tokens.radius.large} min={0} max={48} step={1} unit="px" onChange={(large) => dispatch({ type: 'theme/update-radius', mode, values: { large }, updatedAt: updatedAt() })} />
        <RangeField label="Pill radius" description="Capsules and avatars" value={tokens.radius.pill} min={0} max={999} step={1} unit="px" onChange={(pill) => dispatch({ type: 'theme/update-radius', mode, values: { pill }, updatedAt: updatedAt() })} />
      </div>
    )
  }

  if (section === 'spacing') {
    return (
      <div className="token-fields">
        <RangeField label="Base unit" description="Foundation of the spacing scale" value={tokens.spacing.baseUnit} min={2} max={8} step={1} unit="px" onChange={(baseUnit) => dispatch({ type: 'theme/update-spacing', mode, values: { baseUnit }, updatedAt: updatedAt() })} />
        <RangeField label="Density" description="Global interface compactness" value={tokens.spacing.density} min={0.75} max={1.25} step={0.05} onChange={(density) => dispatch({ type: 'theme/update-spacing', mode, values: { density }, updatedAt: updatedAt() })} />
      </div>
    )
  }

  if (section === 'shadows') {
    return (
      <div className="token-fields">
        <ColorField label="Shadow color" description="Tint used for elevation" value={tokens.shadows.color} onChange={(color) => dispatch({ type: 'theme/update-shadows', mode, values: { color }, updatedAt: updatedAt() })} />
        <RangeField label="Opacity" description="Strength of the shadow" value={tokens.shadows.opacity} min={0} max={0.5} step={0.01} onChange={(opacity) => dispatch({ type: 'theme/update-shadows', mode, values: { opacity }, updatedAt: updatedAt() })} />
        <RangeField label="Blur" description="Softness of the shadow edge" value={tokens.shadows.blur} min={0} max={60} step={1} unit="px" onChange={(blur) => dispatch({ type: 'theme/update-shadows', mode, values: { blur }, updatedAt: updatedAt() })} />
        <RangeField label="Spread" description="Expansion around the surface" value={tokens.shadows.spread} min={-20} max={20} step={1} unit="px" onChange={(spread) => dispatch({ type: 'theme/update-shadows', mode, values: { spread }, updatedAt: updatedAt() })} />
        <RangeField label="Vertical offset" description="Distance from the surface" value={tokens.shadows.offsetY} min={-20} max={40} step={1} unit="px" onChange={(offsetY) => dispatch({ type: 'theme/update-shadows', mode, values: { offsetY }, updatedAt: updatedAt() })} />
      </div>
    )
  }

  return (
    <div className="token-fields">
      <RangeField label="Control height" description="Buttons, inputs, and selects" value={tokens.controls.height} min={32} max={56} step={1} unit="px" onChange={(height) => dispatch({ type: 'theme/update-controls', mode, values: { height }, updatedAt: updatedAt() })} />
      <RangeField label="Border width" description="Definition around controls" value={tokens.controls.borderWidth} min={0} max={4} step={1} unit="px" onChange={(borderWidth) => dispatch({ type: 'theme/update-controls', mode, values: { borderWidth }, updatedAt: updatedAt() })} />
      <RangeField label="Focus ring" description="Keyboard focus visibility" value={tokens.controls.focusRingWidth} min={1} max={6} step={1} unit="px" onChange={(focusRingWidth) => dispatch({ type: 'theme/update-controls', mode, values: { focusRingWidth }, updatedAt: updatedAt() })} />
    </div>
  )
}
