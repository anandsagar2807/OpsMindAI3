import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = false, glass = false, premium = false, ...props }) => {
  const baseClasses = glass
    ? 'glass'
    : premium
      ? 'card-premium'
      : 'card'

  const hoverClasses = hover
    ? 'hover:scale-[1.01] hover:shadow-floating cursor-pointer'
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`
        ${baseClasses}
        ${hoverClasses}
        rounded-xl
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
