import React from 'react'
import MainLayout from '../components/MainLayout'
import { useActivity } from '../context/ActivityContext'
import { CheckCircle, Clock, TrendingUp, Award, BarChart3 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

function buildTopicData(activities) {
  const counts = {}
  activities.forEach(a => {
    if (a.meta?.category) {
      counts[a.meta.category] = (counts[a.meta.category] || 0) + 1
    }
  })
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

function buildScoreData(activities) {
  return activities
    .filter(a => a.meta?.score !== undefined)
    .slice(0, 10)
    .reverse()
    .map((a, i) => ({
      name: `#${i + 1}`,
      score: a.meta.score,
      type: a.type,
    }))
}

function buildTypeData(activities) {
  const map = { aptitude: 0, coding: 0, interview: 0, resume: 0 }
  activities.forEach(a => { if (map[a.type] !== undefined) map[a.type]++ })
  return [
    { name: 'Aptitude', value: map.aptitude },
    { name: 'Coding',   value: map.coding },
    { name: 'Interview', value: map.interview },
    { name: 'Resume',   value: map.resume },
  ].filter(d => d.value > 0)
}

const TestResults = () => {
  const { activities } = useActivity()

  const testActivities = activities.filter(a =>
    ['aptitude', 'coding', 'interview', 'resume'].includes(a.type)
  )
  const scoreActivities = testActivities.filter(a => a.meta?.score !== undefined)
  const avgScore = scoreActivities.length
    ? Math.round(scoreActivities.reduce((s, a) => s + a.meta.score, 0) / scoreActivities.length)
    : 0
  const bestScore = scoreActivities.length
    ? Math.max(...scoreActivities.map(a => a.meta.score))
    : 0

  const topicData  = buildTopicData(activities)
  const scoreData  = buildScoreData(activities)
  const typeData   = buildTypeData(activities)

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
          <p className="text-gray-500 mt-1">Detailed performance analysis</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Tests', value: testActivities.length, icon: Award,    color: 'text-blue-600',   bg: 'bg-blue-50' },
            { label: 'Avg Score',   value: `${avgScore}%`,        icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Best Score',  value: `${bestScore}%`,       icon: BarChart3,  color: 'text-purple-600',bg: 'bg-purple-50' },
            { label: 'Sessions Today', value: activities.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length,
              icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm"
              >
                <div className={`inline-flex p-2 rounded-lg ${c.bg} mb-3`}>
                  <Icon size={18} className={c.color} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                <p className="text-sm text-gray-500">{c.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Charts Row */}
        {testActivities.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Trend */}
            {scoreData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
              >
                <h2 className="text-base font-bold text-gray-900 mb-4">📈 Score Trend</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={scoreData} barSize={24}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip
                      formatter={val => [`${val}%`, 'Score']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {scoreData.map((entry, i) => (
                        <Cell key={i} fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#f59e0b' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Activity Type Distribution */}
            {typeData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
              >
                <h2 className="text-base font-bold text-gray-900 mb-4">🍕 Activity Breakdown</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {typeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Topic-wise Performance */}
            {topicData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2"
              >
                <h2 className="text-base font-bold text-gray-900 mb-4">🎯 Topic-wise Attempts</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={topicData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                    <Radar name="Attempts" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        ) : null}

        {/* Detailed History Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">📋 All Test History</h2>
          </div>
          {testActivities.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-gray-400">
              <BarChart3 size={48} className="mb-3 opacity-40" />
              <p className="font-medium">No test results yet</p>
              <p className="text-sm mt-1">Complete a test to see your results here</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Activity</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Score</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {testActivities.map((result, idx) => (
                  <tr key={result.id || idx} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{result.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 capitalize">
                        {result.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {result.meta?.score !== undefined ? (
                        <span className={`font-bold text-base ${result.meta.score >= 80 ? 'text-green-600' : result.meta.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {result.meta.score}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(result.timestamp).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle size={15} /> Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default TestResults
