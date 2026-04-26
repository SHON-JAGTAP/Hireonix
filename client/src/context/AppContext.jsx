import { createContext, useEffect, useState } from "react";
import axios from "axios";
import {toast } from 'react-toastify';

export const AppContent = createContext()

export const AppContextProvider = (props) => {

  axios.defaults.withCredentials = true;

const backendUrl = import.meta.env.VITE_BACKEND_URL

const [isLoggedIn, setIsLoggedIn] = useState(false)
const [userData, setUserData] = useState(false)
const [authLoading, setAuthLoading] = useState(true);

// Night / Light mode global state
const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem('hireonix_theme') === 'dark';
});

const toggleTheme = (val) => {
  const isDark = typeof val === 'boolean' ? val : !darkMode;
  setDarkMode(isDark);
  localStorage.setItem('hireonix_theme', isDark ? 'dark' : 'light');
  
  // Optional: apply class to body
  if (isDark) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
};

useEffect(() => {
  if (darkMode) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
}, [darkMode]);

const getAuthState = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/auth/is-auth', {
      timeout: 5000
    })
    if (data.success) {
      setIsLoggedIn(true)
      await getUserData()
    }
  } catch (error) {
    console.warn('⚠️ Backend offline or not authenticated.')
  } finally {
    setAuthLoading(false);
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
      getUserData,
      authLoading,
      darkMode, setDarkMode: toggleTheme
  }

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  )
}