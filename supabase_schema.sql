-- ============================================================
--  Arpus-Ultron · Supabase Schema
--  Run this entire file in: Supabase → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── WORKERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workers (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT,
  avatar      TEXT,
  password    TEXT,
  created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── CLIENTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT,
  industry    TEXT,
  notes       TEXT DEFAULT '',
  created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── ACCOUNTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS accounts (
  id          TEXT PRIMARY KEY,
  client_id   TEXT REFERENCES clients(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  platform    TEXT,
  status      TEXT DEFAULT 'Active',
  notes       TEXT DEFAULT '',
  created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── PROJECTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          TEXT PRIMARY KEY,
  account_id  TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  status      TEXT DEFAULT 'Pending',
  notes       TEXT DEFAULT '',
  created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── SHEET TYPES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sheet_types (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  color       TEXT DEFAULT '#7c5ff5'
);

-- ─── SHEETS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sheets (
  id          TEXT PRIMARY KEY,
  project_id  TEXT REFERENCES projects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  url         TEXT,
  type_id     TEXT REFERENCES sheet_types(id) ON DELETE SET NULL,
  worker_ids  TEXT[] DEFAULT '{}',
  priority    TEXT DEFAULT 'Medium',
  created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── TASKS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id          TEXT PRIMARY KEY,
  worker_id   TEXT REFERENCES workers(id) ON DELETE SET NULL,
  project_id  TEXT REFERENCES projects(id) ON DELETE SET NULL,
  sheet_id    TEXT REFERENCES sheets(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  status      TEXT DEFAULT 'Pending',
  deadline    BIGINT,
  created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── STATUS REQUESTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS status_requests (
  id               TEXT PRIMARY KEY,
  task_id          TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  worker_id        TEXT REFERENCES workers(id) ON DELETE CASCADE,
  requested_status TEXT NOT NULL,
  reason           TEXT,
  status           TEXT DEFAULT 'pending',
  timestamp        BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── NOTIFICATIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id               TEXT PRIMARY KEY,
  message          TEXT NOT NULL,
  target_worker_id TEXT,
  is_read          BOOLEAN DEFAULT FALSE,
  timestamp        BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── ACCOUNT CASES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS account_cases (
  id          TEXT PRIMARY KEY,
  account_id  TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  status      TEXT DEFAULT 'Pending',
  created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

CREATE TABLE IF NOT EXISTS account_case_logs (
  id          TEXT PRIMARY KEY,
  case_id     TEXT REFERENCES account_cases(id) ON DELETE CASCADE,
  status      TEXT,
  note        TEXT NOT NULL,
  ts          BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── SPECIAL PROJECTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS special_projects (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  status      TEXT DEFAULT 'Pending',
  notes       TEXT DEFAULT '',
  created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

CREATE TABLE IF NOT EXISTS special_project_logs (
  id          TEXT PRIMARY KEY,
  project_id  TEXT REFERENCES special_projects(id) ON DELETE CASCADE,
  status      TEXT,
  note        TEXT NOT NULL,
  ts          BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

CREATE TABLE IF NOT EXISTS special_project_sheets (
  id          TEXT PRIMARY KEY,
  project_id  TEXT REFERENCES special_projects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  url         TEXT,
  priority    TEXT DEFAULT 'Medium',
  worker_ids  TEXT[] DEFAULT '{}',
  created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── ADMIN TASKS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_tasks (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  status      TEXT DEFAULT 'Pending',
  created_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

CREATE TABLE IF NOT EXISTS admin_task_logs (
  id          TEXT PRIMARY KEY,
  task_id     TEXT REFERENCES admin_tasks(id) ON DELETE CASCADE,
  status      TEXT,
  note        TEXT NOT NULL,
  ts          BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
);

-- ─── ROW LEVEL SECURITY (basic — tighten later) ─────────────
ALTER TABLE workers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheet_types      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sheets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_cases    ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_case_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_project_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_project_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_tasks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_task_logs  ENABLE ROW LEVEL SECURITY;

-- Allow anon read/write (tighten with auth later)
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'workers','clients','accounts','projects','sheet_types','sheets',
    'tasks','status_requests','notifications','account_cases',
    'account_case_logs','special_projects','special_project_logs',
    'special_project_sheets','admin_tasks','admin_task_logs'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    EXECUTE format('CREATE POLICY "allow_all_%s" ON %I FOR ALL TO anon USING (true) WITH CHECK (true)', tbl, tbl);
  END LOOP;
END $$;

-- ─── SEED: Sheet Types ───────────────────────────────────────
INSERT INTO sheet_types (id, name, color) VALUES
  ('st1', 'SEO',       '#10b981'),
  ('st2', 'PPC',       '#f59e0b'),
  ('st3', 'Analytics', '#3b82f6'),
  ('st4', 'Social',    '#8b5cf6'),
  ('st5', 'Content',   '#ec4899'),
  ('st6', 'Email',     '#06b6d4')
ON CONFLICT (id) DO NOTHING;
