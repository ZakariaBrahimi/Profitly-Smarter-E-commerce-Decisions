import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface CurrencyInputProps {
  id?: string
  label?: string
  value: number
  onChange: (value: number) => void
  suffix?: string
  prefix?: string
  min?: number
  invalid?: boolean
  helperText?: string
  className?: string
}

/** Numeric input that shows a comma-formatted value at rest and a raw editable value while focused. */
export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  suffix,
  prefix,
  min = 0,
  invalid,
  helperText,
  className,
}: CurrencyInputProps) {
  const [focused, setFocused] = React.useState(false)
  const [draft, setDraft] = React.useState(String(value))
  const inputId = React.useId()
  const resolvedId = id ?? inputId

  React.useEffect(() => {
    if (!focused) setDraft(String(value))
  }, [value, focused])

  const displayValue = focused
    ? draft
    : Number.isFinite(value)
      ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
      : ''

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <Label htmlFor={resolvedId}>{label}</Label>}
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">
            {prefix}
          </span>
        )}
        <Input
          id={resolvedId}
          inputMode="decimal"
          type="text"
          invalid={invalid}
          value={displayValue}
          className={cn(prefix && 'pl-7', suffix && 'pr-14')}
          onFocus={() => {
            setFocused(true)
            setDraft(value ? String(value) : '')
          }}
          onChange={(e) => {
            const raw = e.target.value
            if (/^\d*\.?\d*$/.test(raw)) setDraft(raw)
          }}
          onBlur={() => {
            setFocused(false)
            const parsed = Number.parseFloat(draft)
            const next = Number.isFinite(parsed) ? Math.max(min, parsed) : 0
            onChange(next)
          }}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
            {suffix}
          </span>
        )}
      </div>
      {helperText && <p className="text-xs text-muted">{helperText}</p>}
    </div>
  )
}
