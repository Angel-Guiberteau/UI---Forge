import { Component, useState, type ReactNode } from 'react'
import { clearThemeWorkspace } from '../../features/theme/theme.storage'
import { ForgeMark } from '../brand/ForgeMark'

type FatalErrorScreenProps = {
  onReload: () => void
  onReset: () => void
}

export const FatalErrorScreen = ({ onReload, onReset }: FatalErrorScreenProps) => {
  const [isConfirmingReset, setIsConfirmingReset] = useState(false)

  return (
    <main className="fatal-screen">
      <section className="fatal-card" aria-labelledby="fatal-title">
        <header className="fatal-card__brand">
          <ForgeMark />
          <div><strong>UI Forge</strong><span>Recovery station</span></div>
        </header>

        <div className="fatal-card__signal" aria-hidden="true"><i /><i /><i /><span>Runtime interrupted</span></div>
        <p className="eyebrow">The forge cooled unexpectedly</p>
        <h1 id="fatal-title">Your workspace couldn’t be rendered.</h1>
        <p className="fatal-card__copy">Reload the interface first. Your projects remain stored in this browser unless you explicitly start with a clean workspace.</p>

        {isConfirmingReset ? (
          <div className="fatal-reset" role="alert">
            <strong>Delete every local UI Forge project?</strong>
            <p>This only clears UI Forge data in this browser and cannot be undone.</p>
            <div>
              <button type="button" onClick={() => setIsConfirmingReset(false)}>Keep my projects</button>
              <button type="button" className="fatal-action--danger" onClick={onReset}>Delete local projects</button>
            </div>
          </div>
        ) : (
          <div className="fatal-card__actions">
            <button type="button" className="fatal-action--primary" onClick={onReload}>Reload workspace</button>
            <button type="button" onClick={() => setIsConfirmingReset(true)}>Start with a clean workspace</button>
          </div>
        )}

        <footer><span>UIF–500</span><span>Local-first recovery</span></footer>
      </section>
    </main>
  )
}

type AppErrorBoundaryProps = {
  children: ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <FatalErrorScreen
          onReload={() => window.location.reload()}
          onReset={() => {
            clearThemeWorkspace(window.localStorage)
            window.location.replace(import.meta.env.BASE_URL)
          }}
        />
      )
    }

    return this.props.children
  }
}
