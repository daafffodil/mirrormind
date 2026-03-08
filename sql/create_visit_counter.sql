-- visit_counter: singleton counter table for tracking total visits
-- Schema requirement:
--   - id: primary key, auto-increment
--   - count: integer, default 0
-- Additional requirement:
--   - ensure only one row exists in this table

CREATE TABLE IF NOT EXISTS visit_counter (
  id SERIAL PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);

-- Ensure this table can contain at most one row.
-- A unique index over a constant expression allows only one record total.
CREATE UNIQUE INDEX IF NOT EXISTS visit_counter_single_row_idx
ON visit_counter ((true));

-- Initialize the singleton row (id = 1) if it does not exist.
INSERT INTO visit_counter (id, count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
