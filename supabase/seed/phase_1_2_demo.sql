-- ProcureAI Phase 1/2 demo data.
-- Safe to rerun: all records use deterministic UUIDs and inserts are conflict-safe.
-- This file intentionally does not create Auth users, credentials, or future AI results.

begin;

insert into public.organizations (id, name)
values ('00000000-0000-0000-0000-000000000001', 'Bharat Precision Systems Pvt. Ltd.')
on conflict do nothing;

insert into public.departments (id, organization_id, name, code)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Strategic Procurement', 'PROC'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Engineering & R&D', 'ENG'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Operations & Facilities', 'OPS')
on conflict do nothing;

-- Attach at most one existing Auth user to the demo organization only when that user
-- does not already have a profile. No Auth user or credential is created here.
insert into public.profiles (id, organization_id, department_id, full_name, role)
select
  u.id,
  '00000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Demo Workspace User',
  'procurement'::public.organization_role
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id)
order by u.created_at
limit 1
on conflict do nothing;

-- Keep the verified demo account attached to the seeded organization when this
-- foundational seed is run independently of the expansion seed.
update public.profiles
set organization_id = '00000000-0000-0000-0000-000000000001',
    department_id = '10000000-0000-0000-0000-000000000001',
    full_name = 'Harshal Mahajan',
    role = 'admin'::public.organization_role,
    updated_at = now()
where id = 'ce0500ee-936c-4554-bfad-c8657c188c84'::uuid
  and exists (select 1 from auth.users where id = 'ce0500ee-936c-4554-bfad-c8657c188c84'::uuid);

insert into public.suppliers (
  id, organization_id, name, category, spend, performance, delivery_rate, quality_score,
  risk_score, risk_level, status, location, contact_email, contact_phone, contract_expiry,
  financial_risk_score, delivery_risk_score, quality_risk_score, price_stability_score,
  risk_reason, recent_rfqs_count, lead_time_days, complaint_rate
)
values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Tata Advanced Materials', 'Raw Materials & Metals', 18450000, 91, 94, 96, 18, 'LOW', 'ACTIVE', 'Pune, Maharashtra', 'demo.tam@example.invalid', '+91-20-4000-1001', '2027-03-31', 12, 15, 10, 88, 'Stable domestic supply and strong quality documentation.', 6, 12, 1.8),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Bharat Components & Controls', 'Electronic Components', 12680000, 88, 86, 92, 29, 'LOW', 'ACTIVE', 'Bengaluru, Karnataka', 'demo.bcc@example.invalid', '+91-80-4000-1002', '2027-06-30', 25, 28, 18, 82, 'Occasional semiconductor lead-time variance.', 5, 18, 2.5),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Apex Industrial Automation', 'Industrial Automation', 9720000, 84, 82, 89, 42, 'MEDIUM', 'ACTIVE', 'Chennai, Tamil Nadu', 'demo.aia@example.invalid', '+91-44-4000-1003', '2026-12-31', 39, 44, 22, 76, 'Delivery performance softened during the last two quarters.', 4, 24, 3.7),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Himalayan Cooling Systems', 'Facilities & Data Centre', 6480000, 86, 88, 90, 35, 'MEDIUM', 'ACTIVE', 'Noida, Uttar Pradesh', 'demo.hcs@example.invalid', '+91-120-4000-1004', '2027-01-31', 31, 33, 20, 79, 'Capacity constrained for high-density cooling deployments.', 3, 21, 2.9),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Kaveri Logistics Network', 'Logistics & Packaging', 4310000, 79, 76, 85, 58, 'MEDIUM', 'FLAGGED', 'Mumbai, Maharashtra', 'demo.kln@example.invalid', '+91-22-4000-1005', '2026-11-30', 55, 63, 35, 68, 'Recent lane delays require alternate-carrier planning.', 3, 9, 5.4),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Deccan Precision Services', 'MRO & Engineering Services', 2890000, 93, 91, 94, 14, 'LOW', 'ACTIVE', 'Hyderabad, Telangana', 'demo.dps@example.invalid', '+91-40-4000-1006', '2027-09-30', 9, 12, 8, 91, 'High service quality and strong preventive-maintenance record.', 2, 7, 1.1)
on conflict do nothing;

