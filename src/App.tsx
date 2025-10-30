import { useEffect, useState } from 'react'
import mondaySdk from 'monday-sdk-js'

const monday = mondaySdk()

function App() {
  const [userName, setUserName] = useState<string>('Guest')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [context, setContext] = useState<any>(null)

  useEffect(() => {
    monday.listen('context', (res) => {
      setContext(res.data)
    })

    monday.api(`query { me { name } }`)
      .then((res) => {
        if (res.data?.me?.name) {
          setUserName(res.data.me.name)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching user:', error)
        setIsLoading(false)
      })
  }, [])

  const handleClick = () => {
    monday.execute('notice', {
      message: `Hello ${userName}! Button clicked successfully!`,
      type: 'success',
      timeout: 3000
    })
  }

  if (isLoading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
        Welcome, {userName}!
      </h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        This is my first monday.com app
      </p>
      
      {context && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <strong>Board ID:</strong> {context.boardId || 'N/A'}
        </div>
      )}
      
      <button 
        onClick={handleClick}
        style={{
          backgroundColor: '#0073ea',
          color: 'white',
          border: 'none',
          padding: '14px 28px',
          fontSize: '16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,115,234,0.3)',
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#0060b9'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#0073ea'
        }}
      >
        Click Me!
      </button>

      <div style={{ 
        marginTop: '30px',
        fontSize: '12px',
        color: '#999'
      }}>
        App is running in {context ? 'monday.com' : 'standalone mode'}
      </div>
    </div>
  )
}

export default App