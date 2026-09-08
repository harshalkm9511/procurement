import React from 'react';
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
  const { isAuthenticated, activePage } = useProcurement();

  if (!isAuthenticated) {
    return <AuthViews />;
  }

  const renderView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'suppliers':
        return <SuppliersView />;
      case 'rfqs':
        return <RFQsView />;
      case 'quotations':
        return <QuotationComparisonView />;
      case 'orders':
        return <PurchaseOrdersView />;
      case 'inventory':
        return <InventoryView />;
      case 'spend':
        return <SpendAnalyticsView />;
      case 'recommendations':
        return <AIRecommendationsView />;
      case 'risk':
        return <SupplierRiskView />;
      case 'forecast':
        return <PriceForecastView />;
      case 'assistant':
        return <AIAssistantView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return <AppLayout>{renderView()}</AppLayout>;
};

export default function App() {
  return (
    <ProcurementProvider>
      <MainContent />
    </ProcurementProvider>
  );
}
