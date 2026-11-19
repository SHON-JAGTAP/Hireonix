import React from 'react'
import ProfileSidebar from './ProfileSidebar'

const MainLayout = ({ children }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar */}
      <ProfileSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default MainLayout
