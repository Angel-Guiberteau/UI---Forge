import { Icon } from '../ui/Icon'

const activity = [
  { name: 'Research synthesis', meta: 'Updated 12 min ago', owner: 'MA', status: 'Ready' },
  { name: 'Quarterly review', meta: 'Updated 36 min ago', owner: 'JL', status: 'Draft' },
  { name: 'Product narrative', meta: 'Updated 2 hr ago', owner: 'AK', status: 'Review' },
]

export const SpecimenOverview = () => (
  <div className="specimen-dashboard">
    <section className="specimen-callout">
      <span className="specimen-callout__icon"><Icon name="activity" size={16} /></span>
      <div><strong>Everything is moving in the right direction.</strong><small>3 milestones were completed this week.</small></div>
      <a href="#recent-work">View activity</a>
    </section>

    <div className="specimen-metrics">
      <section className="metric-card">
        <span>Active projects</span>
        <strong>24</strong>
        <small><b>↗ 8.2%</b> this month</small>
      </section>
      <section className="metric-card">
        <span>Completion rate</span>
        <strong>87%</strong>
        <small>Across 6 teams</small>
      </section>
      <section className="metric-card metric-card--accent">
        <span>System health</span>
        <strong>98.4%</strong>
        <small><i aria-hidden="true" /> All services operational</small>
      </section>
    </div>

    <section className="specimen-activity" id="recent-work">
      <div className="specimen-card-heading">
        <div><strong>Recent work</strong><small>Latest updates across your workspace</small></div>
        <button type="button">View all</button>
      </div>
      <ul>
        {activity.map((item) => (
          <li key={item.name}>
            <span className="specimen-activity__owner" aria-hidden="true">{item.owner}</span>
            <span className="specimen-activity__name"><strong>{item.name}</strong><small>{item.meta}</small></span>
            <span className={`specimen-badge specimen-badge--${item.status.toLowerCase()}`}>{item.status}</span>
          </li>
        ))}
      </ul>
    </section>
  </div>
)
