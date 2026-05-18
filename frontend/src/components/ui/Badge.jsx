const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-indigo-600/20 text-indigo-300 border-indigo-600/30',
    success: 'bg-green-500/20 text-green-300 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-300 border-red-500/30',
  }

  return (
    <span className={`
      inline-flex items-center
      px-3 py-1
      rounded-full
      text-xs font-medium
      border
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  )
}

export default Badge
