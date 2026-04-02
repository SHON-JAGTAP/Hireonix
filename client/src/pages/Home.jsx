import React from 'react'

const Home = () => {
  React.useEffect(() => {
    console.log('✅ Home component mounted!')
  }, [])
  
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #c084fc 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{fontSize: '48px', fontWeight: '900', color: '#1e3a8a', marginBottom: '16px'}}>
        MIT-ADT Platform
      </h1>
      <p style={{fontSize: '20px', color: '#374151', marginBottom: '32px'}}>
        ✅ React is working!
      </p>
      <button style={{
        padding: '12px 32px',
        background: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer'
      }}>
        Get Started
      </button>
    </div>
  )
}

export default Home
