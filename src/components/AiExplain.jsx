import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";

// The feature stays hidden unless this Vercel setting is "on" (an off switch).
const ENABLED = import.meta.env.VITE_AI_EXPLAIN === "on";

// "Prefer not to say" and "under 18" are deliberately not in this list.
const ADULT_GROUPS = ["18-25", "26-35", "36-45", "46-60", "60+"];

const OPT_IN_KEY = "hairally-ai-optin-v1";

const ERROR_DEFAULTS = {
  user_limit:
    "You've used today's AI explanations. Please try again tomorrow.",
  site_limit:
    "The AI explanation is busy right now. Your result above is complete.",
  not_adult:
    "AI explanations are only for accounts confirmed as 18 or older.",
  not_signed_in: "Please log in again.",
  generic:
    "The AI explanation isn't available right now. Your result above is complete.",
};

function readOptIn() {
  try {
    return localStorage.getItem(OPT_IN_KEY) === "yes";
  } catch {
    return false;
  }
}

function writeOptIn(on) {
  try {
    if (on) localStorage.setItem(OPT_IN_KEY, "yes");
    else localStorage.removeItem(OPT_IN_KEY);
  } catch {
    // Storage blocked: the choice just won't be remembered
  }
}

export default function AiExplain({ causeIds, ageGroup }) {
  const { t, i18n } = useTranslation();
  const { isLoggedIn } = useAuth();
  const [optedIn, setOptedIn] = useState(readOptIn);
  const [ticked, setTicked] = useState(false);
  const [state, setState] = useState({
    status: "idle",
    text: "",
    error: "",
    lang: "",
  });

  const lang = i18n.language === "hi" ? "hi" : "en";

  if (!ENABLED) return null;
  if (!ADULT_GROUPS.includes(ageGroup)) return null;
  if (!causeIds || causeIds.length === 0) return null;

  // Guests: a gentle hint to log in, nothing is sent anywhere
  if (!isLoggedIn) {
    return (
      <div className="ai-card">
        <h2>{t("ai.title", "Explain my result in simple words")}</h2>
        <p>
          {t(
            "ai.login",
            "Want a simple AI explanation? Create a free account or log in."
          )}
        </p>
        <Link to="/login" className="btn btn-secondary">
          {t("ai.login.btn", "Log in / Create account")}
        </Link>
      </div>
    );
  }

  const loading = state.status === "loading";
  const showAnswer = state.status === "done" && state.lang === lang;
  const showError = state.status === "error";

  async function run() {
    if (!optedIn) {
      writeOptIn(true);
      setOptedIn(true);
    }
    setState({ status: "loading", text: "", error: "", lang });

    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (!token) {
        setState({ status: "error", text: "", error: "not_signed_in", lang });
        return;
      }

      // Only cause names and the language are sent. Never any text the person typed.
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ causes: causeIds.slice(0, 3), lang }),
      });

      let body = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }

      if (res.ok && body?.text) {
        setState({ status: "done", text: body.text, error: "", lang });
        return;
      }

      const code = body?.error;
      setState({
        status: "error",
        text: "",
        error: ERROR_DEFAULTS[code] ? code : "generic",
        lang,
      });
    } catch {
      setState({ status: "error", text: "", error: "generic", lang });
    }
  }

  function turnOff() {
    writeOptIn(false);
    setOptedIn(false);
    setTicked(false);
    setState({ status: "idle", text: "", error: "", lang: "" });
  }

  return (
    <div className="ai-card">
      <h2>{t("ai.title", "Explain my result in simple words")}</h2>
      <p>
        {t(
          "ai.intro",
          "Get a short, easy explanation of your result, written by an AI. It is optional."
        )}
      </p>

      {!optedIn && (
        <div>
          <div className="ai-notice">
            {t(
              "ai.notice",
              "When you press the button, the names of the possible causes shown in your result and your language are sent to an outside AI service that works outside India. Your answers, age group, gender, diet, place, budget, notes, and email are not sent. The AI can make mistakes."
            )}{" "}
            <Link to="/privacy">{t("ai.privacyLink", "Read the Privacy page")}</Link>
          </div>
          <label className="ai-consent">
            <input
              type="checkbox"
              checked={ticked}
              onChange={(e) => setTicked(e.target.checked)}
            />
            <span>{t("ai.consent", "I have read this and I agree.")}</span>
          </label>
        </div>
      )}

      {!showAnswer && (
        <button
          type="button"
          onClick={run}
          disabled={loading || (!optedIn && !ticked)}
        >
          {loading
            ? t("ai.loading", "Writing...")
            : t("ai.button", "Explain my result")}
        </button>
      )}

      {showError && (
        <p className="ai-error">
          {t(`ai.err.${state.error}`, ERROR_DEFAULTS[state.error])}
        </p>
      )}

      {showAnswer && (
        <div>
          <div className="ai-answer">
            {state.text.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <p className="ai-label">
            {t(
              "ai.label",
              "Written by an AI. It rewords the information above in simpler words. It is not a diagnosis and does not replace a doctor."
            )}
          </p>
        </div>
      )}

      {optedIn && (
        <button type="button" className="link-btn ai-off" onClick={turnOff}>
          {t("ai.off", "Turn off AI explanations")}
        </button>
      )}
    </div>
  );
}