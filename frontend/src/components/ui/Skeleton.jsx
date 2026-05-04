const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 w-full',
    circle: 'h-12 w-12 rounded-full',
    card: 'h-32 w-full',
  }

  return (
    <div className={`
      ${variants[variant]}
      bg-dark-700/50
      animate-pulse
      rounded-lg
      ${className}
    `} />
  )
}

export default Skeleton
