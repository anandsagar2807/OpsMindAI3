const Input = ({
  icon: Icon,
  className = '',
  error,
  ...props
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        )}
        <input
          className={`
            w-full
            ${Icon ? 'pl-12' : 'pl-4'}
            pr-4 py-3
            bg-dark-800/50
            border ${error ? 'border-red-500' : 'border-dark-700'}
            rounded-xl
            text-white placeholder-dark-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Input
