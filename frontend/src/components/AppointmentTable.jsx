import RiskBadge from './RiskBadge'
import LoadingSpinner from './LoadingSpinner'

export default function AppointmentTable({ appointments, loading, onConfirm, onReschedule, onReminder }) {
  if (loading) {
    return <LoadingSpinner />
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <p className="text-gray-500">No appointments found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Patient</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Language</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Risk</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date & Time</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{apt.patientName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{apt.language || 'English'}</td>
                <td className="px-6 py-4">
                  <RiskBadge level={apt.riskLevel || 'LOW'} />
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'CONFIRMED' 
                      ? 'bg-green-100 text-green-800'
                      : apt.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(apt.appointmentTime).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    {apt.status === 'PENDING' && (
                      <button
                        onClick={() => onConfirm?.(apt.id)}
                        className="btn-primary btn-sm"
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      onClick={() => onReschedule?.(apt.id)}
                      className="btn-secondary btn-sm"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => onReminder?.(apt.id)}
                      className="btn-secondary btn-sm"
                    >
                      Remind
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
