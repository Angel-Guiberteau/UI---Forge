import { useEffect, useState, type CSSProperties } from 'react'
import { MobileWorkspaceNav, type MobileWorkspaceView } from '../components/workspace/MobileWorkspaceNav'
import { PresetPanel } from '../components/workspace/PresetPanel'
import { PreviewStage } from '../components/workspace/PreviewStage'
import { WorkspaceHeader } from '../components/workspace/WorkspaceHeader'
import { createThemeCustomProperties } from '../features/theme/theme.css'
import type { ThemePreset } from '../features/theme/theme.types'
import { useTheme } from '../features/theme/useTheme'

export const App = () => {
  const { state, dispatch } = useTheme()
  const [mobileView, setMobileView] = useState<MobileWorkspaceView>('preview')
  const { project } = state
  const tokens = project.themes[project.activeMode]
  const customProperties = createThemeCustomProperties(tokens) as CSSProperties
  const timestamp = () => new Date().toISOString()
  const selectPreset = (preset: ThemePreset) => dispatch({
    type: 'project/apply-preset',
    preset,
    updatedAt: timestamp(),
  })

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
        onRename={(name) => dispatch({
          type: 'project/rename',
          name,
          updatedAt: timestamp(),
        })}
        onUndo={() => dispatch({ type: 'history/undo' })}
        onRedo={() => dispatch({ type: 'history/redo' })}
      />

      <section className="forge-workspace" aria-label="Theme workspace">
        <PresetPanel
          activePresetId={project.originPresetId}
          activeMode={project.activeMode}
          onSelect={selectPreset}
        />
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
