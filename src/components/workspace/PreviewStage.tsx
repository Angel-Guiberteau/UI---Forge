import { useState, type CSSProperties } from 'react'
import type { PreviewViewport, ThemeMode } from '../../features/theme/theme.types'
import { SpecimenApp } from '../specimen/SpecimenApp'
import type { PreviewScenario } from '../specimen/specimen.types'
import { PreviewToolbar } from './PreviewToolbar'

type PreviewStageProps = {
  customProperties: CSSProperties
  mode: ThemeMode
  viewport: PreviewViewport
  onModeChange: (mode: ThemeMode) => void
  onViewportChange: (viewport: PreviewViewport) => void
}

export const PreviewStage = ({
  customProperties,
  mode,
  viewport,
  onModeChange,
  onViewportChange,
}: PreviewStageProps) => {
  const [scenario, setScenario] = useState<PreviewScenario>('ready')

  return <section className="preview-stage" aria-labelledby="preview-title">
    <PreviewToolbar
      mode={mode}
      scenario={scenario}
      viewport={viewport}
      onModeChange={onModeChange}
      onScenarioChange={setScenario}
      onViewportChange={onViewportChange}
    />
    <div className="preview-viewport">
      <div className="preview-viewport__ruler" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <SpecimenApp
        customProperties={customProperties}
        mode={mode}
        scenario={scenario}
        viewport={viewport}
      />
      <div className="preview-viewport__status" aria-live="polite">
        <span className="preview-viewport__signal" aria-hidden="true" />
        <span>{viewport} · {mode}</span>
        <em>· {scenario}</em>
      </div>
    </div>
  </section>
}
