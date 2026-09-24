import { Layers } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { MetricCard } from '@/components/ui/metric-card'
import { PricingFunnelVisualization } from '@/components/pricing/PricingFunnelVisualization'
import { formatDzd } from '@/lib/formatting/currency'
import { METRIC_TOOLTIPS } from '@/components/pricing/metricTooltips'
import type { PricingResult } from '@/lib/calculations/pricing'

const SIMULATION_SIZE = 100

export function OrderSimulation({ result }: { result: PricingResult }) {
  const profitTone = result.currentProfitPerGeneratedOrder >= 0 ? 'positive' : 'negative'

  return (
    <SectionCard
      icon={<Layers className="h-4 w-4" strokeWidth={2} />}
      title="100 Order Simulation"
      description="Exactly what happens financially if advertising generates 100 orders today."
    >
      <div className="flex flex-col gap-6">
        <PricingFunnelVisualization result={result} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <MetricCard
            label="Revenue"
            value={formatDzd(result.revenuePerGeneratedOrder * SIMULATION_SIZE)}
            tooltip={METRIC_TOOLTIPS.simRevenue}
          />
          <MetricCard
            label="Product cost"
            value={formatDzd(result.productCostPerGeneratedOrder * SIMULATION_SIZE)}
            tooltip={METRIC_TOOLTIPS.simProductCost}
          />
          <MetricCard
            label="Advertising cost"
            value={formatDzd(result.adCostDzd * SIMULATION_SIZE)}
            tooltip={METRIC_TOOLTIPS.simAdCost}
          />
          <MetricCard
            label="Call-center cost"
            value={formatDzd(result.callCenterCostPerGeneratedOrder * SIMULATION_SIZE)}
            tooltip={METRIC_TOOLTIPS.simCallCenterCost}
          />
          <MetricCard
            label="Delivery cost"
            value={formatDzd(result.deliveryCostPerGeneratedOrder * SIMULATION_SIZE)}
            tooltip={METRIC_TOOLTIPS.simDeliveryCost}
          />
          <MetricCard
            label="Other costs"
            value={formatDzd(result.otherCostPerGeneratedOrder * SIMULATION_SIZE)}
            tooltip={METRIC_TOOLTIPS.simOtherCost}
          />
          <MetricCard
            label="Net profit"
            value={formatDzd(result.currentProfitPerGeneratedOrder * SIMULATION_SIZE)}
            tone={profitTone}
            tooltip={METRIC_TOOLTIPS.simNetProfit}
          />
        </div>
      </div>
    </SectionCard>
  )
}
