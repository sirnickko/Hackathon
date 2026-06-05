import { useState } from 'react'

export default function ErrorAlert({ message, onDismiss }) {
  const [visible, setVisible] = useState(true)

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  if (!visible) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-red-800">Error</p>
        <p className="text-sm text-red-700 mt-1">{message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-red-500 hover:text-red-700 text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
