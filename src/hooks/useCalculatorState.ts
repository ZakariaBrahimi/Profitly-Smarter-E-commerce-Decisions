import { useReducer } from 'react'
import { DEFAULT_CALCULATOR_INPUTS, whatIfFromCalculator, type CalculatorInputs, type MonthlyPeriodOption, type WhatIfInputs } from '@/types/calculator'
import { validateCalculatorInputs, type FieldError } from '@/lib/validation/calculator'

export interface CalculatorState {
  inputs: CalculatorInputs
  whatIf: WhatIfInputs
  monthlyPeriod: MonthlyPeriodOption
  customDays: number
}

type Action =
  | { type: 'SET_INPUT'; patch: Partial<CalculatorInputs> }
  | { type: 'SET_WHATIF'; patch: Partial<WhatIfInputs> }
  | { type: 'RESET_WHATIF_TO_CURRENT' }
  | { type: 'RESET_ALL' }
  | { type: 'SET_MONTHLY_PERIOD'; period: MonthlyPeriodOption }
  | { type: 'SET_CUSTOM_DAYS'; days: number }
  | { type: 'LOAD_TEMPLATE'; inputs: CalculatorInputs }

function createInitialState(): CalculatorState {
  return {
    inputs: DEFAULT_CALCULATOR_INPUTS,
    whatIf: whatIfFromCalculator(DEFAULT_CALCULATOR_INPUTS),
    monthlyPeriod: 30,
    customDays: 30,
  }
}

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, inputs: { ...state.inputs, ...action.patch } }
    case 'SET_WHATIF':
      return { ...state, whatIf: { ...state.whatIf, ...action.patch } }
    case 'RESET_WHATIF_TO_CURRENT':
      return { ...state, whatIf: whatIfFromCalculator(state.inputs) }
    case 'RESET_ALL':
      return createInitialState()
    case 'SET_MONTHLY_PERIOD':
      return { ...state, monthlyPeriod: action.period }
    case 'SET_CUSTOM_DAYS':
      return { ...state, customDays: Math.max(1, action.days) }
    case 'LOAD_TEMPLATE':
      return { ...state, inputs: action.inputs, whatIf: whatIfFromCalculator(action.inputs) }
    default:
      return state
  }
}

export function useCalculatorState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  const setInput = (patch: Partial<CalculatorInputs>) => dispatch({ type: 'SET_INPUT', patch })
  const setWhatIf = (patch: Partial<WhatIfInputs>) => dispatch({ type: 'SET_WHATIF', patch })
  const resetWhatIfToCurrent = () => dispatch({ type: 'RESET_WHATIF_TO_CURRENT' })
  const resetAll = () => dispatch({ type: 'RESET_ALL' })
  const setMonthlyPeriod = (period: MonthlyPeriodOption) => dispatch({ type: 'SET_MONTHLY_PERIOD', period })
  const setCustomDays = (days: number) => dispatch({ type: 'SET_CUSTOM_DAYS', days })
  const loadTemplate = (inputs: CalculatorInputs) => dispatch({ type: 'LOAD_TEMPLATE', inputs })

  const errors: FieldError[] = validateCalculatorInputs(state.inputs)

  return {
    state,
    errors,
    setInput,
    setWhatIf,
    resetWhatIfToCurrent,
    resetAll,
    setMonthlyPeriod,
    setCustomDays,
    loadTemplate,
  }
}
