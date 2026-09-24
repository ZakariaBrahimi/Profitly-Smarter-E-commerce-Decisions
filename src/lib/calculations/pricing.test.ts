import { describe, expect, it } from 'vitest'
import {
  calculateCpaSensitivity,
  calculatePricing,
  calculateProfitAtCpa,
  roundRecommendedPrice,
  type PricingInputs,
} from './pricing'

const STANDARD_INPUTS: PricingInputs = {
  productCostDzd: 2200,
  sellingPriceDzd: 4200,
  adCostUsd: 1.3,
  exchangeRate: 250,
  confirmationRate: 0.8,
  deliveryRate: 0.75,
  callCenterCostDzd: 150,
  deliveryCostDzd: 0,
  otherCostDzd: 0,
  targetProfitDzd: 800,
}

function assertFinite(result: Record<string, unknown>) {
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'number') {
      expect(value, `${key} should be finite`).toSatisfy(Number.isFinite)
      expect(value, `${key} should not be NaN`).not.toBeNaN()
    }
  }
}

describe('calculatePricing — standard example (section 4 / 8 of the spec)', () => {
  const result = calculatePricing(STANDARD_INPUTS)

  it('computes the overall delivered rate as confirmation × delivery', () => {
    expect(result.deliveredRate).toBeCloseTo(0.6, 10)
    expect(result.confirmedOrders).toBeCloseTo(80, 10)
    expect(result.deliveredOrders).toBeCloseTo(60, 10)
    expect(result.isPricingAvailable).toBe(true)
  })

  it('converts ad cost to DZD', () => {
    expect(result.adCostDzd).toBeCloseTo(325, 6)
  })

  it('computes per-generated-order cost lines and their sum', () => {
    expect(result.productCostPerGeneratedOrder).toBeCloseTo(1320, 6)
    expect(result.callCenterCostPerGeneratedOrder).toBeCloseTo(120, 6)
    expect(result.deliveryCostPerGeneratedOrder).toBeCloseTo(0, 6)
    expect(result.otherCostPerGeneratedOrder).toBeCloseTo(0, 6)
    expect(result.totalCostPerGeneratedOrder).toBeCloseTo(1765, 6)
  })

  it('computes the exact required selling price as 4,275 DZD', () => {
    expect(result.requiredSellingPrice).toBeCloseTo(4275, 6)
  })

  it('rounds the suggested price up to the nearest 10, never below the requirement', () => {
    expect(result.suggestedSellingPrice).toBe(4280)
    expect(result.suggestedSellingPrice).toBeGreaterThanOrEqual(result.requiredSellingPrice)
  })

  it('computes break-even price independent of target profit', () => {
    expect(result.breakEvenPrice).toBeCloseTo(1765 / 0.6, 6)
  })

  it('computes the higher-margin price at 1.25× target profit', () => {
    expect(result.higherMarginPrice).toBeCloseTo((1765 + 1000) / 0.6, 6)
  })

  it('computes current profit at the current selling price (755 DZD)', () => {
    expect(result.revenuePerGeneratedOrder).toBeCloseTo(2520, 6)
    expect(result.currentProfitPerGeneratedOrder).toBeCloseTo(755, 6)
  })

  it('computes price difference and target profit gap exactly as the worked example', () => {
    expect(result.priceDifference).toBeCloseTo(75, 6) // 4275 - 4200
    expect(result.targetProfitGap).toBeCloseTo(45, 6) // 800 - 755
  })

  it('computes max CPA figures', () => {
    expect(result.breakEvenCpaUsd).toBeCloseTo(1080 / 250, 6)
    expect(result.targetProfitCpaUsd).toBeCloseTo(280 / 250, 6)
    expect(result.safetyMarginUsd).toBeCloseTo(1080 / 250 - 1.3, 6)
  })

  it('builds three dynamic pricing scenarios', () => {
    const [breakEven, suggested, higherMargin] = result.scenarios
    expect(breakEven.profit).toBe(0)
    expect(breakEven.sellingPrice).toBeCloseTo(result.breakEvenPrice, 6)
    expect(suggested.profit).toBe(800)
    expect(suggested.sellingPrice).toBeCloseTo(result.requiredSellingPrice, 6)
    expect(higherMargin.label).toBe('Higher Margin Scenario')
    expect(higherMargin.profit).toBe(1000)
    expect(higherMargin.sellingPrice).toBeCloseTo(result.higherMarginPrice, 6)
  })

  it('never produces NaN or Infinity', () => assertFinite(result as unknown as Record<string, unknown>))
})

