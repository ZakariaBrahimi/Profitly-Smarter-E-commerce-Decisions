import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import type { PricingStatus } from '@/lib/calculations/pricing'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<
  PricingStatus,
  { label: string; message: string; icon: typeof CheckCircle2; className: string; iconClassName: string }
> = {
  profitable: {
    label: 'Profitable',
    message: 'Your current selling price meets or beats your target profit.',
    icon: CheckCircle2,
    className: 'bg-success-bg text-success border-success/20',
    iconClassName: 'text-success',
  },
  'below-target': {
    label: 'Below Target',
    message: 'You are profitable, but below your target profit. Consider raising your price.',
    icon: AlertTriangle,
    className: 'bg-warning-bg text-warning border-warning/20',
    iconClassName: 'text-warning',
  },
  loss: {
    label: 'Loss',
    message: 'At this selling price you are losing money on every generated order.',
    icon: XCircle,
    className: 'bg-danger-bg text-danger border-danger/20',
    iconClassName: 'text-danger',
  },
}

export function getPricingStatusConfig(status: PricingStatus) {
  return STATUS_CONFIG[status]
}

export function PricingStatusBadge({ status, className }: { status: PricingStatus; className?: string }) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
        config.className,
        className,
      )}
    >
      <Icon className={cn('h-3.5 w-3.5', config.iconClassName)} strokeWidth={2} />
      {config.label}
    </span>
  )
}
