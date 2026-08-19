import { type CSSProperties } from 'react'
import { createThemeCustomProperties } from '../features/theme/theme.css'
import { useTheme } from '../features/theme/useTheme'
import { themePresets } from '../presets/theme-presets'
import '../styles/app.css'

const viewportLabels = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Mobile',
} as const

export const App = () => {
  const { state, dispatch } = useTheme()
  const { project } = state
  const tokens = project.themes[project.activeMode]
  const customProperties = createThemeCustomProperties(tokens) as CSSProperties
  const timestamp = () => new Date().toISOString()

  return (
    <main className="forge-shell">
      <header className="forge-header">
        <a className="brand" href="/" aria-label="UI Forge home">
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand__name">UI Forge</span>
          <span className="brand__phase">Foundation</span>
        </a>

        <label className="project-name">
          <span className="visually-hidden">Project name</span>
          <input
            value={project.name}
            onChange={(event) => dispatch({
              type: 'project/rename',
              name: event.target.value,
              updatedAt: timestamp(),
            })}
          />
        </label>

        <div className="history-actions" aria-label="Edit history">
          <button
            type="button"
            disabled={state.past.length === 0}
            onClick={() => dispatch({ type: 'history/undo' })}
          >
            Undo
          </button>
          <button
            type="button"
            disabled={state.future.length === 0}
            onClick={() => dispatch({ type: 'history/redo' })}
          >
            Redo
          </button>
        </div>
      </header>

      <section className="forge-workspace" aria-label="Theme workspace">
        <aside className="forge-panel" aria-labelledby="presets-title">
          <div className="forge-panel__intro">
            <p className="eyebrow">Starting material</p>
            <h1 id="presets-title">Choose a character</h1>
            <p>Each preset reshapes the system, not just its palette.</p>
          </div>

          <div className="preset-list">
            {themePresets.map((preset) => (
              <button
                className="preset-card"
                data-active={project.originPresetId === preset.id}
                type="button"
                key={preset.id}
                aria-pressed={project.originPresetId === preset.id}
                onClick={() => dispatch({
                  type: 'project/apply-preset',
                  preset,
                  updatedAt: timestamp(),
                })}
              >
                <span className="preset-card__swatches" aria-hidden="true">
                  <span style={{ backgroundColor: preset.themes.light.colors.primary }} />
                  <span style={{ backgroundColor: preset.themes.light.colors.secondary }} />
                  <span style={{ backgroundColor: preset.themes.light.colors.surface }} />
                </span>
                <span className="preset-card__copy">
                  <strong>{preset.name}</strong>
                  <small>{preset.description}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="preview-stage" aria-labelledby="preview-title">
          <div className="preview-toolbar">
            <div>
              <p className="eyebrow">Live material test</p>
              <h2 id="preview-title">System specimen</h2>
            </div>

            <div className="preview-toolbar__controls">
              <div className="segmented-control" aria-label="Color mode">
                {(['light', 'dark'] as const).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    aria-pressed={project.activeMode === mode}
                    onClick={() => dispatch({ type: 'view/set-mode', mode })}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="segmented-control" aria-label="Preview viewport">
                {(['desktop', 'tablet', 'mobile'] as const).map((viewport) => (
                  <button
                    type="button"
                    key={viewport}
                    aria-label={`${viewportLabels[viewport]} preview`}
                    aria-pressed={state.viewport === viewport}
                    onClick={() => dispatch({ type: 'view/set-viewport', viewport })}
                  >
                    {viewportLabels[viewport].slice(0, 1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="preview-viewport">
            <article
              className="specimen"
              data-viewport={state.viewport}
              data-mode={project.activeMode}
              style={customProperties}
            >
              <nav className="specimen__nav" aria-label="Specimen navigation">
                <span className="specimen__logo">Northstar</span>
                <span className="specimen__nav-meta">Q3 workspace</span>
              </nav>
              <div className="specimen__body">
                <div className="specimen__heading">
                  <div>
                    <span>Operations overview</span>
                    <h3>Good systems create calm.</h3>
                  </div>
                  <button type="button">Create report</button>
                </div>
                <div className="specimen__grid">
                  <section className="metric-card">
                    <span>Active projects</span>
                    <strong>24</strong>
                    <small>+8.2% this month</small>
                  </section>
                  <section className="metric-card metric-card--accent">
                    <span>System health</span>
                    <strong>98.4%</strong>
                    <small>All services operational</small>
                  </section>
                  <section className="activity-card">
                    <div className="activity-card__heading">
                      <strong>Recent activity</strong>
                      <span>Today</span>
                    </div>
                    <ul>
                      <li><span>Research synthesis</span><strong>Ready</strong></li>
                      <li><span>Quarterly review</span><strong>Draft</strong></li>
                      <li><span>Product narrative</span><strong>Review</strong></li>
                    </ul>
                  </section>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  )
}
