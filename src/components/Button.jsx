import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}, ref) {
  const base = 'focus-ring inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[1px]';
  const sizes = {
    sm: 'h-9 rounded-lg px-3 text-sm',
    md: 'h-10 rounded-xl px-4 text-sm',
    lg: 'h-12 rounded-xl px-6 text-base',
  };
  const variants = {
    primary: 'bg-gradient-to-b from-[var(--brand-primary)] to-[var(--brand-primary-dark)] text-white shadow-sm hover:brightness-105',
    secondary: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-[var(--brand-primary)] text-white hover:brightness-105',
  };
  return (
    <button ref={ref} className={clsx(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </button>
  )
})

export default Button



