-- ProcureAI comprehensive demo expansion for the existing Phase 1/2 schema.
-- It is additive, deterministic, transaction-safe, and safe to rerun.
-- It uses the verified Auth user UUID and never creates Auth users or credentials.

begin;

insert into public.organizations (id, name)
values ('00000000-0000-0000-0000-000000000001', 'Bharat Precision Systems Pvt. Ltd.')
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from auth.users where id = 'ce0500ee-936c-4554-bfad-c8657c188c84'::uuid
  ) then
    raise exception 'Verified demo Auth user ce0500ee-936c-4554-bfad-c8657c188c84 is unavailable';
  end if;

  update public.profiles
  set organization_id = '00000000-0000-0000-0000-000000000001',
      full_name = 'Harshal Mahajan',
      role = 'admin'::public.organization_role,
      updated_at = now()
  where id = 'ce0500ee-936c-4554-bfad-c8657c188c84'::uuid;

  if not found then
    insert into public.profiles (id, organization_id, department_id, full_name, role)
    values (
      'ce0500ee-936c-4554-bfad-c8657c188c84',
      '00000000-0000-0000-0000-000000000001',
      '10000000-0000-0000-0000-000000000001',
      'Harshal Mahajan',
      'admin'::public.organization_role
    );
  end if;
end;
$$;

-- Thirty additional suppliers, including GPU, server, networking, software,
-- facilities, and manufacturing vendors. Existing Phase 1/2 suppliers remain untouched.
insert into public.suppliers (
  id, organization_id, name, category, spend, performance, delivery_rate, quality_score,
  risk_score, risk_level, status, location, contact_email, contact_phone, contract_expiry,
  financial_risk_score, delivery_risk_score, quality_risk_score, price_stability_score,
  risk_reason, recent_rfqs_count, lead_time_days, complaint_rate
)
select
  ('21000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  (array[
    'Narmada Compute Systems', 'Saffron Network Works', 'Indus Cloud Hardware',
    'Vidarbha Office Systems', 'Konkan Industrial Gases', 'Ganga Software Services',
    'Malabar Safety Equipment', 'Aravali Server Technologies', 'Krishna Cable Networks',
    'Eastern Power Controls'
  ])[1 + ((i - 1) % 10)] || ' ' || lpad(i::text, 2, '0'),
  (array[
    'IT Hardware & Compute', 'Networking & Security', 'Software & Services',
    'Office Equipment', 'Industrial Automation', 'Facilities & Data Centre',
    'Safety & Compliance', 'Raw Materials & Metals', 'Logistics & Packaging',
    'MRO & Engineering Services'
  ])[1 + ((i - 1) % 10)],
  (850000 + i * 137500)::numeric,
  (76 + (i % 22))::numeric,
  (74 + (i % 25))::numeric,
  (78 + (i % 20))::numeric,
  (case when i % 7 in (0, 1) then 78 + (i % 18) when i % 3 = 0 then 52 + (i % 20) else 18 + (i % 30) end)::numeric,
  (case when i % 7 in (0, 1) then 'HIGH' when i % 3 = 0 then 'MEDIUM' else 'LOW' end)::public.risk_level,
  (case when i % 11 = 0 then 'FLAGGED' when i % 13 = 0 then 'PENDING' else 'ACTIVE' end)::public.supplier_status,
  (array[
    'Pune, Maharashtra', 'Bengaluru, Karnataka', 'Hyderabad, Telangana',
    'Chennai, Tamil Nadu', 'Noida, Uttar Pradesh', 'Mumbai, Maharashtra',
    'Ahmedabad, Gujarat', 'Gurugram, Haryana', 'Kolkata, West Bengal', 'Jaipur, Rajasthan'
  ])[1 + ((i - 1) % 10)],
  'demo.supplier' || lpad(i::text, 2, '0') || '@example.invalid',
  '+91-80-4100-' || lpad(i::text, 4, '0'),
  (date '2027-01-31' + ((i % 18) * interval '31 days'))::date,
  (15 + (i % 50))::numeric,
  (20 + (i * 3 % 55))::numeric,
  (12 + (i * 5 % 45))::numeric,
  (70 + (i % 28))::numeric,
  case when i % 7 in (0, 1) then 'Elevated delivery or solvency variance requires quarterly review.' else 'Routine scorecard monitoring; no material exception recorded.' end,
  2 + (i % 8),
  5 + (i % 30),
  (1 + (i % 8))::numeric
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

