import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UploadPage from './pages/UploadPage'
import Dashboard from './pages/Dashboard'
import { useAuth } from './hooks/useStore'
//abc
function App() {
  // Initialize view based on authentication status and localStorage
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('currentView')
      const token = localStorage.getItem('token')
      
      if (token && savedView === 'dashboard') {
        return 'dashboard'
      }
    }
    return 'landing'
  }
  
  const [currentView, setCurrentView] = useState(getInitialView())
  const { isAuthenticated, initializeAuth, user } = useAuth()
  
  // Enhanced navigation function with localStorage persistence
  const handleNavigation = (view) => {
    setCurrentView(view)
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentView', view)
    }
  }

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (isAuthenticated && user) {
      handleNavigation('dashboard')
    } else if (!isAuthenticated && currentView !== 'landing' && currentView !== 'login' && currentView !== 'register') {
      handleNavigation('landing')
    }
  }, [isAuthenticated, user, currentView])

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (!isAuthenticated) {
        handleNavigation('landing')
      }
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isAuthenticated])

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <LandingPage 
            key="landing" 
            onNavigate={handleNavigation}
          />
        )}
        {currentView === 'login' && (
          <LoginPage 
            key="login" 
            onNavigate={handleNavigation}
          />
        )}
        {currentView === 'register' && (
          <RegisterPage 
            key="register" 
            onNavigate={handleNavigation}
          />
        )}
        {currentView === 'dashboard' && (
          <Dashboard 
            key="dashboard" 
            onNavigate={handleNavigation}
          />
        )}
        {currentView === 'upload' && (
          <UploadPage 
            key="upload" 
            onNavigate={handleNavigation}
          />
        )}
      </AnimatePresence>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App
