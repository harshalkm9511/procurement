import { z } from 'zod';

const uuid = z.string().uuid();
const date = z.string().date();
const nonNegative = z.coerce.number().finite().min(0);
const score = nonNegative.max(100);
const currency = z.string().length(3).transform((value) => value.toUpperCase());

export const idParams = z.object({ id: uuid });
export const rfqSupplierParams = z.object({ id: uuid, supplierId: uuid });
export const paginationQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(25),
});

export const supplierStatuses = ['ACTIVE', 'PENDING', 'FLAGGED', 'INACTIVE'] as const;
export const riskLevels = ['LOW', 'MEDIUM', 'HIGH'] as const;
export const rfqStatuses = ['DRAFT', 'OPEN', 'IN_EVALUATION', 'AWARDED', 'CLOSED'] as const;
export const quotationStatuses = ['PENDING', 'SHORTLISTED', 'RECOMMENDED', 'ACCEPTED', 'REJECTED'] as const;
export const purchaseOrderStatuses = ['ISSUED', 'IN_TRANSIT', 'FULFILLED', 'CANCELLED'] as const;
export const inventoryStatuses = ['HEALTHY', 'LOW_STOCK', 'CRITICAL', 'OVERSTOCKED'] as const;

export const supplierBody = z.object({
  name: z.string().trim().min(1).max(255), category: z.string().trim().min(1).max(255),
  spend: nonNegative.default(0), performance: score.default(0), delivery_rate: score.default(0), quality_score: score.default(0),
  risk_score: score.default(0), risk_level: z.enum(riskLevels).default('LOW'), status: z.enum(supplierStatuses).default('PENDING'),
  location: z.string().trim().max(255).nullable().optional(), contact_email: z.string().email().nullable().optional(),
  contact_phone: z.string().trim().max(50).nullable().optional(), contract_expiry: date.nullable().optional(),
  financial_risk_score: score.default(0), delivery_risk_score: score.default(0), quality_risk_score: score.default(0),
  price_stability_score: score.default(0), risk_reason: z.string().trim().max(2000).nullable().optional(),
  recent_rfqs_count: z.coerce.number().int().min(0).default(0), lead_time_days: z.coerce.number().int().min(0).default(0), complaint_rate: score.default(0),
});
export const supplierPatchBody = supplierBody.partial();

export const rfqBody = z.object({
  reference_number: z.string().trim().min(1).max(100), title: z.string().trim().min(1).max(255), product: z.string().trim().min(1).max(255),
  category: z.string().trim().min(1).max(255), quantity: z.coerce.number().finite().positive(), unit: z.string().trim().min(1).max(50),
  target_price: nonNegative.nullable().optional(), currency: currency.default('USD'), deadline: date,
  status: z.enum(rfqStatuses).default('DRAFT'), delivery_date: date.nullable().optional(), description: z.string().trim().max(5000).nullable().optional(),
  department_id: uuid.nullable().optional(),
});
export const rfqPatchBody = rfqBody.omit({ reference_number: true }).partial();

export const rfqSupplierBody = z.object({ supplier_id: uuid });

export const quotationBody = z.object({
  rfq_id: uuid, supplier_id: uuid, unit_price: nonNegative, currency: currency.default('USD'), delivery_days: z.coerce.number().int().min(0),
  quality_rating: score.default(0), payment_terms: z.string().trim().max(255).nullable().optional(), risk_level: z.enum(riskLevels).default('LOW'),
  historical_performance: score.default(0), overall_score: score.nullable().optional(), status: z.enum(quotationStatuses).default('PENDING'),
  submitted_at: z.string().datetime({ offset: true }).optional(), notes: z.string().trim().max(5000).nullable().optional(),
});
export const quotationPatchBody = quotationBody.omit({ rfq_id: true, supplier_id: true }).partial();

