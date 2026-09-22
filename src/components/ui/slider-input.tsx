import * as React from 'react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface SliderInputProps {
  id?: string
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  formatValue: (value: number) => string
  parseValue?: (raw: string) => number | null
  className?: string
}

/** Draggable slider paired with a directly-editable formatted value. */
export function SliderInput({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue,
  parseValue,
  className,
}: SliderInputProps) {
  const [focused, setFocused] = React.useState(false)
  const [draft, setDraft] = React.useState(formatValue(value))
  const inputId = React.useId()
  const resolvedId = id ?? inputId

  React.useEffect(() => {
    if (!focused) setDraft(formatValue(value))
  }, [value, focused, formatValue])

  const commitDraft = () => {
    setFocused(false)
    const parser = parseValue ?? ((raw: string) => Number.parseFloat(raw.replace(/[^0-9.-]/g, '')))
    const parsed = parser(draft)
    if (parsed === null || !Number.isFinite(parsed)) {
      setDraft(formatValue(value))
      return
    }
    onChange(Math.min(max, Math.max(min, parsed)))
  }

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={resolvedId} className="text-[13px] font-medium text-ink">
          {label}
        </Label>
        <input
          id={resolvedId}
          className="w-24 rounded-md border border-border-strong bg-white px-2 py-1 text-right text-sm font-semibold tabular-nums text-ink focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
          value={focused ? draft : formatValue(value)}
          onFocus={() => {
            setFocused(true)
            setDraft(formatValue(value))
          }}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
          }}
        />
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        aria-label={label}
      />
      <div className="flex justify-between text-[11px] text-slate-400">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  )
}
