-- ProcureAI Phase 1: Supabase database and authorization foundation.
create extension if not exists "pgcrypto";

create type public.organization_role as enum ('admin', 'manager', 'procurement', 'employee');
create type public.risk_level as enum ('LOW', 'MEDIUM', 'HIGH');
create type public.supplier_status as enum ('ACTIVE', 'PENDING', 'FLAGGED', 'INACTIVE');
create type public.rfq_status as enum ('DRAFT', 'OPEN', 'IN_EVALUATION', 'AWARDED', 'CLOSED');
create type public.quotation_status as enum ('PENDING', 'SHORTLISTED', 'RECOMMENDED', 'ACCEPTED', 'REJECTED');
create type public.purchase_order_status as enum ('ISSUED', 'IN_TRANSIT', 'FULFILLED', 'CANCELLED');
create type public.inventory_status as enum ('HEALTHY', 'LOW_STOCK', 'CRITICAL', 'OVERSTOCKED');
create type public.priority_level as enum ('HIGH', 'MEDIUM', 'LOW');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  department_id uuid,
  full_name text,
  role public.organization_role not null default 'employee',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name),
  unique (organization_id, code)
);

alter table public.profiles
  add constraint profiles_department_id_fkey foreign key (department_id)
  references public.departments(id) on delete set null;

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  category text not null,
  spend numeric(14,2) not null default 0 check (spend >= 0),
  performance numeric(5,2) not null default 0 check (performance between 0 and 100),
  delivery_rate numeric(5,2) not null default 0 check (delivery_rate between 0 and 100),
  quality_score numeric(5,2) not null default 0 check (quality_score between 0 and 100),
  risk_score numeric(5,2) not null default 0 check (risk_score between 0 and 100),
  risk_level public.risk_level not null default 'LOW',
  status public.supplier_status not null default 'PENDING',
  location text,
  contact_email text,
  contact_phone text,
  contract_expiry date,
  financial_risk_score numeric(5,2) not null default 0 check (financial_risk_score between 0 and 100),
  delivery_risk_score numeric(5,2) not null default 0 check (delivery_risk_score between 0 and 100),
  quality_risk_score numeric(5,2) not null default 0 check (quality_risk_score between 0 and 100),
  price_stability_score numeric(5,2) not null default 0 check (price_stability_score between 0 and 100),
  risk_reason text,
  recent_rfqs_count integer not null default 0 check (recent_rfqs_count >= 0),
  lead_time_days integer not null default 0 check (lead_time_days >= 0),
  complaint_rate numeric(5,2) not null default 0 check (complaint_rate between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table public.rfqs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  reference_number text not null,
  title text not null,
  product text not null,
  category text not null,
  quantity numeric(14,3) not null check (quantity > 0),
  unit text not null,
  target_price numeric(14,2) check (target_price >= 0),
  currency char(3) not null default 'USD',
  deadline date not null,
  response_count integer not null default 0 check (response_count >= 0),
  status public.rfq_status not null default 'DRAFT',
  delivery_date date,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, reference_number)
);

create table public.rfq_suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  invited_at timestamptz not null default now(),
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (rfq_id, supplier_id)
);

create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  unit_price numeric(14,2) not null check (unit_price >= 0),
  currency char(3) not null default 'USD',
  delivery_days integer not null check (delivery_days >= 0),
  quality_rating numeric(5,2) not null default 0 check (quality_rating between 0 and 100),
  payment_terms text,
  risk_level public.risk_level not null default 'LOW',
  historical_performance numeric(5,2) not null default 0 check (historical_performance between 0 and 100),
  overall_score numeric(5,2) check (overall_score between 0 and 100),
  status public.quotation_status not null default 'PENDING',
  submitted_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (rfq_id, supplier_id)
);

create table public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  reference_number text not null,
  rfq_id uuid references public.rfqs(id) on delete set null,
  quotation_id uuid unique references public.quotations(id) on delete set null,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  product text not null,
  quantity numeric(14,3) not null check (quantity > 0),
  unit text not null,
  total_amount numeric(14,2) not null check (total_amount >= 0),
  currency char(3) not null default 'USD',
  status public.purchase_order_status not null default 'ISSUED',
  issue_date date not null,
  expected_delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, reference_number)
);

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  product text not null,
  sku text not null,
  category text not null,
  current_stock numeric(14,3) not null default 0 check (current_stock >= 0),
  daily_demand numeric(14,3) not null default 0 check (daily_demand >= 0),
  reorder_point numeric(14,3) not null default 0 check (reorder_point >= 0),
  lead_time_days integer not null default 0 check (lead_time_days >= 0),
  status public.inventory_status not null default 'HEALTHY',
  unit_price numeric(14,2) not null default 0 check (unit_price >= 0),
  unit text not null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  critical_days_left integer check (critical_days_left >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku)
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  inventory_item_id uuid references public.inventory_items(id) on delete set null,
  asset_tag text not null,
  name text not null,
  category text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'IN_MAINTENANCE', 'RETIRED')),
  acquired_on date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, asset_tag)
);

