import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { AppContent } from '../context/AppContext'
import { BarChart3, Users, TrendingUp, Award, ArrowLeft } from 'lucide-react'

const Dashboard = () => {
  const { userData } = useContext(AppContent)
  const navigate = useNavigate()

  const stats = [
    { label: 'Tests Completed', value: '12', icon: Award, color: 'bg-blue-500' },
    { label: 'Average Score', value: '82%', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Current Rank', value: '#145', icon: Users, color: 'bg-purple-500' },
    { label: 'Performance', value: 'Good', icon: BarChart3, color: 'bg-orange-500' },
  ]

  return (
    <MainLayout>
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome back, {userData?.name || 'User'}!</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">{stat.label}</h3>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent activity yet. Start practicing to see your progress!</p>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard
