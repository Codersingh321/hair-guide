import { useState } from "react";
import { questions } from "../data/checkerData.js";
import { profileQuestions, extraConcerns } from "../data/profileData.js";
import { getVisibleQuestions } from "../utils/scoring.js";
import ResultsView from "../components/ResultsView.jsx";

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
    return (
      <ResultsView
        visible={visible}
        answers={answers}
        profile={profile}
        onRestart={restart}
        onBack={goBack}
      />
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