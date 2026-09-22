import * as React from 'react'
import { Crosshair } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { CurrencyInput } from '@/components/ui/currency-input'
import { Button } from '@/components/ui/button'
import { formatDzd, formatUsd } from '@/lib/formatting/currency'
import { calculateMaxAdCostForTargetProfit } from '@/lib/calculations/profitability'
import type { CalculatorInputs } from '@/types/calculator'

export function TargetProfit({ inputs }: { inputs: CalculatorInputs }) {
  const [draftTarget, setDraftTarget] = React.useState(1000)
  const [target, setTarget] = React.useState(1000)

  const maxAdCostUsd = React.useMemo(
    () => calculateMaxAdCostForTargetProfit(inputs, target),
    [inputs, target],
  )
  const maxAdCostDzd = maxAdCostUsd * inputs.exchangeRate

  return (
    <SectionCard
      icon={<Crosshair className="h-4 w-4" strokeWidth={2} />}
      title="Target Profit"
      description="Set your desired profit per delivered order to see the maximum ad cost you can afford."
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
        <CurrencyInput
          label="Target profit / order"
          value={draftTarget}
          onChange={(v) => {
            setDraftTarget(v)
            setTarget(v)
          }}
          suffix="DZD"
          className="sm:max-w-[220px]"
        />
        <Button type="button" onClick={() => setTarget(draftTarget)} className="sm:mb-[1px]">
          Calculate
        </Button>
      </div>

      <div className="mt-5 rounded-lg border border-primary/15 bg-primary-light p-4">
        <span className="text-[11px] font-medium uppercase tracking-wide text-primary-dark/70">
          Max. ad cost / order
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums text-primary-dark">{formatUsd(maxAdCostUsd)}</span>
          <span className="text-sm text-primary-dark/70">≈ {formatDzd(maxAdCostDzd)}</span>
        </div>
      </div>
    </SectionCard>
  )
}
