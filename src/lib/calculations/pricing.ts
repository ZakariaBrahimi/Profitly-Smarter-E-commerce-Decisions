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
  /** True once confirmation × delivery > 0 — false means no price can ever be calculated. */
  isPricingAvailable: boolean

  deliveredRate: number
  /** Confirmed orders assuming 100 generated orders. */
  confirmedOrders: number
  /** Delivered orders assuming 100 generated orders. */
  deliveredOrders: number

  adCostDzd: number
  revenuePerGeneratedOrder: number
  productCostPerGeneratedOrder: number
  callCenterCostPerGeneratedOrder: number
  deliveryCostPerGeneratedOrder: number
  otherCostPerGeneratedOrder: number
  totalCostPerGeneratedOrder: number

  /** Profit per generated order at the CURRENT selling price input. */
  currentProfitPerGeneratedOrder: number
  profitPerDeliveredOrder: number
  profitMargin: number

  /** The price where expected profit is exactly 0. */
  breakEvenPrice: number
  /** The exact, unrounded price required to hit the target profit. */
  requiredSellingPrice: number
  /** requiredSellingPrice rounded up to a commercially-friendly number — never below requiredSellingPrice. */
  suggestedSellingPrice: number
  /** Price required to hit 1.25x the target profit. */
  higherMarginPrice: number

  breakEvenCpaUsd: number
  targetProfitCpaUsd: number
  safetyMarginUsd: number

  /** suggestedSellingPrice - current sellingPriceDzd input. Positive = current price is under-priced. */
  priceDifference: number
  /** targetProfitDzd - currentProfitPerGeneratedOrder. Positive = current price falls short of target. */
  targetProfitGap: number

  scenarios: PricingScenario[]
}

const HIGHER_MARGIN_MULTIPLIER = 1.25
const STATUS_EPSILON_DZD = 0.5

const SENSITIVITY_CPAS_USD = [0.5, 1.0, 1.3, 1.5, 2.0, 2.5]

