import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CUSTOM_PRESET_ID, PRICING_PRESETS, matchPresetId } from '@/types/pricing'
import type { PricingInputs } from '@/lib/calculations/pricing'

export interface PricingPresetsProps {
  inputs: PricingInputs
  onSelect: (inputs: PricingInputs) => void
}

export function PricingPresets({ inputs, onSelect }: PricingPresetsProps) {
  const activeId = matchPresetId(inputs)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
        Presets:
      </span>
      {PRICING_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset.inputs)}
          title={preset.description}
          className={cn(
            'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
            activeId === preset.id
              ? 'border-primary bg-primary-light text-primary-dark'
              : 'border-border-strong bg-white text-muted hover:bg-slate-50',
          )}
        >
          {preset.label}
        </button>
      ))}
      <span
        className={cn(
          'rounded-full border px-3 py-1 text-xs font-medium',
          activeId === CUSTOM_PRESET_ID
            ? 'border-primary bg-primary-light text-primary-dark'
            : 'border-dashed border-border-strong text-slate-400',
        )}
      >
        Custom
      </span>
    </div>
  )
}
