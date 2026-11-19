import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { assets } from '../assets/assets'
import { Sun, Moon } from 'lucide-react'

const TopNavbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate()
  const { isLoggedIn } = useContext(AppContent)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand - Left Side */}
          <div 
            onClick={() => navigate('/index-home')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <img src={assets.mitadtlogo} alt="MIT ADT" className="w-10 h-10" />
            <span className="font-bold text-lg text-blue-600">MITPlacementHub</span>
          </div>

          {/* Navigation Links and Controls - Right Side */}
          <div className="flex items-center gap-8">
            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => navigate('/index-home')}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Home
              </button>
              <button 
                onClick={() => navigate('/aptitude-test')}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Tests
              </button>
              <button 
                onClick={() => navigate('/resume-analyzer')}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Resume
              </button>
              <button 
                onClick={() => navigate('/interview-practice')}
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Interview
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-500" />
              ) : (
                <Moon size={20} className="text-gray-600" />
              )}
            </button>

            {/* Login/Dashboard Button */}
            {!isLoggedIn ? (
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Login
              </button>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNavbar
