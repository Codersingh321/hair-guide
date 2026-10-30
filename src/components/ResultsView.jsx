import { useState } from "react";
import { Link } from "react-router-dom";
import { causes } from "../data/checkerData.js";
import { tips } from "../data/profileData.js";
import { resultsContent, supplementNote } from "../data/resultsContent.js";
import { sexExtras } from "../data/profileExtra.js";
import { calculateResults, getTips } from "../utils/scoring.js";

const RANK_LABELS = ["Most likely", "Also possible", "Less likely"];
const COST_LABELS = { free: "Free", low: "Low cost", medium: "Costs more" };
const EVIDENCE_LABELS = {
  strong: { text: "Well supported", className: "badge badge-strong" },
  limited: { text: "Limited evidence", className: "badge badge-limited" },
  weak: { text: "Little or no evidence", className: "badge badge-weak" },
};

const TABS = [
  { id: "problem", label: "Problem" },
  { id: "solutions", label: "Solutions" },
  { id: "diet", label: "Diet" },
  { id: "avoid", label: "Avoid" },
];

// Where each personal tip appears. Any tip not listed goes to "solutions".
const TIP_SECTION = {
  "plant-protein": "diet",
  "animal-protein": "diet",
  b12: "diet",
  "budget-low": "avoid",
};

function BulletList({ items, kind }) {
  return (
    <ul className={"result-list" + (kind === "avoid" ? " avoid" : "")}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function TipList({ tips: list }) {
  if (list.length === 0) return null;
  return (
    <div>
      <p className="result-sub">For your situation, cheapest first</p>
      {list.map((tip) => {
        const evidence = tip.evidence && EVIDENCE_LABELS[tip.evidence];
        return (
          <div className="tip-mini" key={tip.id}>
            <span className="badge badge-cost">{COST_LABELS[tip.cost]}</span>
            {evidence && (
              <span className={evidence.className}>{evidence.text}</span>
            )}
            <p>{tip.text}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function ResultsView({
  visible,
  answers,
  profile,
  onRestart,
  onBack,
}) {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState("problem");

  const { ranked, redFlags } = calculateResults(
    visible,
    answers,
    causes,
    profile
  );

  if (ranked.length === 0) {
    return (
      <div>
        <h1>Your results</h1>
        {redFlags.length > 0 && (
          <div className="red-flags">
            <h3>Please see a doctor about:</h3>
            <ul>
              {redFlags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="card">
          <p>
            Your answers don't point to a common cause we can explain here.
            Please check with a doctor or dermatologist.
          </p>
        </div>
        <div className="result-actions">
          <button onClick={onRestart}>Start again</button>
        </div>
      </div>
    );
  }

  const cause = ranked[selected] ?? ranked[0];
  const content = resultsContent[cause.id] ?? {
    short: cause.title,
    problem: cause.description,
    solutions: cause.care ?? [],
    diet: [],
    avoid: [],
  };

  // Short extra line for women or men, when we have one for this cause
  const extra = sexExtras[cause.id]?.[profile.sex];
  const solutions = extra?.solution
    ? [extra.solution, ...content.solutions]
    : content.solutions;

  const personalTips = getTips(tips, profile, [cause], answers.concern);
  const tipsFor = (section) =>
    personalTips.filter((t) => (TIP_SECTION[t.id] ?? "solutions") === section);

  const tabIndex = TABS.findIndex((t) => t.id === tab);

  function pickCause(i) {
    setSelected(i);
    setTab("problem");
  }

  return (
    <div>
      <h1>Your results</h1>
      <p className="summary">
        These are possibilities based on your answers, not a diagnosis.
      </p>

      {profile.ageGroup === "u18" && (
        <div className="note-callout" style={{ marginBottom: 16 }}>
          You are under 18, so please talk to a parent or guardian and a
          doctor before trying any product, medicine, or supplement. Hair
          changes at your age are best checked in person.
        </div>
      )}

      {redFlags.length > 0 && (
        <div className="red-flags">
          <h3>Please see a doctor about:</h3>
          <ul>
            {redFlags.map((flag, i) => (
              <li key={i}>{flag}</li>
            ))}
          </ul>
        </div>
      )}

      {ranked.length > 1 && (
        <div className="cause-chips">
          {ranked.map((c, i) => (
            <button
              type="button"
              key={c.id}
              className={"chip" + (i === selected ? " selected" : "")}
              onClick={() => pickCause(i)}
            >
              {resultsContent[c.id]?.short ?? c.title}
            </button>
          ))}
        </div>
      )}

      <div className="card result-card">
        <div className="result-head">
          <span className="badge badge-strong">{RANK_LABELS[selected]}</span>
          <h2>{cause.title}</h2>
        </div>

        <div className="result-tabs" role="tablist">
          {TABS.map((t, i) => (
            <button
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              key={t.id}
              className={"result-tab" + (tab === t.id ? " active" : "")}
              onClick={() => setTab(t.id)}
            >
              <span className="num">{i + 1}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="result-body" key={cause.id + tab}>
          {tab === "problem" && (
            <div>
              <p className="result-lead">{content.problem}</p>
              {extra?.problem && (
                <p className="result-lead result-extra">{extra.problem}</p>
              )}
            </div>
          )}

          {tab === "solutions" && (
            <div>
              <BulletList items={solutions} />
              <TipList tips={tipsFor("solutions")} />
            </div>
          )}

          {tab === "diet" && (
            <div>
              <BulletList items={content.diet} />
              <TipList tips={tipsFor("diet")} />
              <div className="note-callout">{supplementNote}</div>
            </div>
          )}

          {tab === "avoid" && (
            <div>
              <BulletList items={content.avoid} kind="avoid" />
              <TipList tips={tipsFor("avoid")} />
            </div>
          )}
        </div>

        <div className="result-foot">
          {tabIndex > 0 ? (
            <button
              type="button"
              className="link-btn"
              onClick={() => setTab(TABS[tabIndex - 1].id)}
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {tabIndex < TABS.length - 1 ? (
            <button type="button" onClick={() => setTab(TABS[tabIndex + 1].id)}>
              Next: {TABS[tabIndex + 1].label} →
            </button>
          ) : (
            <span className="progress-text">That's everything for this one.</span>
          )}
        </div>
      </div>

      {profile.note.trim() && (
        <div className="user-note">
          <strong>Your note:</strong> {profile.note}
          <br />
          <small>
            We don't analyse notes. Mention this to a doctor if you see one.
          </small>
        </div>
      )}

      <div className="disclaimer-box">
        Educational information only. It is not medical advice and does not
        replace a doctor or dermatologist.
      </div>

      <div className="result-actions">
        <button onClick={onRestart}>Start again</button>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          ← Change my answers
        </button>
        <Link to="/learn" className="btn btn-secondary">
          Read the Learn pages
        </Link>
        <Link to="/tracker" className="btn btn-secondary">
          Track my progress
        </Link>
      </div>
    </div>
  );
}