import { Gauge, Truck, Wallet, Megaphone, Percent } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { StatusBadge, getStatusConfig } from '@/components/ui/status-badge'
import { formatDzd, formatOrders, formatPercent, formatUsd } from '@/lib/formatting/currency'
import type { ProfitabilityResult } from '@/lib/calculations/profitability'

export function QuickSummary({ result }: { result: ProfitabilityResult }) {
  const statusConfig = getStatusConfig(result.status)

  const metrics = [
    {
      label: 'Delivered orders / day',
      value: formatOrders(result.deliveredOrders),
      icon: Truck,
    },
    {
      label: 'Profit / delivered order',
      value: formatDzd(result.profitPerDeliveredOrderDzd),
      icon: Wallet,
    },
    {
      label: 'Real ad cost / delivered order',
      value: formatDzd(result.realAdCostPerDeliveredOrderDzd),
      subValue: `≈ ${formatUsd(result.realAdCostPerDeliveredOrderUsd)}`,
      icon: Megaphone,
    },
    {
      label: 'Net margin',
      value: formatPercent(result.netMargin),
      icon: Percent,
    },
  ]

  return (
    <SectionCard icon={<Gauge className="h-4 w-4" strokeWidth={2} />} title="Quick Summary">
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-border bg-slate-50/60 p-4">
          <StatusBadge status={result.status} />
          <p className="mt-2 text-[13px] leading-snug text-muted">{statusConfig.message}</p>
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Key Metrics</h4>
          {metrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between gap-3 border-b border-border py-2.5 last:border-b-0">
              <div className="flex items-center gap-2 text-[13px] text-muted">
                <metric.icon className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
                {metric.label}
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold tabular-nums text-ink">{metric.value}</div>
                {metric.subValue && <div className="text-[11px] text-muted">{metric.subValue}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}
