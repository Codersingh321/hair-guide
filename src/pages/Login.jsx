import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";
import { SITE_NAME } from "../config.js";

// Maps the server's English error text to a translatable key.
function errorKey(message = "") {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "auth.err.invalid";
  if (m.includes("already registered")) return "auth.err.exists";
  if (m.includes("not confirmed")) return "auth.err.notConfirmed";
  if (m.includes("rate limit")) return "auth.err.rate";
  if (m.includes("sending confirmation")) return "auth.err.sending";
  if (m.includes("failed to fetch")) return "auth.err.network";
  if (m.includes("something went wrong")) return "auth.err.generic";
  return null;
}

export default function Login() {
  const { t } = useTranslation();
  const { signIn, signUp, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is18, setIs18] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo(false);
    setLoading(true);

    try {
      if (mode === "signup") {
        const result = await signUp(email, password, { is18 });
        if (result.session) {
          // Email confirmation is off, so the user is already logged in
          navigate("/tracker");
        } else {
          setInfo(true);
        }
      } else {
        await signIn(email, password);
        navigate("/tracker");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGuest() {
    continueAsGuest();
    navigate("/");
  }

  function switchMode(next) {
    setMode(next);
    setError("");
    setInfo(false);
  }

  const key = error ? errorKey(error) : null;
  const shownError = key ? t(key, error) : error;

  const signupReady = is18 && hasConsent && email && password.length >= 8;
  const loginReady = email && password;

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="auth-title">{SITE_NAME}</h1>

        <div className="auth-tabs">
          <button
            className={"auth-tab" + (mode === "login" ? " active" : "")}
            onClick={() => switchMode("login")}
            type="button"
          >
            {t("auth.login", "Log in")}
          </button>
          <button
            className={"auth-tab" + (mode === "signup" ? " active" : "")}
            onClick={() => switchMode("signup")}
            type="button"
          >
            {t("auth.create", "Create account")}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>{t("auth.email", "Email")}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span>
              {t("auth.password", "Password")}{" "}
              {mode === "signup" &&
                t("auth.password.min", "(at least 8 characters)")}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
            />
          </label>

          {mode === "signup" && (
            <div className="consent-group">
              <label className="consent-row">
                <input
                  type="checkbox"
                  checked={is18}
                  onChange={(e) => setIs18(e.target.checked)}
                />
                <span>
                  {t("auth.consent.age", "I am 18 years old or older.")}
                </span>
              </label>

              <label className="consent-row">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                />
                <span>
                  <Trans
                    i18nKey="auth.consent.data"
                    defaults="I agree that {{site}} stores my email and tracker entries to sync them across my devices, as described in the <privacy>Privacy page</privacy>."
                    values={{ site: SITE_NAME }}
                    components={{ privacy: <Link to="/privacy" /> }}
                  />
                </span>
              </label>
            </div>
          )}

          {error && <p className="auth-error">{shownError}</p>}
          {info && (
            <p className="auth-info">
              {t(
                "auth.info.created",
                "Account created. Check your email for a confirmation link, then come back to log in."
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={
              loading || (mode === "signup" ? !signupReady : !loginReady)
            }
            style={{ width: "100%", marginTop: "16px" }}
          >
            {loading
              ? t("auth.wait", "Please wait...")
              : mode === "signup"
              ? t("auth.create", "Create account")
              : t("auth.login", "Log in")}
          </button>
        </form>

        <div className="auth-divider">{t("auth.or", "or")}</div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ width: "100%" }}
          onClick={handleGuest}
        >
          {t("auth.guest", "Continue as guest")}
        </button>
        <p className="auth-guest-note">
          {t(
            "auth.guestNote",
            "Guest data stays only in this browser. If you clear your browser data, it is erased."
          )}
        </p>
      </div>
    </div>
  );
}