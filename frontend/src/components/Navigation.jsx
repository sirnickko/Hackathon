import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navigation() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isDoctor = user?.role === 'DOCTOR'

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to={isDoctor ? '/doctor' : '/patient'} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-gray-900">AfyaConnect</span>
            </Link>

            {isDoctor && (
              <div className="hidden sm:flex space-x-6">
                <Link to="/doctor" className="text-gray-700 hover:text-primary font-medium">Dashboard</Link>
                <Link to="/appointments" className="text-gray-700 hover:text-primary font-medium">Appointments</Link>
                <Link to="/triage" className="text-gray-700 hover:text-primary font-medium">AI Triage</Link>
                <Link to="/reminders" className="text-gray-700 hover:text-primary font-medium">Reminders</Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="btn-secondary btn-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
