import { forwardRef, useImperativeHandle, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import DatePicker from 'react-datepicker'
import { registerLocale } from 'react-datepicker'
import { lt } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

// Register Lithuanian locale
registerLocale('lt', lt)

// Base Input Component
const Input = forwardRef(function Input({ 
  label, 
  error, 
  className = '', 
  floating = false, 
  masked = false, 
  ...props 
}, ref) {
  const base = 'focus-ring block w-full rounded-lg border bg-white px-3 h-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition';
  
  if (floating) {
    return (
      <div className={clsx('relative', className)}>
        <input
          ref={ref}
          aria-invalid={Boolean(error) || undefined}
          className={clsx(
            base,
            'peer placeholder:text-transparent',
            error ? 'border-red-300 ring-1 ring-red-200 focus-visible:ring-red-400' : 'border-gray-300 focus-visible:ring-[var(--brand-secondary)]'
          )}
          {...props}
        />
        {label && (
          <span className="pointer-events-none absolute left-3 top-2.5 z-10 origin-left -translate-y-1/2 bg-white px-1 text-xs text-gray-500 transition-all duration-150 ease-out
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            {label}
          </span>
        )}
        {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
      </div>
    )
  }
  
  return (
    <label className={clsx('block', className)}>
      {label && (
        <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      )}
      <input
        ref={ref}
        aria-invalid={Boolean(error) || undefined}
        className={clsx(
          base,
          error ? 'border-red-300 ring-1 ring-red-200 focus-visible:ring-red-400' : 'border-gray-300 focus-visible:ring-[var(--brand-secondary)]'
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
})

// Text Input with floating label (used in Home.jsx)
const FloatingInput = forwardRef(function FloatingInput({ 
  id,
  label, 
  error, 
  className = '', 
  ...props 
}, ref) {
  return (
    <div className={clsx('relative', className)}>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error) || undefined}
        className={clsx(
          'peer focus-ring block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:outline-none',
          error ? 'border-red-300 ring-1 ring-red-200' : ''
        )}
        {...props}
      />
      {label && (
        <label 
          htmlFor={id} 
          className="absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-[var(--brand-secondary)]"
        >
          {label}
        </label>
      )}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  )
})

// Select Component
const Select = forwardRef(function Select({ 
  value, 
  onChange, 
  children, 
  className = '', 
  selectClassName = '', 
  label,
  error,
  ...rest 
}, ref) {
  return (
    <div className={clsx('relative', className)}>
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-gray-600">{label}</span>
      )}
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        className={clsx(
          'w-full h-10 focus-ring appearance-none rounded-lg border border-gray-300 pl-4 pr-10 bg-white text-gray-900 focus:outline-none',
          error ? 'border-red-300 ring-1 ring-red-200' : '',
          selectClassName
        )}
        {...rest}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </span>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  )
})

// Checkbox Component
const Checkbox = forwardRef(function Checkbox({ 
  label, 
  error, 
  className = '', 
  checkboxClassName = '',
  ...props 
}, ref) {
  return (
    <div className={clsx('block', className)}>
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={clsx(
            'h-4 w-4 checkbox-brand',
            error ? 'border-red-300' : '',
            checkboxClassName
          )}
          {...props}
        />
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  )
})

// Radio Button Component
const Radio = forwardRef(function Radio({ 
  label, 
  error, 
  className = '', 
  radioClassName = '',
  ...props 
}, ref) {
  return (
    <div className={clsx('block', className)}>
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="radio"
          className={clsx(
            'h-4 w-4 text-[var(--brand-secondary)] focus:ring-[var(--brand-secondary)] border-gray-300',
            error ? 'border-red-300' : '',
            radioClassName
          )}
          {...props}
        />
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  )
})

// Radio Group Component
const RadioGroup = forwardRef(function RadioGroup({ 
  name,
  value,
  onChange,
  options = [],
  label,
  error,
  className = '',
  ...props 
}, ref) {
  return (
    <div className={clsx('block', className)}>
      {label && (
        <span className="mb-2 block text-sm font-medium text-gray-600">{label}</span>
      )}
      <div className="flex gap-4">
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            label={option.label}
            {...props}
          />
        ))}
      </div>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  )
})

