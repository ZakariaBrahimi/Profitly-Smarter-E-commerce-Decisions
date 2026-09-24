import * as React from 'react'
import { Tag, ChevronDown, AlertCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionCard } from '@/components/ui/section-card'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { PriceBreakdown } from '@/components/pricing/PriceBreakdown'
import { cn } from '@/lib/utils'
import { formatDzd } from '@/lib/formatting/currency'
import { METRIC_TOOLTIPS } from '@/components/pricing/metricTooltips'
import type { PricingResult } from '@/lib/calculations/pricing'

export function RecommendedPriceCard({
  result,
  targetProfitDzd,
}: {
  result: PricingResult
  targetProfitDzd: number
}) {
  const [breakdownOpen, setBreakdownOpen] = React.useState(false)

  if (!result.isPricingAvailable) {
    return (
      <SectionCard icon={<Tag className="h-4 w-4" strokeWidth={2} />} title="Suggested Selling Price">
        <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning-bg px-4 py-3.5">
          <AlertCircle className="h-[18px] w-[18px] shrink-0 text-warning" strokeWidth={2} />
          <div>
            <p className="text-[13px] font-semibold text-ink">Suggested price unavailable</p>
            <p className="mt-0.5 text-xs text-muted">
              Set confirmation and delivery rates above 0% to calculate a suggested selling price.
            </p>
          </div>
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      icon={<Tag className="h-4 w-4" strokeWidth={2} />}
      title="Suggested Selling Price"
      description="Recommended for your target profit"
    >
      <div className="flex flex-col gap-4">
        <div>
          <motion.div
            key={result.suggestedSellingPrice}
            initial={{ opacity: 0.4, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-4xl font-extrabold tabular-nums text-ink sm:text-[44px]"
          >
            {formatDzd(result.suggestedSellingPrice)}
          </motion.div>
          <p className="mt-1 text-[13px] text-muted">Target profit: {formatDzd(targetProfitDzd)}</p>
        </div>

        <p className="text-[13px] leading-snug text-muted">
          This price covers your expected product, advertising and confirmation costs while achieving your target
          profit.
        </p>

        <div className="flex flex-col gap-1.5 rounded-lg bg-slate-50 px-3.5 py-3 text-[13px]">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1 text-muted">
              Calculated minimum
              <InfoTooltip text={METRIC_TOOLTIPS.calculatedMinimum} />
            </span>
            <span className="font-semibold tabular-nums text-ink">{formatDzd(result.requiredSellingPrice)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1 text-muted">
              Rounded commercially to
              <InfoTooltip text={METRIC_TOOLTIPS.roundedCommercially} />
            </span>
            <span className="font-semibold tabular-nums text-ink">{formatDzd(result.suggestedSellingPrice)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setBreakdownOpen((v) => !v)}
          aria-expanded={breakdownOpen}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border-strong bg-white py-2 text-[13px] font-medium text-ink transition-colors hover:bg-slate-50"
        >
          How is this calculated?
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', breakdownOpen && 'rotate-180')} strokeWidth={2} />
        </button>

        <AnimatePresence initial={false}>
          {breakdownOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <PriceBreakdown result={result} targetProfitDzd={targetProfitDzd} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionCard>
  )
}
