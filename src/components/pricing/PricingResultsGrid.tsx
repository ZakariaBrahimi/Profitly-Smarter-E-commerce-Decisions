import type { ReactNode } from 'react'
import { BarChart3 } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { MetricCard } from '@/components/ui/metric-card'
import { formatDzd, formatPercent, formatUsd } from '@/lib/formatting/currency'
import { METRIC_TOOLTIPS } from '@/components/pricing/metricTooltips'
import type { PricingResult } from '@/lib/calculations/pricing'

function GroupHeading({ children }: { children: ReactNode }) {
  return <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{children}</h4>
}

export function PricingResultsGrid({ result }: { result: PricingResult }) {
  const profitTone = result.currentProfitPerGeneratedOrder >= 0 ? 'positive' : 'negative'

  return (
    <SectionCard
      icon={<BarChart3 className="h-4 w-4" strokeWidth={2} />}
      title="Pricing Economics"
      description="Every figure below is per generated order unless labeled otherwise. Hover the ⓘ on any number for what it means."
    >
      <div className="flex flex-col gap-6">
        <div>
          <GroupHeading>Price benchmark</GroupHeading>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetricCard
              label="Break-even price"
              value={formatDzd(result.breakEvenPrice)}
              tooltip={METRIC_TOOLTIPS.breakEvenPrice}
            />
            <MetricCard
              label="Revenue / generated order"
              value={formatDzd(result.revenuePerGeneratedOrder)}
              tooltip={METRIC_TOOLTIPS.revenuePerGeneratedOrder}
            />
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <GroupHeading>Advertising budget (CPA)</GroupHeading>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MetricCard
              label="Maximum CPA (target)"
              value={formatUsd(result.targetProfitCpaUsd)}
              tone="accent"
              tooltip={METRIC_TOOLTIPS.maxCpaTarget}
            />
            <MetricCard
              label="Maximum CPA (break-even)"
              value={formatUsd(result.breakEvenCpaUsd)}
              tooltip={METRIC_TOOLTIPS.maxCpaBreakEven}
            />
            <MetricCard
              label="CPA safety margin"
              value={formatUsd(result.safetyMarginUsd)}
              tone={result.safetyMarginUsd >= 0 ? 'positive' : 'negative'}
              tooltip={METRIC_TOOLTIPS.cpaSafetyMargin}
            />
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <GroupHeading>Profitability</GroupHeading>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MetricCard
              label="Profit / generated order"
              value={formatDzd(result.currentProfitPerGeneratedOrder)}
              tone={profitTone}
              tooltip={METRIC_TOOLTIPS.profitPerGeneratedOrder}
            />
            <MetricCard
              label="Profit / delivered order"
              value={formatDzd(result.profitPerDeliveredOrder)}
              subValue="Higher — same profit, fewer orders"
              tooltip={METRIC_TOOLTIPS.profitPerDeliveredOrder}
            />
            <MetricCard
              label="Profit margin"
              value={formatPercent(result.profitMargin)}
              tone={profitTone}
              tooltip={METRIC_TOOLTIPS.profitMargin}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
