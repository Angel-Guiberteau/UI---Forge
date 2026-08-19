import { useState, type CSSProperties } from 'react'
import { createThemeCustomProperties } from '../../features/theme/theme.css'
import type { ThemeCategory, ThemeEditorSection } from '../../features/theme/theme.types'
import { useTheme } from '../../features/theme/useTheme'
import { defaultPreset, themePresets } from '../../presets/theme-presets'
import { ConfirmResetDialog } from '../ui/ConfirmResetDialog'
import { Icon, type IconName } from '../ui/Icon'
import { AccessibilityAudit } from './AccessibilityAudit'
import { PresetSection } from './PresetSection'
import { ThemeTokenEditor } from './ThemeTokenEditor'

const editorSections: Array<{
  id: ThemeEditorSection
  label: string
  icon: IconName
}> = [
  { id: 'presets', label: 'Presets', icon: 'palette' },
  { id: 'colors', label: 'Colors', icon: 'palette' },
  { id: 'typography', label: 'Type', icon: 'type' },
  { id: 'radius', label: 'Radius', icon: 'radius' },
  { id: 'spacing', label: 'Spacing', icon: 'spacing' },
  { id: 'shadows', label: 'Depth', icon: 'shadow' },
  { id: 'controls', label: 'Focus', icon: 'controls' },
  { id: 'accessibility', label: 'Audit', icon: 'shield' },
]

const sectionDetails: Record<ThemeEditorSection, { eyebrow: string; title: string; description: string }> = {
  presets: { eyebrow: 'Visual direction', title: 'Choose a character', description: 'A complete visual direction for both modes.' },
  colors: { eyebrow: 'Color system', title: 'Set the atmosphere', description: 'Semantic colors keep the interface coherent.' },
  typography: { eyebrow: 'Type system', title: 'Shape the voice', description: 'Control hierarchy, rhythm, and readability.' },
  radius: { eyebrow: 'Geometry', title: 'Define the edges', description: 'A consistent curve language across components.' },
  spacing: { eyebrow: 'Layout rhythm', title: 'Tune the density', description: 'Build calm through a predictable spacing scale.' },
  shadows: { eyebrow: 'Elevation', title: 'Control the depth', description: 'Use light and distance to separate surfaces.' },
  controls: { eyebrow: 'Interaction', title: 'Refine the controls', description: 'Size and focus details for usable actions.' },
  accessibility: { eyebrow: 'Accessibility lab', title: 'Measure the contrast', description: 'Test semantic color pairs against WCAG targets.' },
}

export const DesignPanel = () => {
  const { state, dispatch } = useTheme()
  const [isResetOpen, setIsResetOpen] = useState(false)
  const { project, selectedSection } = state
  const tokens = project.themes[project.activeMode]
  const basePreset = themePresets.find((preset) => preset.id === project.basePresetId) ?? defaultPreset
  const details = sectionDetails[selectedSection]
  const customProperties = createThemeCustomProperties(tokens) as CSSProperties
  const isTokenSection = selectedSection !== 'presets' && selectedSection !== 'accessibility'
  const isSectionDirty = (section: ThemeCategory) => (
    JSON.stringify(tokens[section]) !== JSON.stringify(basePreset.themes[project.activeMode][section])
  )

  const resetSection = (section: ThemeCategory) => dispatch({
    type: 'project/reset-section',
    preset: basePreset,
    mode: project.activeMode,
    section,
    updatedAt: new Date().toISOString(),
  })

  return (
    <aside className="forge-panel" aria-labelledby="editor-section-title">
      <nav className="editor-nav" aria-label="Theme editor sections">
        {editorSections.map((section) => (
          <button
            type="button"
            key={section.id}
            aria-current={selectedSection === section.id ? 'page' : undefined}
            onClick={() => dispatch({ type: 'view/set-section', section: section.id })}
          >
            <Icon name={section.icon} size={16} />
            {section.label}
          </button>
        ))}
      </nav>

      <div className="forge-panel__header forge-panel__header--editor">
        <span className="panel-index" aria-hidden="true">01</span>
        <div>
          <p className="eyebrow">{details.eyebrow}</p>
          <h1 id="editor-section-title">{details.title}</h1>
        </div>
        {isTokenSection && (
          <button
            className="section-reset"
            type="button"
            disabled={!isSectionDirty(selectedSection)}
            onClick={() => resetSection(selectedSection)}
          >
            <Icon name="reset" size={14} />
            Reset
          </button>
        )}
      </div>

      {selectedSection !== 'presets' && (
        <div className="editor-context">
          <p>{details.description}</p>
          <span>{project.activeMode} mode</span>
        </div>
      )}

      {selectedSection === 'presets' && (
        <PresetSection
          basePresetId={project.basePresetId}
          isCustomized={project.originPresetId === null}
          activeMode={project.activeMode}
          onSelect={(preset) => dispatch({
            type: 'project/apply-preset',
            preset,
            updatedAt: new Date().toISOString(),
          })}
        />
      )}

      {selectedSection === 'accessibility' && (
        <AccessibilityAudit
          colors={tokens.colors}
          mode={project.activeMode}
          onEditColors={() => dispatch({ type: 'view/set-section', section: 'colors' })}
        />
      )}

      {isTokenSection && (
        <>
          <div className="token-sample" data-section={selectedSection} style={customProperties} aria-hidden="true">
            <span>Aa</span>
            <i />
            <button type="button" tabIndex={-1}>Action</button>
          </div>
          <ThemeTokenEditor
            section={selectedSection}
            mode={project.activeMode}
            tokens={tokens}
            dispatch={dispatch}
          />
        </>
      )}

      <div className="forge-panel__footer">
        <div>
          <span className="forge-panel__spark" aria-hidden="true" />
          <p><strong>{project.originPresetId === null ? 'Custom theme' : `${basePreset.name} preset`}</strong> Saved in this browser</p>
        </div>
        <button
          type="button"
          disabled={project.originPresetId !== null}
          onClick={() => setIsResetOpen(true)}
        >
          <Icon name="reset" size={14} />
          Reset theme
        </button>
      </div>

      <ConfirmResetDialog
        open={isResetOpen}
        presetName={basePreset.name}
        onCancel={() => setIsResetOpen(false)}
        onConfirm={() => {
          dispatch({
            type: 'project/apply-preset',
            preset: basePreset,
            updatedAt: new Date().toISOString(),
          })
          setIsResetOpen(false)
        }}
      />
    </aside>
  )
}
