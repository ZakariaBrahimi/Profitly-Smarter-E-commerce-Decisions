const dzdFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

const usdFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const orderFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

export function formatDzd(value: number): string {
  if (!Number.isFinite(value)) return '0 DZD'
  const sign = value < 0 ? '-' : ''
  return `${sign}${dzdFormatter.format(Math.abs(Math.round(value)))} DZD`
}

export function formatDzdCompact(value: number): string {
  if (!Number.isFinite(value)) return '0'
  const sign = value < 0 ? '-' : ''
  return `${sign}${dzdFormatter.format(Math.abs(Math.round(value)))}`
}

export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return '$0.00'
  const sign = value < 0 ? '-' : ''
  return `${sign}$${usdFormatter.format(Math.abs(value))}`
}

export function formatOrders(value: number): string {
  if (!Number.isFinite(value)) return '0.00'
  return orderFormatter.format(Math.max(0, value))
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return '0%'
  return `${percentFormatter.format(value * 100)}%`
}

export function formatSignedPercent(delta: number): string {
  if (!Number.isFinite(delta)) return '0%'
  const sign = delta > 0 ? '+' : delta < 0 ? '-' : ''
  return `${sign}${percentFormatter.format(Math.abs(delta) * 100)}%`
}

export function formatSignedDzd(value: number): string {
  if (!Number.isFinite(value)) return '0 DZD'
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${dzdFormatter.format(Math.abs(Math.round(value)))} DZD`
}
