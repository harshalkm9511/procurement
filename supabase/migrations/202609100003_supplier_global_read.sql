-- Allow authenticated users to discover supplier directory records across organizations.
-- Supplier writes remain protected by the existing organization-scoped procurement-role policy.
begin;

drop policy if exists suppliers_select_organization on public.suppliers;

create policy suppliers_select_authenticated on public.suppliers
  for select to authenticated
  using (auth.uid() is not null);

commit;
