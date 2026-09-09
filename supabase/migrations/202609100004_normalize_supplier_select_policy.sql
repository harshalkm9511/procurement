-- Remove an older broad supplier policy so the intended authenticated-only
-- directory policy is the single cross-organization SELECT policy.
begin;

drop policy if exists suppliers_select on public.suppliers;

commit;