/** Never lets NaN/Infinity/negative garbage leak into the math — the one gate every raw input passes through. */
function safeNonNegative(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

function clampFraction(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

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

  const adCostDzd = safeNonNegative(inputs.adCostUsd) * safeNonNegative(inputs.exchangeRate)
  const productCostPerGeneratedOrder = safeNonNegative(inputs.productCostDzd) * deliveredRate
  const callCenterCostPerGeneratedOrder = safeNonNegative(inputs.callCenterCostDzd) * confirmationRate
  const deliveryCostPerGeneratedOrder = safeNonNegative(inputs.deliveryCostDzd) * deliveredRate
  const otherCostPerGeneratedOrder = safeNonNegative(inputs.otherCostDzd) * deliveredRate

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
  return (breakdown.totalCostPerGeneratedOrder + safeNonNegative(targetProfit)) / breakdown.deliveredRate
}

/**
 * Rounds a calculated minimum price up to the nearest commercial increment.
 * Always rounds UP so the result never falls below the mathematically required price
 * (and therefore never undershoots the target profit it was calculated for).
 */
export function roundRecommendedPrice(calculatedPrice: number, roundingIncrement: RoundingStrategy): number {
  if (!Number.isFinite(calculatedPrice) || calculatedPrice <= 0) return 0
  if (!Number.isFinite(roundingIncrement) || roundingIncrement <= 0) return calculatedPrice
  return Math.ceil(calculatedPrice / roundingIncrement) * roundingIncrement
}

/**
 * Single source of truth for the pricing calculator. All costs (product,
 * delivery, other) apply to DELIVERED orders; call-center cost applies to
 * CONFIRMED orders; advertising is paid per GENERATED order. Every result
 * is expressed "per generated order" unless the field name says otherwise.
 *
 * This deliberately does NOT compute price as cost + markup% or cost × 2 —
 * every DZD of ad spend, confirmation loss, delivery loss, and operational
 * cost is accounted for before the target profit is added back in.
 */
export function calculatePricing(
  inputs: PricingInputs,
  roundingStrategy: RoundingStrategy = 10,
): PricingResult {
  const breakdown = computeCostBreakdown(inputs)
  const {
    deliveredRate,
    adCostDzd,
    productCostPerGeneratedOrder,
    callCenterCostPerGeneratedOrder,
    deliveryCostPerGeneratedOrder,
    otherCostPerGeneratedOrder,
    totalCostPerGeneratedOrder,
  } = breakdown
  const isPricingAvailable = deliveredRate > 0

  const sellingPriceDzd = safeNonNegative(inputs.sellingPriceDzd)
  const revenuePerGeneratedOrder = sellingPriceDzd * deliveredRate
  const currentProfitPerGeneratedOrder = revenuePerGeneratedOrder - totalCostPerGeneratedOrder
  const profitPerDeliveredOrder = deliveredRate > 0 ? currentProfitPerGeneratedOrder / deliveredRate : 0
  const profitMargin = revenuePerGeneratedOrder > 0 ? currentProfitPerGeneratedOrder / revenuePerGeneratedOrder : 0

  const targetProfitDzd = safeNonNegative(inputs.targetProfitDzd)
  const breakEvenPrice = requiredSellingPriceForProfit(breakdown, 0)
  const requiredSellingPrice = requiredSellingPriceForProfit(breakdown, targetProfitDzd)
  const suggestedSellingPrice = isPricingAvailable ? roundRecommendedPrice(requiredSellingPrice, roundingStrategy) : 0
  const higherMarginTargetProfit = targetProfitDzd * HIGHER_MARGIN_MULTIPLIER
  const higherMarginPrice = requiredSellingPriceForProfit(breakdown, higherMarginTargetProfit)

  // Maximum ad cost (DZD, per generated order) the business can spend and still hit a given profit,
  // at the CURRENT selling price — i.e. revenue minus every non-ad cost.
  const nonAdCostPerGeneratedOrder =
    productCostPerGeneratedOrder + callCenterCostPerGeneratedOrder + deliveryCostPerGeneratedOrder + otherCostPerGeneratedOrder
  const maxAdCostBreakEvenDzd = revenuePerGeneratedOrder - nonAdCostPerGeneratedOrder
  const maxAdCostForTargetDzd = maxAdCostBreakEvenDzd - targetProfitDzd

  const exchangeRate = safeNonNegative(inputs.exchangeRate)
  const breakEvenCpaUsd = exchangeRate > 0 ? Math.max(0, maxAdCostBreakEvenDzd) / exchangeRate : 0
  const targetProfitCpaUsd = exchangeRate > 0 ? Math.max(0, maxAdCostForTargetDzd) / exchangeRate : 0
  const safetyMarginUsd = breakEvenCpaUsd - safeNonNegative(inputs.adCostUsd)

  const priceDifference = requiredSellingPrice - sellingPriceDzd
  const targetProfitGap = targetProfitDzd - currentProfitPerGeneratedOrder

  const scenarios: PricingScenario[] = [
    { label: 'Break-even', sellingPrice: breakEvenPrice, profit: 0 },
    { label: 'Suggested', sellingPrice: requiredSellingPrice, profit: targetProfitDzd },
    { label: 'Higher Margin Scenario', sellingPrice: higherMarginPrice, profit: higherMarginTargetProfit },
  ]

  return {
    isPricingAvailable,
    deliveredRate,
    confirmedOrders: 100 * clampFraction(inputs.confirmationRate),
    deliveredOrders: 100 * deliveredRate,
    adCostDzd,
    revenuePerGeneratedOrder,
    productCostPerGeneratedOrder,
    callCenterCostPerGeneratedOrder,
    deliveryCostPerGeneratedOrder,
    otherCostPerGeneratedOrder,
    totalCostPerGeneratedOrder,
    currentProfitPerGeneratedOrder,
    profitPerDeliveredOrder,
    profitMargin,
    breakEvenPrice,
    requiredSellingPrice,
    suggestedSellingPrice,
    higherMarginPrice,
    breakEvenCpaUsd,
    targetProfitCpaUsd,
    safetyMarginUsd,
    priceDifference,
    targetProfitGap,
    scenarios,
  }
}

/** Profit per generated order at a hypothetical CPA, holding every other input (incl. current selling price) fixed. */
export function calculateProfitAtCpa(inputs: PricingInputs, cpaUsd: number): number {
  const breakdown = computeCostBreakdown({ ...inputs, adCostUsd: cpaUsd })
  const sellingPriceDzd = safeNonNegative(inputs.sellingPriceDzd)
  const revenuePerGeneratedOrder = sellingPriceDzd * breakdown.deliveredRate
  return revenuePerGeneratedOrder - breakdown.totalCostPerGeneratedOrder
}

export function calculateCpaSensitivity(inputs: PricingInputs): CpaSensitivityRow[] {
  const result = calculatePricing(inputs)
  const cpas = [...SENSITIVITY_CPAS_USD, result.breakEvenCpaUsd]
  const targetProfitDzd = safeNonNegative(inputs.targetProfitDzd)

  return cpas.map((cpaUsd, index) => {
    const profit = calculateProfitAtCpa(inputs, cpaUsd)
    const isBreakEven = index === cpas.length - 1
    const tone: CpaSensitivityRow['tone'] =
      profit < -STATUS_EPSILON_DZD ? 'negative' : profit + STATUS_EPSILON_DZD < targetProfitDzd ? 'warning' : 'positive'
    return { cpaUsd, isBreakEven, profitPerGeneratedOrder: profit, tone }
  })
}
