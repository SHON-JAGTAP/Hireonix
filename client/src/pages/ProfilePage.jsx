import React, { useContext } from 'react'
import MainLayout from '../components/MainLayout'
import { AppContent } from '../context/AppContext'
import { Mail, User, Phone, MapPin } from 'lucide-react'

const ProfilePage = () => {
  const { userData } = useContext(AppContent)

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold text-4xl">
              {userData?.name ? userData.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{userData?.name || 'User'}</h2>
              <p className="text-gray-600">{userData?.email || 'user@example.com'}</p>
              <p className="text-sm text-gray-500 mt-2">
                Email Verified: {userData?.isAccountVerified ? '✓ Yes' : '✗ No'}
              </p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                value={userData?.name || ''} 
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={userData?.email || ''} 
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input 
                type="tel" 
                placeholder="Not provided"
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                type="text" 
                placeholder="Not provided"
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900"
              />
            </div>
          </div>

          <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition">
            Edit Profile
          </button>
        </div>
      </div>
    </MainLayout>
  )
}

export default ProfilePage
