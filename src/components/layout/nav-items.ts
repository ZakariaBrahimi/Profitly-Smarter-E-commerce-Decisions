import {
  LayoutDashboard,
  Package,
  Calculator,
  Tag,
  Megaphone,
  ClipboardList,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Profitability Calculator', href: '/profitability-calculator', icon: Calculator },
  { label: 'Pricing Calculator', href: '/pricing-calculator', icon: Tag },
  { label: 'Campaigns', href: '/campaigns', icon: Megaphone },
  { label: 'Orders', href: '/orders', icon: ClipboardList },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
]