describe('calculatePricing — section 10 required scenarios', () => {
  it('1. standard example matches the documented numbers', () => {
    const result = calculatePricing(STANDARD_INPUTS)
    expect(result.requiredSellingPrice).toBeCloseTo(4275, 6)
    expect(result.suggestedSellingPrice).toBe(4280)
  })

  it('2. zero delivery rate — pricing unavailable, no divide-by-zero', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, deliveryRate: 0 })
    expect(result.deliveredRate).toBe(0)
    expect(result.isPricingAvailable).toBe(false)
    expect(result.breakEvenPrice).toBe(0)
    expect(result.requiredSellingPrice).toBe(0)
    expect(result.suggestedSellingPrice).toBe(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('3. zero confirmation rate — pricing unavailable, no divide-by-zero', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, confirmationRate: 0 })
    expect(result.deliveredRate).toBe(0)
    expect(result.isPricingAvailable).toBe(false)
    expect(result.confirmedOrders).toBe(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('4. zero target profit collapses required price to break-even', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, targetProfitDzd: 0 })
    expect(result.requiredSellingPrice).toBeCloseTo(result.breakEvenPrice, 6)
    expect(result.scenarios[1].profit).toBe(0)
  })

  it('5. zero advertising cost removes ad cost from the total', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, adCostUsd: 0 })
    expect(result.adCostDzd).toBe(0)
    expect(result.totalCostPerGeneratedOrder).toBeCloseTo(1320 + 120, 6)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('6. free delivery (delivery cost = 0) is handled with no side effects', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, deliveryCostDzd: 0 })
    expect(result.deliveryCostPerGeneratedOrder).toBe(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('7. very high product cost pushes required price up but stays finite', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, productCostDzd: 1_000_000 })
    expect(result.requiredSellingPrice).toBeGreaterThan(1_000_000)
    expect(result.currentProfitPerGeneratedOrder).toBeLessThan(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('8. current price below suggested price — positive gap and difference', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, sellingPriceDzd: 4000 })
    expect(result.priceDifference).toBeGreaterThan(0)
    expect(result.targetProfitGap).toBeGreaterThan(0)
  })

  it('9. current price above suggested price — negative gap and difference', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, sellingPriceDzd: 5000 })
    expect(result.priceDifference).toBeLessThan(0)
    expect(result.targetProfitGap).toBeLessThan(0)
    expect(result.currentProfitPerGeneratedOrder).toBeGreaterThan(result.scenarios[1].profit)
  })

  it('10. rounding never reduces the actual profit below the target', () => {
    for (const increment of [10, 50, 100] as const) {
      const result = calculatePricing(STANDARD_INPUTS, increment)
      const profitAtSuggestedPrice =
        result.suggestedSellingPrice * result.deliveredRate - result.totalCostPerGeneratedOrder
      expect(profitAtSuggestedPrice).toBeGreaterThanOrEqual(STANDARD_INPUTS.targetProfitDzd - 1e-9)
    }
  })
})

