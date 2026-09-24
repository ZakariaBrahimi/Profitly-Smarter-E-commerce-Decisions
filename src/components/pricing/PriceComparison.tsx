import { Scale } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { formatDzd, formatSignedDzd } from '@/lib/formatting/currency'
import type { PricingResult } from '@/lib/calculations/pricing'

export function PriceComparison({
  result,
  currentSellingPriceDzd,
  targetProfitDzd,
}: {
  result: PricingResult
  currentSellingPriceDzd: number
  targetProfitDzd: number
}) {
  if (!result.isPricingAvailable) return null

  const rows = [
    { label: 'Current selling price', value: formatDzd(currentSellingPriceDzd) },
    { label: 'Suggested selling price', value: formatDzd(result.requiredSellingPrice) },
    { label: 'Difference', value: formatSignedDzd(result.priceDifference), emphasis: true, dividerAbove: true },
    { label: 'Current expected profit', value: formatDzd(result.currentProfitPerGeneratedOrder), dividerAbove: true },
    { label: 'Target profit', value: formatDzd(targetProfitDzd) },
    { label: 'Gap', value: formatSignedDzd(result.targetProfitGap), emphasis: true, dividerAbove: true },
  ]

  return (
    <SectionCard
      icon={<Scale className="h-4 w-4" strokeWidth={2} />}
      title="Current Price Comparison"
      description="What you charge today vs. what your funnel needs — the numbers, no verdict."
    >
      <dl className="flex flex-col text-[13px]">
        {rows.map((row) => (
          <div
            key={row.label}
            className={
              'flex items-center justify-between gap-3 py-2' +
              (row.dividerAbove ? ' mt-1 border-t border-border pt-2.5' : '')
            }
          >
            <dt className={row.emphasis ? 'font-semibold text-ink' : 'text-muted'}>{row.label}</dt>
            <dd className={'tabular-nums ' + (row.emphasis ? 'text-base font-bold text-ink' : 'font-medium text-ink')}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-1 text-xs text-muted">
        Per generated order. A positive difference or gap means your current price falls short of the suggested
        price or target profit; negative means it exceeds it.
      </p>
    </SectionCard>
  )
}
