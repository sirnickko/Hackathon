import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SuccessAlert from '../components/SuccessAlert'
import { getPatientAppointments, confirmAppointment, rescheduleAppointment } from '../api/appointments'
import { useAuth } from '../hooks/useAuth'

export default function PatientDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [languagePreference, setLanguagePreference] = useState('en')

  useEffect(() => {
    if (user?.id) {
      fetchAppointments()
    }
  }, [user])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getPatientAppointments(user.id)
      setAppointments(response.data)
    } catch (err) {
      setError('Failed to load appointments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (appointmentId) => {
    try {
      await confirmAppointment(appointmentId)
      setSuccess('Appointment confirmed')
      fetchAppointments()
    } catch (err) {
      setError('Failed to confirm appointment')
    }
  }

  const handleReschedule = async (appointmentId) => {
    const newTime = prompt('Enter new appointment time (YYYY-MM-DD HH:MM)')
    if (newTime) {
      try {
        await rescheduleAppointment(appointmentId, newTime)
        setSuccess('Appointment rescheduled')
        fetchAppointments()
      } catch (err) {
        setError('Failed to reschedule appointment')
      }
    }
  }

  const upcomingAppointment = appointments.find(apt => apt.status === 'CONFIRMED') || appointments[0]

  if (loading) {
    return (
      <>
        <Navigation />
        <LoadingSpinner fullscreen />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
        {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}

        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Health Dashboard</h1>

        {/* Upcoming Appointment Card */}
        {upcomingAppointment ? (
          <div className="card mb-8 border-l-4 border-l-primary">
            <div className="card-body">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">Upcoming Appointment</p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">{new Date(upcomingAppointment.appointmentTime).toLocaleDateString()}</h2>
                </div>
                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  upcomingAppointment.status === 'CONFIRMED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {upcomingAppointment.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-y border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Appointment Time</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {new Date(upcomingAppointment.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Doctor</p>
                  <p className="text-xl font-semibold text-gray-900">{upcomingAppointment.doctorName || 'TBD'}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {upcomingAppointment.status === 'PENDING' && (
                  <button
                    onClick={() => handleConfirm(upcomingAppointment.id)}
                    className="btn-primary"
                  >
                    Confirm Appointment
                  </button>
                )}
                <button
                  onClick={() => handleReschedule(upcomingAppointment.id)}
                  className="btn-secondary"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card mb-8">
            <div className="card-body text-center py-12">
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          </div>
        )}

        {/* Appointment History */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointment History</h2>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(1).map(apt => (
                <div key={apt.id} className="card">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(apt.appointmentTime).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(apt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        apt.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-800'
                          : apt.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-8">
                <p className="text-gray-500">No previous appointments</p>
              </div>
            </div>
          )}
        </div>

        {/* Language Preference */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Preferences</h3>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Reminder Language</label>
              <select
                value={languagePreference}
                onChange={(e) => setLanguagePreference(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
              </select>
            </div>
            <button className="btn-primary">Save Preferences</button>
          </div>
        </div>
      </div>
    </>
  )
}
