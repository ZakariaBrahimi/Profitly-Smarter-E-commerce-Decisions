import { Tag } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionCard } from '@/components/ui/section-card'
import { PricingStatusBadge, getPricingStatusConfig } from '@/components/pricing/PricingStatusBadge'
import { formatDzd, formatUsd } from '@/lib/formatting/currency'
import type { PricingResult } from '@/lib/calculations/pricing'

export function RecommendedPriceCard({ result, currentCpaUsd }: { result: PricingResult; currentCpaUsd: number }) {
  const statusConfig = getPricingStatusConfig(result.status)

  return (
    <SectionCard
      icon={<Tag className="h-4 w-4" strokeWidth={2} />}
      title="Recommended Selling Price"
      description="The price to charge to hit your target profit, rounded to a practical number."
    >
      <div className="flex flex-col gap-5">
        <div>
          <motion.div
            key={result.recommendedSellingPrice}
            initial={{ opacity: 0.4, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="text-4xl font-extrabold tabular-nums text-ink sm:text-[44px]"
          >
            {formatDzd(result.recommendedSellingPrice)}
          </motion.div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
            <span>
              Calculated minimum: <span className="font-semibold tabular-nums text-ink">{formatDzd(result.requiredSellingPrice)}</span>
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-slate-50/60 p-4">
          <PricingStatusBadge status={result.status} />
          <p className="mt-2 text-[13px] leading-snug text-muted">{statusConfig.message}</p>
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-0.5 rounded-lg bg-slate-50 px-3 py-2.5">
            <dt className="text-[11px] font-medium text-muted">Target profit</dt>
            <dd className="text-sm font-semibold tabular-nums text-ink">{formatDzd(result.scenarios[1].profit)}</dd>
          </div>
          <div className="flex flex-col gap-0.5 rounded-lg bg-slate-50 px-3 py-2.5">
            <dt className="text-[11px] font-medium text-muted">Current CPA</dt>
            <dd className="text-sm font-semibold tabular-nums text-ink">{formatUsd(currentCpaUsd)}</dd>
          </div>
          <div className="flex flex-col gap-0.5 rounded-lg bg-slate-50 px-3 py-2.5">
            <dt className="text-[11px] font-medium text-muted">Break-even CPA</dt>
            <dd className="text-sm font-semibold tabular-nums text-ink">{formatUsd(result.breakEvenCpaUsd)}</dd>
          </div>
        </dl>
      </div>
    </SectionCard>
  )
}
