import { GitCompare } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { formatDzd } from '@/lib/formatting/currency'
import { METRIC_TOOLTIPS } from '@/components/pricing/metricTooltips'
import type { PricingResult } from '@/lib/calculations/pricing'

export function PricingScenarios({ result }: { result: PricingResult }) {
  if (!result.isPricingAvailable) return null

  const [breakEven, suggested, higherMargin] = result.scenarios

  const cards = [
    { title: 'Break-even', price: breakEven.sellingPrice, caption: '0 profit', tooltip: METRIC_TOOLTIPS.scenarioBreakEven },
    {
      title: 'Suggested',
      price: suggested.sellingPrice,
      caption: `${formatDzd(suggested.profit)} target`,
      tooltip: METRIC_TOOLTIPS.scenarioSuggested,
      highlight: true,
    },
    {
      title: 'Higher Margin Scenario',
      price: higherMargin.sellingPrice,
      caption: `${formatDzd(higherMargin.profit)} target`,
      tooltip: METRIC_TOOLTIPS.scenarioHigherMargin,
    },
  ]

  return (
    <SectionCard
      icon={<GitCompare className="h-4 w-4" strokeWidth={2} />}
      title="Pricing Scenarios"
      description="Three prices calculated from your current cost structure — none of these are hardcoded."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className={
              'flex flex-col gap-1.5 rounded-lg border p-4' +
              (card.highlight ? ' border-primary/25 bg-primary-light' : ' border-border bg-slate-50/60')
            }
          >
            <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted">
              {card.title}
              <InfoTooltip text={card.tooltip} />
            </span>
            <span className={'text-xl font-bold tabular-nums ' + (card.highlight ? 'text-primary-dark' : 'text-ink')}>
              {formatDzd(card.price)}
            </span>
            <span className="text-xs text-muted">{card.caption}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
