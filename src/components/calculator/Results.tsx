import { TrendingUp } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { MetricCard } from '@/components/ui/metric-card'
import { NumberInput } from '@/components/ui/number-input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { formatDzd, formatUsd } from '@/lib/formatting/currency'
import { projectMonthly, type ProfitabilityResult } from '@/lib/calculations/profitability'
import { MONTHLY_PERIOD_OPTIONS, type MonthlyPeriodOption } from '@/types/calculator'

export interface ResultsProps {
  result: ProfitabilityResult
  period: MonthlyPeriodOption
  customDays: number
  onPeriodChange: (period: MonthlyPeriodOption) => void
  onCustomDaysChange: (days: number) => void
}

export function Results({ result, period, customDays, onPeriodChange, onCustomDaysChange }: ResultsProps) {
  const days = period === 'custom' ? customDays : period
  const projection = projectMonthly(result, days)

  return (
    <SectionCard
      icon={<TrendingUp className="h-4 w-4" strokeWidth={2} />}
      title="Results"
      description="Based on your current settings"
    >
      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
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
        </TabsContent>

        <TabsContent value="monthly">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-muted">
              Projected over {days} day{days === 1 ? '' : 's'}
            </p>
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              {MONTHLY_PERIOD_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onPeriodChange(option)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    period === option ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink',
                  )}
                >
                  {option}d
                </button>
              ))}
              <button
                type="button"
                onClick={() => onPeriodChange('custom')}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  period === 'custom' ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink',
                )}
              >
                Custom
              </button>
            </div>
          </div>

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
            <MetricCard
              label="Net profit (USD)"
              value={formatUsd(projection.netProfitUsd)}
              tone={projection.netProfitUsd >= 0 ? 'positive' : 'negative'}
            />
          </div>
        </TabsContent>
      </Tabs>
    </SectionCard>
  )
}
