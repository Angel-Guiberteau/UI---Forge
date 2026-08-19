import { useEffect, useRef, useState } from 'react'
import { Icon } from '../ui/Icon'

const projects = [
  { name: 'Atlas research', owner: 'Maya Allen', initials: 'MA', status: 'On track', progress: 82, due: 'Sep 24' },
  { name: 'Horizon launch', owner: 'Jon Bell', initials: 'JB', status: 'At risk', progress: 58, due: 'Oct 02' },
  { name: 'Signal refresh', owner: 'Ari Kim', initials: 'AK', status: 'In review', progress: 94, due: 'Oct 11' },
  { name: 'Field notes', owner: 'Lena Ortiz', initials: 'LO', status: 'On track', progress: 71, due: 'Oct 18' },
]

export const SpecimenProjects = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRoot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRoot.current?.contains(event.target as Node)) setOpenMenu(null)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <section className="specimen-projects">
      <div className="specimen-projects__toolbar">
        <label>
          <span className="visually-hidden">Search projects</span>
          <Icon name="search" size={15} />
          <input type="search" placeholder="Search projects" />
        </label>
        <button type="button" className="specimen-button specimen-button--secondary">All statuses <Icon name="chevronDown" size={13} /></button>
      </div>
      <div className="specimen-table-wrap">
        <table>
          <caption className="visually-hidden">Active projects</caption>
          <thead><tr><th>Project</th><th>Owner</th><th>Status</th><th>Progress</th><th>Due</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.name}>
                <td><strong>{project.name}</strong><small>Product design</small></td>
                <td><span className="specimen-table-owner"><i aria-hidden="true">{project.initials}</i>{project.owner}</span></td>
                <td><span className={`specimen-badge specimen-badge--${project.status.toLowerCase().replace(' ', '-')}`}>{project.status}</span></td>
                <td><span className="specimen-table-progress"><span><i style={{ width: `${project.progress}%` }} /></span>{project.progress}%</span></td>
                <td>{project.due}</td>
                <td>
                  <div className="specimen-row-menu" ref={openMenu === project.name ? menuRoot : undefined}>
                    <button
                      type="button"
                      aria-label={`Actions for ${project.name}`}
                      aria-expanded={openMenu === project.name}
                      onClick={() => setOpenMenu(openMenu === project.name ? null : project.name)}
                    ><Icon name="more" size={16} /></button>
                    {openMenu === project.name && (
                      <div role="menu">
                        <button type="button" role="menuitem">Open project</button>
                        <button type="button" role="menuitem">Duplicate</button>
                        <button type="button" role="menuitem">Archive</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
