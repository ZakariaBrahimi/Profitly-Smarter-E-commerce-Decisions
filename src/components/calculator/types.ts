import type { CalculatorInputs } from '@/types/calculator'

export interface InputSectionProps {
  inputs: CalculatorInputs
  onChange: (patch: Partial<CalculatorInputs>) => void
}
