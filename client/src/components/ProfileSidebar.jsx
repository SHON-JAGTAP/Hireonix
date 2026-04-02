import React, { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Zap, 
  Code2, 
  Mic2, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react'

const ProfileSidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userData, backendUrl, setIsLoggedIn, setUserData } = useContext(AppContent)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard',
      color: 'text-blue-500'
    },
    { 
      label: 'My Profile', 
      icon: User, 
      path: '/profile',
      color: 'text-purple-500'
    },
    { 
      label: 'Test Results', 
      icon: FileText, 
      path: '/test-results',
      color: 'text-green-500'
    },
    { 
      label: 'Aptitude Test', 
      icon: Zap, 
      path: '/aptitude-test',
      color: 'text-yellow-500'
    },
    { 
      label: 'Coding Test', 
      icon: Code2, 
      path: '/coding-test',
      color: 'text-red-500'
    },
    { 
      label: 'Resume Analyzer', 
      icon: FileText, 
      path: '/resume-analyzer',
      color: 'text-indigo-500'
    },
    { 
      label: 'Interview Practice', 
      icon: Mic2, 
      path: '/interview-practice',
      color: 'text-pink-500'
    },
    { 
      label: 'Settings', 
      icon: Settings, 
      path: '/settings',
      color: 'text-gray-500'
    },
    { 
      label: 'Help & Support', 
      icon: HelpCircle, 
      path: '/help',
      color: 'text-orange-500'
    },
  ]

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      if (data.success) {
        setIsLoggedIn(false)
        setUserData(false)
        navigate('/')
        toast.success('Logged out successfully')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:relative top-0 left-0 w-64 h-screen bg-linear-to-b from-slate-900 to-slate-800 text-white p-6 shadow-xl transition-transform duration-300 overflow-y-auto z-40`}>
        
        {/* Logo/Header */}
        <div className="mb-8">
          <img 
            src={assets.mitadtlogo} 
            alt="MIT ADT Logo" 
            className="w-32 mb-4"
          />
          {userData && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                {userData.name ? userData.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <p className="font-semibold text-sm">{userData.name || 'User'}</p>
                <p className="text-xs text-gray-400">{userData.email || 'user@example.com'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-b border-slate-700 mb-6"></div>

        {/* Menu Items */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon size={20} className={active ? 'text-white' : item.color} />
                <span className="font-medium text-sm">{item.label}</span>
                {active && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
              </button>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="border-b border-slate-700 mb-6"></div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 font-medium"
        >
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </button>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <p className="text-xs text-gray-500 text-center">
            PlacementHub v1.0
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            © 2024 MIT ADT
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 md:hidden z-30"
        ></div>
      )}
    </>
  )
}

export default ProfileSidebar
