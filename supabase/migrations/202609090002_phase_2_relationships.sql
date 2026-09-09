-- Phase 2 compatibility: relationships required by the existing procurement API scope.
alter table public.rfqs
  add column department_id uuid references public.departments(id) on delete set null;

alter table public.assets
  add column department_id uuid references public.departments(id) on delete set null,
  add column assigned_profile_id uuid references public.profiles(id) on delete set null;

alter table public.spend_records
  add column purchase_order_id uuid references public.purchase_orders(id) on delete set null;

create index rfqs_department_id_idx on public.rfqs (department_id);
create index assets_department_id_idx on public.assets (department_id);
create index assets_assigned_profile_id_idx on public.assets (assigned_profile_id);
create index spend_records_purchase_order_id_idx on public.spend_records (purchase_order_id);
