import React, { useState } from 'react'
import MainLayout from '../components/MainLayout'
import { Bell, Lock, Eye, Globe } from 'lucide-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    twoFactor: false,
    profilePrivacy: 'public',
  })

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    // Optional: show a toast immediately when toggling important settings
    if (key === 'twoFactor') {
      toast.info(`Two-Factor Authentication ${value ? 'enabled' : 'disabled'}`)
    }
  }

  const handleSave = () => {
    toast.success('Settings saved successfully');
  }

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700">Email Notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700">Push Notifications</span>
              </label>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-red-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={settings.twoFactor}
                  onChange={(e) => handleChange('twoFactor', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-700">Two-Factor Authentication</span>
              </label>
              <button 
                onClick={() => navigate('/reset-password')}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-purple-500" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Privacy</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Privacy</label>
              <select 
                value={settings.profilePrivacy}
                onChange={(e) => handleChange('profilePrivacy', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg border-gray-300"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <button onClick={handleSave} className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition">
            Save Settings
          </button>
        </div>
      </div>
    </MainLayout>
  )
}

export default Settings
