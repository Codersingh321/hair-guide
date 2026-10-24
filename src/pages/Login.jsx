import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { SITE_NAME } from "../config.js";

export default function Login() {
  const { signIn, signUp, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is18, setIs18] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await signUp(email, password, { is18 });
        setInfo(
          "Account created. Check your email for a confirmation link, then come back to log in."
        );
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

  const signupReady = is18 && hasConsent && email && password.length >= 8;
  const loginReady = email && password;

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="auth-title">{SITE_NAME}</h1>

        <div className="auth-tabs">
          <button
            className={"auth-tab" + (mode === "login" ? " active" : "")}
            onClick={() => { setMode("login"); setError(""); setInfo(""); }}
            type="button"
          >
            Log in
          </button>
          <button
            className={"auth-tab" + (mode === "signup" ? " active" : "")}
            onClick={() => { setMode("signup"); setError(""); setInfo(""); }}
            type="button"
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
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
            <span>Password {mode === "signup" && "(at least 8 characters)"}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
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
                <span>I am 18 years old or older.</span>
              </label>

              <label className="consent-row">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                />
                <span>
                  I agree that {SITE_NAME} stores my email and tracker entries
                  to sync them across my devices, as described in the{" "}
                  <Link to="/privacy">Privacy page</Link>.
                </span>
              </label>
            </div>
          )}

          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}

          <button
            type="submit"
            disabled={loading || (mode === "signup" ? !signupReady : !loginReady)}
            style={{ width: "100%", marginTop: "16px" }}
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
              ? "Create account"
              : "Log in"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ width: "100%" }}
          onClick={handleGuest}
        >
          Continue as guest
        </button>
        <p className="auth-guest-note">
          Guest data stays only in this browser. If you clear your browser
          data, it is erased.
        </p>
      </div>
    </div>
  );
}