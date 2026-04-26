import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import { ActivityProvider } from './context/ActivityContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <ActivityProvider>
          <App />
        </ActivityProvider>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
)