// Textarea Component
const Textarea = forwardRef(function Textarea({ 
  label, 
  error, 
  className = '', 
  floating = false,
  ...props 
}, ref) {
  const base = 'focus-ring block w-full rounded-lg border bg-white px-3 h-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition resize-none';
  
  if (floating) {
    return (
      <div className={clsx('relative', className)}>
        <textarea
          ref={ref}
          aria-invalid={Boolean(error) || undefined}
          className={clsx(
            base,
            'peer placeholder:text-transparent',
            error ? 'border-red-300 ring-1 ring-red-200 focus-visible:ring-red-400' : 'border-gray-300 focus-visible:ring-[var(--brand-secondary)]'
          )}
          {...props}
        />
        {label && (
          <span className="pointer-events-none absolute left-3 top-2.5 z-10 origin-left -translate-y-1/2 bg-white px-1 text-xs text-gray-500 transition-all duration-150 ease-out
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            {label}
          </span>
        )}
        {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
      </div>
    )
  }
  
  return (
    <label className={clsx('block', className)}>
      {label && (
        <span className="mb-1.5 block text-xs font-medium text-gray-600">{label}</span>
      )}
      <textarea
        ref={ref}
        aria-invalid={Boolean(error) || undefined}
        className={clsx(
          base,
          error ? 'border-red-300 ring-1 ring-red-200 focus-visible:ring-red-400' : 'border-gray-300 focus-visible:ring-[var(--brand-secondary)]'
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
})

// Pin Group Component (from existing PinGroup.jsx)
const PinGroup = forwardRef(function PinGroup({ 
  length, 
  name, 
  setValue, 
  error, 
  onComplete,
  className = '',
  ...props 
}, ref) {
  const inputsRef = useRef([])

  function focusAt(index) {
    const el = inputsRef.current[index]
    if (el) {
      el.focus()
      setTimeout(() => { try { el.select() } catch {} }, 0)
    }
  }

  // Force overwrite and advance even if typed char equals existing one
  function handleBeforeInput(e, index) {
    const data = (e.data || '').replace(/\D/g, '')
    if (!data) return
    e.preventDefault()
    const el = inputsRef.current[index]
    if (el) {
      el.value = data.slice(-1)
    }
    syncHidden()
    const goNext = () => {
      if (index < length - 1) {
        const next = inputsRef.current[index + 1]
        if (next) {
          next.focus()
          try { next.select() } catch {}
        }
      } else if (onComplete) {
        onComplete()
      }
    }
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      window.requestAnimationFrame(goNext)
    } else {
      setTimeout(goNext, 0)
    }
  }

  function handleKeyDown(e, index) {
    const key = e.key
    if (key === 'Backspace' && !e.currentTarget.value && index > 0) {
      focusAt(index - 1)
    }
    if (key === 'ArrowLeft' && index > 0) focusAt(index - 1)
    if (key === 'ArrowRight' && index < length - 1) focusAt(index + 1)
  }

  function handleFocus(e) {
    try { e.target.select() } catch {}
  }

  function handlePaste(e) {
    e.preventDefault()
    const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length)
    text.split('').forEach((ch, i) => {
      const el = inputsRef.current[i]
      if (el) el.value = ch
    })
    const nextIndex = Math.min(text.length, length - 1)
    focusAt(nextIndex)
    syncHidden()
    if (text.length === length && onComplete) onComplete()
  }

  function syncHidden() {
    const value = inputsRef.current.map((el) => (el && el.value) || '').join('')
    if (setValue) {
      // Call setValue with the field name and value for react-hook-form
      setValue(name, value, { shouldValidate: true, shouldDirty: true })
    }
  }

  useImperativeHandle(ref, () => ({
    focus: () => focusAt(0),
    focusFirst: () => focusAt(0), // Add focusFirst method for compatibility
    clear: () => {
      inputsRef.current.forEach(el => { if (el) el.value = '' })
      syncHidden()
    },
    getValue: () => inputsRef.current.map((el) => (el && el.value) || '').join('')
  }))

  return (
    <div className={clsx('space-y-2', className)}>
      <div className="flex gap-2">
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            onBeforeInput={(e) => handleBeforeInput(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onFocus={handleFocus}
            onPaste={handlePaste}
            className={`no-selection h-9 w-9 rounded-lg border border-gray-300 bg-white text-center text-base font-mono shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted caret-[color:var(--brand-primary)]`}
            {...props}
          />
        ))}
      </div>
      {error && <span className="block text-xs text-red-600">{error}</span>}
      <input type="hidden" name={name} />
    </div>
  )
})

// Date Input Component
const DateInput = forwardRef(function DateInput({ 
  label, 
  error, 
  className = '', 
  floating = false,
  value,
  onChange,
  ...props 
}, ref) {
  return (
    <div className={clsx('relative', className)}>
      {label && (
        <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      )}
      <DatePicker
        ref={ref}
        selected={value ? new Date(value) : null}
        onChange={(date) => {
          if (onChange) {
            const event = {
              target: {
                value: date ? date.toISOString().split('T')[0] : ''
              }
            }
            onChange(event)
          }
        }}
        dateFormat="dd-MM-yyyy"
        locale="lt"
        placeholderText="dd-mm-yyyy"
        showPopperArrow={false}
        popperClassName="react-datepicker-popper"
        popperPlacement="bottom-end"
        className={clsx(
          'h-10 w-28 focus-ring block rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-900 focus:outline-none',
          error ? 'border-red-300 ring-1 ring-red-200' : ''
        )}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </div>
  )
})

// Number Input Component
const NumberInput = forwardRef(function NumberInput({ 
  label, 
  error, 
  className = '', 
  floating = false,
  ...props 
}, ref) {
  return (
    <Input
      ref={ref}
      type="number"
      label={label}
      error={error}
      className={className}
      floating={floating}
      {...props}
    />
  )
})

// Email Input Component
const EmailInput = forwardRef(function EmailInput({ 
  label, 
  error, 
  className = '', 
  floating = false,
  ...props 
}, ref) {
  return (
    <Input
      ref={ref}
      type="email"
      label={label}
      error={error}
      className={className}
      floating={floating}
      {...props}
    />
  )
})

// Password Input Component
const PasswordInput = forwardRef(function PasswordInput({ 
  label, 
  error, 
  className = '', 
  floating = false,
  ...props 
}, ref) {
  return (
    <Input
      ref={ref}
      type="password"
      label={label}
      error={error}
      className={className}
      floating={floating}
      {...props}
    />
  )
})

// Search Input Component
const SearchInput = forwardRef(function SearchInput({ 
  label, 
  error, 
  className = '', 
  floating = false,
  ...props 
}, ref) {
  return (
    <Input
      ref={ref}
      type="search"
      label={label}
      error={error}
      className={className}
      floating={floating}
      {...props}
    />
  )
})

export {
  Input,
  FloatingInput,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Textarea,
  PinGroup,
  DateInput,
  NumberInput,
  EmailInput,
  PasswordInput,
  SearchInput
}

export default Input
