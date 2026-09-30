import { useReducer } from 'react'
import { DEFAULT_CALCULATOR_INPUTS, type CalculatorInputs, type MonthlyPeriodOption } from '@/types/calculator'
import { validateCalculatorInputs, type FieldError } from '@/lib/validation/calculator'

export interface CalculatorState {
  inputs: CalculatorInputs
  monthlyPeriod: MonthlyPeriodOption
  customDays: number
}

type Action =
  | { type: 'SET_INPUT'; patch: Partial<CalculatorInputs> }
  | { type: 'RESET_ALL' }
  | { type: 'SET_MONTHLY_PERIOD'; period: MonthlyPeriodOption }
  | { type: 'SET_CUSTOM_DAYS'; days: number }
  | { type: 'LOAD_TEMPLATE'; inputs: CalculatorInputs }

function createInitialState(): CalculatorState {
  return {
    inputs: DEFAULT_CALCULATOR_INPUTS,
    monthlyPeriod: 30,
    customDays: 30,
  }
}

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, inputs: { ...state.inputs, ...action.patch } }
    case 'RESET_ALL':
      return createInitialState()
    case 'SET_MONTHLY_PERIOD':
      return { ...state, monthlyPeriod: action.period }
    case 'SET_CUSTOM_DAYS':
      return { ...state, customDays: Math.max(1, action.days) }
    case 'LOAD_TEMPLATE':
      return { ...state, inputs: action.inputs }
    default:
      return state
  }
}

export function useCalculatorState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  const setInput = (patch: Partial<CalculatorInputs>) => dispatch({ type: 'SET_INPUT', patch })
  const resetAll = () => dispatch({ type: 'RESET_ALL' })
  const setMonthlyPeriod = (period: MonthlyPeriodOption) => dispatch({ type: 'SET_MONTHLY_PERIOD', period })
  const setCustomDays = (days: number) => dispatch({ type: 'SET_CUSTOM_DAYS', days })
  const loadTemplate = (inputs: CalculatorInputs) => dispatch({ type: 'LOAD_TEMPLATE', inputs })

  const errors: FieldError[] = validateCalculatorInputs(state.inputs)

  return {
    state,
    errors,
    setInput,
    resetAll,
    setMonthlyPeriod,
    setCustomDays,
    loadTemplate,
  }
}
