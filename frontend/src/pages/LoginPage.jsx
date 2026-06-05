import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { login as apiLogin } from '../api/auth'
import ErrorAlert from '../components/ErrorAlert'
import LoadingSpinner from '../components/LoadingSpinner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('DOCTOR')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await apiLogin(email, password, role)
      const { token, user } = response.data
      login(user, token)
      navigate(role === 'DOCTOR' ? '/doctor' : '/patient')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AfyaConnect AI</h1>
            <p className="text-gray-600 text-sm mt-2">Healthcare Management Platform</p>
          </div>

          {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Login As</label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="DOCTOR"
                    checked={role === 'DOCTOR'}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="ml-2 text-gray-700">Doctor</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="PATIENT"
                    checked={role === 'PATIENT'}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="ml-2 text-gray-700">Patient</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 font-semibold disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Demo credentials: demo@afyaconnect.com / demo123
          </p>
        </div>
      </div>
    </div>
  )
}
