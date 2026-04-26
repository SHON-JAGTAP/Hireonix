import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/MainLayout'
import { AppContent } from '../context/AppContext'
import { useActivity } from '../context/ActivityContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import {
  BarChart3, Users, TrendingUp, Award,
  Clock, Zap, Code2, FileText, Mic2, Trash2
} from 'lucide-react'
import { motion } from 'framer-motion'

const TYPE_META = {
  aptitude:  { label: 'Aptitude Test',     icon: Zap,      color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  coding:    { label: 'Coding Test',       icon: Code2,    color: 'bg-red-100 text-red-700',      dot: 'bg-red-500'    },
  resume:    { label: 'Resume Analyzed',   icon: FileText, color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  interview: { label: 'Interview Session', icon: Mic2,     color: 'bg-pink-100 text-pink-700',    dot: 'bg-pink-500'   },
  login:     { label: 'Logged In',        icon: Users,    color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500'   },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

/* build last-7-days bar chart data */
function buildWeeklyData(activities) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      name: d.toLocaleDateString('en', { weekday: 'short' }),
      date: d.toDateString(),
      count: 0,
    })
  }
  activities.forEach(a => {
    const idx = days.findIndex(d => d.date === new Date(a.timestamp).toDateString())
    if (idx !== -1) days[idx].count++
  })
  return days
}

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#818cf8', '#6366f1', '#4f46e5']

const Dashboard = () => {
  const { userData } = useContext(AppContent)
  const { activities, clearActivities } = useActivity()
  const navigate = useNavigate()

  const stats = [
    {
      label: 'Tests Completed',
      value: activities.filter(a => a.type === 'aptitude' || a.type === 'coding').length,
      icon: Award, color: 'bg-blue-500'
    },
    {
      label: 'Interview Sessions',
      value: activities.filter(a => a.type === 'interview').length,
      icon: TrendingUp, color: 'bg-green-500'
    },
    {
      label: 'Resumes Analyzed',
      value: activities.filter(a => a.type === 'resume').length,
      icon: Users, color: 'bg-purple-500'
    },
    {
      label: 'Total Activities',
      value: activities.length,
      icon: BarChart3, color: 'bg-orange-500'
    },
  ]

  const weeklyData = buildWeeklyData(activities)

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userData?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your activity overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <Icon size={18} />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6">📊 Activity — Last 7 Days</h2>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <BarChart3 size={48} className="mb-3 opacity-40" />
              <p>No activity yet. Start a test or interview!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barSize={28}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {weeklyData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Aptitude Test', path: '/aptitude-test', icon: Zap, color: 'from-yellow-400 to-orange-500' },
              { label: 'Coding Test',   path: '/coding-test',   icon: Code2, color: 'from-red-400 to-pink-500' },
              { label: 'Resume Check',  path: '/resume-analyzer', icon: FileText, color: 'from-indigo-400 to-blue-500' },
              { label: 'Interview',     path: '/interview-practice', icon: Mic2, color: 'from-green-400 to-teal-500' },
            ].map(action => {
              const Icon = action.icon
              return (
                <motion.button
                  key={action.path}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(action.path)}
                  className={`bg-linear-to-br ${action.color} text-white rounded-xl p-5 flex flex-col items-center gap-2 shadow hover:shadow-lg transition`}
                >
                  <Icon size={24} />
                  <span className="text-sm font-semibold">{action.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">🕒 Recent Activity</h2>
            {activities.length > 0 && (
              <button
                onClick={clearActivities}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition"
              >
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>

          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Clock size={48} className="mb-3 opacity-40" />
              <p className="font-medium">No recent activity</p>
              <p className="text-sm mt-1">Complete a test or interview session to see it here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {activities.map((activity, idx) => {
                const meta = TYPE_META[activity.type] || TYPE_META.login
                const Icon = meta.icon
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className={`p-2 rounded-lg ${meta.color} shrink-0`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{activity.title}</p>
                      {activity.meta?.score !== undefined && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Score: <span className="font-bold text-blue-600">{activity.meta.score}%</span>
                          {activity.meta.correct != null && ` (${activity.meta.correct}/${activity.meta.total} correct)`}
                        </p>
                      )}
                      {activity.meta?.language && (
                        <p className="text-xs text-gray-500 mt-0.5">Language: <span className="font-medium">{activity.meta.language}</span></p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{timeAgo(activity.timestamp)}</span>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  )
}

export default Dashboard
