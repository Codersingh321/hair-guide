import { Routes, Route, NavLink, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SymptomChecker from "./pages/SymptomChecker.jsx";
import Learn from "./pages/Learn.jsx";
import Tracker from "./pages/Tracker.jsx";
import Privacy from "./pages/Privacy.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import logo from "./assets/hairally-logo-800.png";
import { SITE_NAME } from "./config.js";
import "./App.css";

function AccountMenu() {
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  if (user) {
    return (
      <div className="account-menu">
        <span className="account-email">{user.email}</span>
        <button className="link-btn" onClick={handleSignOut}>Log out</button>
        <Link to="/account" className="link-btn">Settings</Link>
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="account-menu">
        <span className="account-email">Guest</span>
        <Link to="/login" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "0.9rem" }}>
          Save my data
        </Link>
      </div>
    );
  }

  return (
    <Link to="/login" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "0.9rem" }}>
      Log in
    </Link>
  );
}

export default function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <p>Loading...</p>
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
          <NavLink to="/">Home</NavLink>
          <NavLink to="/check">Symptom Checker</NavLink>
          <NavLink to="/learn">Learn</NavLink>
          <NavLink to="/tracker">Tracker</NavLink>
        </nav>
        <AccountMenu />
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check" element={<SymptomChecker />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        Educational information only. Not medical advice. See a doctor or
        dermatologist for diagnosis and treatment.
        <br />
        <Link to="/privacy">Privacy</Link>
      </footer>
    </div>
  );
}