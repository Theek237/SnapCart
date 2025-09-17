import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowLeft, UserPlus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { useAuth } from '../hooks/useStore'

const RegisterPage = ({ onNavigate }) => {
  const { register, isLoading, clearError, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isAuthenticated) {
      onNavigate('dashboard')
    }
  }, [isAuthenticated, onNavigate])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., user@example.com)'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    clearError()
    setErrors({})

    try {
      // Only send the fields that the backend expects
      const { confirmPassword: _, ...registrationData } = formData
      const success = await register(registrationData)
      if (success) {
        onNavigate('dashboard')
      }
    } catch (error) {
      if (error.message && error.message.includes('email')) {
        setErrors({ email: error.message })
      } else {
        setErrors({ general: error.message || 'Registration failed. Please try again.' })
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Real-time validation for better UX
    if (name === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address'
        }))
      } else {
        setErrors(prev => ({
          ...prev,
          email: ''
        }))
      }
    } else if (name === 'confirmPassword' && value && formData.password) {
      if (value !== formData.password) {
        setErrors(prev => ({
          ...prev,
          confirmPassword: 'Passwords do not match'
        }))
      } else {
        setErrors(prev => ({
          ...prev,
          confirmPassword: ''
        }))
      }
    } else if (errors[name]) {
      // Clear other errors when user starts typing
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
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
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            
            <CardTitle className="text-2xl font-bold text-white">
              Create Account
            </CardTitle>
            <p className="text-gray-300 mt-2">
              Join SnapCart and start tracking your expenses
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
                >
                  {errors.general}
                </motion.div>
              )}

              <Input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                variant="glass"
                error={errors.name}
                required
              />

              <Input
                type="email"
                name="email"
                placeholder="Enter your email (e.g., user@gmail.com)"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                variant="glass"
                error={errors.email}
                required
              />

              <Input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                variant="glass"
                error={errors.password}
                required
              />

              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                variant="glass"
                error={errors.confirmPassword}
                required
              />

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 rounded border-gray-600 bg-transparent"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center">
                <p className="text-gray-300">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Sign in
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

export default RegisterPage