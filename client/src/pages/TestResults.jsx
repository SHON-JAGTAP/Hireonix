import React from 'react'
import MainLayout from '../components/MainLayout'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

const TestResults = () => {
  const results = [
    { name: 'Aptitude Test 1', score: 85, date: '2024-03-15', status: 'Completed' },
    { name: 'Coding Test 1', score: 92, date: '2024-03-14', status: 'Completed' },
    { name: 'Interview Mock 1', score: 78, date: '2024-03-13', status: 'Completed' },
  ]

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Results</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Test Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Score</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((result, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{result.name}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-lg text-green-600">{result.score}%</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{result.date}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={18} />
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-600">
                    No test results yet. Start practicing now!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  )
}

export default TestResults
