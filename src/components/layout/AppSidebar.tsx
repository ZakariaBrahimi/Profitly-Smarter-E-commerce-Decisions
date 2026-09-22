import { NavLink } from 'react-router-dom'
import { Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/components/layout/nav-items'

export interface AppSidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <img src="/brand/profitly-logo.svg" alt="Profitly" className="h-8 w-auto" />
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors',
                isActive
                  ? 'bg-primary-light text-primary-dark'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-ink',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-primary' : 'text-slate-400')}
                  strokeWidth={2}
                />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-4 text-white">
          <Sparkles className="mb-2 h-4 w-4 opacity-90" strokeWidth={2} />
          <p className="text-[13px] font-semibold leading-snug">Better data.
Bigger profits.</p>
          <p className="mt-1.5 text-[11.5px] leading-snug text-white/80">
            Make smarter decisions and scale with confidence.
          </p>
        </div>
      </div>
    </div>
  )
}

export function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[232px] lg:flex-col lg:border-r lg:border-border lg:bg-white">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={onMobileClose} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 flex w-[260px] flex-col bg-white shadow-xl">
            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-md p-1.5 text-muted hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={onMobileClose} />
          </div>
        </div>
      )}
    </>
  )
}
