export interface ProfitabilityInputs {
  purchaseCostDzd: number
  sellingPriceDzd: number
  dailyAdBudgetUsd: number
  adCostPerGeneratedOrderUsd: number
  confirmationRate: number
  deliveryRate: number
  confirmationFeeDzd: number
  deliveryCostDzd: number
  exchangeRate: number
  daysPerMonth: number
}

export type ProfitabilityStatus = 'profitable' | 'low-margin' | 'break-even' | 'loss'

export interface ProfitabilityResult {
  generatedOrders: number
  confirmedOrders: number
  deliveredOrders: number

  revenueDzd: number
  productCostDzd: number
  confirmationFeesDzd: number
  deliveryCostTotalDzd: number
  adSpendDzd: number
  adSpendUsd: number

  netProfitDzd: number
  netProfitUsd: number
  netMargin: number

  profitPerDeliveredOrderDzd: number
  realAdCostPerDeliveredOrderDzd: number
  realAdCostPerDeliveredOrderUsd: number

  marginPerDeliveredOrderDzd: number
  maxAdCostPerGeneratedOrderUsd: number
  headroomUsd: number

  status: ProfitabilityStatus
}

const LOW_MARGIN_THRESHOLD = 0.1
const BREAK_EVEN_EPSILON = 0.02

/**
 * Single source of truth for every profitability number shown in the UI.
 * Costs (product cost, confirmation fees, delivery cost) apply to DELIVERED
 * orders only — ad spend is the actual daily budget spent regardless of outcome.
 */
export function calculateProfitability(inputs: ProfitabilityInputs): ProfitabilityResult {
  const {
    purchaseCostDzd,
    sellingPriceDzd,
    dailyAdBudgetUsd,
    adCostPerGeneratedOrderUsd,
    confirmationRate,
    deliveryRate,
    confirmationFeeDzd,
    deliveryCostDzd,
    exchangeRate,
  } = inputs

  const generatedOrders =
    adCostPerGeneratedOrderUsd > 0 ? dailyAdBudgetUsd / adCostPerGeneratedOrderUsd : 0
  const confirmedOrders = generatedOrders * confirmationRate
  const deliveredOrders = confirmedOrders * deliveryRate

  const revenueDzd = deliveredOrders * sellingPriceDzd
  const productCostDzd = deliveredOrders * purchaseCostDzd
  const confirmationFeesDzd = deliveredOrders * confirmationFeeDzd
  const deliveryCostTotalDzd = deliveredOrders * deliveryCostDzd
  const adSpendDzd = dailyAdBudgetUsd * exchangeRate
  const adSpendUsd = dailyAdBudgetUsd

  const netProfitDzd =
    revenueDzd - productCostDzd - confirmationFeesDzd - deliveryCostTotalDzd - adSpendDzd
  const netProfitUsd = exchangeRate > 0 ? netProfitDzd / exchangeRate : 0
  const netMargin = revenueDzd > 0 ? netProfitDzd / revenueDzd : 0

  const profitPerDeliveredOrderDzd = deliveredOrders > 0 ? netProfitDzd / deliveredOrders : 0
  const realAdCostPerDeliveredOrderDzd = deliveredOrders > 0 ? adSpendDzd / deliveredOrders : 0
  const realAdCostPerDeliveredOrderUsd =
    exchangeRate > 0 ? realAdCostPerDeliveredOrderDzd / exchangeRate : 0

  const marginPerDeliveredOrderDzd =
    sellingPriceDzd - purchaseCostDzd - confirmationFeeDzd - deliveryCostDzd

  const conversionRate = confirmationRate * deliveryRate
  const maxAdCostPerGeneratedOrderUsd =
    exchangeRate > 0 ? (marginPerDeliveredOrderDzd * conversionRate) / exchangeRate : 0
  const headroomUsd = maxAdCostPerGeneratedOrderUsd - adCostPerGeneratedOrderUsd

  const status = getProfitabilityStatus(netProfitDzd, netMargin, revenueDzd)

  return {
    generatedOrders,
    confirmedOrders,
    deliveredOrders,
    revenueDzd,
    productCostDzd,
    confirmationFeesDzd,
    deliveryCostTotalDzd,
    adSpendDzd,
    adSpendUsd,
    netProfitDzd,
    netProfitUsd,
    netMargin,
    profitPerDeliveredOrderDzd,
    realAdCostPerDeliveredOrderDzd,
    realAdCostPerDeliveredOrderUsd,
    marginPerDeliveredOrderDzd,
    maxAdCostPerGeneratedOrderUsd,
    headroomUsd,
    status,
  }
}

export function getProfitabilityStatus(
  netProfitDzd: number,
  netMargin: number,
  revenueDzd: number,
): ProfitabilityStatus {
  if (revenueDzd <= 0) return 'loss'
  if (Math.abs(netMargin) <= BREAK_EVEN_EPSILON) return 'break-even'
  if (netProfitDzd < 0) return 'loss'
  if (netMargin < LOW_MARGIN_THRESHOLD) return 'low-margin'
  return 'profitable'
}

export interface MonthlyProjection {
  revenueDzd: number
  productCostDzd: number
  confirmationFeesDzd: number
  deliveryCostTotalDzd: number
  adSpendDzd: number
  adSpendUsd: number
  netProfitDzd: number
  netProfitUsd: number
  deliveredOrders: number
  generatedOrders: number
  confirmedOrders: number
}

export function projectMonthly(daily: ProfitabilityResult, days: number): MonthlyProjection {
  return {
    revenueDzd: daily.revenueDzd * days,
    productCostDzd: daily.productCostDzd * days,
    confirmationFeesDzd: daily.confirmationFeesDzd * days,
    deliveryCostTotalDzd: daily.deliveryCostTotalDzd * days,
    adSpendDzd: daily.adSpendDzd * days,
    adSpendUsd: daily.adSpendUsd * days,
    netProfitDzd: daily.netProfitDzd * days,
    netProfitUsd: daily.netProfitUsd * days,
    deliveredOrders: daily.deliveredOrders * days,
    generatedOrders: daily.generatedOrders * days,
    confirmedOrders: daily.confirmedOrders * days,
  }
}

/**
 * Max ad cost / generated order (USD) that still hits a target profit
 * per delivered order. Target of 0 is equivalent to the break-even point.
 */
export function calculateMaxAdCostForTargetProfit(
  inputs: Pick<
    ProfitabilityInputs,
    | 'purchaseCostDzd'
    | 'sellingPriceDzd'
    | 'confirmationFeeDzd'
    | 'deliveryCostDzd'
    | 'confirmationRate'
    | 'deliveryRate'
    | 'exchangeRate'
  >,
  targetProfitPerOrderDzd: number,
): number {
  const marginPerDeliveredOrderDzd =
    inputs.sellingPriceDzd - inputs.purchaseCostDzd - inputs.confirmationFeeDzd - inputs.deliveryCostDzd
  const conversionRate = inputs.confirmationRate * inputs.deliveryRate
  if (inputs.exchangeRate <= 0) return 0
  const maxAdCost =
    ((marginPerDeliveredOrderDzd - targetProfitPerOrderDzd) * conversionRate) / inputs.exchangeRate
  return Math.max(0, maxAdCost)
}
