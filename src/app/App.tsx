import { useEffect, useState, type CSSProperties } from 'react'
import { DesignPanel } from '../components/editor/DesignPanel'
import { MobileWorkspaceNav, type MobileWorkspaceView } from '../components/workspace/MobileWorkspaceNav'
import { PreviewStage } from '../components/workspace/PreviewStage'
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader'
import { createThemeCustomProperties } from '../features/theme/theme.css'
import { useTheme } from '../features/theme/useTheme'

export const App = () => {
  const { state, dispatch } = useTheme()
  const [mobileView, setMobileView] = useState<MobileWorkspaceView>('preview')
  const { project } = state
  const tokens = project.themes[project.activeMode]
  const customProperties = createThemeCustomProperties(tokens) as CSSProperties
  const timestamp = () => new Date().toISOString()

  useEffect(() => {
    if (window.matchMedia('(max-width: 700px)').matches) {
      dispatch({ type: 'view/set-viewport', viewport: 'mobile' })
    }
  }, [dispatch])

  return (
    <main className="forge-shell" data-mobile-view={mobileView}>
      <WorkspaceHeader
        projectName={project.name}
        canUndo={state.past.length > 0}
        canRedo={state.future.length > 0}
        statusLabel={project.originPresetId === null ? 'Customized' : 'Preset base'}
        statusTone={project.originPresetId === null ? 'custom' : 'base'}
        onRename={(name) => dispatch({
          type: 'project/rename',
          name,
          updatedAt: timestamp(),
        })}
        onUndo={() => dispatch({ type: 'history/undo' })}
        onRedo={() => dispatch({ type: 'history/redo' })}
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
    </main>
  )
}
