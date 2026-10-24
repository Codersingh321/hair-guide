const KEY = "hairguide-tracker-v1";

// ── localStorage helpers (used by guests) ──────────────────────────

export function loadLocalEntries() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalEntries(entries) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // Storage full or blocked — session still works
  }
}

export function clearLocalEntries() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// ── Supabase helpers (used by logged-in users) ─────────────────────

export async function loadRemoteEntries(supabase, userId) {
  const { data, error } = await supabase
    .from("tracker_entries")
    .select("*")
    .eq("user_id", userId)
    .order("entry_date", { ascending: true });
  if (error) throw error;
  return data.map((row) => ({
    date: row.entry_date,
    shedding: row.shedding,
    scalp: row.scalp,
    note: row.note ?? "",
    remoteId: row.id,
  }));
}

export async function upsertRemoteEntry(supabase, userId, entry) {
  const { error } = await supabase.from("tracker_entries").upsert(
    {
      user_id: userId,
      entry_date: entry.date,
      shedding: entry.shedding,
      scalp: entry.scalp,
      note: entry.note ?? "",
    },
    { onConflict: "user_id,entry_date" }
  );
  if (error) throw error;
}

export async function deleteRemoteEntry(supabase, userId, date) {
  const { error } = await supabase
    .from("tracker_entries")
    .delete()
    .eq("user_id", userId)
    .eq("entry_date", date);
  if (error) throw error;
}

export async function importLocalToRemote(supabase, userId) {
  const local = loadLocalEntries();
  if (local.length === 0) return 0;
  const rows = local.map((e) => ({
    user_id: userId,
    entry_date: e.date,
    shedding: e.shedding,
    scalp: e.scalp,
    note: e.note ?? "",
  }));
  const { error } = await supabase
    .from("tracker_entries")
    .upsert(rows, { onConflict: "user_id,entry_date" });
  if (error) throw error;
  clearLocalEntries();
  return local.length;
}

// ── Shared helpers ─────────────────────────────────────────────────

export function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function sortByDate(entries) {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

export function summarize(entries) {
  const sorted = sortByDate(entries);
  if (sorted.length < 6) return null;
  const size = Math.max(2, Math.floor(sorted.length / 3));
  const avg = (list) =>
    list.reduce((sum, e) => sum + e.shedding, 0) / list.length;
  const first = avg(sorted.slice(0, size));
  const last = avg(sorted.slice(-size));
  const change = last - first;
  const percent = first === 0 ? 0 : (change / first) * 100;
  let trend = "steady";
  if (percent <= -15) trend = "lower";
  else if (percent >= 15) trend = "higher";
  return { first, last, percent, trend };
}