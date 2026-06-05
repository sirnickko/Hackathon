import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import AppointmentTable from '../components/AppointmentTable'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SuccessAlert from '../components/SuccessAlert'
import { getAppointments, confirmAppointment, rescheduleAppointment, sendReminder } from '../api/appointments'

export default function AppointmentManagementPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    fetchAppointments()
  }, [statusFilter])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      const filters = statusFilter !== 'ALL' ? { status: statusFilter } : {}
      const response = await getAppointments(filters)
      setAppointments(response.data)
    } catch (err) {
      setError('Failed to load appointments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = appointments.filter((apt) =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  const handleReminder = async (appointmentId) => {
    try {
      await sendReminder(appointmentId, 'en')
      setSuccess('Reminder sent')
    } catch (err) {
      setError('Failed to send reminder')
    }
  }

  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
        {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Appointment Management</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field flex-1"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <AppointmentTable
          appointments={filteredAppointments}
          loading={loading}
          onConfirm={handleConfirm}
          onReschedule={handleReschedule}
          onReminder={handleReminder}
        />
      </div>
    </>
  )
}
