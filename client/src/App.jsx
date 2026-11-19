import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppContent } from './context/AppContext'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import AptitudeTest from './pages/AptitudeTest'
import CodingTest from './pages/CodingTest'
import InterviewPractice from './pages/InterviewPractice'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import IndexHome from './pages/IndexHome'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import TestResults from './pages/TestResults'
import Settings from './pages/Settings'
import Help from './pages/Help'
import { ToastContainer } from 'react-toastify'
import { Loader2 } from 'lucide-react'

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authLoading } = useContext(AppContent)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={48} className="animate-spin text-blue-500" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

const App = () => {
  return (
    <div style={{width: '100%', minHeight: '100vh'}}>
      <ToastContainer position="bottom-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home/>} />
        <Route path="/index-home" element={<IndexHome/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/email-verify" element={<EmailVerify/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><Help/></ProtectedRoute>} />
        <Route path="/aptitude-test" element={<ProtectedRoute><AptitudeTest/></ProtectedRoute>} />
        <Route path="/coding-test" element={<ProtectedRoute><CodingTest/></ProtectedRoute>} />
        <Route path="/test-results" element={<ProtectedRoute><TestResults/></ProtectedRoute>} />
        <Route path="/interview-practice" element={<ProtectedRoute><InterviewPractice/></ProtectedRoute>} />
        <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer/></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
