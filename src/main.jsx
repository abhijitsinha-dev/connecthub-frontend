import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { UIProvider } from './context/UIContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </UIProvider>
  </StrictMode>,
)
