export interface PricingInputs {
  productCostDzd: number
  sellingPriceDzd: number
  adCostUsd: number
  exchangeRate: number
  /** Fraction 0-1 */
  confirmationRate: number
  /** Fraction 0-1 */
  deliveryRate: number
  callCenterCostDzd: number
  deliveryCostDzd: number
  otherCostDzd: number
  targetProfitDzd: number
}

export type RoundingStrategy = 10 | 50 | 100

export type PricingStatus = 'profitable' | 'below-target' | 'loss'

export interface PricingScenario {
  label: string
  sellingPrice: number
  profit: number
}

export interface CpaSensitivityRow {
  cpaUsd: number
  isBreakEven: boolean
  profitPerGeneratedOrder: number
  tone: 'positive' | 'warning' | 'negative'
}

export interface PricingResult {
  deliveredRate: number
  confirmedOrdersPer100: number
  deliveredOrdersPer100: number

  adCostDzd: number
  revenuePerGeneratedOrder: number
  productCostPerGeneratedOrder: number
  callCenterCostPerGeneratedOrder: number
  deliveryCostPerGeneratedOrder: number
  otherCostPerGeneratedOrder: number
  totalCostPerGeneratedOrder: number

  profitPerGeneratedOrder: number
  profitPerDeliveredOrder: number
  profitMargin: number

  breakEvenPrice: number
  requiredSellingPrice: number
  recommendedSellingPrice: number

  breakEvenCpaUsd: number
  targetProfitCpaUsd: number
  safetyMarginUsd: number

  status: PricingStatus

  scenarios: PricingScenario[]
}

const STATUS_EPSILON_DZD = 0.5
const HIGHER_MARGIN_MULTIPLIER = 1.25

const SENSITIVITY_CPAS_USD = [0.5, 1.0, 1.3, 1.5, 2.0, 2.5]

/** Costs that don't depend on selling price — shared by break-even, target and scenario math. */
interface CostBreakdown {
  deliveredRate: number
  adCostDzd: number
  productCostPerGeneratedOrder: number
  callCenterCostPerGeneratedOrder: number
  deliveryCostPerGeneratedOrder: number
  otherCostPerGeneratedOrder: number
  totalCostPerGeneratedOrder: number
}

function computeCostBreakdown(inputs: PricingInputs): CostBreakdown {
  const confirmationRate = clampFraction(inputs.confirmationRate)
  const deliveryRate = clampFraction(inputs.deliveryRate)
  const deliveredRate = confirmationRate * deliveryRate

  const adCostDzd = Math.max(0, inputs.adCostUsd) * Math.max(0, inputs.exchangeRate)
  const productCostPerGeneratedOrder = Math.max(0, inputs.productCostDzd) * deliveredRate
  const callCenterCostPerGeneratedOrder = Math.max(0, inputs.callCenterCostDzd) * confirmationRate
  const deliveryCostPerGeneratedOrder = Math.max(0, inputs.deliveryCostDzd) * deliveredRate
  const otherCostPerGeneratedOrder = Math.max(0, inputs.otherCostDzd) * deliveredRate

  const totalCostPerGeneratedOrder =
    adCostDzd +
    productCostPerGeneratedOrder +
    callCenterCostPerGeneratedOrder +
    deliveryCostPerGeneratedOrder +
    otherCostPerGeneratedOrder

  return {
    deliveredRate,
    adCostDzd,
    productCostPerGeneratedOrder,
    callCenterCostPerGeneratedOrder,
    deliveryCostPerGeneratedOrder,
    otherCostPerGeneratedOrder,
    totalCostPerGeneratedOrder,
  }
}

/** The exact selling price that yields `targetProfit` per generated order. 0 when nothing can ever be delivered. */
function requiredSellingPriceForProfit(breakdown: CostBreakdown, targetProfit: number): number {
  if (breakdown.deliveredRate <= 0) return 0
  return (breakdown.totalCostPerGeneratedOrder + targetProfit) / breakdown.deliveredRate
}

export function roundUpToNearest(value: number, step: RoundingStrategy): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  if (step <= 0) return value
  return Math.ceil(value / step) * step
}

