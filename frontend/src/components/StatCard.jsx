export default function StatCard({ icon: Icon, label, value, subtext, variant = 'default' }) {
  const variants = {
    default: 'bg-white border-gray-200',
    primary: 'bg-primary-light border-primary',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
  }

  return (
    <div className={`card ${variants[variant]}`}>
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
          </div>
          {Icon && <Icon className="w-8 h-8 text-primary opacity-50" />}
        </div>
      </div>
    </div>
  )
}
