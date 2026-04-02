import { createContext, useEffect, useState } from "react";
import axios from "axios";
import {toast } from 'react-toastify';

export const AppContent = createContext()

export const AppContextProvider = (props) => {

  axios.defaults.withCredentials = true;

const backendUrl = import.meta.env.VITE_BACKEND_URL
console.log('🔧 AppContextProvider - backendUrl:', backendUrl)

const [isLoggedIn, setIsLoggedIn] = useState(false)
const [userData, setUserData] = useState(false)

const getAuthState = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/auth/is-auth', {
      timeout: 5000
    })
    if (data.success) {
      setIsLoggedIn(true)
      getUserData()
    }
  } catch (error) {
    // Silently fail if backend is offline - allow frontend to load
    console.warn('⚠️ Backend offline. App loading in offline mode.')
  }
}

const getUserData = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/user/data', {
      timeout: 5000
    })
    data.success ? setUserData(data.userData) : toast.error(data.message)
  } catch (error) {
    // Silently fail if backend is offline
    console.warn('⚠️ Could not fetch user data')
  }
}

useEffect(() => {
  getAuthState();
}, [])

  const value = {
     backendUrl,
      isLoggedIn, setIsLoggedIn,
      userData, setUserData,
      getUserData

  }

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  )
}