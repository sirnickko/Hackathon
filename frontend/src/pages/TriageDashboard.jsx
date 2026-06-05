import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import RiskBadge from '../components/RiskBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import { getDoctorFeed } from '../api/appointments'

export default function TriageDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchTriageData()
  }, [])

  const fetchTriageData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getDoctorFeed()
      setData(response.data)
    } catch (err) {
      setError('Failed to load triage data')
      console.error(err)
    } finally {
      setLoading(false)
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

  const riskStats = {
    HIGH: data?.patients?.filter(p => p.riskLevel === 'HIGH').length || 0,
    MEDIUM: data?.patients?.filter(p => p.riskLevel === 'MEDIUM').length || 0,
    LOW: data?.patients?.filter(p => p.riskLevel === 'LOW').length || 0,
  }

  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Risk Assessment Dashboard</h1>

        {/* Risk Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="card-body">
              <p className="text-gray-600 text-sm font-medium">High Risk</p>
              <p className="text-4xl font-bold text-risk-high mt-2">{riskStats.HIGH}</p>
              <p className="text-xs text-gray-500 mt-2">Require immediate attention</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <p className="text-gray-600 text-sm font-medium">Medium Risk</p>
              <p className="text-4xl font-bold text-risk-medium mt-2">{riskStats.MEDIUM}</p>
              <p className="text-xs text-gray-500 mt-2">Monitor closely</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <p className="text-gray-600 text-sm font-medium">Low Risk</p>
              <p className="text-4xl font-bold text-risk-low mt-2">{riskStats.LOW}</p>
              <p className="text-xs text-gray-500 mt-2">Standard priority</p>
            </div>
          </div>
        </div>

        {/* High Risk Patients */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">High Risk Patients</h2>
          {data?.patients?.filter(p => p.riskLevel === 'HIGH').length > 0 ? (
            <div className="space-y-4">
              {data.patients
                .filter(p => p.riskLevel === 'HIGH')
                .map(patient => (
                  <div key={patient.id} className="card">
                    <div className="card-body">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{patient.phone}</p>
                        </div>
                        <RiskBadge level="HIGH" />
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">AI Assessment</p>
                        <p className="text-sm text-gray-600">{patient.aiReason}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(patient.appointmentTime).toLocaleString()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          patient.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {patient.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-12">
                <p className="text-gray-500">No high risk patients at this time</p>
              </div>
            </div>
          )}
        </div>

        {/* No-Show Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-semibold text-gray-900">No-Show Predictions</h3>
            </div>
            <div className="card-body">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {data?.aiInsights?.predictedNoShows || 0}
              </div>
              <p className="text-gray-600">Appointments likely to be missed</p>
              <p className="text-sm text-gray-500 mt-4">
                Based on historical patterns and patient behavior analysis
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-xl font-semibold text-gray-900">Follow-Up Recommendations</h3>
            </div>
            <div className="card-body">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="text-gray-700 text-sm">Send multilingual reminders 24 hours before appointment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="text-gray-700 text-sm">Prioritize confirmations for high-risk patients</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span className="text-gray-700 text-sm">Consider additional assessment for flagged cases</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
