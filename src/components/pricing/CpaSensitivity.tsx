import { Activity } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { cn } from '@/lib/utils'
import { formatDzd, formatUsd } from '@/lib/formatting/currency'
import { METRIC_TOOLTIPS } from '@/components/pricing/metricTooltips'
import type { CpaSensitivityRow, PricingResult } from '@/lib/calculations/pricing'

const TONE_ROW_CLASSES: Record<CpaSensitivityRow['tone'], string> = {
  positive: 'text-success',
  warning: 'text-warning',
  negative: 'text-danger',
}

export interface CpaSensitivityProps {
  rows: CpaSensitivityRow[]
  currentCpaUsd: number
  result: PricingResult
  onSelectCpa: (cpaUsd: number) => void
}

export function CpaSensitivity({ rows, currentCpaUsd, result, onSelectCpa }: CpaSensitivityProps) {
  return (
    <SectionCard
      icon={<Activity className="h-4 w-4" strokeWidth={2} />}
      title="What If My CPA Changes?"
      description="Profit per generated order at your current selling price. Click a CPA to apply it."
    >
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-medium uppercase tracking-wide text-muted">
                <th className="px-4 py-2.5">CPA</th>
                <th className="px-4 py-2.5 text-right">
                  <span className="inline-flex items-center gap-1">
                    Profit / generated order
                    <InfoTooltip text={METRIC_TOOLTIPS.profitPerGeneratedOrder} />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const isCurrent = !row.isBreakEven && Math.abs(row.cpaUsd - currentCpaUsd) < 0.005
                return (
                  <tr
                    key={`${row.cpaUsd}-${row.isBreakEven}`}
                    className={cn(index > 0 && 'border-t border-border', row.isBreakEven && 'bg-slate-50/60')}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onSelectCpa(row.cpaUsd)}
                        className={cn(
                          'rounded-md px-2 py-1 text-left font-medium transition-colors hover:bg-primary-light hover:text-primary-dark',
                          isCurrent ? 'bg-primary-light text-primary-dark' : 'text-ink',
                        )}
                      >
                        {formatUsd(row.cpaUsd)}
                        {row.isBreakEven && <span className="ml-1.5 text-[11px] font-normal text-muted">(break-even)</span>}
                        {isCurrent && <span className="ml-1.5 text-[11px] font-normal text-primary">(current)</span>}
                      </button>
                    </td>
                    <td className={cn('px-4 py-3 text-right font-semibold tabular-nums', TONE_ROW_CLASSES[row.tone])}>
                      {formatDzd(row.profitPerGeneratedOrder)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          <span className="font-medium text-success">Green</span> = at or above target profit ·{' '}
          <span className="font-medium text-warning">amber</span> = profitable but below target ·{' '}
          <span className="font-medium text-danger">red</span> = losing money.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-0.5 rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
              Current CPA
              <InfoTooltip text={METRIC_TOOLTIPS.currentCpa} />
            </span>
            <span className="text-sm font-semibold tabular-nums text-ink">{formatUsd(currentCpaUsd)}</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
              Break-even CPA
              <InfoTooltip text={METRIC_TOOLTIPS.maxCpaBreakEven} />
            </span>
            <span className="text-sm font-semibold tabular-nums text-ink">{formatUsd(result.breakEvenCpaUsd)}</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
              CPA safety margin
              <InfoTooltip text={METRIC_TOOLTIPS.cpaSafetyMargin} />
            </span>
            <span
              className={cn(
                'text-sm font-semibold tabular-nums',
                result.safetyMarginUsd >= 0 ? 'text-success' : 'text-danger',
              )}
            >
              {formatUsd(result.safetyMarginUsd)}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
