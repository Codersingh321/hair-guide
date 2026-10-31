import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { causes } from "../data/checkerData.js";
import { tips } from "../data/profileData.js";
import { resultsContent, supplementNote } from "../data/resultsContent.js";
import { sexExtras } from "../data/profileExtra.js";
import { calculateResults, getTips } from "../utils/scoring.js";

const RANK_DEFAULTS = ["Most likely", "Also possible", "Less likely"];
const COST_DEFAULTS = { free: "Free", low: "Low cost", medium: "Costs more" };
const EVIDENCE = {
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
  const { t } = useTranslation();
  if (list.length === 0) return null;
  return (
    <div>
      <p className="result-sub">
        {t("r.tipsHeading", "For your situation, cheapest first")}
      </p>
      {list.map((tip) => {
        const evidence = tip.evidence && EVIDENCE[tip.evidence];
        return (
          <div className="tip-mini" key={tip.id}>
            <span className="badge badge-cost">
              {t(`r.cost.${tip.cost}`, COST_DEFAULTS[tip.cost])}
            </span>
            {evidence && (
              <span className={evidence.className}>
                {t(`r.ev.${tip.evidence}`, evidence.text)}
              </span>
            )}
            <p>{t(`tip.${tip.id}`, tip.text)}</p>
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
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState("problem");

  const { ranked, redFlags: rawFlags } = calculateResults(
    visible,
    answers,
    causes,
    profile
  );
  const redFlags = rawFlags.map((f) => t(`rf.${f.key}`, f.text));

  const redFlagBox = redFlags.length > 0 && (
    <div className="red-flags">
      <h3>{t("r.rfHeading", "Please see a doctor about:")}</h3>
      <ul>
        {redFlags.map((flag, i) => (
          <li key={i}>{flag}</li>
        ))}
      </ul>
    </div>
  );

  if (ranked.length === 0) {
    return (
      <div>
        <h1>{t("r.title", "Your results")}</h1>
        {redFlagBox}
        <div className="card">
          <p>
            {t(
              "r.none",
              "Your answers don't point to a common cause we can explain here. Please check with a doctor or dermatologist."
            )}
          </p>
        </div>
        <div className="result-actions">
          <button onClick={onRestart}>
            {t("r.restart", "Start again")}
          </button>
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

  const id = cause.id;
  const tList = (section, items) =>
    items.map((text, i) => t(`r.${id}.${section}.${i}`, text));

  const problem = t(`r.${id}.problem`, content.problem);
  const solutionsBase = tList("solutions", content.solutions);
  const diet = tList("diet", content.diet);
  const avoid = tList("avoid", content.avoid);

  // Short extra line for women or men, when we have one for this cause
  const extra = sexExtras[id]?.[profile.sex];
  const extraProblem = extra?.problem
    ? t(`sx.${id}.${profile.sex}.problem`, extra.problem)
    : null;
  const extraSolution = extra?.solution
    ? t(`sx.${id}.${profile.sex}.solution`, extra.solution)
    : null;
  const solutions = extraSolution
    ? [extraSolution, ...solutionsBase]
    : solutionsBase;

  const personalTips = getTips(tips, profile, [cause], answers.concern);
  const tipsFor = (section) =>
    personalTips.filter((x) => (TIP_SECTION[x.id] ?? "solutions") === section);

  const tabLabel = (tb) => t(`r.tab.${tb.id}`, tb.label);
  const tabIndex = TABS.findIndex((x) => x.id === tab);

  function pickCause(i) {
    setSelected(i);
    setTab("problem");
  }

  return (
    <div>
      <h1>{t("r.title", "Your results")}</h1>
      <p className="summary">
        {t(
          "r.summary",
          "These are possibilities based on your answers, not a diagnosis."
        )}
      </p>

      {profile.ageGroup === "u18" && (
        <div className="note-callout" style={{ marginBottom: 16 }}>
          {t(
            "r.u18",
            "You are under 18, so please talk to a parent or guardian and a doctor before trying any product, medicine, or supplement. Hair changes at your age are best checked in person."
          )}
        </div>
      )}

      {redFlagBox}

      {ranked.length > 1 && (
        <div className="cause-chips">
          {ranked.map((c, i) => (
            <button
              type="button"
              key={c.id}
              className={"chip" + (i === selected ? " selected" : "")}
              onClick={() => pickCause(i)}
            >
              {t(`r.${c.id}.short`, resultsContent[c.id]?.short ?? c.title)}
            </button>
          ))}
        </div>
      )}

      <div className="card result-card">
        <div className="result-head">
          <span className="badge badge-strong">
            {t(`r.rank.${selected}`, RANK_DEFAULTS[selected])}
          </span>
          <h2>{t(`r.${id}.title`, cause.title)}</h2>
        </div>

        <div className="result-tabs" role="tablist">
          {TABS.map((tb, i) => (
            <button
              type="button"
              role="tab"
              aria-selected={tab === tb.id}
              key={tb.id}
              className={"result-tab" + (tab === tb.id ? " active" : "")}
              onClick={() => setTab(tb.id)}
            >
              <span className="num">{i + 1}</span>
              {tabLabel(tb)}
            </button>
          ))}
        </div>

        <div className="result-body" key={id + tab}>
          {tab === "problem" && (
            <div>
              <p className="result-lead">{problem}</p>
              {extraProblem && (
                <p className="result-lead result-extra">{extraProblem}</p>
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
              <BulletList items={diet} />
              <TipList tips={tipsFor("diet")} />
              <div className="note-callout">
                {t("r.supplement", supplementNote)}
              </div>
            </div>
          )}

          {tab === "avoid" && (
            <div>
              <BulletList items={avoid} kind="avoid" />
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
              {t("r.back", "← Back")}
            </button>
          ) : (
            <span />
          )}
          {tabIndex < TABS.length - 1 ? (
            <button type="button" onClick={() => setTab(TABS[tabIndex + 1].id)}>
              {t("r.next", {
                defaultValue: "Next: {{label}} →",
                label: tabLabel(TABS[tabIndex + 1]),
              })}
            </button>
          ) : (
            <span className="progress-text">
              {t("r.done", "That's everything for this one.")}
            </span>
          )}
        </div>
      </div>

      {profile.note.trim() && (
        <div className="user-note">
          <strong>{t("r.noteLabel", "Your note:")}</strong> {profile.note}
          <br />
          <small>
            {t(
              "r.noteSmall",
              "We don't analyse notes. Mention this to a doctor if you see one."
            )}
          </small>
        </div>
      )}

      <div className="disclaimer-box">
        {t(
          "r.disclaimer",
          "Educational information only. It is not medical advice and does not replace a doctor or dermatologist."
        )}
      </div>

      <div className="result-actions">
        <button onClick={onRestart}>{t("r.restart", "Start again")}</button>
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          {t("r.change", "← Change my answers")}
        </button>
        <Link to="/learn" className="btn btn-secondary">
          {t("r.learn", "Read the Learn pages")}
        </Link>
        <Link to="/tracker" className="btn btn-secondary">
          {t("r.track", "Track my progress")}
        </Link>
      </div>
    </div>
  );
}