import type { CSSProperties } from 'react'
import type { PreviewViewport, ThemeMode } from '../../features/theme/theme.types'

type SpecimenAppProps = {
  customProperties: CSSProperties
  mode: ThemeMode
  viewport: PreviewViewport
}

const activities = [
  { name: 'Research synthesis', owner: 'MA', status: 'Ready' },
  { name: 'Quarterly review', owner: 'JL', status: 'Draft' },
  { name: 'Product narrative', owner: 'AK', status: 'Review' },
]

export const SpecimenApp = ({
  customProperties,
  mode,
  viewport,
}: SpecimenAppProps) => (
  <article
    className="specimen"
    data-viewport={viewport}
    data-mode={mode}
    style={customProperties}
  >
    <nav className="specimen__nav" aria-label="Specimen navigation">
      <span className="specimen__logo">
        <span aria-hidden="true">N</span>
        Northstar
      </span>
      <div className="specimen__nav-actions">
        <span className="specimen__nav-meta">Q3 workspace</span>
        <span className="specimen__avatar" aria-label="Signed in as Maya Allen">MA</span>
      </div>
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
          <small><span aria-hidden="true">↗</span> 8.2% this month</small>
        </section>
        <section className="metric-card metric-card--accent">
          <span>System health</span>
          <strong>98.4%</strong>
          <small><span className="status-dot" aria-hidden="true" /> All services operational</small>
        </section>
        <section className="activity-card">
          <div className="activity-card__heading">
            <div>
              <strong>Recent activity</strong>
              <small>Latest updates across your workspace</small>
            </div>
            <span>Today</span>
          </div>
          <ul>
            {activities.map((activity) => (
              <li key={activity.name}>
                <span className="activity-card__name">
                  <span className="activity-card__owner" aria-hidden="true">{activity.owner}</span>
                  {activity.name}
                </span>
                <strong>{activity.status}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  </article>
)
