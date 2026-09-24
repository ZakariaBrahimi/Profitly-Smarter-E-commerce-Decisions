import { useReducer } from 'react'
import type { PricingInputs, RoundingStrategy } from '@/lib/calculations/pricing'
import { DEFAULT_PRICING_INPUTS, DEFAULT_ROUNDING_STRATEGY } from '@/types/pricing'

export interface PricingState {
  inputs: PricingInputs
  roundingStrategy: RoundingStrategy
}

type Action =
  | { type: 'SET_INPUT'; patch: Partial<PricingInputs> }
  | { type: 'SET_ROUNDING'; strategy: RoundingStrategy }
  | { type: 'LOAD_PRESET'; inputs: PricingInputs }
  | { type: 'SET_CPA'; cpaUsd: number }
  | { type: 'RESET' }

function createInitialState(): PricingState {
  return {
    inputs: DEFAULT_PRICING_INPUTS,
    roundingStrategy: DEFAULT_ROUNDING_STRATEGY,
  }
}

function reducer(state: PricingState, action: Action): PricingState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, inputs: { ...state.inputs, ...action.patch } }
    case 'SET_ROUNDING':
      return { ...state, roundingStrategy: action.strategy }
    case 'LOAD_PRESET':
      return { ...state, inputs: action.inputs }
    case 'SET_CPA':
      return { ...state, inputs: { ...state.inputs, adCostUsd: action.cpaUsd } }
    case 'RESET':
      return createInitialState()
    default:
      return state
  }
}

export function usePricingState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)

  const setInput = (patch: Partial<PricingInputs>) => dispatch({ type: 'SET_INPUT', patch })
  const setRounding = (strategy: RoundingStrategy) => dispatch({ type: 'SET_ROUNDING', strategy })
  const loadPreset = (inputs: PricingInputs) => dispatch({ type: 'LOAD_PRESET', inputs })
  const setCpa = (cpaUsd: number) => dispatch({ type: 'SET_CPA', cpaUsd })
  const reset = () => dispatch({ type: 'RESET' })

  return { state, setInput, setRounding, loadPreset, setCpa, reset }
}
