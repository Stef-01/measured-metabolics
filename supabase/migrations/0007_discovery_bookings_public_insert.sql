-- Measured Metabolics — allow the public website funnel to file discovery-call
-- leads with the anon/publishable key.
--
-- Insert-only: anon (and authenticated) may CREATE a booking but still cannot
-- read, update, or delete leads — those remain admin / service-role only (see
-- 0006). `source` is pinned so the public role can only file website-funnel
-- rows; the table's own check constraints validate name + email. The service
-- role continues to bypass RLS for the stricter server-only path when its key
-- is configured.

create policy "discovery_bookings public insert" on discovery_bookings
  for insert to anon, authenticated
  with check (source = 'website_funnel');
