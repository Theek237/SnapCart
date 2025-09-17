import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useAuth } from '../hooks/useStore'

const LoginPage = ({ onNavigate }) => {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('dashboard')
    }
  }, [isAuthenticated, onNavigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()

    try {
      const success = await login(formData)
      if (success) {
        onNavigate('dashboard')
      }
    } catch (error) {
      // Error is handled by the store, but we can add additional handling here if needed
      console.error('Login error:', error)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card variant="glass">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('landing')}
              className="absolute top-4 left-4 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            
            <CardTitle className="text-2xl font-bold text-white">
              Welcome Back
            </CardTitle>
            <p className="text-gray-300 mt-2">
              Sign in to your SnapCart account
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                variant="glass"
                required
              />

              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                variant="glass"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-300">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-gray-600 bg-transparent"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={!formData.email || !formData.password}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <p className="text-gray-300">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('register')}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default LoginPage