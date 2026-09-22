import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, invalid, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={invalid}
        className={cn(
          'flex h-11 w-full rounded-lg border border-border-strong bg-white px-3.5 text-sm text-ink placeholder:text-slate-400 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid && 'border-danger focus:border-danger focus:ring-danger/20',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
