import { Megaphone } from 'lucide-react'
import { CurrencyInput } from '@/components/ui/currency-input'
import type { InputSectionProps } from '@/components/calculator/types'

export function AdvertisingInputs({ inputs, onChange }: InputSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-[13px] font-semibold text-ink">Advertising</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CurrencyInput
          id="dailyAdBudget"
          label="Daily ad budget"
          value={inputs.dailyAdBudgetUsd}
          onChange={(v) => onChange({ dailyAdBudgetUsd: v })}
          prefix="$"
        />
        <CurrencyInput
          id="adCostPerOrder"
          label="Ad cost / generated order"
          value={inputs.adCostPerGeneratedOrderUsd}
          onChange={(v) => onChange({ adCostPerGeneratedOrderUsd: v })}
          prefix="$"
        />
      </div>
      <p className="text-xs text-muted -mt-1">
        Cost per order before confirmation and delivery — not the same as your real cost per delivered order.
      </p>
    </div>
  )
}
