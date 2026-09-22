import { AlertCircle } from 'lucide-react'

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-warning/20 bg-warning-bg px-4 py-3.5">
      <AlertCircle className="h-[18px] w-[18px] shrink-0 text-warning" strokeWidth={2} />
      <div>
        <p className="text-[13px] font-semibold text-ink">{title}</p>
        {description && <p className="text-xs text-muted">{description}</p>}
      </div>
    </div>
  )
}
