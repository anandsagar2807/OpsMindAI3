import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'right',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-blue-600 hover:from-primary-600 hover:to-blue-700 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20',
    ghost: 'bg-transparent hover:bg-white/5 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-semibold
        transition-all duration-200
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </motion.button>
  )
}

export default Button
