export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type SupplierStatus = 'ACTIVE' | 'PENDING' | 'FLAGGED' | 'INACTIVE';
export type RFQStatus = 'DRAFT' | 'OPEN' | 'IN_EVALUATION' | 'AWARDED' | 'CLOSED';
export type QuotationStatus = 'PENDING' | 'SHORTLISTED' | 'RECOMMENDED' | 'ACCEPTED' | 'REJECTED';
export type InventoryStatus = 'HEALTHY' | 'LOW_STOCK' | 'CRITICAL' | 'OVERSTOCKED';
export type POStatus = 'ISSUED' | 'IN_TRANSIT' | 'FULFILLED' | 'CANCELLED';
export type RecommendationCategory = 'COST_SAVING' | 'RISK' | 'PRICE' | 'INVENTORY' | 'SUPPLIER' | 'CONTRACT';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Supplier {
  id: string;
  name: string;
  category: string;
  spend: number;
  performance: number; // 0 - 100
  deliveryRate: number; // 0 - 100
  qualityScore: number; // 0 - 100
  riskScore: number; // 0 - 100 (Higher = higher risk)
  riskLevel: RiskLevel;
  status: SupplierStatus;
  location: string;
  contactEmail: string;
  contactPhone: string;
  contractExpiry: string;
  financialRiskScore: number;
  deliveryRiskScore: number;
  qualityRiskScore: number;
  priceStabilityScore: number;
  riskReason: string;
  recentRFQsCount: number;
  leadTimeDays: number;
  complaintRate: number;
}

export interface RFQ {
  id: string;
  title: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  targetPrice: number;
  deadline: string;
  invitedSuppliersCount: number;
  responseCount: number;
  status: RFQStatus;
  createdAt: string;
  deliveryDate: string;
  description: string;
  invitedSupplierIds: string[];
}

export interface Quotation {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  price: number;
  currency: string;
  deliveryDays: number;
  qualityRating: number; // %
  paymentTerms: string;
  riskRating: 'Low' | 'Medium' | 'High';
  historicalPerformance: number; // %
  overallScore: number; // %
  status: QuotationStatus;
  submittedAt: string;
  notes: string;
}

export interface PurchaseOrder {
  id: string;
  rfqId?: string;
  supplierName: string;
  product: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  status: POStatus;
  issueDate: string;
  expectedDeliveryDate: string;
}

export interface InventoryItem {
  id: string;
  product: string;
  sku: string;
  category: string;
  currentStock: number;
  dailyDemand: number;
  reorderPoint: number;
  leadTimeDays: number;
  status: InventoryStatus;
  unitPrice: number;
  unit: string;
  supplierName: string;
  criticalDaysLeft: number;
}

export interface Asset {
  id: string;
  inventoryItemId?: string;
  assetTag: string;
  name: string;
  category: string;
  status: 'ACTIVE' | 'IN_MAINTENANCE' | 'RETIRED';
  acquiredOn?: string;
}

export interface SpendRecord {
  month: string;
  directMaterials: number;
  logistics: number;
  electronics: number;
  mro: number;
  packaging: number;
  totalSpend: number;
  savingsOpportunity: number;
}

export interface PriceForecastPoint {
  date: string;
  price?: number;
  predictedPrice?: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface PriceForecast {
  material: 'Steel' | 'Copper' | 'Aluminum' | 'Electronic Components' | 'Plastic';
  currentPrice: number;
  unit: string;
  forecast30Day: number;
  expectedChangePercent: number;
  confidencePercent: number;
  aiRecommendation: string;
  historicalData: PriceForecastPoint[];
  forecastData: PriceForecastPoint[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  category: RecommendationCategory;
  description: string;
  potentialImpact: string;
  savingsAmount?: number;
  confidencePercent: number;
  priority: PriorityLevel;
  recommendedAction: string;
  actionType: 'NAVIGATE_SUPPLIER' | 'CREATE_RFQ' | 'EVALUATE_QUOTE' | 'REORDER_INVENTORY' | 'PURCHASE_PLAN';
  targetId?: string;
  status: 'ACTIVE' | 'DISMISSED' | 'APPLIED';
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'RISK' | 'QUOTE' | 'PRICE' | 'INVENTORY' | 'SAVINGS';
  isRead: boolean;
  targetPage?: string;
  targetId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  department: string;
  organization: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: string[];
  dataTable?: {
    headers: string[];
    rows: (string | number)[][];
  };
  actionLink?: {
    label: string;
    page: string;
    targetId?: string;
  };
}

export interface ScoringWeights {
  price: number; // e.g. 30
  quality: number; // e.g. 25
  delivery: number; // e.g. 20
  risk: number; // e.g. 15
  performance: number; // e.g. 10
}
