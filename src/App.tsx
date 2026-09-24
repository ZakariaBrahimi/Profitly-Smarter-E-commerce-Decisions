import { Navigate, Route, Routes } from 'react-router-dom'
import { ProfitabilityCalculatorPage } from '@/pages/ProfitabilityCalculatorPage'
import { PricingCalculatorPage } from '@/pages/PricingCalculatorPage'
import { ComingSoonPage } from '@/pages/ComingSoonPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profitability-calculator" replace />} />
      <Route path="/profitability-calculator" element={<ProfitabilityCalculatorPage />} />
      <Route path="/pricing-calculator" element={<PricingCalculatorPage />} />
      <Route path="/dashboard" element={<ComingSoonPage title="Dashboard" />} />
      <Route path="/products" element={<ComingSoonPage title="Products" />} />
      <Route path="/campaigns" element={<ComingSoonPage title="Campaigns" />} />
      <Route path="/orders" element={<ComingSoonPage title="Orders" />} />
      <Route path="/reports" element={<ComingSoonPage title="Reports" />} />
      <Route path="/settings" element={<ComingSoonPage title="Settings" />} />
      <Route path="*" element={<Navigate to="/profitability-calculator" replace />} />
    </Routes>
  )
}

export default App
