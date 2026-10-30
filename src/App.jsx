import { useEffect, useRef, useState } from "react";
import { Routes, Route, NavLink, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home.jsx";
import SymptomChecker from "./pages/SymptomChecker.jsx";
import Learn from "./pages/Learn.jsx";
import Tracker from "./pages/Tracker.jsx";
import Privacy from "./pages/Privacy.jsx";
import Login from "./pages/Login.jsx";
import Account from "./pages/Account.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { setLanguage } from "./i18n/index.js";
import logo from "./assets/hairally-logo-800.png";
import { SITE_NAME, CONTACT_EMAIL } from "./config.js";
import "./App.css";

function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const current = i18n.language === "hi" ? "hi" : "en";

  return (
    <div
      className="lang-toggle"
      role="group"
      aria-label={t("lang.label", "Language")}
    >
      <button
        type="button"
        className={current === "en" ? "active" : ""}
        aria-pressed={current === "en"}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={current === "hi" ? "active" : ""}
        aria-pressed={current === "hi"}
        onClick={() => setLanguage("hi")}
      >
        हिं
      </button>
    </div>
  );
}

function AccountMenu() {
  const { t } = useTranslation();
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close the menu on an outside click or the Escape key
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function close() {
    setOpen(false);
  }

  async function handleSignOut() {
    close();
    await signOut();
    navigate("/");
  }

  if (user) {
    const initial = (user.email || "?").charAt(0).toUpperCase();
    return (
      <div className="account-dd" ref={ref}>
        <button
          type="button"
          className="account-trigger"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="avatar">{initial}</span>
          <span className="chev" aria-hidden="true">▾</span>
        </button>

        {open && (
          <div className="dd-panel" role="menu">
            <div className="dd-head">
              <span className="dd-label">
                {t("account.signedIn", "Signed in as")}
              </span>
              <span className="dd-email">{user.email}</span>
            </div>
            <Link to="/account" role="menuitem" className="dd-item" onClick={close}>
              {t("account.settings", "Account settings")}
            </Link>
            <Link to="/tracker" role="menuitem" className="dd-item" onClick={close}>
              {t("account.tracker", "My tracker")}
            </Link>
            <Link to="/privacy" role="menuitem" className="dd-item" onClick={close}>
              {t("account.privacy", "Privacy")}
            </Link>
            <button
              type="button"
              role="menuitem"
              className="dd-item dd-logout"
              onClick={handleSignOut}
            >
              {t("account.logout", "Log out")}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="account-menu">
        <span className="account-email">{t("account.guest", "Guest")}</span>
        <Link to="/login" className="btn btn-primary">
          {t("account.save", "Save my data")}
        </Link>
      </div>
    );
  }

  return (
    <Link to="/login" className="btn btn-primary">
      {t("account.login", "Log in")}
    </Link>
  );
}

export default function App() {
  const { t } = useTranslation();
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <p>{t("loading", "Loading...")}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand-link" aria-label={SITE_NAME + " home"}>
          <img src={logo} alt={SITE_NAME} className="brand-logo" />
        </Link>
        <nav>
          <NavLink to="/" end>{t("nav.home", "Home")}</NavLink>
          <NavLink to="/check">{t("nav.check", "Symptom Checker")}</NavLink>
          <NavLink to="/learn">{t("nav.learn", "Learn")}</NavLink>
          <NavLink to="/tracker">{t("nav.tracker", "Tracker")}</NavLink>
        </nav>
        <div className="navbar-right">
          <LanguageToggle />
          <AccountMenu />
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check" element={<SymptomChecker />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        {t(
          "footer.disclaimer",
          "Educational information only. Not medical advice. See a doctor or dermatologist for diagnosis and treatment."
        )}
        <br />
        <Link to="/privacy">{t("footer.privacy", "Privacy")}</Link>
        {" · "}
        <a href={"mailto:" + CONTACT_EMAIL}>
          {t("footer.feedback", "Feedback")}: {CONTACT_EMAIL}
        </a>
      </footer>

      <nav className="bottom-nav">
        <NavLink to="/" end>{t("nav.home", "Home")}</NavLink>
        <NavLink to="/check">{t("bnav.check", "Check")}</NavLink>
        <NavLink to="/learn">{t("nav.learn", "Learn")}</NavLink>
        <NavLink to="/tracker">{t("nav.tracker", "Tracker")}</NavLink>
      </nav>
    </div>
  );
}