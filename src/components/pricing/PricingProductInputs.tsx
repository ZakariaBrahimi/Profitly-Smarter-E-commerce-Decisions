import { Package } from 'lucide-react'
import { CurrencyInput } from '@/components/ui/currency-input'
import type { PricingInputSectionProps } from '@/components/pricing/types'

export function PricingProductInputs({ inputs, onChange }: PricingInputSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-[13px] font-semibold text-ink">Product</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CurrencyInput
          id="pricingProductCost"
          label="Product cost"
          value={inputs.productCostDzd}
          onChange={(v) => onChange({ productCostDzd: v })}
          suffix="DZD"
        />
        <CurrencyInput
          id="pricingSellingPrice"
          label="Selling price"
          value={inputs.sellingPriceDzd}
          onChange={(v) => onChange({ sellingPriceDzd: v })}
          suffix="DZD"
          helperText="What you currently charge — compared against the required price below."
        />
      </div>
    </div>
  )
}
