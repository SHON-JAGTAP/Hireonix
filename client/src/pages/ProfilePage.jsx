import React, { useContext, useState, useEffect } from 'react'
import MainLayout from '../components/MainLayout'
import { AppContent } from '../context/AppContext'
import { Mail, User, Phone, MapPin } from 'lucide-react'
import { toast } from 'react-toastify'

const ProfilePage = () => {
  const { userData, setUserData } = useContext(AppContent)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  })

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || ''
      })
    }
  }, [userData])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    if (setUserData) {
      setUserData(prev => ({ ...prev, ...formData }))
    }
    setIsEditing(false)
    toast.success('Profile updated successfully')
  }

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="bg-white rounded-lg shadow p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold text-4xl">
              {formData.name ? formData.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{formData.name || 'User'}</h2>
              <p className="text-gray-600">{formData.email || 'user@example.com'}</p>
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
                name="name"
                value={formData.name} 
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'} text-gray-900`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'} text-gray-900`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Not provided"
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'} text-gray-900`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Not provided"
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${!isEditing ? 'bg-gray-50' : 'bg-white'} text-gray-900`}
              />
            </div>
          </div>

          {isEditing ? (
            <div className="mt-6 flex gap-4">
              <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition">
                Save Profile
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default ProfilePage
