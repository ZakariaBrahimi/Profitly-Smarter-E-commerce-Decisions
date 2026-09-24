import { GitCompare } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { formatDzd } from '@/lib/formatting/currency'
import type { PricingResult } from '@/lib/calculations/pricing'

export function PricingScenarios({ result }: { result: PricingResult }) {
  return (
    <SectionCard
      icon={<GitCompare className="h-4 w-4" strokeWidth={2} />}
      title="Pricing Scenarios"
      description="Three prices calculated from your current cost structure — none of these are hardcoded."
    >
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-medium uppercase tracking-wide text-muted">
              <th className="px-4 py-2.5">Scenario</th>
              <th className="px-4 py-2.5 text-right">Selling Price</th>
              <th className="px-4 py-2.5 text-right">Profit / order</th>
            </tr>
          </thead>
          <tbody>
            {result.scenarios.map((scenario, index) => (
              <tr key={scenario.label} className={index > 0 ? 'border-t border-border' : undefined}>
                <td className="px-4 py-3 font-medium text-ink">{scenario.label}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink">
                  {formatDzd(scenario.sellingPrice)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted">{formatDzd(scenario.profit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}