describe('calculatePricing — additional edge cases', () => {
  it('handles negative inputs by clamping instead of propagating negatives', () => {
    const result = calculatePricing({
      ...STANDARD_INPUTS,
      productCostDzd: -500,
      callCenterCostDzd: -50,
      sellingPriceDzd: -100,
    })
    expect(result.productCostPerGeneratedOrder).toBe(0)
    expect(result.callCenterCostPerGeneratedOrder).toBe(0)
    expect(result.revenuePerGeneratedOrder).toBe(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles "empty" inputs (NaN from a blank field) without ever producing NaN', () => {
    const result = calculatePricing({
      ...STANDARD_INPUTS,
      productCostDzd: Number.NaN,
      targetProfitDzd: Number.NaN,
      sellingPriceDzd: Number.NaN,
      exchangeRate: Number.NaN,
    })
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles extremely large values without overflowing to Infinity', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, sellingPriceDzd: 1e12, productCostDzd: 1e12 })
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles a zero exchange rate without dividing by zero', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, exchangeRate: 0 })
    expect(result.adCostDzd).toBe(0)
    expect(result.breakEvenCpaUsd).toBe(0)
    expect(result.targetProfitCpaUsd).toBe(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles zero call-center cost and zero other costs', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, callCenterCostDzd: 0, otherCostDzd: 0 })
    expect(result.callCenterCostPerGeneratedOrder).toBe(0)
    expect(result.otherCostPerGeneratedOrder).toBe(0)
  })

  it('handles confirmation and delivery both at 0 together with a 0 exchange rate', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, confirmationRate: 0, deliveryRate: 0, exchangeRate: 0 })
    assertFinite(result as unknown as Record<string, unknown>)
    expect(result.isPricingAvailable).toBe(false)
  })

  it('clamps out-of-range fractions (>100% or negative) instead of producing nonsense', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, confirmationRate: 1.5, deliveryRate: -0.2 })
    expect(result.deliveredRate).toBe(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })
})

describe('roundRecommendedPrice', () => {
  it('always rounds up, matching the documented examples', () => {
    expect(roundRecommendedPrice(4275, 10)).toBe(4280)
    expect(roundRecommendedPrice(4281, 10)).toBe(4290)
    expect(roundRecommendedPrice(4301, 10)).toBe(4310)
    expect(roundRecommendedPrice(4275, 50)).toBe(4300)
    expect(roundRecommendedPrice(4270, 10)).toBe(4270)
  })

  it('never rounds below the calculated price', () => {
    for (const price of [1, 9.5, 100, 4275, 999999]) {
      for (const increment of [10, 50, 100] as const) {
        expect(roundRecommendedPrice(price, increment)).toBeGreaterThanOrEqual(price)
      }
    }
  })

  it('returns 0 for non-positive or non-finite input', () => {
    expect(roundRecommendedPrice(0, 10)).toBe(0)
    expect(roundRecommendedPrice(-5, 10)).toBe(0)
    expect(roundRecommendedPrice(Number.NaN, 10)).toBe(0)
  })
})

describe('calculateProfitAtCpa / calculateCpaSensitivity', () => {
  it('profit decreases monotonically as CPA increases', () => {
    const low = calculateProfitAtCpa(STANDARD_INPUTS, 0.5)
    const mid = calculateProfitAtCpa(STANDARD_INPUTS, 1.3)
    const high = calculateProfitAtCpa(STANDARD_INPUTS, 2.5)
    expect(low).toBeGreaterThan(mid)
    expect(mid).toBeGreaterThan(high)
  })

  it('produces a finite row per preset CPA plus the dynamic break-even row', () => {
    const rows = calculateCpaSensitivity(STANDARD_INPUTS)
    expect(rows).toHaveLength(7)
    expect(rows.filter((r) => r.isBreakEven)).toHaveLength(1)
    rows.forEach((row) => {
      expect(Number.isFinite(row.profitPerGeneratedOrder)).toBe(true)
    })
  })

  it('profit is ~0 at the break-even CPA row', () => {
    const rows = calculateCpaSensitivity(STANDARD_INPUTS)
    const breakEvenRow = rows.find((r) => r.isBreakEven)!
    expect(breakEvenRow.profitPerGeneratedOrder).toBeCloseTo(0, 4)
  })

  it('never produces NaN even with degenerate inputs', () => {
    const rows = calculateCpaSensitivity({ ...STANDARD_INPUTS, confirmationRate: 0, exchangeRate: 0 })
    rows.forEach((row) => expect(Number.isFinite(row.profitPerGeneratedOrder)).toBe(true))
  })
})