export const purchaseOrderBody = z.object({
  reference_number: z.string().trim().min(1).max(100), rfq_id: uuid.nullable().optional(), quotation_id: uuid.nullable().optional(), supplier_id: uuid,
  product: z.string().trim().min(1).max(255), quantity: z.coerce.number().finite().positive(), unit: z.string().trim().min(1).max(50),
  total_amount: nonNegative, currency: currency.default('USD'), status: z.enum(purchaseOrderStatuses).default('ISSUED'), issue_date: date,
  expected_delivery_date: date.nullable().optional(),
});
export const purchaseOrderPatchBody = purchaseOrderBody.omit({ reference_number: true, rfq_id: true, quotation_id: true, supplier_id: true }).partial();

export const inventoryBody = z.object({
  product: z.string().trim().min(1).max(255), sku: z.string().trim().min(1).max(100), category: z.string().trim().min(1).max(255),
  current_stock: nonNegative.default(0), daily_demand: nonNegative.default(0), reorder_point: nonNegative.default(0), lead_time_days: z.coerce.number().int().min(0).default(0),
  status: z.enum(inventoryStatuses).default('HEALTHY'), unit_price: nonNegative.default(0), unit: z.string().trim().min(1).max(50),
  supplier_id: uuid.nullable().optional(), critical_days_left: z.coerce.number().int().min(0).nullable().optional(),
});
export const inventoryPatchBody = inventoryBody.omit({ sku: true, supplier_id: true }).partial();

export const assetBody = z.object({
  inventory_item_id: uuid.nullable().optional(), department_id: uuid.nullable().optional(), assigned_profile_id: uuid.nullable().optional(),
  asset_tag: z.string().trim().min(1).max(100), name: z.string().trim().min(1).max(255), category: z.string().trim().max(255).nullable().optional(),
  status: z.enum(['ACTIVE', 'IN_MAINTENANCE', 'RETIRED']).default('ACTIVE'), acquired_on: date.nullable().optional(), metadata: z.record(z.string(), z.unknown()).default({}),
});
export const assetPatchBody = assetBody.omit({ asset_tag: true, inventory_item_id: true, department_id: true, assigned_profile_id: true }).partial();

const spendRecordFields = z.object({
  period_start: date, period_end: date, category: z.string().trim().min(1).max(255), supplier_id: uuid.nullable().optional(),
  purchase_order_id: uuid.nullable().optional(), amount: nonNegative, currency: currency.default('USD'), savings_opportunity: nonNegative.default(0),
});
export const spendRecordBody = spendRecordFields.refine((value) => value.period_end >= value.period_start, { message: 'period_end must be on or after period_start', path: ['period_end'] });
export const spendRecordPatchBody = spendRecordFields.partial().refine(
  (value) => !value.period_start || !value.period_end || value.period_end >= value.period_start,
  { message: 'period_end must be on or after period_start', path: ['period_end'] },
);

export const supplierListQuery = paginationQuery.extend({ status: z.enum(supplierStatuses).optional(), risk_level: z.enum(riskLevels).optional(), category: z.string().trim().min(1).optional(), search: z.string().trim().min(1).max(100).optional() });
export const rfqListQuery = paginationQuery.extend({ status: z.enum(rfqStatuses).optional(), category: z.string().trim().min(1).optional() });
export const quotationListQuery = paginationQuery.extend({ status: z.enum(quotationStatuses).optional(), rfq_id: uuid.optional(), supplier_id: uuid.optional() });
export const purchaseOrderListQuery = paginationQuery.extend({ status: z.enum(purchaseOrderStatuses).optional(), rfq_id: uuid.optional(), supplier_id: uuid.optional() });
export const inventoryListQuery = paginationQuery.extend({ status: z.enum(inventoryStatuses).optional(), category: z.string().trim().min(1).optional(), supplier_id: uuid.optional() });
export const assetListQuery = paginationQuery.extend({ status: z.enum(['ACTIVE', 'IN_MAINTENANCE', 'RETIRED']).optional(), department_id: uuid.optional(), inventory_item_id: uuid.optional() });
export const spendRecordListQuery = paginationQuery.extend({ category: z.string().trim().min(1).optional(), supplier_id: uuid.optional(), period_start: date.optional(), period_end: date.optional() });
