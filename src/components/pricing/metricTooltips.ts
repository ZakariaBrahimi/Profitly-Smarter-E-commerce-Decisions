/**
 * Plain-language explanations for every number the pricing calculator shows.
 * Centralized so the same metric (e.g. "CPA safety margin") reads identically
 * wherever it appears — Pricing Economics, CPA Sensitivity, etc.
 */
export const METRIC_TOOLTIPS = {
  breakEvenPrice: 'The selling price where profit is exactly 0. Below this, you lose money on every generated order.',
  maxCpaTarget:
    'The most you could pay per generated order in ads and still hit your target profit, at your current selling price. $0.00 means your target isn\'t reachable at this price — even free ads wouldn\'t get you there. Raise your price or lower your target to fix it.',
  maxCpaBreakEven:
    'The most you could pay per generated order in ads before you start losing money, at your current selling price.',
  cpaSafetyMargin:
    'Maximum CPA (break-even) minus what you\'re actually paying. Positive = room before ads become unprofitable. Negative = you\'re already over.',
  profitPerGeneratedOrder:
    'Profit from every ad click, averaged across ALL of them — including the ones that never confirm or deliver.',
  profitPerDeliveredOrder:
    'The same profit, but spread only across orders that actually delivered. Always higher, since fewer orders share it.',
  profitMargin: 'Profit as a percentage of revenue — how much of every DZD of sales you actually keep.',
  revenuePerGeneratedOrder:
    'What you earn per ad click on average. Most generated orders never deliver, so this is far below your selling price.',
  currentCpa: 'What you\'re currently paying per generated order in ads (your "Ad cost / CPA" input).',
  simRevenue: 'Selling price × the orders that actually deliver out of these 100.',
  simProductCost: 'Product cost, paid only for the orders that deliver.',
  simAdCost: 'Ad cost × all 100 generated orders — you pay for every click, confirmed or not.',
  simCallCenterCost: 'Call-center cost × confirmed orders only.',
  simDeliveryCost: 'Delivery cost × delivered orders only.',
  simOtherCost: 'Other variable costs × delivered orders only.',
  simNetProfit: 'Revenue minus every cost above, for this batch of 100 generated orders.',
  scenarioBreakEven: 'The price where profit is exactly 0 — the floor.',
  scenarioSuggested: 'The price required to hit your target profit exactly.',
  scenarioHigherMargin: 'The price required to hit 25% more than your target — extra cushion if you want it.',
  currentSellingPrice: 'What you entered as "Selling price" in the Product section.',
  suggestedSellingPriceExact: 'The exact price needed to hit your target profit (before rounding).',
  priceDifference: 'Suggested minus current selling price. Positive = you\'re under-charging today.',
  currentExpectedProfit: 'Profit per generated order at the selling price you entered.',
  targetProfitLabel: 'What you entered as "Target profit" in the Target Profit section.',
  targetProfitGap: 'Target profit minus your current expected profit. Positive = you\'re falling short of target.',
  calculatedMinimum: 'The exact price from the formula, before rounding to a clean number.',
  roundedCommercially: 'The calculated minimum, rounded UP to your chosen increment — never down, so it still clears your target.',
} as const
