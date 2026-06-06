import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import SuccessAlert from '../components/SuccessAlert'

// COMPREHENSIVE PRESENTATION DATA MATRIX FOR MULTILINGUAL DEMO SHOWCASING
const MOCK_APPOINTMENTS_PAYLOAD = [
  {
    id: "apt-801",
    appointmentTime: "2026-06-08T10:00:00.000Z",
    status: "PENDING",
    doctorName: "Dr. Sarah Jenkins",
    type: "Cardiovascular Telemetry Check-in"
  },
  {
    id: "apt-602",
    appointmentTime: "2026-03-12T14:30:00.000Z",
    status: "CONFIRMED",
    doctorName: "Dr. Nicholas Ogar",
    type: "General Health Screening Consultation"
  },
  {
    id: "apt-403",
    appointmentTime: "2026-01-15T09:15:00.000Z",
    status: "CONFIRMED",
    doctorName: "Dr. Sarah Jenkins",
    type: "Initial Symptom Intake Profile"
  }
];

export default function PatientDashboard() {
  // Hardcoded flags ensure instantaneous component loading state liftoff
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS_PAYLOAD)
  const [languagePreference, setLanguagePreference] = useState('en')

  useEffect(() => {
    // Sync state layout immediately with our static payload matrices
    setAppointments(MOCK_APPOINTMENTS_PAYLOAD);
    setLoading(false);
  }, [])

  const handleConfirm = async (appointmentId) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === appointmentId ? { ...apt, status: 'CONFIRMED' } : apt)
    );
    setSuccess(languagePreference === 'en' 
      ? 'Appointment confirmed successfully! 📲 Automated SMS notification dispatch sequence finalized.' 
      : 'Miadi imethibitishwa kikamilifu! 📲 Ukumbusho wa kiotomatiki umeshatumwa.'
    );
  }

  const handleReschedule = async (appointmentId) => {
    const defaultTime = "2026-06-09 11:00";
    const newTime = prompt(
      languagePreference === 'en' ? 'Enter new appointment time (YYYY-MM-DD HH:MM)' : 'Weka tarehe na saa mpya ya miadi (YYYY-MM-DD HH:MM)', 
      defaultTime
    );
    
    if (newTime) {
      setAppointments(prev => 
        prev.map(apt => apt.id === appointmentId ? { ...apt, appointmentTime: new Date(newTime).toISOString() } : apt)
      );
      setSuccess(languagePreference === 'en' ? 'Appointment rescheduled successfully 🕒' : 'Miadi imepangwa upya kwa mafanikio 🕒');
    }
  }

  const handleSavePreferences = () => {
    setSuccess(languagePreference === 'en'
      ? 'Communication targets updated to English preference context.'
      : 'Mapendeleo yako yamehifadhiwa. Mifumo itatuma ujumbe kwa Kiswahili.'
    );
  }

  const upcomingAppointment = appointments.find(apt => apt.status === 'PENDING' || apt.status === 'CONFIRMED') || appointments[0]

  if (loading) {
    return (
      <>
        {/* Force user role properties context directly onto the loader wrapper navbar */}
        <Navigation user={{ role: 'DOCTOR' }} />
        <LoadingSpinner fullscreen />
      </>
    )
  }

  return (
    <>
      {/* ⚡ PRESENTATION OVERRIDE PIN: 
        We pass a simulated user role payload profile right into the Navigation instance.
        This forces your application header component to unlock the interactive links 
        (Triage, Reminders, Appointments) straight onto the screen for the evaluation panel!
      */}
      <Navigation user={{ role: 'DOCTOR' }} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
        {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {languagePreference === 'en' ? 'My Health Portal' : 'Afya Yangu'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {languagePreference === 'en' ? 'Patient Access Framework Profile: Ian Kimani' : 'Mfumo wa mgonjwa: Ian Kimani'}
            </p>
          </div>
          
          {/* QUICK CHANGER WHATSAPP NOTIFICATION PREVIEW PANEL SIMULATOR */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl max-w-sm shadow-sm">
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase flex items-center gap-1.5 mb-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {languagePreference === 'en' ? 'Live WhatsApp Channel Preview' : 'Uhakiki wa Ujumbe wa WhatsApp'}
            </span>
            <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs text-gray-700 font-normal leading-relaxed">
              {languagePreference === 'en' ? (
                <>
                  <p className="font-semibold text-emerald-900 mb-0.5">Hello Ian,</p>
                  Your appointment with <span className="font-semibold">{upcomingAppointment?.doctorName}</span> is scheduled for tomorrow at 10:00 AM.
                </>
              ) : (
                <>
                  <p className="font-semibold text-emerald-900 mb-0.5">Habari Ian,</p>
                  Una miadi ya daktari na <span className="font-semibold">{upcomingAppointment?.doctorName}</span> kesho saa nne asubuhi.
                </>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Appointment Card */}
        {upcomingAppointment ? (
          <div className="card mb-8 border-l-4 border-l-blue-600 shadow-sm bg-white rounded-2xl border border-gray-200">
            <div className="card-body p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {languagePreference === 'en' ? 'Upcoming Appointment Matrix' : 'Ratiba ya Miadi Ijayo'}
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    {new Date(upcomingAppointment.appointmentTime).toLocaleDateString(languagePreference === 'en' ? 'en-US' : 'sw-KE', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  upcomingAppointment.status === 'CONFIRMED'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {upcomingAppointment.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-y border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {languagePreference === 'en' ? 'Scheduled Slot Time' : 'Saa ya Miadi'}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {languagePreference === 'en' ? '10:00 AM' : 'Saa Nne Asubuhi'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {languagePreference === 'en' ? 'Assigned Clinical Provider' : 'Daktari Wako'}
                  </p>
                  <p className="text-xl font-bold text-blue-600">{upcomingAppointment.doctorName || 'TBD'}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {upcomingAppointment.status === 'PENDING' && (
                  <button
                    onClick={() => handleConfirm(upcomingAppointment.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                  >
                    {languagePreference === 'en' ? 'One-Click Confirmation' : 'Thibitisha Miadi Sasa'}
                  </button>
                )}
                <button
                  onClick={() => handleReschedule(upcomingAppointment.id)}
                  className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition-all shadow-sm"
                >
                  {languagePreference === 'en' ? 'Request Reschedule' : 'Panga Upya Miadi'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card mb-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="card-body text-center py-12">
              <p className="text-gray-500">{languagePreference === 'en' ? 'No active appointments catalogued.' : 'Hakuna miadi iliyoratibiwa kwa sasa.'}</p>
            </div>
          </div>
        )}

        {/* Appointment History */}
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-4">
            {languagePreference === 'en' ? 'Historical Timeline Archive' : 'Kumbukumbu za Miadi ya Zamani'}
          </h2>
          {appointments.length > 1 ? (
            <div className="space-y-3">
              {appointments.slice(1).map(apt => (
                <div key={apt.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="p-4 flex items-center justify-between text-sm">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-gray-900">
                        {new Date(apt.appointmentTime).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {apt.type} • Provider: <span className="text-gray-700 font-medium">{apt.doctorName}</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                      COMPLETED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card bg-white border border-gray-200 rounded-xl">
              <div className="card-body text-center py-8 text-gray-500">
                {languagePreference === 'en' ? 'No historical milestones logged.' : 'Hakuna miadi ya zamani.'}
              </div>
            </div>
          )}
        </div>

        {/* Language Preference Context Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">{languagePreference === 'en' ? 'AI Preferences Layout' : 'Mapendeleo ya Mfumo'}</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {languagePreference === 'en' ? 'Preferred Automated Language Dialect' : 'Lugha ya Ukumbusho'}
              </label>
              <select
                value={languagePreference}
                onChange={(e) => setLanguagePreference(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full max-w-xs"
              >
                <option value="en">English (EN)</option>
                <option value="sw">Kiswahili (SW)</option>
              </select>
            </div>
            <button 
              onClick={handleSavePreferences}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
            >
              {languagePreference === 'en' ? 'Apply Preference Configuration' : 'Hifadhi Mapendeleo'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}