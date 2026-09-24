import { Calculator } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { PricingPresets } from '@/components/pricing/PricingPresets'
import { PricingProductInputs } from '@/components/pricing/PricingProductInputs'
import { PricingAdvertisingInputs } from '@/components/pricing/PricingAdvertisingInputs'
import { PricingFunnelInputs } from '@/components/pricing/PricingFunnelInputs'
import { PricingCostInputs } from '@/components/pricing/PricingCostInputs'
import { PricingTargetInput } from '@/components/pricing/PricingTargetInput'
import type { PricingInputs, RoundingStrategy } from '@/lib/calculations/pricing'

export interface PricingInputsPanelProps {
  inputs: PricingInputs
  onChange: (patch: Partial<PricingInputs>) => void
  onLoadPreset: (inputs: PricingInputs) => void
  roundingStrategy: RoundingStrategy
  onRoundingChange: (strategy: RoundingStrategy) => void
}

export function PricingInputsPanel({
  inputs,
  onChange,
  onLoadPreset,
  roundingStrategy,
  onRoundingChange,
}: PricingInputsPanelProps) {
  return (
    <SectionCard
      icon={<Calculator className="h-4 w-4" strokeWidth={2} />}
      title="Inputs"
      description="Every field updates the results instantly — no submit button needed."
      action={<PricingPresets inputs={inputs} onSelect={onLoadPreset} />}
    >
      <div className="flex flex-col gap-6">
        <PricingProductInputs inputs={inputs} onChange={onChange} />
        <PricingAdvertisingInputs inputs={inputs} onChange={onChange} />
        <PricingFunnelInputs inputs={inputs} onChange={onChange} />
        <PricingCostInputs inputs={inputs} onChange={onChange} />
        <PricingTargetInput
          inputs={inputs}
          onChange={onChange}
          roundingStrategy={roundingStrategy}
          onRoundingChange={onRoundingChange}
        />
      </div>
    </SectionCard>
  )
}
