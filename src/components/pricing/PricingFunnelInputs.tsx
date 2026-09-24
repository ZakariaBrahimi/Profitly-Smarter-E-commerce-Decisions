import { Users } from 'lucide-react'
import { PercentageInput } from '@/components/ui/percentage-input'
import { formatPercent } from '@/lib/formatting/currency'
import type { PricingInputSectionProps } from '@/components/pricing/types'

export function PricingFunnelInputs({ inputs, onChange }: PricingInputSectionProps) {
  const deliveredRate = inputs.confirmationRate * inputs.deliveryRate
  const deliveredPer100 = Math.round(deliveredRate * 100)
  const confirmedPer100 = Math.round(inputs.confirmationRate * 100)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" strokeWidth={2} />
        <h3 className="text-[13px] font-semibold text-ink">Order Funnel</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PercentageInput
          id="pricingConfirmationRate"
          label="Confirmation rate"
          value={inputs.confirmationRate}
          onChange={(v) => onChange({ confirmationRate: v })}
        />
        <PercentageInput
          id="pricingDeliveryRate"
          label="Delivery rate"
          value={inputs.deliveryRate}
          onChange={(v) => onChange({ deliveryRate: v })}
        />
      </div>

      <div className="rounded-lg border border-primary/15 bg-primary-light px-3.5 py-3 text-[13px] text-primary-dark">
        <p className="font-semibold tabular-nums">
          {formatPercent(inputs.confirmationRate)} confirmation × {formatPercent(inputs.deliveryRate)} delivery ={' '}
          {formatPercent(deliveredRate)} overall delivered rate
        </p>
        <p className="mt-0.5 text-primary-dark/70">
          For every 100 generated orders → {confirmedPer100} confirmed → {deliveredPer100} delivered.
          Product cost only applies to the {deliveredPer100}, not the {confirmedPer100}.
        </p>
      </div>
    </div>
  )
}
