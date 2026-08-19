import type { CSSProperties } from 'react'
import type { PreviewViewport, ThemeMode } from '../../features/theme/theme.types'
import { SpecimenApp } from '../specimen/SpecimenApp'
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
}: PreviewStageProps) => (
  <section className="preview-stage" aria-labelledby="preview-title">
    <PreviewToolbar
      mode={mode}
      viewport={viewport}
      onModeChange={onModeChange}
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
        viewport={viewport}
      />
      <div className="preview-viewport__status" aria-live="polite">
        <span aria-hidden="true" />
        {viewport} · {mode}
      </div>
    </div>
  </section>
)
