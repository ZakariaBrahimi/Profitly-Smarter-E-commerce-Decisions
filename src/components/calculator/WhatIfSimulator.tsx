import { FlaskConical, RotateCcw } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { SliderInput } from '@/components/ui/slider-input'
import { Button } from '@/components/ui/button'
import { formatDzd, formatUsd, formatPercent } from '@/lib/formatting/currency'
import type { WhatIfInputs } from '@/types/calculator'

export interface WhatIfSimulatorProps {
  whatIf: WhatIfInputs
  onChange: (patch: Partial<WhatIfInputs>) => void
  onReset: () => void
}

export function WhatIfSimulator({ whatIf, onChange, onReset }: WhatIfSimulatorProps) {
  return (
    <SectionCard
      icon={<FlaskConical className="h-4 w-4" strokeWidth={2} />}
      title="What-if Simulator"
      description="See how changes in your settings affect your results."
      action={
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          Reset to current
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <SliderInput
          label="Ad cost / order"
          value={whatIf.adCostPerGeneratedOrderUsd}
          onChange={(v) => onChange({ adCostPerGeneratedOrderUsd: v })}
          min={0.5}
          max={3}
          step={0.01}
          formatValue={formatUsd}
        />
        <SliderInput
          label="Confirmation rate"
          value={whatIf.confirmationRate}
          onChange={(v) => onChange({ confirmationRate: v })}
          min={0.5}
          max={1}
          step={0.01}
          formatValue={formatPercent}
          parseValue={(raw) => {
            const n = Number.parseFloat(raw.replace('%', ''))
            return Number.isFinite(n) ? n / 100 : null
          }}
        />
        <SliderInput
          label="Delivery rate"
          value={whatIf.deliveryRate}
          onChange={(v) => onChange({ deliveryRate: v })}
          min={0.5}
          max={1}
          step={0.01}
          formatValue={formatPercent}
          parseValue={(raw) => {
            const n = Number.parseFloat(raw.replace('%', ''))
            return Number.isFinite(n) ? n / 100 : null
          }}
        />
        <SliderInput
          label="Selling price"
          value={whatIf.sellingPriceDzd}
          onChange={(v) => onChange({ sellingPriceDzd: v })}
          min={2500}
          max={5000}
          step={10}
          formatValue={formatDzd}
        />
      </div>
    </SectionCard>
  )
}
