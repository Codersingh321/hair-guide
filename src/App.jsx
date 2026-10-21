import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SymptomChecker from "./pages/SymptomChecker.jsx";
import Learn from "./pages/Learn.jsx";
import Tracker from "./pages/Tracker.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="navbar">
        <span className="brand">HairGuide</span>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/check">Symptom Checker</NavLink>
          <NavLink to="/learn">Learn</NavLink>
          <NavLink to="/tracker">Tracker</NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check" element={<SymptomChecker />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        Educational information only. Not medical advice. See a doctor or
        dermatologist for diagnosis and treatment.
      </footer>
    </div>
  );
}