import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
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
    default: function Chart({ data, label }) {
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
              name={label}
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

const TREND_DEFAULT = {
  steady: "about the same",
  lower: "lower",
  higher: "higher",
};

function emptyForm() {
  return { date: todayString(), shedding: "", scalp: "normal", note: "" };
}

export default function Tracker() {
  const { t } = useTranslation();
  const { user, isLoggedIn } = useAuth();
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [imported, setImported] = useState(false);

  // Load entries when the page opens or the user changes
  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      if (isLoggedIn && user) {
        // Import any local entries first (only once per session)
        if (!imported) {
          const count = await importLocalToRemote(supabase, user.id);
          if (count > 0) {
            setMessage(
              t("tr.msg.imported", {
                defaultValue: "Imported {{n}} entries from your browser.",
                n: count,
              })
            );
          }
          setImported(true);
        }
        const remote = await loadRemoteEntries(supabase, user.id);
        setEntries(remote);
      } else {
        setEntries(loadLocalEntries());
      }
    } catch (err) {
      setMessage(
        t("tr.msg.loadFail", {
          defaultValue: "Could not load entries: {{error}}",
          error: err.message,
        })
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user, imported]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Save to localStorage whenever entries change (guest only)
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
  const trendLabel = summary
    ? t(`tr.trend.${summary.trend}`, TREND_DEFAULT[summary.trend])
    : "";

  async function handleSubmit(e) {
    e.preventDefault();
    const count = Number(form.shedding);
    if (
      form.shedding === "" ||
      Number.isNaN(count) ||
      count < 0 ||
      count > 1000
    ) {
      setMessage(
        t("tr.msg.range", "Enter a shedding count between 0 and 1000.")
      );
      return;
    }
    if (form.date > todayString()) {
      setMessage(t("tr.msg.future", "The date can't be in the future."));
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
      setMessage(t("tr.msg.saved", "Saved."));
    } catch (err) {
      setMessage(
        t("tr.msg.saveFail", {
          defaultValue: "Could not save: {{error}}",
          error: err.message,
        })
      );
    }
  }

  function editEntry(entry) {
    setForm({
      date: entry.date,
      shedding: String(entry.shedding),
      scalp: entry.scalp,
      note: entry.note,
    });
    setMessage(
      t("tr.msg.editing", {
        defaultValue: "Editing {{date}}. Press Save to update it.",
        date: entry.date,
      })
    );
  }

  async function deleteEntry(date) {
    try {
      if (isLoggedIn && user) {
        await deleteRemoteEntry(supabase, user.id, date);
      }
      setEntries((prev) => prev.filter((x) => x.date !== date));
    } catch (err) {
      setMessage(
        t("tr.msg.delFail", {
          defaultValue: "Could not delete: {{error}}",
          error: err.message,
        })
      );
    }
  }

  async function clearAll() {
    if (
      !window.confirm(
        t(
          "tr.confirm.all",
          "Delete all tracker entries? This can't be undone."
        )
      )
    )
      return;
    try {
      if (isLoggedIn && user) {
        for (const e of entries) {
          await deleteRemoteEntry(supabase, user.id, e.date);
        }
      }
      setEntries([]);
      setMessage(t("tr.msg.allDeleted", "All entries deleted."));
    } catch (err) {
      setMessage(
        t("tr.msg.delAllFail", {
          defaultValue: "Could not delete all: {{error}}",
          error: err.message,
        })
      );
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
        <p className="progress-text">
          {t("tr.loading", "Loading your entries...")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>{t("tr.title", "15-Day Tracker")}</h1>
      <p className="summary">
        {t(
          "tr.intro",
          "Log once a day for 15 days. Hair changes slowly, so 15 days can show early signs only, not final results."
        )}
        {isLoggedIn
          ? t("tr.intro.synced", " Your entries sync across your devices.")
          : t("tr.intro.local", " Your data stays in this browser.")}
      </p>

      {!isLoggedIn && (
        <div className="guest-banner">
          {t(
            "tr.guest",
            "Guest mode: data is saved in this browser only. If you clear your browser data, it is erased."
          )}{" "}
          <Link to="/login">
            {t("tr.guest.link", "Save my data across devices →")}
          </Link>
        </div>
      )}

      <form className="card" onSubmit={handleSubmit}>
        <h2 className="cause-title">
          {t("tr.form.title", "Add today's log")}
        </h2>

        <label className="field">
          <span>{t("tr.date", "Date")}</span>
          <input
            type="date"
            value={form.date}
            max={todayString()}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>
            {t(
              "tr.shedding",
              "Hairs noticed shedding today (comb, shower, pillow)"
            )}
          </span>
          <input
            type="number"
            min="0"
            max="1000"
            inputMode="numeric"
            placeholder={t("tr.shedding.ph", "For example: 60")}
            value={form.shedding}
            onChange={(e) => setForm({ ...form, shedding: e.target.value })}
            required
          />
        </label>

        <fieldset className="profile-group">
          <legend>{t("tr.scalp", "Scalp today")}</legend>
          <div className="chip-row">
            {SCALP_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={"chip" + (form.scalp === opt.value ? " selected" : "")}
                onClick={() => setForm({ ...form, scalp: opt.value })}
              >
                {t(`tr.scalp.${opt.value}`, opt.label)}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span>{t("tr.note", "Note (optional)")}</span>
          <input
            type="text"
            maxLength={120}
            placeholder={t("tr.note.ph", "For example: washed hair today")}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </label>

        <button type="submit">{t("tr.save", "Save entry")}</button>
        {message && <p className="form-message">{message}</p>}
      </form>

      {entries.length === 0 ? (
        <div className="card">
          <p>
            {t(
              "tr.empty",
              "No entries yet. Add your first log above to start your chart."
            )}
          </p>
        </div>
      ) : (
        <div>
          <div className="card">
            <h2 className="cause-title">
              {t("tr.chart.title", "Shedding over time")}
            </h2>
            <p className="progress-text">
              {t("tr.chart.logged", {
                defaultValue: "{{n}} of 15 days logged",
                n: entries.length,
              })}
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
                fallback={
                  <p className="progress-text">
                    {t("tr.chart.loading", "Loading chart...")}
                  </p>
                }
              >
                <RechartsComponents
                  data={chartData}
                  label={t("tr.chart.line", "Shedding")}
                />
              </Suspense>
            </div>
          </div>

          <div className="card">
            <h2 className="cause-title">
              {t("tr.show.title", "What your log shows")}
            </h2>
            {summary ? (
              <p>
                <Trans
                  i18nKey="tr.show.sentence"
                  defaults="Average shedding in your first entries was <b>{{first}}</b> hairs a day. In your latest entries it was <b>{{last}}</b> ({{trend}}). Day-to-day counts vary a lot, so treat this as a rough signal only."
                  values={{
                    first: summary.first.toFixed(0),
                    last: summary.last.toFixed(0),
                    trend: trendLabel,
                  }}
                  components={{ b: <strong /> }}
                />
                {summary.trend === "higher" &&
                  t(
                    "tr.show.higher",
                    " If shedding keeps rising, please see a doctor or dermatologist."
                  )}
              </p>
            ) : (
              <p>
                {t(
                  "tr.show.need",
                  "Log at least 6 days to see a comparison."
                )}
              </p>
            )}
            <p className="progress-text">
              {t(
                "tr.show.disclaimer",
                "Not medical advice. Counting hairs is imprecise, and a normal day can be anywhere from about 50 to 100 hairs."
              )}
            </p>
          </div>

          <div className="card">
            <h2 className="cause-title">
              {t("tr.entries.title", "Your entries")}
            </h2>
            <div className="table-wrap">
              <table className="entry-table">
                <thead>
                  <tr>
                    <th>{t("tr.col.date", "Date")}</th>
                    <th>{t("tr.col.shed", "Shedding")}</th>
                    <th>{t("tr.col.scalp", "Scalp")}</th>
                    <th>{t("tr.col.note", "Note")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...sorted].reverse().map((e) => (
                    <tr key={e.date}>
                      <td>{e.date}</td>
                      <td>{e.shedding}</td>
                      <td>{t(`tr.scalp.${e.scalp}`, e.scalp)}</td>
                      <td>{e.note}</td>
                      <td className="row-actions">
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => editEntry(e)}
                        >
                          {t("tr.edit", "Edit")}
                        </button>
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => deleteEntry(e.date)}
                        >
                          {t("tr.delete", "Delete")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="result-actions">
              <button type="button" onClick={exportData}>
                {t("tr.export", "Export my data")}
              </button>
              <button
                type="button"
                className="danger-btn"
                onClick={clearAll}
              >
                {t("tr.deleteAll", "Delete all")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}