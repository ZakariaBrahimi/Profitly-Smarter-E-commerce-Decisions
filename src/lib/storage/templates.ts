import type { CalculatorInputs } from '@/types/calculator'

export interface CalculatorTemplate {
  id: string
  name: string
  description: string
  inputs: CalculatorInputs
  createdAt: string
}

const STORAGE_KEY = 'profitly.calculator-templates'

/**
 * localStorage-backed template store. Swap the bodies of these functions
 * for API calls once backend persistence exists — call sites don't change.
 */
export function listTemplates(): CalculatorTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CalculatorTemplate[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveTemplate(name: string, description: string, inputs: CalculatorInputs): CalculatorTemplate {
  const template: CalculatorTemplate = {
    id: crypto.randomUUID(),
    name,
    description,
    inputs,
    createdAt: new Date().toISOString(),
  }
  const templates = [template, ...listTemplates()]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
  return template
}

export function deleteTemplate(id: string): void {
  const templates = listTemplates().filter((t) => t.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}
