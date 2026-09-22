import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface NumberInputProps {
  id?: string
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
  className?: string
}

/** Plain numeric input (no thousands formatting) for counts like days or step values. */
export function NumberInput({ id, label, value, onChange, min = 0, max, step = 1, suffix, className }: NumberInputProps) {
  const inputId = React.useId()
  const resolvedId = id ?? inputId

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <Label htmlFor={resolvedId}>{label}</Label>}
      <div className="relative">
        <Input
          id={resolvedId}
          type="number"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : ''}
          className={cn(suffix && 'pr-12')}
          onChange={(e) => {
            const parsed = Number.parseFloat(e.target.value)
            if (!Number.isFinite(parsed)) return
            let next = Math.max(min, parsed)
            if (max !== undefined) next = Math.min(max, next)
            onChange(next)
          }}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
