import { CheckCircle2, AlertTriangle, MinusCircle, XCircle } from 'lucide-react'
import type { ProfitabilityStatus } from '@/lib/calculations/profitability'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<
  ProfitabilityStatus,
  { label: string; message: string; icon: typeof CheckCircle2; className: string; iconClassName: string }
> = {
  profitable: {
    label: 'Profitable',
    message: "You're making a good profit with these numbers!",
    icon: CheckCircle2,
    className: 'bg-success-bg text-success border-success/20',
    iconClassName: 'text-success',
  },
  'low-margin': {
    label: 'Low Margin',
    message: 'Profitable, but margins are thin. Small changes could tip this into a loss.',
    icon: AlertTriangle,
    className: 'bg-warning-bg text-warning border-warning/20',
    iconClassName: 'text-warning',
  },
  'break-even': {
    label: 'Break-even',
    message: "You're roughly breaking even — revenue covers costs with little left over.",
    icon: MinusCircle,
    className: 'bg-slate-100 text-slate-600 border-slate-200',
    iconClassName: 'text-slate-500',
  },
  loss: {
    label: 'Loss',
    message: "These numbers are losing money. Revisit your costs, price, or ad spend.",
    icon: XCircle,
    className: 'bg-danger-bg text-danger border-danger/20',
    iconClassName: 'text-danger',
  },
}

export function getStatusConfig(status: ProfitabilityStatus) {
  return STATUS_CONFIG[status]
}

export function StatusBadge({ status, className }: { status: ProfitabilityStatus; className?: string }) {
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
