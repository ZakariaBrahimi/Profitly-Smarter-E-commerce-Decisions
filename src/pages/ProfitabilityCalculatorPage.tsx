import * as React from 'react'
import { RotateCcw, Save, FolderOpen } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Toast } from '@/components/ui/toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalculatorInputs } from '@/components/calculator/CalculatorInputs'
import { OrderFunnel } from '@/components/calculator/OrderFunnel'
import { Results } from '@/components/calculator/Results'
import { QuickSummary } from '@/components/calculator/QuickSummary'
import { BreakEvenAnalysis } from '@/components/calculator/BreakEvenAnalysis'
import { TargetProfit } from '@/components/calculator/TargetProfit'
import { SaveTemplateDialog } from '@/components/calculator/SaveTemplateDialog'
import { useCalculatorState } from '@/hooks/useCalculatorState'
import { calculateProfitability } from '@/lib/calculations/profitability'
import { isProductInfoComplete } from '@/lib/validation/calculator'
import { listTemplates, type CalculatorTemplate } from '@/lib/storage/templates'

export function ProfitabilityCalculatorPage() {
  const { state, setInput, resetAll, setResultsPeriod, setCustomDays, loadTemplate } = useCalculatorState()

  const [resetDialogOpen, setResetDialogOpen] = React.useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [templates, setTemplates] = React.useState<CalculatorTemplate[]>([])

  React.useEffect(() => {
    setTemplates(listTemplates())
  }, [])

  React.useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 2600)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const result = React.useMemo(() => calculateProfitability(state.inputs), [state.inputs])

  const productComplete = isProductInfoComplete(state.inputs)

  return (
    <AppShell
      title="Product Profitability Calculator"
      subtitle="Calculate your real costs, profit and ROI. Adjust the numbers to see how your business performs and what you can improve."
      headerActions={
        <>
          {templates.length > 0 && (
            <Select
              onValueChange={(id) => {
                const template = templates.find((t) => t.id === id)
                if (!template) return
                loadTemplate(template.inputs)
                setToastMessage(`Loaded template "${template.name}"`)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <FolderOpen className="h-3.5 w-3.5 text-muted" strokeWidth={2} />
                <SelectValue placeholder="Load template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="secondary" size="sm" onClick={() => setResetDialogOpen(true)} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
            Reset
          </Button>
          <Button size="sm" onClick={() => setSaveDialogOpen(true)} className="gap-1.5">
            <Save className="h-3.5 w-3.5" strokeWidth={2} />
            Save as Template
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
        <div className="flex flex-col gap-5 lg:col-span-2 lg:gap-6">
          <CalculatorInputs inputs={state.inputs} onChange={setInput} />

          {!productComplete && (
            <EmptyState
              title="Complete your product information"
              description="Add a purchase cost and selling price to see accurate results."
            />
          )}

          <OrderFunnel
            result={result}
            dailyAdBudgetUsd={state.inputs.dailyAdBudgetUsd}
            confirmationRate={state.inputs.confirmationRate}
            deliveryRate={state.inputs.deliveryRate}
          />

          <Results
            result={result}
            period={state.resultsPeriod}
            customDays={state.customDays}
            onPeriodChange={setResultsPeriod}
            onCustomDaysChange={setCustomDays}
          />

          <BreakEvenAnalysis result={result} currentAdCostUsd={state.inputs.adCostPerGeneratedOrderUsd} />

          <TargetProfit inputs={state.inputs} />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <QuickSummary result={result} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        title="Reset calculator?"
        description="This restores every field to its default value."
        confirmLabel="Reset"
        onConfirm={() => {
          resetAll()
          setToastMessage('Calculator reset to defaults')
        }}
      />

      <SaveTemplateDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        inputs={state.inputs}
        onSaved={(name) => {
          setTemplates(listTemplates())
          setToastMessage(`Template "${name}" saved`)
        }}
      />

      <Toast message={toastMessage} />
    </AppShell>
  )
}
