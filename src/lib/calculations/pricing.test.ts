import { describe, expect, it } from 'vitest'
import {
  calculateCpaSensitivity,
  calculatePricing,
  calculateProfitAtCpa,
  getPricingStatus,
  roundUpToNearest,
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

describe('calculatePricing — standard case', () => {
  const result = calculatePricing(STANDARD_INPUTS)

  it('computes the overall delivered rate as confirmation × delivery', () => {
    expect(result.deliveredRate).toBeCloseTo(0.6, 10)
  })

  it('projects confirmed/delivered orders per 100 generated', () => {
    expect(result.confirmedOrdersPer100).toBeCloseTo(80, 10)
    expect(result.deliveredOrdersPer100).toBeCloseTo(60, 10)
  })

  it('converts ad cost to DZD', () => {
    expect(result.adCostDzd).toBeCloseTo(325, 6)
  })

  it('computes per-generated-order cost lines', () => {
    expect(result.productCostPerGeneratedOrder).toBeCloseTo(1320, 6)
    expect(result.callCenterCostPerGeneratedOrder).toBeCloseTo(120, 6)
    expect(result.deliveryCostPerGeneratedOrder).toBeCloseTo(0, 6)
    expect(result.totalCostPerGeneratedOrder).toBeCloseTo(1765, 6)
  })

  it('computes revenue and profit per generated order at the current selling price', () => {
    expect(result.revenuePerGeneratedOrder).toBeCloseTo(2520, 6)
    expect(result.profitPerGeneratedOrder).toBeCloseTo(755, 6)
  })

  it('computes the required selling price to hit the target profit within the documented range', () => {
    expect(result.requiredSellingPrice).toBeCloseTo(4275, 6)
    expect(result.requiredSellingPrice).toBeGreaterThanOrEqual(4200)
    expect(result.requiredSellingPrice).toBeLessThanOrEqual(4275)
  })

  it('rounds the recommended price up to the nearest step, never under the exact requirement', () => {
    expect(result.recommendedSellingPrice).toBeGreaterThanOrEqual(result.requiredSellingPrice)
    expect(result.recommendedSellingPrice % 10).toBe(0)
  })

  it('computes break-even price independent of target profit', () => {
    expect(result.breakEvenPrice).toBeCloseTo(1765 / 0.6, 6)
  })

  it('computes max CPA figures', () => {
    expect(result.breakEvenCpaUsd).toBeCloseTo(1080 / 250, 6)
    expect(result.targetProfitCpaUsd).toBeCloseTo(280 / 250, 6)
    expect(result.safetyMarginUsd).toBeCloseTo(1080 / 250 - 1.3, 6)
  })

  it('flags the default example as below target (755 < 800)', () => {
    expect(result.status).toBe('below-target')
  })

  it('builds three dynamic pricing scenarios', () => {
    const [breakEven, target, higherMargin] = result.scenarios
    expect(breakEven.profit).toBe(0)
    expect(breakEven.sellingPrice).toBeCloseTo(result.breakEvenPrice, 6)
    expect(target.profit).toBe(800)
    expect(target.sellingPrice).toBeCloseTo(result.requiredSellingPrice, 6)
    expect(higherMargin.profit).toBe(1000)
    expect(higherMargin.sellingPrice).toBeGreaterThan(target.sellingPrice)
  })

  it('never produces NaN or Infinity', () => assertFinite(result as unknown as Record<string, unknown>))
})

describe('calculatePricing — edge cases', () => {
  it('handles 100% confirmation and 100% delivery', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, confirmationRate: 1, deliveryRate: 1 })
    expect(result.deliveredRate).toBe(1)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles 0% confirmation without dividing by zero', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, confirmationRate: 0 })
    expect(result.deliveredRate).toBe(0)
    expect(result.breakEvenPrice).toBe(0)
    expect(result.requiredSellingPrice).toBe(0)
    expect(result.recommendedSellingPrice).toBe(0)
    expect(result.profitPerDeliveredOrder).toBe(0)
    expect(result.profitMargin).toBe(0)
    // Ad spend with zero conversions is a pure loss.
    expect(result.status).toBe('loss')
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles 0% delivery without dividing by zero', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, deliveryRate: 0 })
    expect(result.deliveredRate).toBe(0)
    expect(result.breakEvenPrice).toBe(0)
    expect(result.status).toBe('loss')
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles a very high CPA (deep loss, still finite)', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, adCostUsd: 500 })
    expect(result.profitPerGeneratedOrder).toBeLessThan(0)
    expect(result.status).toBe('loss')
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles zero call-center cost', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, callCenterCostDzd: 0 })
    expect(result.callCenterCostPerGeneratedOrder).toBe(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles high delivery cost', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, deliveryCostDzd: 5000 })
    expect(result.deliveryCostPerGeneratedOrder).toBeCloseTo(5000 * 0.6, 6)
    expect(result.status).toBe('loss')
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles high product cost', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, productCostDzd: 100000 })
    expect(result.profitPerGeneratedOrder).toBeLessThan(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles target profit of 0 (required price collapses to break-even)', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, targetProfitDzd: 0 })
    expect(result.requiredSellingPrice).toBeCloseTo(result.breakEvenPrice, 6)
    expect(result.scenarios[1].profit).toBe(0)
  })

  it('handles a target profit far above what any reasonable price could sustain', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, targetProfitDzd: 1_000_000 })
    expect(result.requiredSellingPrice).toBeGreaterThan(1_000_000)
    expect(result.status).toBe('below-target')
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles decimal percentages', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, confirmationRate: 0.823, deliveryRate: 0.716 })
    expect(result.deliveredRate).toBeCloseTo(0.823 * 0.716, 10)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('handles a different exchange rate / currency assumption', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, exchangeRate: 135 })
    expect(result.adCostDzd).toBeCloseTo(1.3 * 135, 6)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('never divides by zero even when exchange rate is 0', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, exchangeRate: 0 })
    expect(result.adCostDzd).toBe(0)
    expect(result.breakEvenCpaUsd).toBe(0)
    expect(result.targetProfitCpaUsd).toBe(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('never divides by zero when confirmation, delivery and exchange rate are all 0', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, confirmationRate: 0, deliveryRate: 0, exchangeRate: 0 })
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('clamps out-of-range fractions instead of producing nonsense', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, confirmationRate: 1.5, deliveryRate: -0.2 })
    expect(result.deliveredRate).toBe(0)
    assertFinite(result as unknown as Record<string, unknown>)
  })

  it('never produces a negative recommended price', () => {
    const result = calculatePricing({ ...STANDARD_INPUTS, targetProfitDzd: -100000 })
    expect(result.recommendedSellingPrice).toBeGreaterThanOrEqual(0)
  })
})

describe('roundUpToNearest', () => {
  it('rounds up to the nearest step', () => {
    expect(roundUpToNearest(4273, 10)).toBe(4280)
    expect(roundUpToNearest(4270, 10)).toBe(4270)
    expect(roundUpToNearest(4273, 50)).toBe(4300)
    expect(roundUpToNearest(4273, 100)).toBe(4300)
  })

  it('returns 0 for non-positive input', () => {
    expect(roundUpToNearest(0, 10)).toBe(0)
    expect(roundUpToNearest(-5, 10)).toBe(0)
  })
})

describe('getPricingStatus', () => {
  it('classifies loss, below-target and profitable', () => {
    expect(getPricingStatus(-10, 800)).toBe('loss')
    expect(getPricingStatus(400, 800)).toBe('below-target')
    expect(getPricingStatus(800, 800)).toBe('profitable')
    expect(getPricingStatus(900, 800)).toBe('profitable')
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
})
