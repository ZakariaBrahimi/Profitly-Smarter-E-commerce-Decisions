import * as React from 'react'
import { Bell, ChevronDown, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AppHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  onOpenMobileNav: () => void
}

export function AppHeader({ title, subtitle, actions, onOpenMobileNav }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-white/80 backdrop-blur-sm">
      <div className="flex items-start gap-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open menu"
          className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted hover:bg-slate-50 lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="text-[22px] font-bold leading-tight text-ink sm:text-[26px] lg:text-[28px]">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-[13px] leading-snug text-muted sm:text-sm">{subtitle}</p>}
        </div>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">{actions}</div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <div className="hidden h-6 w-px bg-border sm:block" />
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-slate-50"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>
          <UserMenu />
        </div>
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2 px-4 pb-4 lg:hidden">{actions}</div>}
    </header>
  )
}

function UserMenu() {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-50',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-[12px] font-semibold text-primary-dark">
        ZB
      </span>
      <span className="hidden text-[13px] font-medium text-ink sm:inline">Zakaria Brahimi</span>
      <ChevronDown className="hidden h-3.5 w-3.5 text-muted sm:block" strokeWidth={2} />
    </button>
  )
}
