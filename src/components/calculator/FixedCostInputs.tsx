import { Receipt } from 'lucide-react'
import { CurrencyInput } from '@/components/ui/currency-input'
import type { InputSectionProps } from '@/components/calculator/types'

export function FixedCostInputs({ inputs, onChange }: InputSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Receipt className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-[13px] font-semibold text-ink">Fixed Costs</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CurrencyInput
          id="confirmationFee"
          label="Confirmation fee / delivered order"
          value={inputs.confirmationFeeDzd}
          onChange={(v) => onChange({ confirmationFeeDzd: v })}
          suffix="DZD"
        />
        <CurrencyInput
          id="deliveryCost"
          label="Delivery cost / delivered order"
          value={inputs.deliveryCostDzd}
          onChange={(v) => onChange({ deliveryCostDzd: v })}
          suffix="DZD"
        />
      </div>
    </div>
  )
}
