import { useState, useEffect, useCallback } from "react";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";
import {
  loadLocalEntries,
  saveLocalEntries,
  loadRemoteEntries,
  upsertRemoteEntry,
  deleteRemoteEntry,
  importLocalToRemote,
  todayString,
  sortByDate,
  summarize,
} from "../utils/trackerStorage.js";

const RechartsComponents = lazy(() =>
  import("recharts").then((m) => ({
    default: function Chart({ data }) {
      return (
        <m.ResponsiveContainer width="100%" height={260}>
          <m.LineChart data={data}>
            <m.CartesianGrid strokeDasharray="3 3" stroke="#e4e0d6" />
            <m.XAxis dataKey="date" />
            <m.YAxis allowDecimals={false} />
            <m.Tooltip />
            <m.Line
              type="monotone"
              dataKey="shedding"
              stroke="#2f6f5e"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </m.LineChart>
        </m.ResponsiveContainer>
      );
    },
  }))
);

const SCALP_OPTIONS = [
  { value: "normal", label: "Normal" },
  { value: "itchy", label: "Itchy" },
  { value: "flaky", label: "Flaky" },
  { value: "oily", label: "Oily" },
];

function emptyForm() {
  return { date: todayString(), shedding: "", scalp: "normal", note: "" };
}

export default function Tracker() {
  const { user, isLoggedIn } = useAuth();
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [imported, setImported] = useState(false);

  // Load entries when component mounts or user changes
  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      if (isLoggedIn && user) {
        // Import any local entries first (only once per session)
        if (!imported) {
          const count = await importLocalToRemote(supabase, user.id);
          if (count > 0) {
            setMessage(`Imported ${count} entries from your browser.`);
          }
          setImported(true);
        }
        const remote = await loadRemoteEntries(supabase, user.id);
        setEntries(remote);
      } else {
        setEntries(loadLocalEntries());
      }
    } catch (err) {
      setMessage("Could not load entries: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user, imported]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Save local entries to localStorage whenever they change (guest only)
  useEffect(() => {
    if (!isLoggedIn) {
      saveLocalEntries(entries);
    }
  }, [entries, isLoggedIn]);

  const sorted = sortByDate(entries);
  const summary = summarize(entries);
  const chartData = sorted.map((e) => ({
    date: e.date.slice(5),
    shedding: e.shedding,
  }));

  async function handleSubmit(e) {
    e.preventDefault();
    const count = Number(form.shedding);
    if (form.shedding === "" || Number.isNaN(count) || count < 0 || count > 1000) {
      setMessage("Enter a shedding count between 0 and 1000.");
      return;
    }
    if (form.date > todayString()) {
      setMessage("The date can't be in the future.");
      return;
    }

    const entry = {
      date: form.date,
      shedding: Math.round(count),
      scalp: form.scalp,
      note: form.note.trim(),
    };

    try {
      if (isLoggedIn && user) {
        await upsertRemoteEntry(supabase, user.id, entry);
        const remote = await loadRemoteEntries(supabase, user.id);
        setEntries(remote);
      } else {
        const others = entries.filter((x) => x.date !== entry.date);
        setEntries([...others, entry]);
      }
      setForm(emptyForm());
      setMessage("Saved.");
    } catch (err) {
      setMessage("Could not save: " + err.message);
    }
  }

  function editEntry(entry) {
    setForm({
      date: entry.date,
      shedding: String(entry.shedding),
      scalp: entry.scalp,
      note: entry.note,
    });
    setMessage("Editing " + entry.date + ". Press Save to update it.");
  }

  async function deleteEntry(date) {
    try {
      if (isLoggedIn && user) {
        await deleteRemoteEntry(supabase, user.id, date);
        setEntries((prev) => prev.filter((x) => x.date !== date));
      } else {
        setEntries((prev) => prev.filter((x) => x.date !== date));
      }
    } catch (err) {
      setMessage("Could not delete: " + err.message);
    }
  }

  async function clearAll() {
    if (!window.confirm("Delete all tracker entries? This can't be undone.")) return;
    try {
      if (isLoggedIn && user) {
        for (const e of entries) {
          await deleteRemoteEntry(supabase, user.id, e.date);
        }
      }
      setEntries([]);
      setMessage("All entries deleted.");
    } catch (err) {
      setMessage("Could not delete all: " + err.message);
    }
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(sorted, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hairally-tracker.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="card">
        <p className="progress-text">Loading your entries...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>15-Day Tracker</h1>
      <p className="summary">
        Log once a day for 15 days. Hair changes slowly, so 15 days can show
        early signs only, not final results.
        {isLoggedIn
          ? " Your entries sync across your devices."
          : " Your data stays in this browser."}
      </p>

      {!isLoggedIn && (
        <div className="guest-banner">
          Guest mode: data is saved in this browser only. If you clear your
          browser data, it is erased.{" "}
          <Link to="/login">Save my data across devices →</Link>
        </div>
      )}

      <form className="card" onSubmit={handleSubmit}>
        <h2 className="cause-title">Add today's log</h2>

        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={form.date}
            max={todayString()}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>Hairs noticed shedding today (comb, shower, pillow)</span>
          <input
            type="number"
            min="0"
            max="1000"
            inputMode="numeric"
            placeholder="For example: 60"
            value={form.shedding}
            onChange={(e) => setForm({ ...form, shedding: e.target.value })}
            required
          />
        </label>

        <fieldset className="profile-group">
          <legend>Scalp today</legend>
          <div className="chip-row">
            {SCALP_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={"chip" + (form.scalp === opt.value ? " selected" : "")}
                onClick={() => setForm({ ...form, scalp: opt.value })}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>Note (optional)</span>
          <input
            type="text"
            maxLength={120}
            placeholder="For example: washed hair today"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </label>

        <button type="submit">Save entry</button>
        {message && <p className="form-message">{message}</p>}
      </form>

      {entries.length === 0 ? (
        <div className="card">
          <p>No entries yet. Add your first log above to start your chart.</p>
        </div>
      ) : (
        <div>
          <div className="card">
            <h2 className="cause-title">Shedding over time</h2>
            <p className="progress-text">
              {entries.length} of 15 days logged
            </p>
            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min(100, (entries.length / 15) * 100)}%`,
                }}
              />
            </div>
            <div className="chart-box">
              <Suspense
                fallback={<p className="progress-text">Loading chart...</p>}
              >
                <RechartsComponents data={chartData} />
              </Suspense>
            </div>
          </div>

          <div className="card">
            <h2 className="cause-title">What your log shows</h2>
            {summary ? (
              <p>
                Average shedding in your first entries was{" "}
                <strong>{summary.first.toFixed(0)}</strong> hairs a day. In
                your latest entries it was{" "}
                <strong>{summary.last.toFixed(0)}</strong> (
                {summary.trend === "steady"
                  ? "about the same"
                  : summary.trend === "lower"
                  ? "lower"
                  : "higher"}
                ). Day-to-day counts vary a lot, so treat this as a rough
                signal only.
                {summary.trend === "higher" &&
                  " If shedding keeps rising, please see a doctor or dermatologist."}
              </p>
            ) : (
              <p>Log at least 6 days to see a comparison.</p>
            )}
            <p className="progress-text">
              Not medical advice. Counting hairs is imprecise, and a normal
              day can be anywhere from about 50 to 100 hairs.
            </p>
          </div>

          <div className="card">
            <h2 className="cause-title">Your entries</h2>
            <div className="table-wrap">
              <table className="entry-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Shedding</th>
                    <th>Scalp</th>
                    <th>Note</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...sorted].reverse().map((e) => (
                    <tr key={e.date}>
                      <td>{e.date}</td>
                      <td>{e.shedding}</td>
                      <td>{e.scalp}</td>
                      <td>{e.note}</td>
                      <td className="row-actions">
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => editEntry(e)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => deleteEntry(e.date)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="result-actions">
              <button type="button" onClick={exportData}>
                Export my data
              </button>
              <button
                type="button"
                className="danger-btn"
                onClick={clearAll}
              >
                Delete all
              </button>