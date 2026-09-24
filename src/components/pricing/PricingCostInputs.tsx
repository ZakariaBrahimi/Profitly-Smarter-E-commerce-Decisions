import { Receipt } from 'lucide-react'
import { CurrencyInput } from '@/components/ui/currency-input'
import type { PricingInputSectionProps } from '@/components/pricing/types'

export function PricingCostInputs({ inputs, onChange }: PricingInputSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-[13px] font-semibold text-ink">Operational Costs</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <CurrencyInput
          id="pricingCallCenterCost"
          label="Call center"
          value={inputs.callCenterCostDzd}
          onChange={(v) => onChange({ callCenterCostDzd: v })}
          suffix="DZD"
          helperText="Per confirmed order"
        />
        <CurrencyInput
          id="pricingDeliveryCost"
          label="Delivery cost"
          value={inputs.deliveryCostDzd}
          onChange={(v) => onChange({ deliveryCostDzd: v })}
          suffix="DZD"
          helperText="Per delivered order"
        />
        <CurrencyInput
          id="pricingOtherCost"
          label="Other costs"
          value={inputs.otherCostDzd}
          onChange={(v) => onChange({ otherCostDzd: v })}
          suffix="DZD"
          helperText="Per delivered order"
        />
      </div>
    </div>
  )
}
