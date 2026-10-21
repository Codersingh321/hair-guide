import { useState } from "react";
import { Link } from "react-router-dom";
import { questions, causes } from "../data/checkerData.js";
import { getVisibleQuestions, calculateResults } from "../utils/scoring.js";

const RANK_LABELS = ["Most likely", "Also possible", "Less likely"];

export default function SymptomChecker() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const visible = getVisibleQuestions(questions, answers);
  const current = visible[step];

  function choose(value) {
    let newAnswers = { ...answers, [current.id]: value };

    // If the main concern changes, clear the other answers.
    if (current.id === "concern" && value !== answers.concern) {
      newAnswers = { concern: value };
    }

    setAnswers(newAnswers);
    const newVisible = getVisibleQuestions(questions, newAnswers);

    if (step + 1 >= newVisible.length) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  }

  function goBack() {
    if (done) {
      setDone(false);
      setStep(visible.length - 1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  if (done) {
    const { ranked, redFlags } = calculateResults(visible, answers, causes);

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
                {cause.care.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          ))
        )}

        <div className="disclaimer-box">
          Educational information only. It is not medical advice and does not
          replace a doctor or dermatologist.
        </div>

        <div className="result-actions">
          <button onClick={restart}>Start again</button>
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

      {step > 0 && (
        <button className="link-btn" onClick={goBack}>
          ← Back
        </button>
      )}
    </div>
  );
}