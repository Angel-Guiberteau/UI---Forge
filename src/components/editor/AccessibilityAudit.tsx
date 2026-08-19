import { evaluateContrast, type ContrastRequirement } from '../../features/accessibility/contrast'
import type { ColorTokens, ThemeMode } from '../../features/theme/theme.types'
import { Icon } from '../ui/Icon'

type AccessibilityAuditProps = {
  colors: ColorTokens
  mode: ThemeMode
  onEditColors: () => void
}

type ContrastPair = {
  label: string
  description: string
  foreground: string
  background: string
  requirement: ContrastRequirement
}

const createContrastPairs = (colors: ColorTokens): ContrastPair[] => [
  { label: 'Primary text', description: 'Text on application background', foreground: colors.text, background: colors.background, requirement: 'normal-text' },
  { label: 'Surface text', description: 'Text inside cards and navigation', foreground: colors.text, background: colors.surface, requirement: 'normal-text' },
  { label: 'Muted copy', description: 'Secondary text on the canvas', foreground: colors.textMuted, background: colors.background, requirement: 'normal-text' },
  { label: 'Muted on surface', description: 'Metadata and supporting labels', foreground: colors.textMuted, background: colors.surface, requirement: 'normal-text' },
  { label: 'Primary action', description: 'Button label against primary fill', foreground: colors.background, background: colors.primary, requirement: 'normal-text' },
  { label: 'Accent copy', description: 'Primary color used as readable text', foreground: colors.primary, background: colors.background, requirement: 'normal-text' },
  { label: 'Structural border', description: 'Controls against the application canvas', foreground: colors.border, background: colors.background, requirement: 'interface' },
]

export const AccessibilityAudit = ({ colors, mode, onEditColors }: AccessibilityAuditProps) => {
  const results = createContrastPairs(colors).map((pair) => ({
    ...pair,
    result: evaluateContrast(pair.foreground, pair.background, pair.requirement),
  }))
  const passingCount = results.filter(({ result }) => result.passesAA).length
  const failingCount = results.length - passingCount
  const score = Math.round((passingCount / results.length) * 100)
  const summaryStatus = failingCount === 0 ? 'pass' : score >= 70 ? 'review' : 'fail'

  return (
    <div className="accessibility-audit">
      <section className="accessibility-score" data-status={summaryStatus} aria-live="polite">
        <div className="accessibility-score__meter" style={{ '--audit-score': `${score * 3.6}deg` } as React.CSSProperties}>
          <span>{score}</span>
          <small>/ 100</small>
        </div>
        <div className="accessibility-score__copy">
          <span>{mode} theme audit</span>
          <h2>{failingCount === 0 ? 'All core pairs pass.' : `${failingCount} ${failingCount === 1 ? 'pair needs' : 'pairs need'} attention.`}</h2>
          <p>{passingCount} of {results.length} combinations meet their WCAG AA target.</p>
        </div>
      </section>

      {failingCount > 0 && (
        <div className="accessibility-alert" role="alert">
          <span><Icon name="alert" size={15} /></span>
          <p><strong>Contrast risk detected.</strong> Small text needs 4.5:1; controls and structural cues need 3:1.</p>
          <button type="button" onClick={onEditColors}>Edit colors</button>
        </div>
      )}

      <section className="contrast-report" aria-labelledby="contrast-report-title">
        <div className="contrast-report__heading">
          <div><h2 id="contrast-report-title">Semantic pairs</h2><p>Calculated from the active tokens, not isolated swatches.</p></div>
          <span>WCAG 2.2</span>
        </div>
        <ul>
          {results.map((pair) => (
            <li key={pair.label} data-status={pair.result.passesAA ? 'pass' : 'fail'}>
              <span className="contrast-swatches" aria-hidden="true">
                <i style={{ backgroundColor: pair.background }} />
                <i style={{ backgroundColor: pair.foreground }} />
              </span>
              <span className="contrast-pair__copy">
                <strong>{pair.label}</strong>
                <small>{pair.description}</small>
              </span>
              <span className="contrast-ratio" aria-label={`${pair.label} contrast ratio ${pair.result.ratio.toFixed(2)} to 1`}>
                <strong>{pair.result.ratio.toFixed(2)}</strong>
                <small>: 1</small>
              </span>
              <span className="contrast-levels">
                <span data-pass={pair.result.passesAA}><Icon name={pair.result.passesAA ? 'check' : 'close'} size={10} />{pair.requirement === 'interface' ? 'UI' : 'AA'}</span>
                {pair.result.passesAAA !== null && <span data-pass={pair.result.passesAAA}><Icon name={pair.result.passesAAA ? 'check' : 'close'} size={10} />AAA</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="accessibility-note"><Icon name="shield" size={14} /> Contrast is one part of accessibility. Keyboard flow, semantics, motion, and readable labels remain essential.</p>
    </div>
  )
}
