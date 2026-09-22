import { ArrowRight, LineChart } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MetricChange } from '@/components/ui/metric-change'
import { formatDzd, formatOrders } from '@/lib/formatting/currency'
import { projectMonthly, type ProfitabilityResult } from '@/lib/calculations/profitability'

export interface ProjectedResultsProps {
  current: ProfitabilityResult
  scenario: ProfitabilityResult
  days: number
}

interface Row {
  label: string
  current: number
  scenario: number
  format: (v: number) => string
}

function ComparisonRows({ rows }: { rows: Row[] }) {
  return (
    <div className="flex flex-col">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-b-0">
          <span className="text-[13px] text-muted">{row.label}</span>
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-medium tabular-nums text-slate-400">{row.format(row.current)}</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-300" strokeWidth={2} />
            <span className="text-sm font-bold tabular-nums text-ink">{row.format(row.scenario)}</span>
            <MetricChange current={row.current} scenario={row.scenario} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProjectedResults({ current, scenario, days }: ProjectedResultsProps) {
  const dailyRows: Row[] = [
    { label: 'Delivered orders', current: current.deliveredOrders, scenario: scenario.deliveredOrders, format: formatOrders },
    { label: 'Revenue', current: current.revenueDzd, scenario: scenario.revenueDzd, format: formatDzd },
    { label: 'Net profit', current: current.netProfitDzd, scenario: scenario.netProfitDzd, format: formatDzd },
    {
      label: 'Profit / order',
      current: current.profitPerDeliveredOrderDzd,
      scenario: scenario.profitPerDeliveredOrderDzd,
      format: formatDzd,
    },
  ]

  const currentMonthly = projectMonthly(current, days)
  const scenarioMonthly = projectMonthly(scenario, days)

  const monthlyRows: Row[] = [
    { label: 'Delivered orders', current: currentMonthly.deliveredOrders, scenario: scenarioMonthly.deliveredOrders, format: formatOrders },
    { label: 'Revenue', current: currentMonthly.revenueDzd, scenario: scenarioMonthly.revenueDzd, format: formatDzd },
    { label: 'Net profit', current: currentMonthly.netProfitDzd, scenario: scenarioMonthly.netProfitDzd, format: formatDzd },
  ]

  return (
    <SectionCard
      icon={<LineChart className="h-4 w-4" strokeWidth={2} />}
      title="Projected Results"
      description="Current settings compared to your what-if scenario."
    >
      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <ComparisonRows rows={dailyRows} />
        </TabsContent>
        <TabsContent value="monthly">
          <ComparisonRows rows={monthlyRows} />
        </TabsContent>
      </Tabs>
    </SectionCard>
  )
}
