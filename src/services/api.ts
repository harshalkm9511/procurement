import type {
  InventoryItem,
  Asset,
  PurchaseOrder,
  Quotation,
  RFQ,
  SpendRecord,
  Supplier,
  RiskLevel,
  SupplierStatus,
  RFQStatus,
  QuotationStatus,
  InventoryStatus,
  POStatus,
} from '../types/procurement';
import {
  initialAssets,
  initialInventory,
  initialPurchaseOrders,
  initialQuotations,
  initialRFQs,
  initialSpendData,
  initialSuppliers,
} from '../data/mockData';
import { getSession } from './supabase';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface ApiListResult<T> {
  records: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

interface RawSupplier {
  id: string;
  name: string;
  category: string;
  spend: number;
  performance: number;
  delivery_rate: number;
  quality_score: number;
  risk_score: number;
  risk_level: string;
  status: string;
  location: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contract_expiry: string | null;
  financial_risk_score: number;
  delivery_risk_score: number;
  quality_risk_score: number;
  price_stability_score: number;
  risk_reason: string | null;
  recent_rfqs_count: number;
  lead_time_days: number;
  complaint_rate: number;
}

interface RawRfq {
  id: string;
  reference_number: string;
  title: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  target_price: number | null;
  currency: string;
  deadline: string;
  response_count: number;
  status: string;
  created_at: string;
  delivery_date: string | null;
  description: string | null;
  department_id: string | null;
}

interface RawRfqSupplier {
  supplier_id: string;
}

interface RawQuotation {
  id: string;
  rfq_id: string;
  supplier_id: string;
  unit_price: number;
  currency: string;
  delivery_days: number;
  quality_rating: number;
  payment_terms: string | null;
  risk_level: string;
  historical_performance: number;
  overall_score: number | null;
  status: string;
  submitted_at: string;
  notes: string | null;
}

interface RawPurchaseOrder {
  id: string;
  reference_number: string;
  rfq_id: string | null;
  supplier_id: string;
  product: string;
  quantity: number;
  unit: string;
  total_amount: number;
  status: string;
  issue_date: string;
  expected_delivery_date: string | null;
}

interface RawInventoryItem {
  id: string;
  product: string;
  sku: string;
  category: string;
  current_stock: number;
  daily_demand: number;
  reorder_point: number;
  lead_time_days: number;
  status: string;
  unit_price: number;
  unit: string;
  supplier_id: string | null;
  critical_days_left: number | null;
}

interface RawAsset {
  id: string;
  inventory_item_id: string | null;
  asset_tag: string;
  name: string;
  category: string | null;
  status: string;
  acquired_on: string | null;
}

interface RawSpendRecord {
  id: string;
  period_start: string;
  category: string;
  supplier_id: string | null;
  amount: number;
  savings_opportunity: number;
}

function asRiskLevel(value: string): RiskLevel {
  return value === 'HIGH' || value === 'MEDIUM' ? value : 'LOW';
}

function asSupplierStatus(value: string): SupplierStatus {
  return value === 'ACTIVE' || value === 'PENDING' || value === 'FLAGGED' ? value : 'INACTIVE';
}

function asRfqStatus(value: string): RFQStatus {
  return value === 'DRAFT' || value === 'OPEN' || value === 'IN_EVALUATION' || value === 'AWARDED' ? value : 'CLOSED';
}

function asQuotationStatus(value: string): QuotationStatus {
  return value === 'SHORTLISTED' || value === 'RECOMMENDED' || value === 'ACCEPTED' || value === 'REJECTED' ? value : 'PENDING';
}

function asInventoryStatus(value: string): InventoryStatus {
  return value === 'LOW_STOCK' || value === 'CRITICAL' || value === 'OVERSTOCKED' ? value : 'HEALTHY';
}

function asPoStatus(value: string): POStatus {
  return value === 'IN_TRANSIT' || value === 'FULFILLED' || value === 'CANCELLED' ? value : 'ISSUED';
}

function asRiskRating(value: string): Quotation['riskRating'] {
  const risk = asRiskLevel(value);
  return risk === 'HIGH' ? 'High' : risk === 'MEDIUM' ? 'Medium' : 'Low';
}

function mapSupplier(record: RawSupplier): Supplier {
  return {
    id: record.id,
    name: record.name,
    category: record.category,
    spend: Number(record.spend ?? 0),
    performance: Number(record.performance ?? 0),
    deliveryRate: Number(record.delivery_rate ?? 0),
    qualityScore: Number(record.quality_score ?? 0),
    riskScore: Number(record.risk_score ?? 0),
    riskLevel: asRiskLevel(record.risk_level),
    status: asSupplierStatus(record.status),
    location: record.location ?? '—',
    contactEmail: record.contact_email ?? '—',
    contactPhone: record.contact_phone ?? '—',
    contractExpiry: record.contract_expiry ?? '—',
    financialRiskScore: Number(record.financial_risk_score ?? 0),
    deliveryRiskScore: Number(record.delivery_risk_score ?? 0),
    qualityRiskScore: Number(record.quality_risk_score ?? 0),
    priceStabilityScore: Number(record.price_stability_score ?? 0),
    riskReason: record.risk_reason ?? 'No risk commentary available.',
    recentRFQsCount: Number(record.recent_rfqs_count ?? 0),
    leadTimeDays: Number(record.lead_time_days ?? 0),
    complaintRate: Number(record.complaint_rate ?? 0),
  };
}

function mapRfq(record: RawRfq, invitedSupplierIds: string[]): RFQ {
  return {
    id: record.id,
    title: record.title,
    product: record.product,
    category: record.category,
    quantity: Number(record.quantity),
    unit: record.unit,
    targetPrice: Number(record.target_price ?? 0),
    deadline: record.deadline,
    invitedSuppliersCount: invitedSupplierIds.length,
    responseCount: Number(record.response_count ?? 0),
    status: asRfqStatus(record.status),
    createdAt: record.created_at,
    deliveryDate: record.delivery_date ?? '—',
    description: record.description ?? '',
    invitedSupplierIds,
  };
}

function mapQuotation(record: RawQuotation, supplierNames: Map<string, string>): Quotation {
  return {
    id: record.id,
    rfqId: record.rfq_id,
    supplierId: record.supplier_id,
    supplierName: supplierNames.get(record.supplier_id) ?? record.supplier_id,
    price: Number(record.unit_price),
    currency: record.currency,
    deliveryDays: Number(record.delivery_days),
    qualityRating: Number(record.quality_rating ?? 0),
    paymentTerms: record.payment_terms ?? '—',
    riskRating: asRiskRating(record.risk_level),
    historicalPerformance: Number(record.historical_performance ?? 0),
    overallScore: Number(record.overall_score ?? 0),
    status: asQuotationStatus(record.status),
    submittedAt: record.submitted_at,
    notes: record.notes ?? '',
  };
}

function mapPurchaseOrder(record: RawPurchaseOrder, supplierNames: Map<string, string>): PurchaseOrder {
  return {
    id: record.reference_number || record.id,
    rfqId: record.rfq_id ?? undefined,
    supplierName: supplierNames.get(record.supplier_id) ?? record.supplier_id,
    product: record.product,
    quantity: Number(record.quantity),
    unit: record.unit,
    totalAmount: Number(record.total_amount),
    status: asPoStatus(record.status),
    issueDate: record.issue_date,
    expectedDeliveryDate: record.expected_delivery_date ?? '—',
  };
}

function mapInventoryItem(record: RawInventoryItem, supplierNames: Map<string, string>): InventoryItem {
  return {
    id: record.id,
    product: record.product,
    sku: record.sku,
    category: record.category,
    currentStock: Number(record.current_stock),
    dailyDemand: Number(record.daily_demand),
    reorderPoint: Number(record.reorder_point),
    leadTimeDays: Number(record.lead_time_days),
    status: asInventoryStatus(record.status),
    unitPrice: Number(record.unit_price),
    unit: record.unit,
    supplierName: record.supplier_id ? supplierNames.get(record.supplier_id) ?? record.supplier_id : '—',
    criticalDaysLeft: Number(record.critical_days_left ?? 0),
  };
}

function mapAsset(record: RawAsset): Asset {
  return {
    id: record.id,
    inventoryItemId: record.inventory_item_id ?? undefined,
    assetTag: record.asset_tag,
    name: record.name,
    category: record.category ?? 'Uncategorised',
    status: record.status === 'IN_MAINTENANCE' || record.status === 'RETIRED' ? record.status : 'ACTIVE',
    acquiredOn: record.acquired_on ?? undefined,
  };
}

function mapSpendRecords(records: RawSpendRecord[]): SpendRecord[] {
  const grouped = new Map<string, SpendRecord>();
  for (const record of records) {
    const month = record.period_start.slice(0, 7);
    const current = grouped.get(month) ?? { month, directMaterials: 0, logistics: 0, electronics: 0, mro: 0, packaging: 0, totalSpend: 0, savingsOpportunity: 0 };
    const amount = Number(record.amount ?? 0);
    const category = record.category.toLowerCase();
    if (category.includes('raw material')) current.directMaterials += amount;
    else if (category.includes('electronic')) current.electronics += amount;
    else if (category.includes('logistic')) current.logistics += amount;
    else if (category.includes('packaging')) current.packaging += amount;
    else current.mro += amount;
    current.totalSpend += amount;
    current.savingsOpportunity += Number(record.savings_opportunity ?? 0);
    grouped.set(month, current);
  }
  return Array.from(grouped.values()).sort((a, b) => a.month.localeCompare(b.month));
}

async function requestPage<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const session = await getSession();
  if (!session?.access_token) throw new ApiError(401, 'Authentication required', 'UNAUTHORIZED');
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`, ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => null) as ApiEnvelope<T> & { error?: { message?: string; code?: string } } | null;
  if (!response.ok) throw new ApiError(response.status, body?.error?.message ?? 'API request failed', body?.error?.code);
  if (!body?.success) throw new ApiError(response.status, 'API request failed');
  return body;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  return (await requestPage<T>(path, init)).data;
}

async function listAll<T>(path: string, query: Record<string, string | number | undefined> = {}): Promise<T[]> {
  const records: T[] = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...query, page, limit: 100 })) {
      if (value !== undefined) params.set(key, String(value));
    }
    const result = await requestPage<T[]>(`${path}?${params.toString()}`);
    records.push(...result.data);
    totalPages = result.meta?.totalPages ?? page;
    page += 1;
  }
  return records;
}

async function listAllOrEmpty<T>(path: string): Promise<T[]> {
  try {
    return await listAll<T>(path);
  } catch {
    return [];
  }
}

export interface Phase2Data {
  suppliers: Supplier[];
  rfqs: RFQ[];
  quotations: Quotation[];
  purchaseOrders: PurchaseOrder[];
  inventory: InventoryItem[];
  assets: Asset[];
  spendData: SpendRecord[];
}

export async function loadPhase2Data(): Promise<Phase2Data> {
  const [rawSuppliers, rawRfqs, rawQuotations, rawPurchaseOrders, rawInventory, rawAssets, rawSpend] = await Promise.all([
    listAllOrEmpty<RawSupplier>('/suppliers'),
    listAllOrEmpty<RawRfq>('/rfqs'),
    listAllOrEmpty<RawQuotation>('/quotations'),
    listAllOrEmpty<RawPurchaseOrder>('/purchase-orders'),
    listAllOrEmpty<RawInventoryItem>('/inventory'),
    listAllOrEmpty<RawAsset>('/assets'),
    listAllOrEmpty<RawSpendRecord>('/spend-records'),
  ]);
  const suppliers = rawSuppliers.length > 0 ? rawSuppliers.map(mapSupplier) : initialSuppliers;
  const supplierNames = new Map(suppliers.map((supplier) => [supplier.id, supplier.name]));
  let rfqs = initialRFQs;
  if (rawRfqs.length > 0) {
    const mappedRfqs: RFQ[] = [];
    for (const rfq of rawRfqs) {
      const mockRfq = initialRFQs.find((candidate) => candidate.id === rfq.id);
      const links = await listAllOrEmpty<RawRfqSupplier>(`/rfqs/${rfq.id}/suppliers`);
      const invitedSupplierIds = links.length > 0 ? links.map((link) => link.supplier_id) : mockRfq?.invitedSupplierIds ?? [];
      mappedRfqs.push(mapRfq(rfq, invitedSupplierIds));
    }
    rfqs = mappedRfqs;
  }
  return {
    suppliers,
    rfqs,
    quotations: rawQuotations.length > 0 ? rawQuotations.map((quotation) => mapQuotation(quotation, supplierNames)) : initialQuotations,
    purchaseOrders: rawPurchaseOrders.length > 0 ? rawPurchaseOrders.map((order) => mapPurchaseOrder(order, supplierNames)) : initialPurchaseOrders,
    inventory: rawInventory.length > 0 ? rawInventory.map((item) => mapInventoryItem(item, supplierNames)) : initialInventory,
    assets: rawAssets.length > 0 ? rawAssets.map(mapAsset) : initialAssets,
    spendData: rawSpend.length > 0 ? mapSpendRecords(rawSpend) : initialSpendData,
  };
}

export interface CreateRfqInput {
  title: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  targetPrice: number;
  deadline: string;
  deliveryDate: string;
  description: string;
  invitedSupplierIds: string[];
}

export async function createRfq(input: CreateRfqInput): Promise<RFQ> {
  const raw = await request<RawRfq>('/rfqs', {
    method: 'POST',
    body: JSON.stringify({
      reference_number: `RFQ-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}`,
      title: input.title,
      product: input.product,
      category: input.category,
      quantity: input.quantity,
      unit: input.unit,
      target_price: input.targetPrice,
      currency: 'INR',
      deadline: input.deadline,
      status: 'OPEN',
      delivery_date: input.deliveryDate,
      description: input.description,
    }),
  });
  await Promise.all(input.invitedSupplierIds.map((supplierId) => request<RawRfqSupplier>(`/rfqs/${raw.id}/suppliers`, {
    method: 'POST',
    body: JSON.stringify({ supplier_id: supplierId }),
  })));
  return mapRfq(raw, input.invitedSupplierIds);
}
