import React from 'react'
import { Routes, Route } from 'react-router-dom'
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
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div style={{width: '100%', minHeight: '100vh'}}>
      <ToastContainer/>
     <Routes>
      

        <Route path="/" element={<Home/>} />
        <Route path="/index-home" element={<IndexHome/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/email-verify" element={<EmailVerify/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/aptitude-test" element={<AptitudeTest/>} />
        <Route path="/coding-test" element={<CodingTest/>} />
        <Route path="/interview-practice" element={<InterviewPractice/>} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/test-results" element={<TestResults/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/help" element={<Help/>} />
      </Routes>
    </div>
  )
}

export default App
