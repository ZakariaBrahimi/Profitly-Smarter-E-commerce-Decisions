import { formatDzd, formatPercent } from '@/lib/formatting/currency'
import type { PricingResult } from '@/lib/calculations/pricing'

interface BreakdownRow {
  label: string
  value: string
  emphasis?: boolean
  dividerAbove?: boolean
}

export function PriceBreakdown({ result, targetProfitDzd }: { result: PricingResult; targetProfitDzd: number }) {
  const requiredRevenue = result.totalCostPerGeneratedOrder + targetProfitDzd

  const rows: BreakdownRow[] = [
    { label: 'Expected ad cost', value: formatDzd(result.adCostDzd) },
    { label: 'Expected product cost', value: formatDzd(result.productCostPerGeneratedOrder) },
    { label: 'Expected confirmation cost', value: formatDzd(result.callCenterCostPerGeneratedOrder) },
    { label: 'Expected delivery cost', value: formatDzd(result.deliveryCostPerGeneratedOrder) },
    { label: 'Other costs', value: formatDzd(result.otherCostPerGeneratedOrder) },
    { label: 'Expected cost', value: formatDzd(result.totalCostPerGeneratedOrder), emphasis: true, dividerAbove: true },
    { label: 'Target profit', value: formatDzd(targetProfitDzd) },
    { label: 'Required revenue', value: formatDzd(requiredRevenue), emphasis: true, dividerAbove: true },
    { label: 'Expected delivered rate', value: formatPercent(result.deliveredRate) },
    {
      label: 'Suggested selling price',
      value: formatDzd(result.requiredSellingPrice),
      emphasis: true,
      dividerAbove: true,
    },
  ]

  return (
    <div className="rounded-lg border border-border bg-slate-50/60 p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted">How is this calculated?</p>
      <dl className="flex flex-col text-[13px]">
        {rows.map((row) => (
          <div
            key={row.label}
            className={
              'flex items-center justify-between gap-3 py-1.5' +
              (row.dividerAbove ? ' mt-1 border-t border-border pt-2.5' : '')
            }
          >
            <dt className={row.emphasis ? 'font-semibold text-ink' : 'text-muted'}>{row.label}</dt>
            <dd className={'tabular-nums ' + (row.emphasis ? 'font-bold text-ink' : 'font-medium text-ink')}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[11px] leading-snug text-muted">
        Required revenue ÷ expected delivered rate = the exact price needed. The suggested price above rounds this
        up to a practical commercial number.
      </p>
    </div>
  )
}
