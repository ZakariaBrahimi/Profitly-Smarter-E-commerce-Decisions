import * as React from 'react'
import { useState } from 'react'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppHeader, type AppHeaderProps } from '@/components/layout/AppHeader'

export interface AppShellProps {
  title: string
  subtitle?: string
  headerActions?: React.ReactNode
  children: React.ReactNode
}

export function AppShell({ title, subtitle, headerActions, children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const headerProps: AppHeaderProps = {
    title,
    subtitle,
    actions: headerActions,
    onOpenMobileNav: () => setMobileNavOpen(true),
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppSidebar mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
      <div className="lg:pl-[232px]">
        <AppHeader {...headerProps} />
        <main className="mx-auto max-w-[1560px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
