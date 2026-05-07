// src/lib/supabase.js
// Arpus-Ultron · Supabase Client
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.warn('[Arpus-Ultron] Supabase env vars missing — running in local mode.');
}

export const supabase = SUPABASE_URL && SUPABASE_ANON
  ? createClient(SUPABASE_URL, SUPABASE_ANON)
  : null;

// ─── Generic helpers ─────────────────────────────────────────

export async function dbFetch(table, filters = {}) {
  if (!supabase) return null;
  let q = supabase.from(table).select('*');
  Object.entries(filters).forEach(([k, v]) => { q = q.eq(k, v); });
  const { data, error } = await q;
  if (error) { console.error(`[db] fetch ${table}:`, error.message); return null; }
  return data;
}

export async function dbUpsert(table, row) {
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).upsert(row).select();
  if (error) { console.error(`[db] upsert ${table}:`, error.message); return null; }
  return data;
}

export async function dbDelete(table, id) {
  if (!supabase) return null;
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) { console.error(`[db] delete ${table}:`, error.message); return null; }
  return true;
}

// ─── Domain helpers ──────────────────────────────────────────

export const db = {
  // Workers
  workers:        { list: () => dbFetch('workers'),
                    upsert: r => dbUpsert('workers', r),
                    del:    id => dbDelete('workers', id) },
  // Clients
  clients:        { list: () => dbFetch('clients'),
                    upsert: r => dbUpsert('clients', r),
                    del:    id => dbDelete('clients', id) },
  // Accounts
  accounts:       { list: () => dbFetch('accounts'),
                    upsert: r => dbUpsert('accounts', r),
                    del:    id => dbDelete('accounts', id) },
  // Projects
  projects:       { list: () => dbFetch('projects'),
                    upsert: r => dbUpsert('projects', r),
                    del:    id => dbDelete('projects', id) },
  // Sheet Types
  sheetTypes:     { list: () => dbFetch('sheet_types'),
                    upsert: r => dbUpsert('sheet_types', r),
                    del:    id => dbDelete('sheet_types', id) },
  // Sheets
  sheets:         { list: () => dbFetch('sheets'),
                    upsert: r => dbUpsert('sheets', r),
                    del:    id => dbDelete('sheets', id) },
  // Tasks
  tasks:          { list: () => dbFetch('tasks'),
                    upsert: r => dbUpsert('tasks', r),
                    del:    id => dbDelete('tasks', id) },
  // Status Requests
  statusRequests: { list: () => dbFetch('status_requests'),
                    upsert: r => dbUpsert('status_requests', r),
                    del:    id => dbDelete('status_requests', id) },
  // Notifications
  notifications:  { list: () => dbFetch('notifications'),
                    upsert: r => dbUpsert('notifications', r),
                    del:    id => dbDelete('notifications', id) },
  // Account Cases
  accountCases:   { list: () => dbFetch('account_cases'),
                    upsert: r => dbUpsert('account_cases', r),
                    del:    id => dbDelete('account_cases', id) },
  accountCaseLogs:{ list: caseId => dbFetch('account_case_logs', { case_id: caseId }),
                    upsert: r => dbUpsert('account_case_logs', r),
                    del:    id => dbDelete('account_case_logs', id) },
  // Special Projects
  specialProjects:{ list: () => dbFetch('special_projects'),
                    upsert: r => dbUpsert('special_projects', r),
                    del:    id => dbDelete('special_projects', id) },
  specialProjLogs:{ list: pid => dbFetch('special_project_logs', { project_id: pid }),
                    upsert: r => dbUpsert('special_project_logs', r) },
  specialProjSheets:{ list: pid => dbFetch('special_project_sheets', { project_id: pid }),
                      upsert: r => dbUpsert('special_project_sheets', r),
                      del:    id => dbDelete('special_project_sheets', id) },
  // Admin Tasks
  adminTasks:     { list: () => dbFetch('admin_tasks'),
                    upsert: r => dbUpsert('admin_tasks', r),
                    del:    id => dbDelete('admin_tasks', id) },
  adminTaskLogs:  { list: tid => dbFetch('admin_task_logs', { task_id: tid }),
                    upsert: r => dbUpsert('admin_task_logs', r) },
};
