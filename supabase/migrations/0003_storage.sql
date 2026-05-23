-- Stage 5b — Storage buckets and per-bucket RLS.
-- Apply via `supabase db push`. Only takes effect on a real Supabase project.

insert into storage.buckets (id, name, public)
values
  ('meal-photos', 'meal-photos', false),
  ('report-pdfs', 'report-pdfs', false),
  ('consent-docs', 'consent-docs', false)
on conflict (id) do nothing;

-- meal-photos: patient writes own; clinicians read assigned/referred via meal_logs join.
create policy "meal-photos patient write"
  on storage.objects for insert
  with check (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "meal-photos patient read"
  on storage.objects for select
  using (
    bucket_id = 'meal-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1
        from public.meal_logs ml
        where ml.storage_path = storage.objects.name
          and public.auth_can_see_patient(ml.patient_id)
      )
    )
  );

create policy "meal-photos patient delete"
  on storage.objects for delete
  using (
    bucket_id = 'meal-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- report-pdfs: dietitian writes; GP + dietitian + admin read; patients read their own
-- via the referenced report row.
create policy "report-pdfs dietitian write"
  on storage.objects for insert
  with check (
    bucket_id = 'report-pdfs'
    and public.auth_role() in ('dietitian', 'admin')
  );

create policy "report-pdfs read"
  on storage.objects for select
  using (
    bucket_id = 'report-pdfs'
    and (
      public.auth_role() in ('dietitian', 'gp', 'admin')
      or exists (
        select 1
        from public.dietitian_reports r
        where r.pdf_url = storage.objects.name
          and r.patient_id = public.auth_patient_id()
      )
    )
  );

-- consent-docs: patient self-write; admin read.
create policy "consent-docs patient write"
  on storage.objects for insert
  with check (
    bucket_id = 'consent-docs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "consent-docs read"
  on storage.objects for select
  using (
    bucket_id = 'consent-docs'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.auth_is_admin()
    )
  );
