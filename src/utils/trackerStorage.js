const KEY = "hairguide-tracker-v1";

export function loadEntries() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
    // Storage can be full or blocked. The app still works for this session.
  }
}

// Today's date as YYYY-MM-DD in the user's local time.
export function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function sortByDate(entries) {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date));
}

// Compares the average shedding of the first third and last third of entries.
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