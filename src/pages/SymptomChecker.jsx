import { useState } from "react";
import { useTranslation } from "react-i18next";
import { questions } from "../data/questions.js";
import { profileQuestions, extraConcerns } from "../data/profileData.js";
import { demographicQuestions } from "../data/profileExtra.js";
import { getVisibleQuestions } from "../utils/scoring.js";
import ResultsView from "../components/ResultsView.jsx";

const emptyProfile = {
  ageGroup: "",
  sex: "",
  diet: "",
  place: "",
  budget: "",
  extras: [],
  note: "",
};

// Age and gender come first, then diet, place, and budget.
const allProfileQuestions = [...demographicQuestions, ...profileQuestions];

export default function SymptomChecker() {
  const { t } = useTranslation();
  const [stage, setStage] = useState("profile");
  const [profile, setProfile] = useState(emptyProfile);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

  const visible = getVisibleQuestions(questions, answers, profile);
  const current = visible[step];

  // Translation helpers: the English text is the default value.
  const pText = (q) => t(`p.${q.id}.text`, q.text);
  const pOpt = (q, o) => t(`p.${q.id}.o.${o.value}`, o.label);
  const qText = (q) => t(`q.${q.id}.text`, q.text);
  const qOpt = (q, o) => t(`q.${q.id}.o.${o.value}`, o.label);

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
    const newVisible = getVisibleQuestions(questions, newAnswers, profile);

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
    const ready =
      profile.ageGroup &&
      profile.sex &&
      profile.diet &&
      profile.place &&
      profile.budget;

    return (
      <div className="card">
        <h1 className="question">
          {t("sc.profile.title", "A little about you")}
        </h1>
        <p className="summary">
          {t(
            "sc.profile.intro",
            "This helps us ask the right questions and make tips that fit you. Everything stays in your browser. Nothing is sent or saved."
          )}
        </p>

        {allProfileQuestions.map((q) => (
          <fieldset className="profile-group" key={q.id}>
            <legend>{pText(q)}</legend>
            {q.hint && <p className="hint">{t(`p.${q.id}.hint`, q.hint)}</p>}
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
                  {pOpt(q, opt)}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        <fieldset className="profile-group">
          <legend>
            {t(
              "sc.profile.extras",
              "Anything else you notice? (optional, pick any)"
            )}
          </legend>
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
                {t(`p.extras.${opt.value}`, opt.label)}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="profile-group">
          <legend>{t("sc.profile.note", "Your own note (optional)")}</legend>
          <textarea
            className="note-box"
            maxLength={300}
            placeholder={t(
              "sc.profile.notePh",
              "For example: hair breaks near the ends"
            )}
            value={profile.note}
            onChange={(e) => setProfile({ ...profile, note: e.target.value })}
          />
        </fieldset>

        <div className="profile-actions">
          <button disabled={!ready} onClick={() => setStage("questions")}>
            {t("sc.continue", "Continue")}
          </button>
          {!ready && (
            <p className="progress-text">
              {t("sc.pickAll", "Pick one option in each group above.")}
            </p>
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
        {total
          ? t("sc.questionOf", {
              defaultValue: "Question {{n}} of {{total}}",
              n: step + 1,
              total,
            })
          : t("sc.question", {
              defaultValue: "Question {{n}}",
              n: step + 1,
            })}
      </p>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <h1 className="question">{qText(current)}</h1>

      <div className="options">
        {current.options.map((opt) => (
          <button
            key={opt.value}
            className={
              "option" + (answers[current.id] === opt.value ? " selected" : "")
            }
            onClick={() => choose(opt.value)}
          >
            {qOpt(current, opt)}
          </button>
        ))}
      </div>

      <button className="link-btn" onClick={goBack}>
        {t("sc.back", "← Back")}
      </button>
    </div>
  );
}