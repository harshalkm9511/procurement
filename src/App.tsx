import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProcurementProvider, useProcurement } from './context/ProcurementContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthViews } from './components/auth/AuthViews';

import { DashboardView } from './components/dashboard/DashboardView';
import { SuppliersView } from './components/suppliers/SuppliersView';
import { RFQsView } from './components/rfq/RFQsView';
import { QuotationComparisonView } from './components/rfq/QuotationComparisonView';
import { PurchaseOrdersView } from './components/orders/PurchaseOrdersView';
import { InventoryView } from './components/inventory/InventoryView';
import { SpendAnalyticsView } from './components/spend/SpendAnalyticsView';
import { AIRecommendationsView } from './components/intelligence/AIRecommendationsView';
import { SupplierRiskView } from './components/risk/SupplierRiskView';
import { PriceForecastView } from './components/forecast/PriceForecastView';
import { AIAssistantView } from './components/intelligence/AIAssistantView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { isAuthenticated, isDataLoading, apiError, retryPhase2Data } = useProcurement();

  if (!isAuthenticated) {
    return <AuthViews />;
  }

  return (
    <AppLayout>
      {(isDataLoading || apiError) && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-xs text-slate-300">
          <span>{isDataLoading ? 'Loading procurement data…' : apiError}</span>
          {!isDataLoading && apiError && <button className="font-semibold text-cyan-300 hover:text-cyan-200" onClick={() => void retryPhase2Data()}>Retry</button>}
        </div>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/suppliers" element={<SuppliersView />} />
        <Route path="/rfqs" element={<RFQsView />} />
        <Route path="/quotations" element={<QuotationComparisonView />} />
        <Route path="/orders" element={<PurchaseOrdersView />} />
        <Route path="/inventory" element={<InventoryView />} />
        <Route path="/spend" element={<SpendAnalyticsView />} />
        <Route path="/recommendations" element={<AIRecommendationsView />} />
        <Route path="/risk" element={<SupplierRiskView />} />
        <Route path="/forecast" element={<PriceForecastView />} />
        <Route path="/assistant" element={<AIAssistantView />} />
        <Route path="/reports" element={<ReportsView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ProcurementProvider>
        <MainContent />
      </ProcurementProvider>
    </BrowserRouter>
  );
}
