import { Icon } from '../ui/Icon'
import type { PreviewScenario } from './specimen.types'

type SpecimenScenarioStateProps = {
  type: Exclude<PreviewScenario, 'ready'> | 'team'
}

const team = [
  { name: 'Maya Allen', role: 'Workspace lead', initials: 'MA', capacity: 68 },
  { name: 'Ari Kim', role: 'Product designer', initials: 'AK', capacity: 74 },
  { name: 'Jon Bell', role: 'Research lead', initials: 'JB', capacity: 81 },
]

export const SpecimenScenarioState = ({ type }: SpecimenScenarioStateProps) => {
  if (type === 'loading') {
    return (
      <div className="specimen-loading" aria-busy="true" aria-label="Loading dashboard">
        <div className="specimen-skeleton specimen-skeleton--callout" />
        <div className="specimen-loading__grid"><div className="specimen-skeleton" /><div className="specimen-skeleton" /><div className="specimen-skeleton" /></div>
        <div className="specimen-skeleton specimen-skeleton--table" />
      </div>
    )
  }

  if (type === 'empty') {
    return (
      <section className="specimen-state">
        <span className="specimen-state__icon"><Icon name="inbox" size={24} /></span>
        <span>Clear workspace</span>
        <h4>No projects need your attention.</h4>
        <p>New work and updates from your team will appear here when they arrive.</p>
        <button type="button" className="specimen-button specimen-button--primary"><Icon name="plus" size={14} /> Create a project</button>
      </section>
    )
  }

  if (type === 'error') {
    return (
      <section className="specimen-state specimen-state--error" role="alert">
        <span className="specimen-state__icon"><Icon name="alert" size={24} /></span>
        <span>Connection interrupted</span>
        <h4>We couldn’t load this workspace.</h4>
        <p>Your changes are safe. Check your connection and try loading the dashboard again.</p>
        <button type="button" className="specimen-button specimen-button--secondary"><Icon name="refresh" size={14} /> Try again</button>
      </section>
    )
  }

  return (
    <div className="specimen-team">
      <div className="specimen-card-heading"><div><strong>Core team</strong><small>Capacity across active initiatives</small></div><button type="button">Manage team</button></div>
      <ul>
        {team.map((member) => (
          <li key={member.name}>
            <span className="specimen-team__avatar">{member.initials}</span>
            <span><strong>{member.name}</strong><small>{member.role}</small></span>
            <span className="specimen-team__capacity"><span><i style={{ width: `${member.capacity}%` }} /></span><small>{member.capacity}% allocated</small></span>
          </li>
        ))}
      </ul>
    </div>
  )
}
