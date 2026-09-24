import { Crosshair } from 'lucide-react'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ROUNDING_OPTIONS } from '@/types/pricing'
import type { RoundingStrategy } from '@/lib/calculations/pricing'
import type { PricingInputSectionProps } from '@/components/pricing/types'

export interface PricingTargetInputProps extends PricingInputSectionProps {
  roundingStrategy: RoundingStrategy
  onRoundingChange: (strategy: RoundingStrategy) => void
}

export function PricingTargetInput({ inputs, onChange, roundingStrategy, onRoundingChange }: PricingTargetInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Crosshair className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-[13px] font-semibold text-ink">Target Profit</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CurrencyInput
          id="pricingTargetProfit"
          label="Target profit"
          value={inputs.targetProfitDzd}
          onChange={(v) => onChange({ targetProfitDzd: v })}
          suffix="DZD"
          helperText="Per generated order"
        />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pricingRounding">Round recommended price to</Label>
          <Select value={String(roundingStrategy)} onValueChange={(v) => onRoundingChange(Number(v) as RoundingStrategy)}>
            <SelectTrigger id="pricingRounding" className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROUNDING_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  Nearest {option} DZD
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
