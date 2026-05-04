import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = false, glass = false, ...props }) => {
  const baseClasses = glass
    ? 'backdrop-blur-xl bg-white/5 border border-white/10'
    : 'bg-dark-800/50 border border-dark-700/50'

  const hoverClasses = hover
    ? 'hover:scale-[1.02] hover:shadow-premium-lg hover:border-primary-500/30 cursor-pointer'
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        ${baseClasses}
        ${hoverClasses}
        rounded-2xl p-6
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
