import { useState } from 'react'

export default function SuccessAlert({ message, onDismiss }) {
  const [visible, setVisible] = useState(true)

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  if (!visible) return null

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-green-800">Success</p>
        <p className="text-sm text-green-700 mt-1">{message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="text-green-500 hover:text-green-700 text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
