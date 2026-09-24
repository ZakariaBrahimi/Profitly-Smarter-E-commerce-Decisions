import type { PricingInputs } from '@/lib/calculations/pricing'

export interface PricingInputSectionProps {
  inputs: PricingInputs
  onChange: (patch: Partial<PricingInputs>) => void
}
