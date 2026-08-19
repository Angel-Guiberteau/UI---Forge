import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { DesignPanel } from '../components/editor/DesignPanel'
import { ExportDialog } from '../components/export/ExportDialog'
import { ProjectLibraryDialog } from '../components/projects/ProjectLibraryDialog'
import { ShareDialog } from '../components/share/ShareDialog'
import { SharedThemeDialog } from '../components/share/SharedThemeDialog'
import { Icon } from '../components/ui/Icon'
import { MobileWorkspaceNav, type MobileWorkspaceView } from '../components/workspace/MobileWorkspaceNav'
import { PreviewStage } from '../components/workspace/PreviewStage'
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader'
import { createThemeCustomProperties } from '../features/theme/theme.css'
import {
  createProjectFromSharedTheme,
  readThemeShare,
  type ThemeShareResult,
} from '../features/share/theme.share'
import {
  createThemeProject,
  createUniqueProjectName,
  duplicateThemeProject,
} from '../features/theme/theme.factory'
import type { ThemeProject } from '../features/theme/theme.types'
import { useTheme } from '../features/theme/useTheme'

export const App = () => {
  const { state, dispatch } = useTheme()
  const [mobileView, setMobileView] = useState<MobileWorkspaceView>('preview')
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [shareResult, setShareResult] = useState<ThemeShareResult>(() => readThemeShare(window.location.hash))
  const [shareNotice, setShareNotice] = useState('')
  const { project } = state
  const tokens = project.themes[project.activeMode]
  const customProperties = createThemeCustomProperties(tokens) as CSSProperties
  const timestamp = () => new Date().toISOString()
  const activeProjectCount = state.projects.filter((storedProject) => storedProject.archivedAt === null).length
  const closeLibrary = useCallback(() => setIsLibraryOpen(false), [])
  const closeShare = useCallback(() => setIsShareOpen(false), [])
  const dismissSharedTheme = useCallback(() => {
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}`,
    )
    setShareResult({ status: 'none' })
  }, [])

  const handleCreateProject = () => {
    const name = createUniqueProjectName('Untitled system', state.projects)
    dispatch({ type: 'library/create', project: createThemeProject(undefined, { name }) })
    setIsLibraryOpen(false)
  }

  const handleDuplicateProject = (sourceProject: ThemeProject) => {
    const name = createUniqueProjectName(`${sourceProject.name} copy`, state.projects)
    dispatch({ type: 'library/duplicate', project: duplicateThemeProject(sourceProject, { name }) })
  }

  const handleImportSharedTheme = () => {
    if (shareResult.status !== 'ready') return

    const name = createUniqueProjectName(shareResult.theme.name, state.projects)
    const importedProject = createProjectFromSharedTheme(shareResult.theme, {
      name,
      timestamp: timestamp(),
    })

    dispatch({ type: 'library/create', project: importedProject })
    setShareNotice(`${name} was added to your local library.`)
    dismissSharedTheme()
  }

  useEffect(() => {
    if (window.matchMedia('(max-width: 700px)').matches) {
      dispatch({ type: 'view/set-viewport', viewport: 'mobile' })
    }
  }, [dispatch])

  useEffect(() => {
    const handleHashChange = () => setShareResult(readThemeShare(window.location.hash))

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (!shareNotice) return

    const timeout = window.setTimeout(() => setShareNotice(''), 3600)

    return () => window.clearTimeout(timeout)
  }, [shareNotice])

  return (
    <main className="forge-shell" data-mobile-view={mobileView}>
      <WorkspaceHeader
        projectName={project.name}
        canUndo={state.past.length > 0}
        canRedo={state.future.length > 0}
        statusLabel={project.originPresetId === null ? 'Customized' : 'Preset base'}
        statusTone={project.originPresetId === null ? 'custom' : 'base'}
        projectCount={activeProjectCount}
        onRename={(name) => dispatch({
          type: 'project/rename',
          name,
          updatedAt: timestamp(),
        })}
        onUndo={() => dispatch({ type: 'history/undo' })}
        onRedo={() => dispatch({ type: 'history/redo' })}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onShare={() => setIsShareOpen(true)}
        onExport={() => setIsExportOpen(true)}
      />

      <section className="forge-workspace" aria-label="Theme workspace">
        <DesignPanel />
        <PreviewStage
          customProperties={customProperties}
          mode={project.activeMode}
          viewport={state.viewport}
          onModeChange={(mode) => dispatch({ type: 'view/set-mode', mode })}
          onViewportChange={(viewport) => dispatch({ type: 'view/set-viewport', viewport })}
        />
      </section>

      <MobileWorkspaceNav view={mobileView} onChange={setMobileView} />

      <ExportDialog
        open={isExportOpen}
        project={project}
        onClose={() => setIsExportOpen(false)}
      />

      <ProjectLibraryDialog
        open={isLibraryOpen}
        activeProjectId={project.id}
        projects={state.projects}
        onClose={closeLibrary}
        onCreate={handleCreateProject}
        onSelect={(selectedProject) => {
          dispatch({ type: 'project/replace', project: selectedProject })
          setIsLibraryOpen(false)
        }}
        onDuplicate={handleDuplicateProject}
        onArchive={(archivedProject) => dispatch({
          type: 'library/archive',
          projectId: archivedProject.id,
          archivedAt: timestamp(),
        })}
        onRestore={(archivedProject) => dispatch({
          type: 'library/restore',
          projectId: archivedProject.id,
          updatedAt: timestamp(),
        })}
      />

      <ShareDialog
        open={isShareOpen}
        project={project}
        onClose={closeShare}
      />

      {shareResult.status !== 'none' && (
        <SharedThemeDialog
          result={shareResult}
          onDismiss={dismissSharedTheme}
          onImport={handleImportSharedTheme}
        />
      )}

      {shareNotice && (
        <div className="forge-notification" role="status">
          <span><Icon name="check" size={15} /></span>
          <div><strong>Theme imported</strong><p>{shareNotice}</p></div>
          <button type="button" aria-label="Dismiss import notification" onClick={() => setShareNotice('')}><Icon name="close" size={14} /></button>
        </div>
      )}
    </main>
  )
}
