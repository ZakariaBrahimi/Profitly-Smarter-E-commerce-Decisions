import type { ProfitabilityInputs } from '@/lib/calculations/profitability'

export interface CalculatorInputs extends ProfitabilityInputs {
  productName: string
}

export const DEFAULT_CALCULATOR_INPUTS: CalculatorInputs = {
  productName: 'T-shirt Khalid Ibn Al-Walid',
  purchaseCostDzd: 2200,
  sellingPriceDzd: 3990,
  dailyAdBudgetUsd: 20,
  adCostPerGeneratedOrderUsd: 1.7,
  confirmationRate: 0.65,
  deliveryRate: 0.65,
  confirmationFeeDzd: 200,
  deliveryCostDzd: 0,
  exchangeRate: 250,
  daysPerMonth: 30,
}

export const MONTHLY_PERIOD_OPTIONS = [7, 30, 60, 90] as const
export type MonthlyPeriodOption = (typeof MONTHLY_PERIOD_OPTIONS)[number] | 'custom'
