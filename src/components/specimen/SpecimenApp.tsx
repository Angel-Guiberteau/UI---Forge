import { useRef, useState, type CSSProperties } from 'react'
import type { PreviewViewport, ThemeMode } from '../../features/theme/theme.types'
import { Icon, type IconName } from '../ui/Icon'
import { SpecimenOverview } from './SpecimenOverview'
import { SpecimenProjects } from './SpecimenProjects'
import { SpecimenReportModal } from './SpecimenReportModal'
import { SpecimenScenarioState } from './SpecimenScenarioState'
import type { PreviewScenario, SpecimenView } from './specimen.types'

type SpecimenAppProps = {
  customProperties: CSSProperties
  mode: ThemeMode
  scenario: PreviewScenario
  viewport: PreviewViewport
}

const navigation: Array<{ view: SpecimenView; label: string; icon: IconName }> = [
  { view: 'overview', label: 'Overview', icon: 'home' },
  { view: 'projects', label: 'Projects', icon: 'folder' },
  { view: 'team', label: 'Team', icon: 'users' },
]

const viewCopy: Record<SpecimenView, { eyebrow: string; title: string; description: string }> = {
  overview: {
    eyebrow: 'Operations overview',
    title: 'Good systems create calm.',
    description: 'A clear view of delivery, momentum, and the work that needs attention.',
  },
  projects: {
    eyebrow: 'Project portfolio',
    title: 'Work, without the noise.',
    description: 'Track ownership and progress across every active initiative.',
  },
  team: {
    eyebrow: 'People and capacity',
    title: 'Built around people.',
    description: 'See who is moving the work forward and where support is needed.',
  },
}

export const SpecimenApp = ({
  customProperties,
  mode,
  scenario,
  viewport,
}: SpecimenAppProps) => {
  const [activeView, setActiveView] = useState<SpecimenView>('overview')
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const createReportButton = useRef<HTMLButtonElement>(null)
  const copy = viewCopy[activeView]

  const handleReportCreated = (reportName: string) => {
    setIsReportOpen(false)
    setNotification(`${reportName} is ready to review.`)
  }

  return (
    <article
      className="specimen"
      data-viewport={viewport}
      data-mode={mode}
      style={customProperties}
    >
      <header className="specimen__topbar">
        <span className="specimen__logo">
          <span aria-hidden="true">N</span>
          Northstar
        </span>
        <div className="specimen__topbar-actions">
          <span className="specimen__workspace-name">Q3 workspace</span>
          <button type="button" className="specimen-icon-button" aria-label="Notifications">
            <Icon name="bell" size={15} />
            <span className="specimen-icon-button__signal" aria-hidden="true" />
          </button>
          <span className="specimen__avatar" aria-label="Signed in as Maya Allen">MA</span>
        </div>
      </header>

      <div className="specimen__shell">
        <aside className="specimen-sidebar">
          <nav aria-label="Northstar navigation">
            {navigation.map((item) => (
              <button
                type="button"
                key={item.view}
                aria-current={activeView === item.view ? 'page' : undefined}
                onClick={() => setActiveView(item.view)}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="specimen-sidebar__capacity">
            <span>Team capacity</span>
            <strong>72%</strong>
            <span className="specimen-progress"><span style={{ width: '72%' }} /></span>
            <small>Healthy workload</small>
          </div>
          <div className="specimen-sidebar__profile">
            <span className="specimen__avatar">MA</span>
            <span><strong>Maya Allen</strong><small>Workspace lead</small></span>
          </div>
        </aside>

        <main className="specimen__main">
          <div className="specimen__heading">
            <div>
              <span>{copy.eyebrow}</span>
              <h3>{copy.title}</h3>
              <p>{copy.description}</p>
            </div>
            <button
              type="button"
              ref={createReportButton}
              className="specimen-button specimen-button--primary"
              onClick={() => setIsReportOpen(true)}
            >
              <Icon name="plus" size={15} />
              Create report
            </button>
          </div>

          {scenario === 'ready' && activeView === 'overview' && <SpecimenOverview />}
          {scenario === 'ready' && activeView === 'projects' && <SpecimenProjects />}
          {scenario === 'ready' && activeView === 'team' && <SpecimenScenarioState type="team" />}
          {scenario !== 'ready' && <SpecimenScenarioState type={scenario} />}
        </main>
      </div>

      <nav className="specimen-mobile-nav" aria-label="Northstar mobile navigation">
        {navigation.map((item) => (
          <button
            type="button"
            key={item.view}
            aria-current={activeView === item.view ? 'page' : undefined}
            aria-label={item.label}
            onClick={() => setActiveView(item.view)}
          >
            <Icon name={item.icon} size={17} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {notification && (
        <div className="specimen-toast" role="status">
          <span><Icon name="check" size={14} /></span>
          <div><strong>Report created</strong><small>{notification}</small></div>
          <button type="button" aria-label="Dismiss notification" onClick={() => setNotification(null)}>
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      {isReportOpen && (
        <SpecimenReportModal
          returnFocusRef={createReportButton}
          onClose={() => setIsReportOpen(false)}
          onCreated={handleReportCreated}
        />
      )}
    </article>
  )
}