create table public.spend_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  period_start date not null,
  period_end date not null check (period_end >= period_start),
  category text not null,
  supplier_id uuid references public.suppliers(id) on delete set null,
  amount numeric(14,2) not null check (amount >= 0),
  currency char(3) not null default 'USD',
  savings_opportunity numeric(14,2) not null default 0 check (savings_opportunity >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.historical_data (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  data_type text not null,
  subject text not null,
  observed_on date not null,
  value numeric(18,4),
  unit text,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.supplier_risk_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  risk_score numeric(5,2) not null check (risk_score between 0 and 100),
  risk_level public.risk_level not null,
  financial_risk_score numeric(5,2) check (financial_risk_score between 0 and 100),
  delivery_risk_score numeric(5,2) check (delivery_risk_score between 0 and 100),
  quality_risk_score numeric(5,2) check (quality_risk_score between 0 and 100),
  reason text,
  assessed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.price_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  material text not null,
  current_price numeric(14,4) not null check (current_price >= 0),
  forecast_price numeric(14,4) not null check (forecast_price >= 0),
  unit text not null,
  forecast_date date not null,
  confidence_percent numeric(5,2) not null check (confidence_percent between 0 and 100),
  recommendation text,
  historical_points jsonb not null default '[]'::jsonb,
  forecast_points jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  category text not null,
  description text not null,
  potential_impact text,
  savings_amount numeric(14,2) check (savings_amount >= 0),
  confidence_percent numeric(5,2) check (confidence_percent between 0 and 100),
  priority public.priority_level not null,
  recommended_action text,
  action_type text,
  target_type text,
  target_id uuid,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'DISMISSED', 'APPLIED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.requirement_validations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  submitted_by uuid references public.profiles(id) on delete set null,
  requirement text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'VALID', 'INVALID', 'NEEDS_REVIEW')),
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dependency_definitions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_type text not null,
  source_id uuid not null,
  target_type text not null,
  target_id uuid not null,
  relationship_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, source_type, source_id, target_type, target_id, relationship_type)
);

create table public.decision_simulations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  name text not null,
  description text,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'READY', 'COMPLETED', 'FAILED')),
  input_data jsonb not null default '{}'::jsonb,
  result_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.simulation_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  simulation_id uuid not null references public.decision_simulations(id) on delete cascade,
  name text not null,
  assumptions jsonb not null default '{}'::jsonb,
  outcome jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (simulation_id, name)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender text not null check (sender in ('user', 'ai', 'system')),
  content text not null,
  suggestions jsonb not null default '[]'::jsonb,
  data_table jsonb,
  action_link jsonb,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  recipient_profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  type text not null check (type in ('RISK', 'QUOTE', 'PRICE', 'INVENTORY', 'SAVINGS')),
  is_read boolean not null default false,
  target_page text,
  target_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  name text not null,
  report_type text not null,
  filters jsonb not null default '{}'::jsonb,
  output_url text,
  generated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index profiles_organization_id_idx on public.profiles (organization_id);
create index departments_organization_id_idx on public.departments (organization_id);
create index suppliers_organization_status_idx on public.suppliers (organization_id, status);
create index rfqs_organization_status_deadline_idx on public.rfqs (organization_id, status, deadline);
create index rfq_suppliers_rfq_id_idx on public.rfq_suppliers (rfq_id);
create index rfq_suppliers_supplier_id_idx on public.rfq_suppliers (supplier_id);
create index quotations_rfq_id_idx on public.quotations (rfq_id);
create index quotations_supplier_id_idx on public.quotations (supplier_id);
create index purchase_orders_organization_status_delivery_idx on public.purchase_orders (organization_id, status, expected_delivery_date);
create index inventory_items_organization_status_idx on public.inventory_items (organization_id, status);
create index assets_organization_id_idx on public.assets (organization_id);
create index spend_records_organization_period_idx on public.spend_records (organization_id, period_start, period_end);
create index historical_data_organization_subject_date_idx on public.historical_data (organization_id, subject, observed_on);
create index supplier_risk_assessments_supplier_date_idx on public.supplier_risk_assessments (supplier_id, assessed_at desc);
create index price_forecasts_organization_material_date_idx on public.price_forecasts (organization_id, material, forecast_date);
create index ai_recommendations_organization_status_priority_idx on public.ai_recommendations (organization_id, status, priority);
create index requirement_validations_organization_status_idx on public.requirement_validations (organization_id, status);
create index dependency_definitions_organization_source_idx on public.dependency_definitions (organization_id, source_type, source_id);
create index decision_simulations_organization_status_idx on public.decision_simulations (organization_id, status);
create index simulation_scenarios_simulation_id_idx on public.simulation_scenarios (simulation_id);
create index conversations_organization_profile_idx on public.conversations (organization_id, profile_id);
create index chat_messages_conversation_created_idx on public.chat_messages (conversation_id, created_at);
create index notifications_organization_recipient_read_idx on public.notifications (organization_id, recipient_profile_id, is_read);
create index reports_organization_created_idx on public.reports (organization_id, created_at desc);
create index audit_logs_organization_created_idx on public.audit_logs (organization_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'organizations', 'profiles', 'departments', 'suppliers', 'rfqs', 'quotations',
    'purchase_orders', 'inventory_items', 'assets', 'spend_records', 'historical_data',
    'price_forecasts', 'ai_recommendations', 'requirement_validations',
    'dependency_definitions', 'decision_simulations', 'simulation_scenarios',
    'conversations', 'notifications', 'reports'
  ] loop
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', table_name || '_set_updated_at', table_name);
  end loop;
