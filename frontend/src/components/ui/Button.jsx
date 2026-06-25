import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'right',
  onClick,
  ...props
}) => {
  const variants = {
    primary: 'btn-premium hover:shadow-xl hover:shadow-indigo-500/30',
    secondary: 'btn-ghost hover:bg-white/[0.08] hover:border-white/[0.15]',
    ghost: 'btn-ghost hover:bg-white/[0.05]',
    danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/40',
    outline: 'btn-outline',
    gradient: 'btn-gradient',
  }

  const sizes = {
    sm: 'btn-sm',
    md: '', // default size
    lg: 'btn-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-medium
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
