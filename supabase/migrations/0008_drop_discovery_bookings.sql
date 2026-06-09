-- 0008_drop_discovery_bookings.sql
-- Remove the discovery-booking system. The landing page now books directly via
-- HealthEngine (Dr Saxena / Dr Yadav), so this table and its supporting objects
-- created in 0006/0007 are no longer used by any application code.
--
-- Safe to run on an empty or populated table; data is intentionally discarded.

-- View first (depends on the table).
drop view if exists discovery_bookings_admin;

-- Table drops its own policies, indexes and triggers via cascade.
drop table if exists discovery_bookings cascade;

-- Supporting functions.
drop function if exists discovery_bookings_touch_updated_at() cascade;
drop function if exists discovery_is_admin() cascade;

-- Enum types last (nothing references them once the table is gone).
drop type if exists discovery_booking_status;
drop type if exists discovery_time_block;
