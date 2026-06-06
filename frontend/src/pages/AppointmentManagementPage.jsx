import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import AppointmentTable from '../components/AppointmentTable'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SuccessAlert from '../components/SuccessAlert'

// HIGH-FIDELITY MOCK MATRIX FOR INTERACTIVE HACKATHON FILTERING
const MOCK_ROSTER_PAYLOAD = [
  { id: "apt-201", patientName: "John Kamau", doctorName: "Dr. Sarah Jenkins", appointmentTime: "2026-06-08T09:30:00.000Z", type: "Cardiovascular Telemetry Check-in", status: "PENDING" },
  { id: "apt-202", patientName: "Mary Atieno", doctorName: "Dr. Nicholas Ogar", appointmentTime: "2026-06-08T11:00:00.000Z", type: "General Health Screening Consultation", status: "CONFIRMED" },
  { id: "apt-203", patientName: "David Ochieng", doctorName: "Dr. Sarah Jenkins", appointmentTime: "2026-06-08T14:15:00.000Z", type: "Initial Symptom Intake Profile", status: "CONFIRMED" },
  { id: "apt-204", patientName: "Alice Wambui", doctorName: "Dr. Nicholas Ogar", appointmentTime: "2026-06-09T10:00:00.000Z", type: "Post-Op Follow-up", status: "CANCELLED" }
];

export default function AppointmentManagementPage() {
  // Directly set loading to false and link your array matrix state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [appointments, setAppointments] = useState(MOCK_ROSTER_PAYLOAD)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    // Local filter simulation layout for status selections during presentation
    if (statusFilter === 'ALL') {
      setAppointments(MOCK_ROSTER_PAYLOAD);
    } else {
      setAppointments(MOCK_ROSTER_PAYLOAD.filter(apt => apt.status === statusFilter));
    }
  }, [statusFilter])

  // Real-time search handler calculation 
  const filteredAppointments = appointments.filter((apt) =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleConfirm = async (appointmentId) => {
    setAppointments(prev =>
      prev.map(apt => apt.id === appointmentId ? { ...apt, status: 'CONFIRMED' } : apt)
    );
    setSuccess('Appointment confirmed successfully! 📲 SMS update sequence fired.');
  }

  const handleReschedule = async (appointmentId) => {
    const newTime = prompt('Enter new appointment time (YYYY-MM-DD HH:MM)', '2026-06-09 14:00')
    if (newTime) {
      setAppointments(prev =>
        prev.map(apt => apt.id === appointmentId ? { ...apt, appointmentTime: new Date(newTime).toISOString() } : apt)
      );
      setSuccess('Appointment slots rescheduled successfully 🕒');
    }
  }

  const handleReminder = async (appointmentId) => {
    setSuccess('AI Multi-channel reminder notification queued for dispatch successfully 📲');
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
              className="input-field flex-1 px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 px-4 py-2"
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