import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import type { PreviewViewport, ThemeMode } from '../../features/theme/theme.types'
import { SpecimenApp } from '../specimen/SpecimenApp'
import type { PreviewScenario } from '../specimen/specimen.types'
import { PreviewToolbar } from './PreviewToolbar'

type PreviewStageProps = {
  customProperties: CSSProperties
  fitToViewport: boolean
  mode: ThemeMode
  viewport: PreviewViewport
  onModeChange: (mode: ThemeMode) => void
  onViewportChange: (viewport: PreviewViewport) => void
}

export const PreviewStage = ({
  customProperties,
  fitToViewport,
  mode,
  viewport,
  onModeChange,
  onViewportChange,
}: PreviewStageProps) => {
  const [scenario, setScenario] = useState<PreviewScenario>('ready')
  const [fitScale, setFitScale] = useState(1)
  const previewRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!fitToViewport) return

    const preview = previewRef.current
    const specimen = preview?.querySelector<HTMLElement>('.specimen')
    const status = preview?.querySelector<HTMLElement>('.preview-viewport__status')

    if (!preview || !specimen) return

    const updateScale = () => {
      const styles = window.getComputedStyle(preview)
      const availableWidth = preview.clientWidth
        - Number.parseFloat(styles.paddingLeft)
        - Number.parseFloat(styles.paddingRight)
      const availableHeight = preview.clientHeight
        - Number.parseFloat(styles.paddingTop)
        - Number.parseFloat(styles.paddingBottom)
        - (preview.clientWidth <= 700 ? (status?.offsetHeight ?? 0) + 12 : 0)
      const nextScale = Math.min(
        1,
        availableWidth / specimen.offsetWidth,
        availableHeight / specimen.offsetHeight,
      )

      setFitScale((currentScale) => (
        Math.abs(currentScale - nextScale) < 0.002 ? currentScale : nextScale
      ))
    }

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateScale)

    resizeObserver?.observe(preview)
    resizeObserver?.observe(specimen)
    window.addEventListener('resize', updateScale)
    const animationFrame = window.requestAnimationFrame(updateScale)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updateScale)
    }
  }, [fitToViewport, mode, scenario, viewport])

  return <section className="preview-stage" aria-labelledby="preview-title">
    <PreviewToolbar
      mode={mode}
      scenario={scenario}
      viewport={viewport}
      onModeChange={onModeChange}
      onScenarioChange={setScenario}
      onViewportChange={onViewportChange}
    />
    <div
      className="preview-viewport"
      data-fit={fitToViewport}
      ref={previewRef}
      style={{ '--preview-fit-scale': fitToViewport ? fitScale : 1 } as CSSProperties}
    >
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
