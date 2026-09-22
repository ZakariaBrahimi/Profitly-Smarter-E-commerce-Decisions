import type { ProfitabilityInputs } from '@/lib/calculations/profitability'

export interface FieldError {
  field: keyof ProfitabilityInputs
  message: string
}

export function isProductInfoComplete(inputs: Pick<ProfitabilityInputs, 'purchaseCostDzd' | 'sellingPriceDzd'>): boolean {
  return inputs.purchaseCostDzd > 0 && inputs.sellingPriceDzd > 0
}

export function validateCalculatorInputs(inputs: ProfitabilityInputs): FieldError[] {
  const errors: FieldError[] = []

  if (inputs.purchaseCostDzd < 0) errors.push({ field: 'purchaseCostDzd', message: 'Purchase cost cannot be negative' })
  if (inputs.sellingPriceDzd < 0) errors.push({ field: 'sellingPriceDzd', message: 'Selling price cannot be negative' })
  if (inputs.dailyAdBudgetUsd < 0) errors.push({ field: 'dailyAdBudgetUsd', message: 'Daily ad budget cannot be negative' })
  if (inputs.adCostPerGeneratedOrderUsd < 0) errors.push({ field: 'adCostPerGeneratedOrderUsd', message: 'Ad cost cannot be negative' })
  if (inputs.confirmationRate < 0 || inputs.confirmationRate > 1) errors.push({ field: 'confirmationRate', message: 'Confirmation rate must be between 0% and 100%' })
  if (inputs.deliveryRate < 0 || inputs.deliveryRate > 1) errors.push({ field: 'deliveryRate', message: 'Delivery rate must be between 0% and 100%' })
  if (inputs.confirmationFeeDzd < 0) errors.push({ field: 'confirmationFeeDzd', message: 'Confirmation fee cannot be negative' })
  if (inputs.deliveryCostDzd < 0) errors.push({ field: 'deliveryCostDzd', message: 'Delivery cost cannot be negative' })
  if (inputs.exchangeRate <= 0) errors.push({ field: 'exchangeRate', message: 'Exchange rate must be greater than 0' })
  if (inputs.daysPerMonth <= 0) errors.push({ field: 'daysPerMonth', message: 'Days must be greater than 0' })

  return errors
}

export function clampNonNegative(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0
  return Math.max(0, value)
}

export function clampPercent(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}
