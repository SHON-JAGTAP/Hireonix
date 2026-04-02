import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'

console.log('🚀 main.jsx loaded')
console.log('📍 Root element:', document.getElementById('root'))

try {
  const root = createRoot(document.getElementById('root'))
  console.log('✅ React root created')

  root.render(
      <StrictMode>
        <BrowserRouter>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </BrowserRouter>
      </StrictMode>
  )

  console.log('✅ App rendered')
} catch (error) {
  console.error('❌ Error rendering app:', error)
  document.body.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;"><h1>React Error</h1><pre>${error.message}</pre></div>`
}
