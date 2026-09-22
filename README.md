# Profitly — Product Profitability Calculator

Smarter E-commerce Decisions. Calculate real product costs, profit and ROI for
e-commerce/COD businesses, with a live order funnel, break-even analysis,
target-profit solver and a what-if simulator.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Radix UI primitives (shadcn/ui-style components)
- Lucide React icons
- Framer Motion for subtle transitions
- React Router

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173/profitability-calculator`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run oxlint

## Project structure

```
src/
  components/
    layout/       AppShell, AppSidebar, AppHeader
    calculator/    all calculator sections (inputs, funnel, results, what-if…)
    ui/            reusable primitives (Button, Card, Slider, MetricCard…)
  lib/
    calculations/  profitability.ts — single source of truth for all math
    formatting/    currency/number formatting helpers
    validation/    input validation and empty-state helpers
    storage/       localStorage-backed template persistence
  hooks/
    useCalculatorState.ts — useReducer-based state for the calculator page
  pages/
  types/
```

## Calculation model

All product costs (purchase cost, confirmation fee, delivery cost) apply to
**delivered** orders only. Ad spend is the actual daily budget spent,
regardless of outcome. See `src/lib/calculations/profitability.ts` for the
full model — it's the only place these numbers are computed.
