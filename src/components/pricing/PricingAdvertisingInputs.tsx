import { Megaphone } from 'lucide-react'
import { CurrencyInput } from '@/components/ui/currency-input'
import { NumberInput } from '@/components/ui/number-input'
import type { PricingInputSectionProps } from '@/components/pricing/types'

export function PricingAdvertisingInputs({ inputs, onChange }: PricingInputSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-[13px] font-semibold text-ink">Advertising</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CurrencyInput
          id="pricingAdCost"
          label="Ad cost / CPA"
          value={inputs.adCostUsd}
          onChange={(v) => onChange({ adCostUsd: v })}
          prefix="$"
          helperText="Per generated order"
        />
        <NumberInput
          id="pricingExchangeRate"
          label="Exchange rate"
          value={inputs.exchangeRate}
          onChange={(v) => onChange({ exchangeRate: v })}
          min={1}
          suffix="DZD/USD"
        />
      </div>
    </div>
  )
}
