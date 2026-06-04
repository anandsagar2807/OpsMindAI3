import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = false, glass = false, ...props }) => {
  const baseClasses = glass
    ? 'backdrop-blur-xl bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 border border-white/10'
    : 'bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800 border border-dark-700/50'

  const hoverClasses = hover
    ? 'hover:scale-[1.02] hover:shadow-glow hover:border-indigo-500/30 cursor-pointer'
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
        animate-fade-in-up
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
