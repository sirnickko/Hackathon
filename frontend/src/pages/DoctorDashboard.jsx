import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import StatCard from '../components/StatCard'
import PatientQueueCard from '../components/PatientQueueCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SuccessAlert from '../components/SuccessAlert'
import { getDoctorFeed, confirmAppointment, rescheduleAppointment, sendReminder } from '../api/appointments'

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [feed, setFeed] = useState(null)

  useEffect(() => {
    fetchFeed()
  }, [])

  const fetchFeed = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getDoctorFeed()
      setFeed(response.data)
    } catch (err) {
      setError('Failed to load dashboard. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (appointmentId) => {
    try {
      await confirmAppointment(appointmentId)
      setSuccess('Appointment confirmed successfully')
      fetchFeed()
    } catch (err) {
      setError('Failed to confirm appointment')
    }
  }

  const handleReschedule = async (appointmentId) => {
    const newTime = prompt('Enter new appointment time (YYYY-MM-DD HH:MM)')
    if (newTime) {
      try {
        await rescheduleAppointment(appointmentId, newTime)
        setSuccess('Appointment rescheduled successfully')
        fetchFeed()
      } catch (err) {
        setError('Failed to reschedule appointment')
      }
    }
  }

  const handleReminder = async (appointmentId) => {
    try {
      await sendReminder(appointmentId, 'en')
      setSuccess('Reminder sent successfully')
    } catch (err) {
      setError('Failed to send reminder')
    }
  }

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
        {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Appointments"
            value={feed?.stats?.totalAppointments || 0}
            variant="primary"
          />
          <StatCard
            label="Confirmed"
            value={feed?.stats?.confirmed || 0}
            variant="success"
          />
          <StatCard
            label="Pending"
            value={feed?.stats?.pending || 0}
            variant="warning"
          />
          <StatCard
            label="High Risk"
            value={feed?.stats?.highRisk || 0}
            variant="danger"
          />
        </div>

        {/* AI Command Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-gray-900">Predicted No-Shows</h3>
            </div>
            <div className="card-body">
              <p className="text-3xl font-bold text-gray-900">{feed?.aiInsights?.predictedNoShows || 0}</p>
              <p className="text-sm text-gray-600 mt-2">Based on historical patterns</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-gray-900">High Risk Patients</h3>
            </div>
            <div className="card-body">
              <p className="text-3xl font-bold text-risk-high">{feed?.aiInsights?.highRiskPatients || 0}</p>
              <p className="text-sm text-gray-600 mt-2">Require immediate attention</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-gray-900">Reminders Sent</h3>
            </div>
            <div className="card-body">
              <p className="text-3xl font-bold text-gray-900">{feed?.aiInsights?.remindersSent || 0}</p>
              <p className="text-sm text-gray-600 mt-2">Today</p>
            </div>
          </div>
        </div>

        {/* Patient Queue */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Prioritized Patient Queue</h2>
          {feed?.patients && feed.patients.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {feed.patients.map((patient) => (
                <PatientQueueCard
                  key={patient.id}
                  patient={patient}
                  onConfirm={handleConfirm}
                  onReschedule={handleReschedule}
                  onReminder={handleReminder}
                />
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-12">
                <p className="text-gray-500">No patients in queue</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
