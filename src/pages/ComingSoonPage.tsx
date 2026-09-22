import { Sparkles } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <AppShell title={title} subtitle="This section is on its way.">
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-white py-24 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-primary">
          <Sparkles className="h-5 w-5" strokeWidth={2} />
        </div>
        <p className="text-sm font-semibold text-ink">{title} is coming soon</p>
        <p className="max-w-sm text-[13px] text-muted">
          We&apos;re focused on the Profitability Calculator right now. This page will light up in a future release.
        </p>
      </div>
    </AppShell>
  )
}