function clampFraction(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

/**
 * Single source of truth for the pricing calculator. All costs (product,
 * delivery, other) apply to DELIVERED orders; call-center cost applies to
 * CONFIRMED orders; advertising is paid per GENERATED order. Every result
 * is expressed "per generated order" unless the field name says otherwise.
 */
export function calculatePricing(
  inputs: PricingInputs,
  roundingStrategy: RoundingStrategy = 10,
): PricingResult {
  const breakdown = computeCostBreakdown(inputs)
  const { deliveredRate, adCostDzd, productCostPerGeneratedOrder, callCenterCostPerGeneratedOrder, deliveryCostPerGeneratedOrder, otherCostPerGeneratedOrder, totalCostPerGeneratedOrder } = breakdown

  const sellingPriceDzd = Math.max(0, inputs.sellingPriceDzd)
  const revenuePerGeneratedOrder = sellingPriceDzd * deliveredRate
  const profitPerGeneratedOrder = revenuePerGeneratedOrder - totalCostPerGeneratedOrder
  const profitPerDeliveredOrder = deliveredRate > 0 ? profitPerGeneratedOrder / deliveredRate : 0
  const profitMargin = revenuePerGeneratedOrder > 0 ? profitPerGeneratedOrder / revenuePerGeneratedOrder : 0

  const targetProfitDzd = inputs.targetProfitDzd
  const breakEvenPrice = requiredSellingPriceForProfit(breakdown, 0)
  const requiredSellingPrice = requiredSellingPriceForProfit(breakdown, targetProfitDzd)
  const recommendedSellingPrice = roundUpToNearest(requiredSellingPrice, roundingStrategy)

  // Maximum ad cost (DZD, per generated order) the business can spend and still hit a given profit,
  // at the CURRENT selling price — i.e. revenue minus every non-ad cost.
  const nonAdCostPerGeneratedOrder =
    productCostPerGeneratedOrder + callCenterCostPerGeneratedOrder + deliveryCostPerGeneratedOrder + otherCostPerGeneratedOrder
  const maxAdCostBreakEvenDzd = revenuePerGeneratedOrder - nonAdCostPerGeneratedOrder
  const maxAdCostForTargetDzd = maxAdCostBreakEvenDzd - targetProfitDzd

  const exchangeRate = Math.max(0, inputs.exchangeRate)
  const breakEvenCpaUsd = exchangeRate > 0 ? Math.max(0, maxAdCostBreakEvenDzd) / exchangeRate : 0
  const targetProfitCpaUsd = exchangeRate > 0 ? Math.max(0, maxAdCostForTargetDzd) / exchangeRate : 0
  const safetyMarginUsd = breakEvenCpaUsd - Math.max(0, inputs.adCostUsd)

  const status = getPricingStatus(profitPerGeneratedOrder, targetProfitDzd)

  const scenarios: PricingScenario[] = [
    { label: 'Break-even', sellingPrice: breakEvenPrice, profit: 0 },
    { label: 'Target', sellingPrice: requiredSellingPrice, profit: targetProfitDzd },
    {
      label: 'Higher Margin',
      sellingPrice: requiredSellingPriceForProfit(breakdown, targetProfitDzd * HIGHER_MARGIN_MULTIPLIER),
      profit: targetProfitDzd * HIGHER_MARGIN_MULTIPLIER,
    },
  ]

  return {
    deliveredRate,
    confirmedOrdersPer100: 100 * clampFraction(inputs.confirmationRate),
    deliveredOrdersPer100: 100 * deliveredRate,
    adCostDzd,
    revenuePerGeneratedOrder,
    productCostPerGeneratedOrder,
    callCenterCostPerGeneratedOrder,
    deliveryCostPerGeneratedOrder,
    otherCostPerGeneratedOrder,
    totalCostPerGeneratedOrder,
    profitPerGeneratedOrder,
    profitPerDeliveredOrder,
    profitMargin,
    breakEvenPrice,
    requiredSellingPrice,
    recommendedSellingPrice,
    breakEvenCpaUsd,
    targetProfitCpaUsd,
    safetyMarginUsd,
    status,
    scenarios,
  }
}

export function getPricingStatus(profitPerGeneratedOrder: number, targetProfitDzd: number): PricingStatus {
  if (profitPerGeneratedOrder < -STATUS_EPSILON_DZD) return 'loss'
  if (profitPerGeneratedOrder + STATUS_EPSILON_DZD < targetProfitDzd) return 'below-target'
  return 'profitable'
}

/** Profit per generated order at a hypothetical CPA, holding every other input (incl. current selling price) fixed. */
export function calculateProfitAtCpa(inputs: PricingInputs, cpaUsd: number): number {
  const breakdown = computeCostBreakdown({ ...inputs, adCostUsd: cpaUsd })
  const sellingPriceDzd = Math.max(0, inputs.sellingPriceDzd)
  const revenuePerGeneratedOrder = sellingPriceDzd * breakdown.deliveredRate
  return revenuePerGeneratedOrder - breakdown.totalCostPerGeneratedOrder
}

export function calculateCpaSensitivity(inputs: PricingInputs): CpaSensitivityRow[] {
  const result = calculatePricing(inputs)
  const cpas = [...SENSITIVITY_CPAS_USD, result.breakEvenCpaUsd]

  return cpas.map((cpaUsd, index) => {
    const profit = calculateProfitAtCpa(inputs, cpaUsd)
    const isBreakEven = index === cpas.length - 1
    const tone: CpaSensitivityRow['tone'] =
      profit < -STATUS_EPSILON_DZD ? 'negative' : profit + STATUS_EPSILON_DZD < inputs.targetProfitDzd ? 'warning' : 'positive'
    return { cpaUsd, isBreakEven, profitPerGeneratedOrder: profit, tone }
  })
}
