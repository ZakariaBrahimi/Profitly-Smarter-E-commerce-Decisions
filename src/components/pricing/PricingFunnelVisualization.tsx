import { motion } from 'framer-motion'
import { Megaphone, PhoneCall, Truck, ArrowRight, ArrowDown } from 'lucide-react'
import { formatDzd } from '@/lib/formatting/currency'
import type { PricingResult } from '@/lib/calculations/pricing'

const TONE_CLASSES = {
  accent: 'bg-accent-bg text-accent',
  primary: 'bg-primary-light text-primary',
  success: 'bg-success-bg text-success',
}

export function PricingFunnelVisualization({ result }: { result: PricingResult }) {
  const stages = [
    {
      id: 'generated',
      label: 'Generated Orders',
      count: 100,
      percentage: 100,
      costNote: `Ad cost applies here: ${formatDzd(result.adCostDzd)} / order`,
      icon: Megaphone,
      tone: 'accent' as const,
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      count: Math.round(result.confirmedOrders),
      percentage: result.confirmedOrders,
      costNote: `Call-center cost applies here: ${formatDzd(result.callCenterCostPerGeneratedOrder * 100)} total for these confirmed orders`,
      icon: PhoneCall,
      tone: 'primary' as const,
    },
    {
      id: 'delivered',
      label: 'Delivered',
      count: Math.round(result.deliveredOrders),
      percentage: result.deliveredOrders,
      costNote: 'Product, delivery & other costs apply here — this is also where revenue is earned',
      icon: Truck,
      tone: 'success' as const,
    },
  ]

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex flex-1 items-center gap-2 sm:gap-3">
          <div className="flex w-full flex-1 flex-col gap-2 rounded-xl border border-border bg-slate-50/60 p-4">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONE_CLASSES[stage.tone]}`}>
              <stage.icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted">{stage.label}</span>
            <motion.span
              key={stage.count}
              initial={{ opacity: 0.4, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-2xl font-bold tabular-nums text-ink"
            >
              {stage.count}
            </motion.span>
            <span className="text-xs text-muted">{Math.round(stage.percentage)}% of generated</span>
            <p className="mt-1 border-t border-border pt-2 text-[11px] leading-snug text-muted">{stage.costNote}</p>
          </div>
          {index < stages.length - 1 && (
            <div className="flex shrink-0 items-center justify-center text-slate-300">
              <ArrowRight className="hidden h-5 w-5 sm:block" strokeWidth={2} />
              <ArrowDown className="h-5 w-5 sm:hidden" strokeWidth={2} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
