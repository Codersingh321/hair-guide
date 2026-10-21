import { useState } from "react";
import { Link } from "react-router-dom";
import { questions, causes } from "../data/checkerData.js";
import { profileQuestions, extraConcerns, tips } from "../data/profileData.js";
import {
  getVisibleQuestions,
  calculateResults,
  getTips,
} from "../utils/scoring.js";

const RANK_LABELS = ["Most likely", "Also possible", "Less likely"];
const COST_LABELS = { free: "Free", low: "Low cost", medium: "Costs more" };
const EVIDENCE_LABELS = {
  strong: { text: "Well supported", className: "badge badge-strong" },
  limited: { text: "Limited evidence", className: "badge badge-limited" },
  weak: { text: "Little or no evidence", className: "badge badge-weak" },
};

const emptyProfile = { diet: "", place: "", budget: "", extras: [], note: "" };

export default function SymptomChecker() {
  const [stage, setStage] = useState("profile");
  const [profile, setProfile] = useState(emptyProfile);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  const visible = getVisibleQuestions(questions, answers);
  const current = visible[step];

  function pickProfile(id, value) {
    setProfile({ ...profile, [id]: value });
  }

  function toggleExtra(value) {
    const selected = profile.extras.includes(value);
    setProfile({
      ...profile,
      extras: selected
        ? profile.extras.filter((v) => v !== value)
        : [...profile.extras, value],
    });
  }

  function choose(value) {
    let newAnswers = { ...answers, [current.id]: value };

    // If the main concern changes, clear the other answers.
    if (current.id === "concern" && value !== answers.concern) {
      newAnswers = { concern: value };
    }

    setAnswers(newAnswers);
    const newVisible = getVisibleQuestions(questions, newAnswers);

    if (step + 1 >= newVisible.length) {
      setStage("results");
    } else {
      setStep(step + 1);
    }
  }

  function goBack() {
    if (stage === "results") {
      setStage("questions");
      setStep(visible.length - 1);
    } else if (step > 0) {
      setStep(step - 1);
    } else {
      setStage("profile");
    }
  }

  function restart() {
    setProfile(emptyProfile);
    setAnswers({});
    setStep(0);
    setStage("profile");
  }

  // ---------- Stage 1: profile ----------
  if (stage === "profile") {
    const ready = profile.diet && profile.place && profile.budget;

    return (
      <div className="card">
        <h1 className="question">A little about you</h1>
        <p className="summary">
          This helps us make tips that fit your food, place, and budget.
          Everything stays in your browser. Nothing is sent or saved.
        </p>

        {profileQuestions.map((q) => (
          <fieldset className="profile-group" key={q.id}>
            <legend>{q.text}</legend>
            <div className="chip-row">
              {q.options.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={
                    "chip" + (profile[q.id] === opt.value ? " selected" : "")
                  }
                  onClick={() => pickProfile(q.id, opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <fieldset className="profile-group">
          <legend>Anything else you notice? (optional, pick any)</legend>
          <div className="chip-row">
            {extraConcerns.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={
                  "chip" +
                  (profile.extras.includes(opt.value) ? " selected" : "")
                }
                onClick={() => toggleExtra(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="profile-group">
          <legend>Your own note (optional)</legend>
          <textarea
            className="note-box"
            maxLength={300}
            placeholder="For example: hair breaks near the ends"
            value={profile.note}
            onChange={(e) => setProfile({ ...profile, note: e.target.value })}
          />
        </fieldset>

        <div className="profile-actions">
          <button disabled={!ready} onClick={() => setStage("questions")}>
            Continue
          </button>
          {!ready && (
            <p className="progress-text">Pick one option in each group above.</p>
          )}
        </div>
      </div>
    );
  }

  // ---------- Stage 3: results ----------
  if (stage === "results") {
    const { ranked, redFlags } = calculateResults(
      visible,
      answers,
      causes,
      profile
    );
    const personalTips = getTips(tips, profile, ranked, answers.concern);

    return (
      <div>
        <h1>Your results</h1>
        <p className="summary">
          These are possibilities based on your answers, not a diagnosis.
        </p>

        {redFlags.length > 0 && (
          <div className="red-flags">
            <h3>Please see a doctor about:</h3>
            <ul>
              {redFlags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))}
            </ul>
          </div>
        )}

        {ranked.length === 0 ? (
          <div className="card">
            <p>
              Your answers don't point to a common cause we can explain here.
              Please check with a doctor or dermatologist.
            </p>
          </div>
        ) : (
          ranked.map((cause, index) => (
            <div className="card" key={cause.id}>
              <span className="badge badge-strong">{RANK_LABELS[index]}</span>
              <h2 className="cause-title">{cause.title}</h2>
              <p>{cause.description}</p>
              <h3>General care steps</h3>
              <ul className="care-list">
                {cause.care.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))
        )}

        {personalTips.length > 0 && (
          <div>
            <h2>Tips for your situation</h2>
            <p className="summary">Cheapest options come first.</p>
            {personalTips.map((tip) => {
              const evidence = tip.evidence && EVIDENCE_LABELS[tip.evidence];
              return (
                <div className="card tip-card" key={tip.id}>
                  <span className="badge badge-cost">{COST_LABELS[tip.cost]}</span>
                  {evidence && (
                    <span className={evidence.className}>{evidence.text}</span>
                  )}
                  <p>{tip.text}</p>
                </div>
              );
            })}
          </div>
        )}

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
          <button onClick={restart}>Start again</button>
          <button className="link-btn" onClick={goBack}>
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

  // ---------- Stage 2: questions ----------
  if (!current) return null;

  const total = answers.concern ? visible.length : null;
  const progress = total ? ((step + 1) / total) * 100 : 8;

  return (
    <div className="card">
      <p className="progress-text">
        Question {step + 1}
        {total ? ` of ${total}` : ""}
      </p>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <h1 className="question">{current.text}</h1>

      <div className="options">
        {current.options.map((opt) => (
          <button
            key={opt.value}
            className={
              "option" + (answers[current.id] === opt.value ? " selected" : "")
            }
            onClick={() => choose(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button className="link-btn" onClick={goBack}>
        ← Back
      </button>
    </div>
  );
}