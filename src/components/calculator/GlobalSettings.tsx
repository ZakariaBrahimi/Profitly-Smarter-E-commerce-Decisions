import { Link } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { formatDzd, formatPercent } from '@/lib/formatting/currency'
import { DEFAULT_CALCULATOR_INPUTS } from '@/types/calculator'

const ROWS = [
  { label: 'Confirmation rate', value: formatPercent(DEFAULT_CALCULATOR_INPUTS.confirmationRate) },
  { label: 'Delivery rate', value: formatPercent(DEFAULT_CALCULATOR_INPUTS.deliveryRate) },
  { label: 'Exchange rate', value: formatDzd(DEFAULT_CALCULATOR_INPUTS.exchangeRate) },
  { label: 'Confirmation fee', value: formatDzd(DEFAULT_CALCULATOR_INPUTS.confirmationFeeDzd) },
]

export function GlobalSettings() {
  return (
    <SectionCard
      icon={<SlidersHorizontal className="h-4 w-4" strokeWidth={2} />}
      title="Global Settings"
      description="Applied automatically unless overridden for this product."
      action={
        <Link
          to="/settings"
          className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline"
        >
          Edit defaults
        </Link>
      }
    >
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {ROWS.map((row) => (
          <div key={row.label} className="flex flex-col gap-0.5 rounded-lg bg-slate-50 px-3 py-2.5">
            <dt className="text-[11px] font-medium text-muted">{row.label}</dt>
            <dd className="text-sm font-semibold tabular-nums text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  )
}
