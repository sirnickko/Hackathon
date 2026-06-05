export default function LoadingSpinner({ size = 'md', fullscreen = false }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const spinner = (
    <div className={`${sizes[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin`} />
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80">
        {spinner}
      </div>
    )
  }

  return <div className="flex justify-center p-4">{spinner}</div>
}
