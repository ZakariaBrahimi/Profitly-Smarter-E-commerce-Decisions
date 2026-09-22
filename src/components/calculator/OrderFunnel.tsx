import { motion } from 'framer-motion'
import { Megaphone, Users, Truck, ArrowRight, ArrowDown } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { formatOrders, formatPercent } from '@/lib/formatting/currency'
import type { ProfitabilityResult } from '@/lib/calculations/profitability'

export interface OrderFunnelProps {
  result: ProfitabilityResult
  dailyAdBudgetUsd: number
  confirmationRate: number
  deliveryRate: number
}

export function OrderFunnel({ result, dailyAdBudgetUsd, confirmationRate, deliveryRate }: OrderFunnelProps) {
  const stages = [
    {
      id: 'generated',
      label: 'Generated orders',
      value: result.generatedOrders,
      caption: `from $${dailyAdBudgetUsd.toFixed(2)} budget`,
      icon: Megaphone,
      tone: 'accent' as const,
    },
    {
      id: 'confirmed',
      label: 'Confirmed orders',
      value: result.confirmedOrders,
      caption: formatPercent(confirmationRate),
      icon: Users,
      tone: 'primary' as const,
    },
    {
      id: 'delivered',
      label: 'Delivered orders',
      value: result.deliveredOrders,
      caption: formatPercent(deliveryRate),
      icon: Truck,
      tone: 'success' as const,
    },
  ]

  return (
    <SectionCard title="Order Funnel" description="How your ad budget turns into delivered orders.">
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex flex-1 items-center gap-2 sm:gap-3">
            <FunnelStageCard label={stage.label} value={stage.value} caption={stage.caption} icon={stage.icon} tone={stage.tone} />
            {index < stages.length - 1 && (
              <div className="flex shrink-0 items-center justify-center text-slate-300">
                <ArrowRight className="hidden h-5 w-5 sm:block" strokeWidth={2} />
                <ArrowDown className="h-5 w-5 sm:hidden" strokeWidth={2} />
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

const TONE_CLASSES = {
  accent: 'bg-accent-bg text-accent',
  primary: 'bg-primary-light text-primary',
  success: 'bg-success-bg text-success',
}

function FunnelStageCard({
  label,
  value,
  caption,
  icon: Icon,
  tone,
}: {
  label: string
  value: number
  caption: string
  icon: typeof Megaphone
  tone: keyof typeof TONE_CLASSES
}) {
  return (
    <div className="flex w-full flex-1 flex-col gap-2 rounded-xl border border-border bg-slate-50/60 p-4">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONE_CLASSES[tone]}`}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</span>
      <motion.span
        key={value.toFixed(2)}
        initial={{ opacity: 0.4, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="text-2xl font-bold tabular-nums text-ink"
      >
        {formatOrders(value)}
      </motion.span>
      <span className="text-xs text-muted">{caption}</span>
    </div>
  )
}
