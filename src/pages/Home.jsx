import { Link } from "react-router-dom";
import { TAGLINE } from "../config.js";
import tile1 from "../assets/photos/tile-1.webp";
import tile2 from "../assets/photos/tile-2.webp";
import tile3 from "../assets/photos/tile-3.webp";
import heart from "../assets/photos/promise-heart.webp";

const features = [
  {
    title: "Symptom Checker",
    text: "Answer a few questions about your hair and get likely causes, general care steps, and warning signs.",
    to: "/check",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Learn",
    text: "Plain explanations of hair fall, greying, and dandruff. Every claim is labelled by how strong the evidence is.",
    to: "/learn",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: "15-Day Tracker",
    text: "Log your shedding and hair condition, then see your early trend on a simple chart.",
    to: "/tracker",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

const steps = [
  {
    title: "Tell us about you",
    text: "Share your diet, place, and budget so the tips fit your life.",
  },
  {
    title: "Answer a few questions",
    text: "We weigh your answers and show possible causes, not a diagnosis.",
  },
  {
    title: "Get honest next steps",
    text: "Free and low-cost steps first, plus clear signs to see a doctor.",
  },
];

export default function Home() {
  return (
    <div className="home-wide">
      <section className="hero3">
        <h1>{TAGLINE}</h1>
        <p>
          Understand your hair before you spend money on it. Free,
          research-based guidance on hair fall, greying, and scalp care. We
          tell you what is proven, what isn't, and when to see a doctor.
        </p>
        <div className="hero-actions">
          <Link to="/check" className="btn btn-primary">
            Check my symptoms
          </Link>
          <Link to="/learn" className="btn btn-secondary">
            Learn about hair problems
          </Link>
        </div>

        <div className="hero3-photos" aria-hidden="true">
          <img className="ph" src={tile3} alt="" width="640" height="800" decoding="async" />
          <img className="ph ph-mid" src={tile1} alt="" width="640" height="800" fetchPriority="high" decoding="async" />
          <img className="ph" src={tile2} alt="" width="640" height="800" decoding="async" />
        </div>
      </section>

      <section className="features">
        {features.map((f) => (
          <Link to={f.to} className="card feature-card" key={f.title}>
            <span className="feature-icon">{f.icon}</span>
            <h2>{f.title}</h2>
            <p>{f.text}</p>
          </Link>
        ))}
      </section>

      <section className="steps">
        <h2 className="section-title">How it works</h2>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className="step" key={s.title}>
              <span className="step-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="promise">
        <div className="promise-text">
          <h2>Our promise</h2>
          <p>No products to sell and no miracle claims. Just honest information.</p>
          <ul className="care-list">
            <li>Free to use, with no account needed</li>
            <li>Every claim labelled by how strong the evidence is</li>
            <li>Clear signs for when to see a doctor</li>
          </ul>
        </div>
        <img className="promise-img" src={heart} alt="" width="720" height="720" loading="lazy" decoding="async" />
      </section>
    </div>
  );
}