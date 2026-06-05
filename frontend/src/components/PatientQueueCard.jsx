import RiskBadge from './RiskBadge'

export default function PatientQueueCard({ patient, onConfirm, onReschedule, onReminder }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500">{patient.phone}</p>
          </div>
          <RiskBadge level={patient.riskLevel} />
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">AI Assessment</p>
            <p className="text-sm text-gray-700 mt-1">{patient.aiReason}</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <p className="text-xs text-gray-500">Appointment</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(patient.appointmentTime).toLocaleString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              patient.status === 'CONFIRMED'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {patient.status}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => onConfirm?.(patient.id)}
            className="flex-1 btn-primary btn-sm"
          >
            Confirm
          </button>
          <button
            onClick={() => onReschedule?.(patient.id)}
            className="flex-1 btn-secondary btn-sm"
          >
            Reschedule
          </button>
          <button
            onClick={() => onReminder?.(patient.id)}
            className="flex-1 btn-secondary btn-sm"
          >
            Remind
          </button>
        </div>
      </div>
    </div>
  )
}
