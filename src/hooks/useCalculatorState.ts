import { useReducer } from 'react'
import { DEFAULT_CALCULATOR_INPUTS, type CalculatorInputs, type ResultsPeriod } from '@/types/calculator'
import { validateCalculatorInputs, type FieldError } from '@/lib/validation/calculator'

export interface CalculatorState {
  inputs: CalculatorInputs
  resultsPeriod: ResultsPeriod
  customDays: number
}

type Action =
  | { type: 'SET_INPUT'; patch: Partial<CalculatorInputs> }
  | { type: 'RESET_ALL' }
  | { type: 'SET_RESULTS_PERIOD'; period: ResultsPeriod }
  | { type: 'SET_CUSTOM_DAYS'; days: number }
  | { type: 'LOAD_TEMPLATE'; inputs: CalculatorInputs }

function createInitialState(): CalculatorState {
  return {
    inputs: DEFAULT_CALCULATOR_INPUTS,
    resultsPeriod: 'daily',
    customDays: 30,
  }
}

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, inputs: { ...state.inputs, ...action.patch } }
    case 'RESET_ALL':
      return createInitialState()
    case 'SET_RESULTS_PERIOD':
      return { ...state, resultsPeriod: action.period }
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
  const setResultsPeriod = (period: ResultsPeriod) => dispatch({ type: 'SET_RESULTS_PERIOD', period })
  const setCustomDays = (days: number) => dispatch({ type: 'SET_CUSTOM_DAYS', days })
  const loadTemplate = (inputs: CalculatorInputs) => dispatch({ type: 'LOAD_TEMPLATE', inputs })

  const errors: FieldError[] = validateCalculatorInputs(state.inputs)

  return {
    state,
    errors,
    setInput,
    resetAll,
    setResultsPeriod,
    setCustomDays,
    loadTemplate,
  }
}
