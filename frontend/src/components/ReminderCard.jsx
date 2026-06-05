export default function ReminderCard({ message, language, onConfirm, onReschedule }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-md">
      <div className="mb-4 pb-4 border-b border-gray-200">
        <span className="inline-block px-3 py-1 bg-primary-light text-primary rounded-full text-xs font-medium">
          {language === 'sw' ? 'Swahili' : 'English'}
        </span>
      </div>

      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        {message}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 btn-primary btn-sm"
        >
          Confirm
        </button>
        <button
          onClick={onReschedule}
          className="flex-1 btn-secondary btn-sm"
        >
          Reschedule
        </button>
      </div>
    </div>
  )
}
