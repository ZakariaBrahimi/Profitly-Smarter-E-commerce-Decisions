import { Calculator } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { ProductInputs } from '@/components/calculator/ProductInputs'
import { AdvertisingInputs } from '@/components/calculator/AdvertisingInputs'
import { FunnelInputs } from '@/components/calculator/FunnelInputs'
import { FixedCostInputs } from '@/components/calculator/FixedCostInputs'
import { CurrencyInputs } from '@/components/calculator/CurrencyInputs'
import type { InputSectionProps } from '@/components/calculator/types'

export function CalculatorInputs({ inputs, onChange }: InputSectionProps) {
  return (
    <SectionCard
      icon={<Calculator className="h-4 w-4" strokeWidth={2} />}
      title="Calculator"
      description="Enter your product economics — every result below updates instantly."
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
        <ProductInputs inputs={inputs} onChange={onChange} />
        <AdvertisingInputs inputs={inputs} onChange={onChange} />
        <FunnelInputs inputs={inputs} onChange={onChange} />
        <FixedCostInputs inputs={inputs} onChange={onChange} />
        <div className="lg:col-span-2 lg:max-w-xs">
          <CurrencyInputs inputs={inputs} onChange={onChange} />
        </div>
      </div>
    </SectionCard>
  )
}
