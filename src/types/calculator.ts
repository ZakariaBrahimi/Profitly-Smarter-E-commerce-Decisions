import type { ProfitabilityInputs } from '@/lib/calculations/profitability'

export type CalculatorInputs = ProfitabilityInputs

export const DEFAULT_CALCULATOR_INPUTS: CalculatorInputs = {
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

export type ResultsPeriod = 'daily' | 'weekly' | 'monthly' | 'custom'

export const RESULTS_PERIOD_DAYS: Record<Exclude<ResultsPeriod, 'custom'>, number> = {
  daily: 1,
  weekly: 7,
  monthly: 30,
}
