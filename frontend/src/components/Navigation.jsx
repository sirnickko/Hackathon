import { Link, useNavigate } from 'react-router-dom'

export default function Navigation() {
  const navigate = useNavigate()

  // EMERGENCY PRESENTATION OVERRIDE: Bypass the broken hook context
  const isDoctor = true 
  const userDisplayEmail = "ian.kimani@afyaconnect.ai"

  const handleLogout = () => {
    // Navigate straight to the login route layout on click
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/doctor" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-gray-900">AfyaConnect</span>
            </Link>

            {/* Force-renders the doctor action routes array directly on screen */}
            {isDoctor && (
              <div className="hidden sm:flex space-x-6 items-center">
                <Link to="/doctor" className="text-gray-700 hover:text-blue-600 font-semibold text-sm">Dashboard</Link>
                <Link to="/appointments" className="text-gray-700 hover:text-blue-600 font-semibold text-sm">Appointments</Link>
                <Link to="/triage" className="text-gray-700 hover:text-blue-600 font-semibold text-sm">AI Triage</Link>
                <Link to="/reminders" className="text-gray-700 hover:text-blue-600 font-semibold text-sm">Reminders</Link>
                
                {/* QUICK SWITCH ACTION BUTTON FOR JUMPING PATHS MID-PITCH */}
                <Link 
                  to="/patient" 
                  className="ml-4 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold hover:from-blue-100 transition-all shadow-sm"
                >
                  Switch to Patient View 🔄
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500 hidden md:inline">{userDisplayEmail}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}