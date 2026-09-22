import { Target } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { formatUsd } from '@/lib/formatting/currency'
import { cn } from '@/lib/utils'
import type { ProfitabilityResult } from '@/lib/calculations/profitability'

export function BreakEvenAnalysis({
  result,
  currentAdCostUsd,
}: {
  result: ProfitabilityResult
  currentAdCostUsd: number
}) {
  const max = Math.max(0, result.maxAdCostPerGeneratedOrderUsd)
  const ratio = max > 0 ? Math.min(1, currentAdCostUsd / max) : currentAdCostUsd > 0 ? 1 : 0
  const overBudget = currentAdCostUsd > max
  const headroom = result.headroomUsd

  return (
    <SectionCard
      icon={<Target className="h-4 w-4" strokeWidth={2} />}
      title="Break-even"
      description="Find the limits and opportunities for your product."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-lg bg-slate-50 p-4">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted">Maximum ad cost / order</span>
          <span className="text-xl font-bold tabular-nums text-ink">{formatUsd(max)}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-lg bg-slate-50 p-4">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted">Current</span>
          <span className="text-xl font-bold tabular-nums text-ink">{formatUsd(currentAdCostUsd)}</span>
        </div>
        <div
          className={cn(
            'flex flex-col gap-1 rounded-lg p-4',
            overBudget ? 'bg-danger-bg' : 'bg-success-bg',
          )}
        >
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted">Headroom</span>
          <span className={cn('text-xl font-bold tabular-nums', overBudget ? 'text-danger' : 'text-success')}>
            {overBudget ? '-' : ''}
            {formatUsd(Math.abs(headroom))} / order
          </span>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
          <span>$0</span>
          <span>Max sustainable: {formatUsd(max)}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn('h-full rounded-full transition-all duration-300 ease-out', overBudget ? 'bg-danger' : 'bg-primary')}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          {overBudget
            ? "Your current ad cost is above the break-even point — you're losing money on every order."
            : 'Your current ad cost sits within a sustainable range.'}
        </p>
      </div>
    </SectionCard>
  )
}
