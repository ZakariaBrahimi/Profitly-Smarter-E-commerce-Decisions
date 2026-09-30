import { TrendingUp } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { MetricCard } from '@/components/ui/metric-card'
import { NumberInput } from '@/components/ui/number-input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatDzd, formatUsd } from '@/lib/formatting/currency'
import { projectMonthly, type ProfitabilityResult } from '@/lib/calculations/profitability'
import { RESULTS_PERIOD_DAYS, type ResultsPeriod } from '@/types/calculator'

export interface ResultsProps {
  result: ProfitabilityResult
  period: ResultsPeriod
  customDays: number
  onPeriodChange: (period: ResultsPeriod) => void
  onCustomDaysChange: (days: number) => void
}

const PERIOD_LABELS: Record<ResultsPeriod, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  custom: 'Custom',
}

export function Results({ result, period, customDays, onPeriodChange, onCustomDaysChange }: ResultsProps) {
  const days = period === 'custom' ? customDays : RESULTS_PERIOD_DAYS[period]
  const projection = projectMonthly(result, days)
  const isDaily = period === 'daily'

  return (
    <SectionCard
      icon={<TrendingUp className="h-4 w-4" strokeWidth={2} />}
      title="Results"
      description={isDaily ? 'Based on your current settings' : `Projected over ${days} day${days === 1 ? '' : 's'}`}
    >
      <Tabs value={period} onValueChange={(value) => onPeriodChange(value as ResultsPeriod)}>
        <TabsList>
          {(Object.keys(PERIOD_LABELS) as ResultsPeriod[]).map((key) => (
            <TabsTrigger key={key} value={key}>
              {PERIOD_LABELS[key]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={period}>
          {period === 'custom' && (
            <div className="mb-4 max-w-[160px]">
              <NumberInput
                label="Custom days"
                value={customDays}
                onChange={onCustomDaysChange}
                min={1}
                max={365}
                suffix="days"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <MetricCard label="Revenue" value={formatDzd(projection.revenueDzd)} />
            <MetricCard label="Ad spend" value={formatDzd(projection.adSpendDzd)} />
            <MetricCard label="Product cost" value={formatDzd(projection.productCostDzd)} />
            <MetricCard label="Confirmation fees" value={formatDzd(projection.confirmationFeesDzd)} />
            <MetricCard label="Delivery cost" value={formatDzd(projection.deliveryCostTotalDzd)} />
            <MetricCard
              label="Net profit"
              value={formatDzd(projection.netProfitDzd)}
              tone={projection.netProfitDzd >= 0 ? 'positive' : 'negative'}
            />
            {isDaily ? (
              <MetricCard
                label="Profit / delivered order"
                value={formatDzd(result.profitPerDeliveredOrderDzd)}
                tone={result.profitPerDeliveredOrderDzd >= 0 ? 'positive' : 'negative'}
              />
            ) : (
              <MetricCard
                label="Net profit (USD)"
                value={formatUsd(projection.netProfitUsd)}
                tone={projection.netProfitUsd >= 0 ? 'positive' : 'negative'}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </SectionCard>
  )
}
