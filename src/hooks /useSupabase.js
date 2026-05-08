// src/hooks/useSupabase.js
// Arpus-Ultron · Data sync hook
// Loads all data from Supabase on mount, falls back to SEED if offline.

import { useState, useEffect } from 'react';
import { db, supabase } from '../lib/supabase.js';

export function useSupabase(SEED) {
  const [data, setData] = useState(SEED);
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!supabase) return; // local mode — use SEED
    loadAll();
  }, []);

  async function loadAll() {
    setSyncing(true);
    try {
      const [
        workers, clients, accounts, projects,
        sheetTypes, sheets, tasks, statusRequests,
        notifications, accountCases, specialProjects, adminTasks,
      ] = await Promise.all([
        db.workers.list(),
        db.clients.list(),
        db.accounts.list(),
        db.projects.list(),
        db.sheetTypes.list(),
        db.sheets.list(),
        db.tasks.list(),
        db.statusRequests.list(),
        db.notifications.list(),
        db.accountCases.list(),
        db.specialProjects.list(),
        db.adminTasks.list(),
      ]);

      setData(prev => ({
        ...prev,
        workers:        workers        || prev.workers,
        clients:        clients        || prev.clients,
        accounts:       accounts       || prev.accounts,
        projects:       projects       || prev.projects,
        sheetTypes:     sheetTypes     || prev.sheetTypes,
        sheets:         sheets         || prev.sheets,
        tasks:          tasks          || prev.tasks,
        statusRequests: statusRequests || prev.statusRequests,
        notifications:  notifications  || prev.notifications,
        accountCases:   accountCases   || prev.accountCases,
        specialProjects:specialProjects|| prev.specialProjects,
        adminTasks:     adminTasks     || prev.adminTasks,
      }));
      setSynced(true);
    } catch (e) {
      console.warn('[useSupabase] Load failed, using local data:', e.message);
    } finally {
      setSyncing(false);
    }
  }

  // Call this after any local state change to persist to Supabase
  async function syncItem(table, item) {
    if (!supabase) return;
    await db[table]?.upsert(item);
  }

  async function deleteItem(table, id) {
    if (!supabase) return;
    await db[table]?.del(id);
  }

  return { data, setData, syncing, synced, syncItem, deleteItem, reload: loadAll };
}
