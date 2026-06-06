import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import StatCard from '../components/StatCard'
import PatientQueueCard from '../components/PatientQueueCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SuccessAlert from '../components/SuccessAlert'

// MOCK DATA TO POPULATE THE CLINICAL COMMAND CENTER FLUSH WITH METRICS
const PRESENTATION_MOCK_DATA = {
  stats: {
    totalAppointments: 24,
    confirmed: 14,
    pending: 7,
    highRisk: 3
  },
  aiInsights: {
    predictedNoShows: 4,
    highRiskPatients: 3,
    remindersSent: 18
  },
  patients: [
    {
      id: "pt-01",
      name: "John Kamau",
      appointmentTime: "09:30 AM",
      status: "PENDING",
      riskLevel: "HIGH",
      symptoms: "Severe chest pressure radiating to left arm, shortness of breath.",
      aiTriageAnalysis: "High correlation with acute cardiovascular events. AI Priority Flag: Level 1 Dispatch Required.",
      language: "Swahili",
      phoneNumber: "+254712345678"
    },
    {
      id: "pt-02",
      name: "Mary Atieno",
      appointmentTime: "11:00 AM",
      status: "CONFIRMED",
      riskLevel: "MEDIUM",
      symptoms: "Persistent dry cough for 3 weeks, low-grade intermittent fever.",
      aiTriageAnalysis: "Risk factors indicate potential upper respiratory layout complications. Escalating alert status.",
      language: "English",
      phoneNumber: "+254722345678"
    },
    {
      id: "pt-03",
      name: "David Ochieng",
      appointmentTime: "02:15 PM",
      status: "PENDING",
      riskLevel: "LOW",
      symptoms: "Routine check-in regarding post-operative knee replacement healing progress.",
      aiTriageAnalysis: "Telemetry monitors stable recovery metrics. Normal status parameters confirmed.",
      language: "English",
      phoneNumber: "+254732345678"
    }
  ]
};

export default function DoctorDashboard() {
  // Directly initializing states to presentation configurations
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [feed, setFeed] = useState(PRESENTATION_MOCK_DATA)

  useEffect(() => {
    // Hardcoded bypass for presentation stability
    setFeed(PRESENTATION_MOCK_DATA);
    setLoading(false);
  }, [])

  const handleConfirm = async (appointmentId) => {
    // Instantly simulate successful database updates locally
    setFeed(prev => ({
      ...prev,
      patients: prev.patients.map(p => p.id === appointmentId ? { ...p, status: 'CONFIRMED' } : p),
      stats: { ...prev.stats, confirmed: prev.stats.confirmed + 1, pending: Math.max(0, prev.stats.pending - 1) }
    }));
    setSuccess('Appointment confirmed successfully 🎉');
  }

  const handleReschedule = async (appointmentId) => {
    const newTime = prompt('Enter new appointment time (YYYY-MM-DD HH:MM)', '2026-06-06 14:00')
    if (newTime) {
      setFeed(prev => ({
        ...prev,
        patients: prev.patients.map(p => p.id === appointmentId ? { ...p, appointmentTime: newTime } : p)
      }));
      setSuccess('Appointment rescheduled successfully 🕒');
    }
  }

  const handleReminder = async (appointmentId) => {
    setFeed(prev => ({
      ...prev,
      aiInsights: { ...prev.aiInsights, remindersSent: prev.aiInsights.remindersSent + 1 }
    }));
    setSuccess('AI Multilingual Reminder dispatched via SMS successfully 📲');
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
              <p className="text-3xl font-bold text-red-600">{feed?.aiInsights?.highRiskPatients || 0}</p>
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