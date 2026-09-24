import { BarChart3 } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { MetricCard } from '@/components/ui/metric-card'
import { formatDzd, formatPercent, formatUsd } from '@/lib/formatting/currency'
import type { PricingResult } from '@/lib/calculations/pricing'

export function PricingResultsGrid({ result }: { result: PricingResult }) {
  const profitTone = result.profitPerGeneratedOrder >= 0 ? 'positive' : 'negative'

  return (
    <SectionCard
      icon={<BarChart3 className="h-4 w-4" strokeWidth={2} />}
      title="Pricing Economics"
      description="Every figure below is per generated order unless labeled otherwise."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <MetricCard label="Break-even price" value={formatDzd(result.breakEvenPrice)} />
        <MetricCard label="Maximum CPA (target)" value={formatUsd(result.targetProfitCpaUsd)} tone="accent" />
        <MetricCard label="Maximum CPA (break-even)" value={formatUsd(result.breakEvenCpaUsd)} />
        <MetricCard
          label="CPA safety margin"
          value={formatUsd(result.safetyMarginUsd)}
          tone={result.safetyMarginUsd >= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          label="Profit / generated order"
          value={formatDzd(result.profitPerGeneratedOrder)}
          tone={profitTone}
        />
        <MetricCard
          label="Profit / delivered order"
          value={formatDzd(result.profitPerDeliveredOrder)}
          subValue="Higher — costs are already spread across fewer orders"
        />
        <MetricCard label="Profit margin" value={formatPercent(result.profitMargin)} tone={profitTone} />
        <MetricCard label="Revenue / generated order" value={formatDzd(result.revenuePerGeneratedOrder)} />
      </div>
    </SectionCard>
  )
}