insert into public.rfqs (
  id, organization_id, reference_number, title, product, category, quantity, unit,
  target_price, currency, deadline, response_count, status, delivery_date, description,
  created_by, department_id
)
values
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'RFQ-DEMO-001', 'High-density compute workstation refresh', 'GPU-enabled engineering workstations', 'IT Hardware & Compute', 8, 'workstations', 425000, 'INR', '2026-10-05', 3, 'OPEN', '2026-11-15', 'Eight GPU workstations for simulation and digital-twin workloads; existing assets should be assessed before final award.', null, '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'RFQ-DEMO-002', '316L stainless steel precision assemblies', '316L stainless steel assemblies', 'Raw Materials & Metals', 1200, 'units', 6850, 'INR', '2026-09-28', 3, 'IN_EVALUATION', '2026-10-25', 'Corrosion-resistant assemblies for the Pune production line.', null, '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'RFQ-DEMO-003', 'Industrial sensor and controller replenishment', 'Industrial sensors and PLC controllers', 'Electronic Components', 450, 'kits', 18500, 'INR', '2026-10-12', 2, 'OPEN', '2026-11-10', 'Replenishment for machine-health monitoring and line-control upgrades.', null, '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'RFQ-DEMO-004', 'Data-centre liquid cooling retrofit', 'Rack liquid-cooling distribution units', 'Facilities & Data Centre', 12, 'units', 310000, 'INR', '2026-09-30', 2, 'AWARDED', '2026-10-30', 'Cooling retrofit for a high-density GPU cluster and adjacent network racks.', null, '10000000-0000-0000-0000-000000000003')
on conflict do nothing;

