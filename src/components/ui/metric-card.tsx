import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface MetricCardProps {
  label: string
  value: string
  subValue?: string
  icon?: React.ReactNode
  tone?: 'default' | 'positive' | 'negative' | 'accent'
  size?: 'sm' | 'lg'
  className?: string
}

const TONE_CLASSES: Record<NonNullable<MetricCardProps['tone']>, string> = {
  default: 'bg-slate-50 border-border',
  positive: 'bg-success-bg border-success/15',
  negative: 'bg-danger-bg border-danger/15',
  accent: 'bg-primary-light border-primary/15',
}

const VALUE_TONE_CLASSES: Record<NonNullable<MetricCardProps['tone']>, string> = {
  default: 'text-ink',
  positive: 'text-success',
  negative: 'text-danger',
  accent: 'text-primary-dark',
}

export function MetricCard({ label, value, subValue, icon, tone = 'default', size = 'sm', className }: MetricCardProps) {
  return (
    <div className={cn('rounded-lg border p-4 flex flex-col gap-1.5', TONE_CLASSES[tone], className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</span>
        {icon && <span className="text-muted/70">{icon}</span>}
      </div>
      <motion.span
        key={value}
        initial={{ opacity: 0.4, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          'tabular-nums font-bold leading-tight',
          size === 'lg' ? 'text-2xl sm:text-[26px]' : 'text-lg',
          VALUE_TONE_CLASSES[tone],
        )}
      >
        {value}
      </motion.span>
      {subValue && <span className="text-xs text-muted">{subValue}</span>}
    </div>
  )
}
