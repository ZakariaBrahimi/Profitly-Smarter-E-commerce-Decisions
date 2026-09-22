import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { formatSignedPercent } from '@/lib/formatting/currency'
import { cn } from '@/lib/utils'

export interface MetricChangeProps {
  current: number
  scenario: number
  className?: string
}

/** Percentage delta chip: green for improvement, red for decline, gray for flat. */
export function MetricChange({ current, scenario, className }: MetricChangeProps) {
  const delta = current !== 0 ? (scenario - current) / Math.abs(current) : 0
  const isFlat = Math.abs(scenario - current) < 0.005
  const isUp = delta > 0 && !isFlat
  const isDown = delta < 0 && !isFlat

  const Icon = isFlat ? Minus : isUp ? ArrowUp : ArrowDown

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
        isFlat && 'bg-slate-100 text-slate-500',
        isUp && 'bg-success-bg text-success',
        isDown && 'bg-danger-bg text-danger',
        className,
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {isFlat ? '0%' : formatSignedPercent(delta)}
    </span>
  )
}
