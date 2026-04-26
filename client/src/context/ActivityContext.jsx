import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { AppContent } from './AppContext'

export const ActivityContext = createContext()

export const ActivityProvider = ({ children }) => {
  const { userData } = useContext(AppContent)
  const [activities, setActivities] = useState([])

  // Dynamic storage key based on session
  const getStorageKey = () => `hireonix_activity_${userData?._id || 'guest'}`

  // Load specifically for this session whenever userData changes
  useEffect(() => {
    try {
      const loaded = JSON.parse(localStorage.getItem(getStorageKey())) || []
      setActivities(loaded)
    } catch {
      setActivities([])
    }
  }, [userData])

  const addActivity = useCallback((type, title, meta = {}) => {
    const entry = {
      id: Date.now(),
      type,
      title,
      meta,
      timestamp: new Date().toISOString(),
    }
    
    setActivities(prev => {
      const updated = [entry, ...prev].slice(0, 50)
      localStorage.setItem(getStorageKey(), JSON.stringify(updated))
      return updated
    })
  }, [userData])

  const clearActivities = useCallback(() => {
    localStorage.removeItem(getStorageKey())
    setActivities([])
  }, [userData])

  return (
    <ActivityContext.Provider value={{ activities, addActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  )
}


export const useActivity = () => useContext(ActivityContext)
