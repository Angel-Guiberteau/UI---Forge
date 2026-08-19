import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { AppErrorBoundary } from './components/release/AppErrorBoundary'
import { ThemeProvider } from './features/theme/ThemeProvider'
import './styles/base.css'
import './styles/editor.css'
import './styles/export.css'
import './styles/projects.css'
import './styles/release.css'
import './styles/share.css'
import './styles/specimen.css'
import './styles/workspace.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