end;
$$;

-- Each new Auth user receives an isolated organization and an employee profile.
-- Organization membership changes should be performed by an authenticated admin flow later.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare new_organization_id uuid;
begin
  insert into public.organizations (name)
  values (coalesce(nullif(new.raw_user_meta_data ->> 'organization_name', ''), split_part(new.email, '@', 1) || '''s organization'))
  returning id into new_organization_id;

  insert into public.profiles (id, organization_id, full_name, role, avatar_url)
  values (
    new.id,
    new_organization_id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'employee',
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.current_organization_id()
returns uuid
language sql stable security definer set search_path = public
as $$ select organization_id from public.profiles where id = auth.uid() $$;

create or replace function public.current_profile_role()
returns public.organization_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

grant execute on function public.current_organization_id() to anon, authenticated;
grant execute on function public.current_profile_role() to anon, authenticated;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;

create policy organizations_select_own on public.organizations for select
  using (id = public.current_organization_id());
create policy profiles_select_own_or_admin on public.profiles for select
  using (id = auth.uid() or (organization_id = public.current_organization_id() and public.current_profile_role() = 'admin'));
create policy profiles_update_admin on public.profiles for update
  using (organization_id = public.current_organization_id() and public.current_profile_role() = 'admin')
  with check (organization_id = public.current_organization_id());

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'departments', 'suppliers', 'rfqs', 'rfq_suppliers', 'quotations', 'purchase_orders',
    'inventory_items', 'assets', 'spend_records', 'historical_data',
    'supplier_risk_assessments', 'price_forecasts', 'ai_recommendations',
    'requirement_validations', 'dependency_definitions', 'decision_simulations',
    'simulation_scenarios', 'reports', 'audit_logs'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('create policy %I on public.%I for select using (organization_id = public.current_organization_id())', table_name || '_select_organization', table_name);
    execute format(
      'create policy %I on public.%I for all using (organization_id = public.current_organization_id() and public.current_profile_role() in (''admin'', ''manager'', ''procurement'')) with check (organization_id = public.current_organization_id() and public.current_profile_role() in (''admin'', ''manager'', ''procurement''))',
      table_name || '_write_procurement_roles', table_name
    );
  end loop;
end;
$$;

alter table public.conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.notifications enable row level security;

create policy conversations_select_own_or_admin on public.conversations for select
  using (organization_id = public.current_organization_id() and (profile_id = auth.uid() or public.current_profile_role() = 'admin'));
create policy conversations_write_own on public.conversations for all
  using (organization_id = public.current_organization_id() and profile_id = auth.uid())
  with check (organization_id = public.current_organization_id() and profile_id = auth.uid());
create policy chat_messages_select_conversation_member on public.chat_messages for select
  using (organization_id = public.current_organization_id() and exists (
    select 1 from public.conversations c where c.id = conversation_id and (c.profile_id = auth.uid() or public.current_profile_role() = 'admin')
  ));
create policy chat_messages_write_conversation_member on public.chat_messages for all
  using (organization_id = public.current_organization_id() and exists (
    select 1 from public.conversations c where c.id = conversation_id and c.profile_id = auth.uid()
  ))
  with check (organization_id = public.current_organization_id() and exists (
    select 1 from public.conversations c where c.id = conversation_id and c.profile_id = auth.uid()
  ));
create policy notifications_select_recipient_or_admin on public.notifications for select
  using (organization_id = public.current_organization_id() and (recipient_profile_id is null or recipient_profile_id = auth.uid() or public.current_profile_role() = 'admin'));
create policy notifications_update_recipient on public.notifications for update
  using (organization_id = public.current_organization_id() and recipient_profile_id = auth.uid())
  with check (organization_id = public.current_organization_id() and recipient_profile_id = auth.uid());
create policy notifications_write_procurement_roles on public.notifications for insert
  with check (organization_id = public.current_organization_id() and public.current_profile_role() in ('admin', 'manager', 'procurement'));
