import { useEffect, useState } from "react";
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
  if (m.includes("only request this after")) return "auth.err.wait";
  if (m.includes("sending confirmation") || m.includes("sending recovery"))
    return "auth.err.sending";
  if (m.includes("failed to fetch")) return "auth.err.network";
  if (m.includes("link has expired")) return "auth.err.expired";
  if (m.includes("different from the old")) return "auth.err.samePw";
  if (m.includes("session missing")) return "auth.err.noSession";
  if (m.includes("don't match")) return "auth.reset.mismatch";
  if (m.includes("weak")) return "auth.err.weak";
  if (m.includes("something went wrong")) return "auth.err.generic";
  return null;
}

const EXPIRED_MESSAGE =
  "This link has expired or was already used. Please request a new reset link.";

// An expired or used reset link comes back with an error in the address
function linkExpired() {
  const h = window.location.hash + window.location.search;
  return (
    h.includes("error_code=otp_expired") || h.includes("error=access_denied")
  );
}

export default function Login() {
  const { t } = useTranslation();
  const {
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    recovering,
    continueAsGuest,
  } = useAuth();
  const navigate = useNavigate();

  // "login" | "signup" | "forgot" | "reset"
  const [mode, setMode] = useState(() => (linkExpired() ? "forgot" : "login"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [is18, setIs18] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [error, setError] = useState(() =>
    linkExpired() ? EXPIRED_MESSAGE : ""
  );
  const [info, setInfo] = useState(""); // "created" | "sent" | ""
  const [resetDone, setResetDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Show the new-password form when the person arrives from a reset link
  useEffect(() => {
    if (recovering) {
      setMode("reset");
      setError("");
      setInfo("");
    }
  }, [recovering]);

  function switchMode(next) {
    setMode(next);
    setError("");
    setInfo("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (mode === "reset" && newPw !== confirmPw) {
      setError("The two passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const result = await signUp(email, password, { is18 });
        if (result.session) {
          // Email confirmation is off, so the user is already logged in
          navigate("/tracker");
        } else {
          setInfo("created");
        }
      } else if (mode === "forgot") {
        await resetPassword(email);
        // The same message appears whether or not the email has an account
        setInfo("sent");
      } else if (mode === "reset") {
        await updatePassword(newPw);
        setResetDone(true);
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

  const key = error ? errorKey(error) : null;
  const shownError = key ? t(key, error) : error;

  const errorBox = error && <p className="auth-error">{shownError}</p>;
  const infoBox = info && (
    <p className="auth-info">
      {info === "sent"
        ? t(
            "auth.forgot.sent",
            "If an account exists for this email, we've sent a password reset link. Please check your email and your spam folder."
          )
        : t(
            "auth.info.created",
            "Account created. Check your email for a confirmation link, then come back to log in."
          )}
    </p>
  );

  // ---------- Choose a new password ----------
  if (mode === "reset") {
    return (
      <div className="auth-wrap">
        <div className="card auth-card">
          <h1 className="auth-title">
            {t("auth.reset.title", "Choose a new password")}
          </h1>

          {resetDone ? (
            <div>
              <p className="auth-info">
                {t("auth.reset.done", "Your password has been changed.")}
              </p>
              <button
                type="button"
                style={{ width: "100%", marginTop: 16 }}
                onClick={() => navigate("/tracker")}
              >
                {t("auth.reset.go", "Go to the tracker")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="field">
                <span>
                  {t("auth.reset.new", "New password (at least 8 characters)")}
                </span>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </label>

              <label className="field">
                <span>{t("auth.reset.confirm", "Type the new password again")}</span>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </label>

              {errorBox}

              <button
                type="submit"
                disabled={loading || newPw.length < 8 || !confirmPw}
                style={{ width: "100%", marginTop: 16 }}
              >
                {loading
                  ? t("auth.wait", "Please wait...")
                  : t("auth.reset.save", "Change password")}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ---------- Forgot password ----------
  if (mode === "forgot") {
    return (
      <div className="auth-wrap">
        <div className="card auth-card">
          <h1 className="auth-title">
            {t("auth.forgot.title", "Reset your password")}
          </h1>
          <p className="auth-sub">
            {t(
              "auth.forgot.intro",
              "Enter your email. If an account exists for it, we'll send a link to choose a new password."
            )}
          </p>

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

            {errorBox}
            {infoBox}

            <button
              type="submit"
              disabled={loading || !email}
              style={{ width: "100%", marginTop: 16 }}
            >
              {loading
                ? t("auth.wait", "Please wait...")
                : t("auth.forgot.send", "Send reset link")}
            </button>
          </form>

          <button
            type="button"
            className="link-btn"
            onClick={() => switchMode("login")}
          >
            {t("auth.forgot.back", "← Back to log in")}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Log in / Create account ----------
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

          {mode === "login" && (
            <button
              type="button"
              className="link-btn forgot-link"
              onClick={() => switchMode("forgot")}
            >
              {t("auth.forgot", "Forgot password?")}
            </button>
          )}

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

          {errorBox}
          {infoBox}

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