insert into public.rfq_suppliers (id, organization_id, rfq_id, supplier_id, invited_at, responded_at)
values
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '2026-09-08T09:00:00Z', '2026-09-14T11:30:00Z'),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', '2026-09-08T09:00:00Z', '2026-09-15T15:20:00Z'),
  ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', '2026-09-08T09:00:00Z', '2026-09-16T10:05:00Z'),
  ('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '2026-09-01T09:00:00Z', '2026-09-08T14:00:00Z'),
  ('40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', '2026-09-01T09:00:00Z', '2026-09-09T12:10:00Z'),
  ('40000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', '2026-09-01T09:00:00Z', '2026-09-10T09:45:00Z'),
  ('40000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '2026-09-09T09:00:00Z', '2026-09-16T13:00:00Z'),
  ('40000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '2026-09-09T09:00:00Z', '2026-09-17T10:30:00Z'),
  ('40000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', '2026-08-26T09:00:00Z', '2026-09-03T16:15:00Z'),
  ('40000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000006', '2026-08-26T09:00:00Z', '2026-09-04T11:00:00Z')
on conflict do nothing;

insert into public.quotations (
  id, organization_id, rfq_id, supplier_id, unit_price, currency, delivery_days,
  quality_rating, payment_terms, risk_level, historical_performance, overall_score,
  status, submitted_at, notes
)
values
  ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 418000, 'INR', 28, 92, 'Net 45', 'LOW', 88, 89, 'SHORTLISTED', '2026-09-14T11:30:00Z', 'Strong warranty and domestic support coverage.'),
  ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 392000, 'INR', 35, 86, 'Net 30', 'MEDIUM', 84, 82, 'PENDING', '2026-09-15T15:20:00Z', 'Lowest initial quote but longer delivery and higher integration effort.'),
  ('50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 436000, 'INR', 21, 95, 'Net 45', 'LOW', 91, 94, 'RECOMMENDED', '2026-09-16T10:05:00Z', 'Premium cooling-ready configuration with fastest delivery.'),
  ('50000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 6710, 'INR', 18, 97, 'Net 45', 'LOW', 93, 94, 'RECOMMENDED', '2026-09-08T14:00:00Z', 'Best quality and stable alloy certification.'),
  ('50000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 6480, 'INR', 26, 90, 'Net 30', 'MEDIUM', 84, 83, 'SHORTLISTED', '2026-09-09T12:10:00Z', 'Competitive cost with a longer production slot.'),
  ('50000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000006', 6950, 'INR', 12, 94, 'Net 60', 'LOW', 95, 91, 'PENDING', '2026-09-10T09:45:00Z', 'Fast turnaround with premium service terms.'),
  ('50000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 17600, 'INR', 24, 94, 'Net 45', 'LOW', 88, 92, 'RECOMMENDED', '2026-09-16T13:00:00Z', 'Includes calibration certificates and remote commissioning.'),
  ('50000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 16900, 'INR', 32, 88, 'Net 30', 'MEDIUM', 84, 84, 'SHORTLISTED', '2026-09-17T10:30:00Z', 'Lower price with additional integration work.'),
  ('50000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', 298000, 'INR', 30, 93, 'Net 45', 'LOW', 91, 90, 'ACCEPTED', '2026-09-03T16:15:00Z', 'Approved liquid-cooling distribution units and commissioning.'),
  ('50000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000006', 312000, 'INR', 24, 95, 'Net 60', 'LOW', 95, 92, 'SHORTLISTED', '2026-09-04T11:00:00Z', 'Higher service score and longer payment terms.')
on conflict do nothing;

insert into public.purchase_orders (
  id, organization_id, reference_number, rfq_id, quotation_id, supplier_id, product,
  quantity, unit, total_amount, currency, status, issue_date, expected_delivery_date
)
values
  ('60000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'PO-DEMO-001', '30000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000004', 'Rack liquid-cooling distribution units', 12, 'units', 3576000, 'INR', 'IN_TRANSIT', '2026-09-06', '2026-10-06'),
  ('60000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'PO-DEMO-002', '30000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '316L stainless steel assemblies', 1200, 'units', 8052000, 'INR', 'ISSUED', '2026-09-11', '2026-09-29'),
  ('60000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'PO-DEMO-003', null, null, '20000000-0000-0000-0000-000000000006', 'Preventive maintenance service kits', 24, 'kits', 684000, 'INR', 'FULFILLED', '2026-07-18', '2026-08-15'),
  ('60000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'PO-DEMO-004', '30000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000004', 'GPU-enabled engineering workstations', 4, 'workstations', 1744000, 'INR', 'ISSUED', '2026-09-18', '2026-10-09')
on conflict do nothing;

insert into public.inventory_items (
  id, organization_id, product, sku, category, current_stock, daily_demand,
  reorder_point, lead_time_days, status, unit_price, unit, supplier_id, critical_days_left
)
values
  ('70000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'GPU-enabled engineering workstations', 'GPU-WS-RTX-01', 'IT Hardware & Compute', 4, 0.10, 6, 35, 'LOW_STOCK', 436000, 'workstations', '20000000-0000-0000-0000-000000000004', 40),
  ('70000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '316L stainless steel assemblies', 'SS316L-ASM-12', 'Raw Materials & Metals', 480, 85, 300, 18, 'HEALTHY', 6710, 'units', '20000000-0000-0000-0000-000000000001', 6),
  ('70000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Industrial sensor and PLC controller kits', 'SENS-PLC-KIT-04', 'Electronic Components', 130, 18, 180, 24, 'CRITICAL', 17600, 'kits', '20000000-0000-0000-0000-000000000002', 7),
  ('70000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Rack liquid-cooling distribution units', 'RACK-LCDU-12', 'Facilities & Data Centre', 12, 0.20, 8, 30, 'HEALTHY', 298000, 'units', '20000000-0000-0000-0000-000000000004', 60),
  ('70000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'MRO calibration and maintenance kits', 'MRO-CAL-24', 'MRO & Engineering Services', 9, 0.50, 12, 7, 'LOW_STOCK', 28500, 'kits', '20000000-0000-0000-0000-000000000006', 18),
  ('70000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Reusable ESD shipping containers', 'ESD-TOTE-350', 'Logistics & Packaging', 680, 22, 250, 9, 'OVERSTOCKED', 4200, 'units', '20000000-0000-0000-0000-000000000005', 31)
on conflict do nothing;

insert into public.assets (
  id, organization_id, inventory_item_id, asset_tag, name, category, status, acquired_on, metadata,
  department_id, assigned_profile_id
)
values
  ('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 'ASSET-GPU-001', 'NVIDIA GPU compute workstation cluster node', 'High-performance compute', 'ACTIVE', '2025-11-12', '{"gpu_memory_gb": 48, "utilization_percent": 32, "location": "Pune R&D lab"}', '10000000-0000-0000-0000-000000000002', (select id from public.profiles where organization_id = '00000000-0000-0000-0000-000000000001' order by created_at limit 1)),
  ('80000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 'ASSET-GPU-002', 'NVIDIA GPU compute workstation cluster node', 'High-performance compute', 'IN_MAINTENANCE', '2024-07-18', '{"gpu_memory_gb": 24, "utilization_percent": 8, "location": "Bengaluru engineering lab"}', '10000000-0000-0000-0000-000000000002', null),
  ('80000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000004', 'ASSET-COOL-001', 'Rack liquid-cooling distribution unit', 'Data-centre cooling', 'ACTIVE', '2025-05-22', '{"capacity_kw": 80, "utilization_percent": 58, "location": "Noida data hall"}', '10000000-0000-0000-0000-000000000003', null),
  ('80000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', null, 'ASSET-TEST-001', 'Environmental test chamber', 'R&D test equipment', 'ACTIVE', '2023-03-15', '{"utilization_percent": 41, "location": "Pune R&D lab"}', '10000000-0000-0000-0000-000000000002', null)
on conflict do nothing;

insert into public.spend_records (
  id, organization_id, period_start, period_end, category, supplier_id, purchase_order_id,
  amount, currency, savings_opportunity
)
values
  ('90000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '2026-01-01', '2026-01-31', 'Raw Materials & Metals', '20000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000002', 12800000, 'INR', 640000),
  ('90000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '2026-02-01', '2026-02-28', 'Electronic Components', '20000000-0000-0000-0000-000000000002', null, 7420000, 'INR', 520000),
  ('90000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '2026-03-01', '2026-03-31', 'MRO & Engineering Services', '20000000-0000-0000-0000-000000000006', '60000000-0000-0000-0000-000000000003', 2210000, 'INR', 125000),
  ('90000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '2026-04-01', '2026-04-30', 'Facilities & Data Centre', '20000000-0000-0000-0000-000000000004', null, 3180000, 'INR', 190000),
  ('90000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '2026-05-01', '2026-05-31', 'Logistics & Packaging', '20000000-0000-0000-0000-000000000005', null, 2840000, 'INR', 210000),
  ('90000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', '2026-06-01', '2026-06-30', 'IT Hardware & Compute', '20000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000004', 1744000, 'INR', 95000),
  ('90000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', '2026-07-01', '2026-07-31', 'Raw Materials & Metals', '20000000-0000-0000-0000-000000000001', null, 14100000, 'INR', 710000),
  ('90000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', '2026-08-01', '2026-08-31', 'Electronic Components', '20000000-0000-0000-0000-000000000002', null, 8160000, 'INR', 590000),
  ('90000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', '2026-09-01', '2026-09-30', 'Facilities & Data Centre', '20000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000001', 3576000, 'INR', 240000)
on conflict do nothing;

insert into public.historical_data (
  id, organization_id, data_type, subject, observed_on, value, unit, source, metadata
)
values
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'asset_utilization', 'GPU-enabled engineering workstations', '2026-01-31', 34, 'percent', 'internal_asset_register', '{"available_nodes": 2, "underutilized_nodes": 1}'),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'asset_utilization', 'GPU-enabled engineering workstations', '2026-04-30', 29, 'percent', 'internal_asset_register', '{"available_nodes": 2, "underutilized_nodes": 2}'),
  ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'asset_utilization', 'GPU-enabled engineering workstations', '2026-07-31', 32, 'percent', 'internal_asset_register', '{"available_nodes": 1, "underutilized_nodes": 1}'),
  ('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'procurement_price', '316L stainless steel assemblies', '2026-03-31', 6580, 'INR/unit', 'approved_purchase_history', '{"supplier_count": 3}'),
  ('a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'procurement_price', '316L stainless steel assemblies', '2026-06-30', 6740, 'INR/unit', 'approved_purchase_history', '{"supplier_count": 3}'),
  ('a0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'procurement_price', 'Industrial sensor and PLC controller kits', '2026-06-30', 18100, 'INR/kit', 'approved_purchase_history', '{"supplier_count": 2}'),
  ('a0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'inventory_consumption', 'Industrial sensor and PLC controller kits', '2026-08-31', 18, 'kits/day', 'warehouse_issue_history', '{"line": "Assembly-2"}'),
  ('a0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'inventory_consumption', '316L stainless steel assemblies', '2026-08-31', 85, 'units/day', 'warehouse_issue_history', '{"line": "Pune-Production-1"}'),
  ('a0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'delivery_performance', 'Bharat Components & Controls', '2026-08-31', 86, 'percent_on_time', 'supplier_scorecard', '{"late_shipments": 3, "shipments": 22}'),
  ('a0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'delivery_performance', 'Tata Advanced Materials', '2026-08-31', 94, 'percent_on_time', 'supplier_scorecard', '{"late_shipments": 1, "shipments": 17}'),
  ('a0000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'requirement_context', 'GPU-enabled engineering workstations', '2026-08-31', 4, 'active_nodes', 'engineering_capacity_register', '{"planned_projects": 2, "average_utilization_percent": 32}'),
  ('a0000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'requirement_context', 'GPU-enabled engineering workstations', '2026-08-31', 2, 'available_nodes', 'engineering_capacity_register', '{"maintenance_nodes": 1, "available_nodes": 1}')
on conflict do nothing;

commit;
