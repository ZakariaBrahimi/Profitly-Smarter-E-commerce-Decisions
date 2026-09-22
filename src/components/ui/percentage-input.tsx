import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface PercentageInputProps {
  id?: string
  label?: string
  /** Fraction 0-1 */
  value: number
  onChange: (value: number) => void
  invalid?: boolean
  className?: string
}

/** Input for percentage values stored internally as a 0-1 fraction. */
export function PercentageInput({ id, label, value, onChange, invalid, className }: PercentageInputProps) {
  const [focused, setFocused] = React.useState(false)
  const [draft, setDraft] = React.useState(String(Math.round(value * 100)))
  const inputId = React.useId()
  const resolvedId = id ?? inputId

  React.useEffect(() => {
    if (!focused) setDraft(String(Math.round(value * 100)))
  }, [value, focused])

  const displayValue = focused ? draft : String(Math.round(value * 100))

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <Label htmlFor={resolvedId}>{label}</Label>}
      <div className="relative">
        <Input
          id={resolvedId}
          inputMode="decimal"
          type="text"
          invalid={invalid}
          value={displayValue}
          className="pr-8"
          onFocus={() => {
            setFocused(true)
            setDraft(String(Math.round(value * 100)))
          }}
          onChange={(e) => {
            const raw = e.target.value
            if (/^\d*\.?\d*$/.test(raw)) setDraft(raw)
          }}
          onBlur={() => {
            setFocused(false)
            const parsed = Number.parseFloat(draft)
            const clamped = Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0
            onChange(clamped / 100)
          }}
        />
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">%</span>
      </div>
    </div>
  )
}
