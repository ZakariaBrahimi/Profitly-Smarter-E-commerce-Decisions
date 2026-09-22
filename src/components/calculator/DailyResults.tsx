import { TrendingUp } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { MetricCard } from '@/components/ui/metric-card'
import { formatDzd } from '@/lib/formatting/currency'
import type { ProfitabilityResult } from '@/lib/calculations/profitability'

export function DailyResults({ result }: { result: ProfitabilityResult }) {
  return (
    <SectionCard
      icon={<TrendingUp className="h-4 w-4" strokeWidth={2} />}
      title="Daily Results"
      description="Based on your current settings"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <MetricCard label="Revenue" value={formatDzd(result.revenueDzd)} />
        <MetricCard label="Ad spend" value={formatDzd(result.adSpendDzd)} />
        <MetricCard label="Product cost" value={formatDzd(result.productCostDzd)} />
        <MetricCard label="Confirmation fees" value={formatDzd(result.confirmationFeesDzd)} />
        <MetricCard label="Delivery cost" value={formatDzd(result.deliveryCostTotalDzd)} />
        <MetricCard
          label="Net profit"
          value={formatDzd(result.netProfitDzd)}
          tone={result.netProfitDzd >= 0 ? 'positive' : 'negative'}
        />
        <MetricCard
          label="Profit / delivered order"
          value={formatDzd(result.profitPerDeliveredOrderDzd)}
          tone={result.profitPerDeliveredOrderDzd >= 0 ? 'positive' : 'negative'}
        />
      </div>
    </SectionCard>
  )
}
