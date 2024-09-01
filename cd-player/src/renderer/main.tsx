import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { PlayerProvider } from './context/PlayerContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </StrictMode>
)
