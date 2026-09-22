import { Users } from 'lucide-react'
import { PercentageInput } from '@/components/ui/percentage-input'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import type { InputSectionProps } from '@/components/calculator/types'

export function FunnelInputs({ inputs, onChange }: InputSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-[13px] font-semibold text-ink">Order Funnel Rates</h3>
        <InfoTooltip text="Global defaults are applied automatically. You can override them for this product." />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PercentageInput
          id="confirmationRate"
          label="Confirmation rate"
          value={inputs.confirmationRate}
          onChange={(v) => onChange({ confirmationRate: v })}
        />
        <PercentageInput
          id="deliveryRate"
          label="Delivery rate"
          value={inputs.deliveryRate}
          onChange={(v) => onChange({ deliveryRate: v })}
        />
      </div>
    </div>
  )
}