update public.suppliers
set risk_score = case when right(id::text, 2)::integer % 7 in (0, 1) then 78 + (right(id::text, 2)::integer % 18) when right(id::text, 2)::integer % 3 = 0 then 52 + (right(id::text, 2)::integer % 20) else 18 + (right(id::text, 2)::integer % 30) end,
    updated_at = now()
where organization_id = '00000000-0000-0000-0000-000000000001'
  and id >= '21000000-0000-0000-0000-000000000001'::uuid
  and id <= '21000000-0000-0000-0000-000000000030'::uuid;

-- Thirty RFQs covering the procurement workflows, with a GPU/server capacity scenario.
insert into public.rfqs (
  id, organization_id, reference_number, title, product, category, quantity, unit,
  target_price, currency, deadline, response_count, status, delivery_date, description,
  created_by, department_id
)
select
  ('31000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  'RFQ-DEMO-' || lpad((10 + i)::text, 3, '0'),
  (array[
    'GPU server cluster expansion', 'Business laptop refresh', 'Zero-trust network upgrade',
    'ERP support services', 'Warehouse barcode scanners', '316L precision assemblies',
    'Liquid cooling retrofit', 'Industrial PLC controllers', 'Office workstation seating',
    'Preventive maintenance kits'
  ])[1 + ((i - 1) % 10)],
  (array[
    'GPU compute servers', 'Enterprise laptops', 'Firewall and switching equipment',
    'ERP managed services', 'Barcode scanner fleet', '316L stainless steel assemblies',
    'Rack liquid-cooling distribution units', 'PLC controller kits', 'Ergonomic office equipment',
    'MRO calibration kits'
  ])[1 + ((i - 1) % 10)],
  (array[
    'IT Hardware & Compute', 'IT Hardware & Compute', 'Networking & Security',
    'Software & Services', 'Warehouse Operations', 'Raw Materials & Metals',
    'Facilities & Data Centre', 'Electronic Components', 'Office Equipment',
    'MRO & Engineering Services'
  ])[1 + ((i - 1) % 10)],
  (case when i % 10 = 1 then 6 else 20 + (i % 180) end)::numeric,
  (array['servers', 'laptops', 'units', 'months', 'scanners', 'assemblies', 'units', 'kits', 'sets', 'kits'])[1 + ((i - 1) % 10)],
  (case when i % 10 = 1 then 18500000 else 125000 + i * 17500 end)::numeric,
  'INR',
  (date '2026-10-01' + ((i % 28) * interval '1 day'))::date,
  1 + (i % 4),
  (case when i % 9 = 0 then 'AWARDED' when i % 5 = 0 then 'IN_EVALUATION' when i % 7 = 0 then 'DRAFT' else 'OPEN' end)::public.rfq_status,
  (date '2026-10-25' + ((i % 25) * interval '1 day'))::date,
  case when i % 10 = 1 then 'GPU cluster expansion for simulation workloads; reuse available nodes before buying additional H100-class capacity.' else 'Competitive sourcing event for the operating plan and approved department demand.' end,
  'ce0500ee-936c-4554-bfad-c8657c188c84',
  ('10000000-0000-0000-0000-' || lpad((1 + ((i - 1) % 3))::text, 12, '0'))::uuid
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

-- Three invited suppliers and three quotations per RFQ.
insert into public.rfq_suppliers (id, organization_id, rfq_id, supplier_id, invited_at, responded_at)
select
  ('41000000-0000-0000-0000-' || lpad(((i - 1) * 3 + supplier_slot + 1)::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  ('31000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  ('21000000-0000-0000-0000-' || lpad((((i + supplier_slot - 1) % 30) + 1)::text, 12, '0'))::uuid,
  (timestamptz '2026-09-10 09:00:00+00' + (i * interval '1 day')),
  case when supplier_slot = 2 then null else (timestamptz '2026-09-15 10:00:00+00' + (i * interval '1 day')) end
from generate_series(1, 30) as series(i)
cross join generate_series(0, 2) as slots(supplier_slot)
on conflict (id) do nothing;

insert into public.quotations (
  id, organization_id, rfq_id, supplier_id, unit_price, currency, delivery_days,
  quality_rating, payment_terms, risk_level, historical_performance, overall_score,
  status, submitted_at, notes
)
select
  ('51000000-0000-0000-0000-' || lpad(((i - 1) * 3 + supplier_slot + 1)::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  ('31000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  ('21000000-0000-0000-0000-' || lpad((((i + supplier_slot - 1) % 30) + 1)::text, 12, '0'))::uuid,
  (case when i % 10 = 1 then 17200000 + supplier_slot * 350000 else 120000 + i * 4100 + supplier_slot * 8500 end)::numeric,
  'INR',
  12 + ((i + supplier_slot * 5) % 35),
  (82 + ((i + supplier_slot) % 17))::numeric,
  (array['Net 30', 'Net 45', 'Net 60'])[1 + (supplier_slot % 3)],
  (case when (i + supplier_slot) % 8 = 0 then 'HIGH' when (i + supplier_slot) % 3 = 0 then 'MEDIUM' else 'LOW' end)::public.risk_level,
  (78 + ((i * 2 + supplier_slot) % 20))::numeric,
  (79 + ((i * 3 + supplier_slot * 4) % 20))::numeric,
  (case when supplier_slot = 0 then 'SHORTLISTED' when supplier_slot = 1 then 'PENDING' else 'RECOMMENDED' end)::public.quotation_status,
  timestamptz '2026-09-12 10:00:00+00' + ((i + supplier_slot) * interval '1 day'),
  case when i % 10 = 1 then 'GPU/server quote includes warranty, on-site support, and rack power assessment.' else 'Commercially valid quote with delivery and quality evidence attached.' end
from generate_series(1, 30) as series(i)
cross join generate_series(0, 2) as slots(supplier_slot)
on conflict (id) do nothing;

insert into public.purchase_orders (
  id, organization_id, reference_number, rfq_id, quotation_id, supplier_id, product,
  quantity, unit, total_amount, currency, status, issue_date, expected_delivery_date
)
select
  ('61000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  'PO-DEMO-' || lpad((10 + i)::text, 3, '0'),
  ('31000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  ('51000000-0000-0000-0000-' || lpad(((i - 1) * 3 + 1)::text, 12, '0'))::uuid,
  ('21000000-0000-0000-0000-' || lpad((((i - 1) % 30) + 1)::text, 12, '0'))::uuid,
  (array['GPU compute servers', 'Enterprise laptops', 'Firewall and switching equipment', 'ERP managed services', 'Barcode scanner fleet'])[1 + ((i - 1) % 5)],
  (case when i % 10 = 1 then 6 else 5 + (i % 80) end)::numeric,
  (array['servers', 'laptops', 'units', 'months', 'scanners'])[1 + ((i - 1) % 5)],
  (case when i % 10 = 1 then 17200000 else 180000 + i * 13500 end)::numeric,
  'INR',
  (case when i % 6 = 0 then 'FULFILLED' when i % 4 = 0 then 'IN_TRANSIT' else 'ISSUED' end)::public.purchase_order_status,
  (date '2026-08-01' + ((i - 1) * interval '2 days'))::date,
  (date '2026-09-15' + ((i - 1) * interval '2 days'))::date
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.inventory_items (
  id, organization_id, product, sku, category, current_stock, daily_demand,
  reorder_point, lead_time_days, status, unit_price, unit, supplier_id, critical_days_left
)
select
  ('71000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  (array['GPU compute server nodes', 'Business laptops', 'Firewall appliances', 'Barcode scanners', 'PLC controllers', 'ESD shipping containers'])[1 + ((i - 1) % 6)] || ' ' || lpad(i::text, 2, '0'),
  'DEMO-SKU-' || lpad(i::text, 3, '0'),
  (array['IT Hardware & Compute', 'IT Hardware & Compute', 'Networking & Security', 'Warehouse Operations', 'Electronic Components', 'Logistics & Packaging'])[1 + ((i - 1) % 6)],
  (10 + (i * 7 % 280))::numeric,
  (1 + (i % 24))::numeric,
  (20 + (i * 5 % 120))::numeric,
  5 + (i % 35),
  (case when i % 9 = 0 then 'CRITICAL' when i % 4 = 0 then 'LOW_STOCK' when i % 7 = 0 then 'OVERSTOCKED' else 'HEALTHY' end)::public.inventory_status,
  (case when i % 6 = 1 then 2850000 else 3500 + i * 1250 end)::numeric,
  (array['nodes', 'units', 'units', 'units', 'kits', 'units'])[1 + ((i - 1) % 6)],
  ('21000000-0000-0000-0000-' || lpad((((i - 1) % 30) + 1)::text, 12, '0'))::uuid,
  case when i % 9 = 0 then 4 + (i % 6) else 15 + (i % 45) end
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.assets (
  id, organization_id, inventory_item_id, asset_tag, name, category, status, acquired_on,
  metadata, department_id, assigned_profile_id
)
select
  ('81000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  ('71000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  'ASSET-DEMO-' || lpad(i::text, 3, '0'),
  (array['GPU server node', 'Engineering laptop', 'Firewall appliance', 'Warehouse scanner', 'PLC controller', 'Cooling monitor'])[1 + ((i - 1) % 6)] || ' ' || lpad(i::text, 2, '0'),
  (array['High-performance compute', 'End-user computing', 'Network security', 'Warehouse automation', 'Industrial controls', 'Data-centre facilities'])[1 + ((i - 1) % 6)],
  (case when i % 11 = 0 then 'IN_MAINTENANCE' when i % 17 = 0 then 'RETIRED' else 'ACTIVE' end),
  (date '2024-01-15' + ((i - 1) * interval '19 days'))::date,
  jsonb_build_object('serial', 'BPS-DEMO-' || lpad(i::text, 4, '0'), 'location', (array['Pune R&D lab', 'Bengaluru engineering lab', 'Noida data hall', 'Chennai plant'])[1 + ((i - 1) % 4)], 'utilization_percent', 28 + (i % 61)),
  ('10000000-0000-0000-0000-' || lpad((1 + ((i - 1) % 3))::text, 12, '0'))::uuid,
  'ce0500ee-936c-4554-bfad-c8657c188c84'
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.spend_records (
  id, organization_id, period_start, period_end, category, supplier_id, purchase_order_id,
  amount, currency, savings_opportunity
)
select
  ('91000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  (date '2024-04-01' + ((i - 1) * interval '30 days'))::date,
  (date '2024-04-01' + ((i - 1) * interval '30 days') + interval '29 days')::date,
  (array['IT Hardware & Compute', 'Electronic Components', 'Raw Materials & Metals', 'Logistics & Packaging', 'MRO & Engineering Services', 'Facilities & Data Centre'])[1 + ((i - 1) % 6)],
  ('21000000-0000-0000-0000-' || lpad((((i - 1) % 30) + 1)::text, 12, '0'))::uuid,
  ('61000000-0000-0000-0000-' || lpad((((i - 1) % 30) + 1)::text, 12, '0'))::uuid,
  (450000 + i * 83500)::numeric,
  'INR',
  (15000 + i * 2400)::numeric
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.historical_data (
  id, organization_id, data_type, subject, observed_on, value, unit, source, metadata
)
select
  ('a1000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  (array['procurement_price', 'asset_utilization', 'inventory_consumption', 'delivery_performance', 'requirement_context'])[1 + ((i - 1) % 5)],
  (array['GPU compute server nodes', 'Business laptops', '316L stainless steel assemblies', 'Bharat Components & Controls', 'GPU cluster capacity'])[1 + ((i - 1) % 5)],
  (date '2024-05-01' + ((i - 1) * interval '30 days'))::date,
  (18 + i * 2.75)::numeric,
  (array['INR/unit', 'percent', 'units/day', 'percent_on_time', 'active_nodes'])[1 + ((i - 1) % 5)],
  (array['approved_purchase_history', 'internal_asset_register', 'warehouse_issue_history', 'supplier_scorecard', 'engineering_capacity_register'])[1 + ((i - 1) % 5)],
  jsonb_build_object('period_index', i, 'scenario', case when i % 5 = 0 then 'GPU-capacity-review' else 'operational-baseline' end)
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.supplier_risk_assessments (
  id, organization_id, supplier_id, risk_score, risk_level, financial_risk_score,
  delivery_risk_score, quality_risk_score, reason, assessed_at
)
select
  ('a2000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  ('21000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  (case when i % 7 in (0, 1) then 78 + (i % 18) when i % 3 = 0 then 52 + (i % 20) else 18 + (i % 30) end)::numeric,
  (case when i % 7 in (0, 1) then 'HIGH' when i % 3 = 0 then 'MEDIUM' else 'LOW' end)::public.risk_level,
  (18 + (i * 5 % 75))::numeric,
  (22 + (i * 3 % 70))::numeric,
  (12 + (i * 4 % 78))::numeric,
  case when i % 7 in (0, 1) then 'Review concentration, delivery variance, and financial resilience before award.' else 'Routine supplier assessment based on scorecard, quality, and delivery evidence.' end,
  timestamptz '2026-09-01 08:00:00+00' + (i * interval '1 day')
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

update public.supplier_risk_assessments
set risk_score = case when right(id::text, 2)::integer % 7 in (0, 1) then 78 + (right(id::text, 2)::integer % 18) when right(id::text, 2)::integer % 3 = 0 then 52 + (right(id::text, 2)::integer % 20) else 18 + (right(id::text, 2)::integer % 30) end
where organization_id = '00000000-0000-0000-0000-000000000001'
  and id >= 'a2000000-0000-0000-0000-000000000001'::uuid
  and id <= 'a2000000-0000-0000-0000-000000000030'::uuid;

insert into public.price_forecasts (
  id, organization_id, material, current_price, forecast_price, unit, forecast_date,
  confidence_percent, recommendation, historical_points, forecast_points
)
select
  ('a3000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  (array['GPU server node', '316L stainless steel', 'Copper cable', 'Aluminium sheet', 'Diesel logistics', 'Industrial sensors'])[1 + ((i - 1) % 6)],
  (4200 + i * 375)::numeric,
  (4550 + i * 410)::numeric,
  (array['INR/node-hour', 'INR/kg', 'INR/kg', 'INR/kg', 'INR/litre', 'INR/unit'])[1 + ((i - 1) % 6)],
  (date '2026-10-15' + ((i - 1) * interval '3 days'))::date,
  (78 + (i % 19))::numeric,
  case when i % 6 = 1 then 'Stage GPU capacity purchases against utilization and power availability.' when i % 4 = 0 then 'Lock a partial quantity this month to reduce price volatility.' else 'Monitor the next two supplier quotes before committing the balance.' end,
  jsonb_build_array(jsonb_build_object('date', '2026-08-01', 'price', 3900 + i * 300), jsonb_build_object('date', '2026-09-01', 'price', 4200 + i * 375)),
  jsonb_build_array(jsonb_build_object('date', '2026-10-15', 'price', 4350 + i * 390), jsonb_build_object('date', '2026-11-15', 'price', 4550 + i * 410))
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.ai_recommendations (
  id, organization_id, title, category, description, potential_impact, savings_amount,
  confidence_percent, priority, recommended_action, action_type, target_type, target_id, status
)
select
  ('a4000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  (array['Consolidate GPU server support', 'Renegotiate laptop warranty', 'Dual-source network hardware', 'Reuse available compute nodes', 'Bundle MRO demand', 'Optimize cooling capacity'])[1 + ((i - 1) % 6)] || ' ' || lpad(i::text, 2, '0'),
  (array['COST_OPTIMIZATION', 'RISK', 'SUPPLIER', 'ASSET_REUSE', 'INVENTORY', 'SUSTAINABILITY'])[1 + ((i - 1) % 6)],
  case when i % 6 = 4 then 'Existing GPU capacity can cover part of the request before new server purchase.' else 'Use current supplier, spend, delivery, and historical evidence to improve the next sourcing decision.' end,
  case when i % 6 = 4 then 'Avoid unnecessary capital expenditure and reduce lead-time exposure.' else 'Reduce total landed cost while preserving service and quality controls.' end,
  (25000 + i * 3750)::numeric,
  (76 + (i % 22))::numeric,
  (case when i % 5 = 0 then 'HIGH' when i % 2 = 0 then 'MEDIUM' else 'LOW' end)::public.priority_level,
  case when i % 6 = 4 then 'Review asset utilization and reuse options before issuing a purchase order.' else 'Compare qualified suppliers and request a refreshed commercial proposal.' end,
  (array['EVALUATE_QUOTE', 'NAVIGATE_SUPPLIER', 'CREATE_RFQ', 'REUSE_ASSET', 'REORDER_INVENTORY', 'PURCHASE_PLAN'])[1 + ((i - 1) % 6)],
  (array['supplier', 'supplier', 'rfq', 'asset', 'inventory_item', 'price_forecast'])[1 + ((i - 1) % 6)],
  case when i % 6 in (1, 2) then ('21000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 3 then ('31000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 4 then ('81000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 5 then ('71000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid else ('a3000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid end,
  'ACTIVE'
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.requirement_validations (
  id, organization_id, submitted_by, requirement, status, result
)
select
  ('a5000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  'ce0500ee-936c-4554-bfad-c8657c188c84',
  case when i % 6 = 1 then 'Six GPU server nodes for simulation workloads' else 'Department procurement requirement ' || lpad(i::text, 2, '0') end,
  (case when i % 7 = 0 then 'NEEDS_REVIEW' when i % 4 = 0 then 'VALID' when i % 5 = 0 then 'INVALID' else 'PENDING' end),
  jsonb_build_object('evidence', jsonb_build_array('department request', 'capacity register', 'historical spend'), 'existing_assets_checked', (i % 4), 'recommended_action', case when i % 6 = 1 then 'REUSE_AND_BUY' else 'BUY' end)
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.dependency_definitions (
  id, organization_id, source_type, source_id, target_type, target_id, relationship_type, metadata
)
select
  ('a6000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  (array['requirement_validation', 'rfq', 'purchase_order', 'asset', 'inventory_item', 'supplier'])[1 + ((i - 1) % 6)],
  case when i % 6 = 1 then ('a5000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 2 then ('31000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 3 then ('61000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 4 then ('81000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 5 then ('71000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid else ('21000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid end,
  (array['asset', 'supplier', 'inventory_item', 'purchase_order', 'requirement_validation', 'rfq'])[1 + ((i - 1) % 6)],
  case when i % 6 = 1 then ('81000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 2 then ('21000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 3 then ('71000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 4 then ('61000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 5 then ('a5000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid else ('31000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid end,
  (array['requires', 'qualified_by', 'consumes', 'fulfills', 'evidenced_by', 'supports'])[1 + ((i - 1) % 6)],
  jsonb_build_object('criticality', case when i % 6 = 1 then 'HIGH' else 'MEDIUM' end, 'review_cycle_days', 30 + i)
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.decision_simulations (
  id, organization_id, created_by, name, description, status, input_data, result_data
)
select
  ('a7000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  'ce0500ee-936c-4554-bfad-c8657c188c84',
  case when i % 6 = 1 then 'GPU capacity sourcing simulation ' || lpad(i::text, 2, '0') else 'Procurement policy simulation ' || lpad(i::text, 2, '0') end,
  'Compare sourcing, reuse, timing, and quantity decisions against cost, risk, and capacity constraints.',
  (case when i % 5 = 0 then 'COMPLETED' when i % 3 = 0 then 'READY' else 'DRAFT' end),
  jsonb_build_object('rfq_id', ('31000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid, 'supplier_count', 3, 'currency', 'INR'),
  jsonb_build_object('recommended_scenario', case when i % 6 = 1 then 'REUSE_AND_BUY' else 'BUY' end, 'estimated_savings_inr', 45000 + i * 2500)
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.simulation_scenarios (
  id, organization_id, simulation_id, name, assumptions, outcome
)
select
  ('a8000000-0000-0000-0000-' || lpad(((i - 1) * 6 + scenario_no)::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  ('a7000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  (array['BUY', 'REUSE', 'REUSE_AND_BUY', 'DELAY', 'REDUCE', 'ALTERNATIVE'])[scenario_no],
  jsonb_build_object('quantity_factor', case scenario_no when 2 then 0.0 when 3 then 0.5 when 4 then 1.0 when 5 then 0.6 else 1.0 end, 'lead_time_buffer_days', scenario_no * 3, 'price_change_percent', (scenario_no - 3) * 2),
  jsonb_build_object('net_cost_inr', 1250000 + i * 21000 + scenario_no * 17500, 'risk_score', 35 + scenario_no * 7, 'recommendation', case scenario_no when 2 then 'Use available assets before purchasing.' when 3 then 'Reuse available capacity and buy the balance.' when 4 then 'Delay until demand evidence improves.' when 5 then 'Reduce quantity and stagger delivery.' when 6 then 'Use a qualified alternate supplier.' else 'Proceed with approved purchase controls.' end)
from generate_series(1, 30) as series(i)
cross join generate_series(1, 6) as scenarios(scenario_no)
on conflict (id) do nothing;

insert into public.conversations (id, organization_id, profile_id, title)
select
  ('a9000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  'ce0500ee-936c-4554-bfad-c8657c188c84',
  (array['GPU capacity review', 'Supplier risk review', 'Spend optimization review', 'Inventory planning review'])[1 + ((i - 1) % 4)] || ' ' || lpad(i::text, 2, '0')
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.chat_messages (id, organization_id, conversation_id, sender, content, suggestions, data_table, action_link)
select
  ('ab000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  ('a9000000-0000-0000-0000-' || lpad((((i - 1) % 30) + 1)::text, 12, '0'))::uuid,
  (case when i % 2 = 0 then 'ai' else 'user' end),
  case when i % 6 = 1 then 'Review available GPU assets before approving new server capacity.' else 'Procurement workspace note ' || lpad(i::text, 2, '0') end,
  '[]'::jsonb,
  case when i % 6 = 1 then jsonb_build_object('headers', jsonb_build_array('Metric', 'Value'), 'rows', jsonb_build_array(jsonb_build_array('Available nodes', 2), jsonb_build_array('Utilization', '32%'))) else null end,
  case when i % 6 = 1 then jsonb_build_object('label', 'Open inventory', 'page', 'inventory') else null end
from generate_series(1, 60) as series(i)
on conflict (id) do nothing;

insert into public.notifications (
  id, organization_id, recipient_profile_id, title, description, type, is_read, target_page, target_id
)
select
  ('ac000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  'ce0500ee-936c-4554-bfad-c8657c188c84',
  (array['Supplier risk review due', 'Quotation response received', 'Price movement detected', 'Inventory below reorder point', 'Savings opportunity available'])[1 + ((i - 1) % 5)],
  'Demo notification for the current procurement workspace and its organization-scoped workflow.',
  (array['RISK', 'QUOTE', 'PRICE', 'INVENTORY', 'SAVINGS'])[1 + ((i - 1) % 5)],
  (i % 3 = 0),
  (array['risk', 'quotations', 'forecast', 'inventory', 'recommendations'])[1 + ((i - 1) % 5)],
  case when i % 5 = 1 then ('21000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 5 = 2 then ('31000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 5 = 4 then ('71000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid else null end
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.reports (id, organization_id, created_by, name, report_type, filters, output_url, generated_at)
select
  ('ad000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  'ce0500ee-936c-4554-bfad-c8657c188c84',
  (array['Supplier risk register', 'Quarterly spend review', 'Inventory health report', 'RFQ pipeline report', 'Asset utilization report'])[1 + ((i - 1) % 5)] || ' ' || lpad(i::text, 2, '0'),
  (array['SUPPLIER_RISK', 'SPEND', 'INVENTORY', 'RFQ_PIPELINE', 'ASSET_UTILIZATION'])[1 + ((i - 1) % 5)],
  jsonb_build_object('organization', 'Bharat Precision Systems Pvt. Ltd.', 'currency', 'INR', 'period_index', i),
  null,
  case when i % 3 = 0 then timestamptz '2026-09-01 12:00:00+00' + (i * interval '1 day') else null end
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

insert into public.audit_logs (id, organization_id, actor_profile_id, action, entity_type, entity_id, changes)
select
  ('ae000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '00000000-0000-0000-0000-000000000001',
  'ce0500ee-936c-4554-bfad-c8657c188c84',
  (array['CREATE', 'UPDATE', 'SUBMIT', 'APPROVE', 'REVIEW', 'EXPORT'])[1 + ((i - 1) % 6)],
  (array['supplier', 'rfq', 'quotation', 'purchase_order', 'inventory_item', 'report'])[1 + ((i - 1) % 6)],
  case when i % 6 = 1 then ('21000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 2 then ('31000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 3 then ('51000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 4 then ('61000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid when i % 6 = 5 then ('71000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid else ('ad000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid end,
  jsonb_build_object('source', 'phase_3_demo_expansion', 'sequence', i, 'currency', 'INR')
from generate_series(1, 30) as series(i)
on conflict (id) do nothing;

commit;
