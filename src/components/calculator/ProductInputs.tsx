import { Package } from 'lucide-react'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { InputSectionProps } from '@/components/calculator/types'

export function ProductInputs({ inputs, onChange }: InputSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-[13px] font-semibold text-ink">Product</h3>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="productName">Product name</Label>
        <Input
          id="productName"
          value={inputs.productName}
          onChange={(e) => onChange({ productName: e.target.value })}
          placeholder="e.g. T-shirt Khalid Ibn Al-Walid"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CurrencyInput
          id="purchaseCost"
          label="Purchase cost"
          value={inputs.purchaseCostDzd}
          onChange={(v) => onChange({ purchaseCostDzd: v })}
          suffix="DZD"
        />
        <CurrencyInput
          id="sellingPrice"
          label="Selling price"
          value={inputs.sellingPriceDzd}
          onChange={(v) => onChange({ sellingPriceDzd: v })}
          suffix="DZD"
        />
      </div>
    </div>
  )
}
