import type { PricingInputs, RoundingStrategy } from '@/lib/calculations/pricing'

export const DEFAULT_PRICING_INPUTS: PricingInputs = {
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

export const ROUNDING_OPTIONS: RoundingStrategy[] = [10, 50, 100]
export const DEFAULT_ROUNDING_STRATEGY: RoundingStrategy = 10

export interface PricingPreset {
  id: string
  label: string
  description: string
  inputs: PricingInputs
}

export const PRICING_PRESETS: PricingPreset[] = [
  {
    id: 'current-example',
    label: 'Current Example',
    description: '80% confirmation, 75% delivery, $1.30 CPA',
    inputs: DEFAULT_PRICING_INPUTS,
  },
  {
    id: 'conservative',
    label: 'Conservative',
    description: '60% confirmation, 55% delivery, $2.00 CPA',
    inputs: {
      ...DEFAULT_PRICING_INPUTS,
      confirmationRate: 0.6,
      deliveryRate: 0.55,
      adCostUsd: 2.0,
    },
  },
]

export const CUSTOM_PRESET_ID = 'custom'

export function matchPresetId(inputs: PricingInputs): string {
  const match = PRICING_PRESETS.find((preset) =>
    (Object.keys(preset.inputs) as (keyof PricingInputs)[]).every(
      (key) => Math.abs(preset.inputs[key] - inputs[key]) < 1e-9,
    ),
  )
  return match?.id ?? CUSTOM_PRESET_ID
}
