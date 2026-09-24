import * as React from 'react'
import { RotateCcw } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Toast } from '@/components/ui/toast'
import { PricingInputsPanel } from '@/components/pricing/PricingInputsPanel'
import { RecommendedPriceCard } from '@/components/pricing/RecommendedPriceCard'
import { PricingResultsGrid } from '@/components/pricing/PricingResultsGrid'
import { OrderSimulation } from '@/components/pricing/OrderSimulation'
import { PricingScenarios } from '@/components/pricing/PricingScenarios'
import { CpaSensitivity } from '@/components/pricing/CpaSensitivity'
import { usePricingState } from '@/hooks/usePricingState'
import { calculateCpaSensitivity, calculatePricing } from '@/lib/calculations/pricing'

export function PricingCalculatorPage() {
  const { state, setInput, setRounding, loadPreset, setCpa, reset } = usePricingState()
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 2600)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const result = React.useMemo(
    () => calculatePricing(state.inputs, state.roundingStrategy),
    [state.inputs, state.roundingStrategy],
  )

  const sensitivityRows = React.useMemo(() => calculateCpaSensitivity(state.inputs), [state.inputs])

  return (
    <AppShell
      title="Pricing Calculator"
      subtitle="What should you sell this product for? Enter your costs and funnel, set a target profit, and see the price to charge."
      headerActions={
        <Button variant="secondary" size="sm" onClick={() => setResetDialogOpen(true)} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          Reset
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <PricingInputsPanel
            inputs={state.inputs}
            onChange={setInput}
            onLoadPreset={(inputs) => {
              loadPreset(inputs)
              setToastMessage('Preset applied')
            }}
            roundingStrategy={state.roundingStrategy}
            onRoundingChange={setRounding}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <RecommendedPriceCard result={result} currentCpaUsd={state.inputs.adCostUsd} />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5 lg:mt-6 lg:gap-6">
        <PricingResultsGrid result={result} />
        <OrderSimulation result={result} />
        <PricingScenarios result={result} />
        <CpaSensitivity
          rows={sensitivityRows}
          currentCpaUsd={state.inputs.adCostUsd}
          result={result}
          onSelectCpa={setCpa}
        />
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset pricing calculator?"
        description="This restores every field to its default value."
        confirmLabel="Reset"
        onConfirm={() => {
          reset()
          setToastMessage('Pricing calculator reset to defaults')
        }}
      />

      <Toast message={toastMessage} />
    </AppShell>
  )
}
