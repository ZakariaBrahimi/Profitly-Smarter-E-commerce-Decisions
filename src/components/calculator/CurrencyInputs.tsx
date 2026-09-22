import { DollarSign } from 'lucide-react'
import { NumberInput } from '@/components/ui/number-input'
import type { InputSectionProps } from '@/components/calculator/types'

export function CurrencyInputs({ inputs, onChange }: InputSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-[13px] font-semibold text-ink">Currency</h3>
      </div>

      <NumberInput
        id="exchangeRate"
        label="USD → DZD exchange rate"
        value={inputs.exchangeRate}
        onChange={(v) => onChange({ exchangeRate: v })}
        min={1}
        suffix="DZD"
      />
      <p className="text-xs text-muted -mt-1">1 USD = {Math.round(inputs.exchangeRate)} DZD</p>
    </div>
  )
}
