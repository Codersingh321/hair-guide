import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TAGLINE } from "../config.js";
import tile1 from "../assets/photos/tile-1.webp";
import tile2 from "../assets/photos/tile-2.webp";
import tile3 from "../assets/photos/tile-3.webp";
import heart from "../assets/photos/promise-heart.webp";

const icons = {
  check: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  ),
  learn: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  tracker: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
};

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      key: "check",
      to: "/check",
      title: t("home.f.check.title", "Symptom Checker"),
      text: t(
        "home.f.check.text",
        "Answer a few questions about your hair and get likely causes, general care steps, and warning signs."
      ),
    },
    {
      key: "learn",
      to: "/learn",
      title: t("home.f.learn.title", "Learn"),
      text: t(
        "home.f.learn.text",
        "Plain explanations of hair fall, greying, and dandruff. Every claim is labelled by how strong the evidence is."
      ),
    },
    {
      key: "tracker",
      to: "/tracker",
      title: t("home.f.tracker.title", "15-Day Tracker"),
      text: t(
        "home.f.tracker.text",
        "Log your shedding and hair condition, then see your early trend on a simple chart."
      ),
    },
  ];

  const steps = [
    {
      key: "s1",
      title: t("home.s1.title", "Tell us about you"),
      text: t(
        "home.s1.text",
        "Share your diet, place, and budget so the tips fit your life."
      ),
    },
    {
      key: "s2",
      title: t("home.s2.title", "Answer a few questions"),
      text: t(
        "home.s2.text",
        "We weigh your answers and show possible causes, not a diagnosis."
      ),
    },
    {
      key: "s3",
      title: t("home.s3.title", "Get honest next steps"),
      text: t(
        "home.s3.text",
        "Free and low-cost steps first, plus clear signs to see a doctor."
      ),
    },
  ];

  return (
    <div className="home-wide">
      <section className="hero3">
        <h1>{t("home.tagline", TAGLINE)}</h1>
        <p>
          {t(
            "home.hero.p",
            "Understand your hair before you spend money on it. Free, research-based guidance on hair fall, greying, and scalp care. We tell you what is proven, what isn't, and when to see a doctor."
          )}
        </p>
        <div className="hero-actions">
          <Link to="/check" className="btn btn-primary">
            {t("home.cta.check", "Check my symptoms")}
          </Link>
          <Link to="/learn" className="btn btn-secondary">
            {t("home.cta.learn", "Learn about hair problems")}
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
          <Link to={f.to} className="card feature-card" key={f.key}>
            <span className="feature-icon">{icons[f.key]}</span>
            <h2>{f.title}</h2>
            <p>{f.text}</p>
          </Link>
        ))}
      </section>

      <section className="steps">
        <h2 className="section-title">{t("home.how.title", "How it works")}</h2>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className="step" key={s.key}>
              <span className="step-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="promise">
        <div className="promise-text">
          <h2>{t("home.promise.title", "Our promise")}</h2>
          <p>
            {t(
              "home.promise.p",
              "No products to sell and no miracle claims. Just honest information."
            )}
          </p>
          <ul className="care-list">
            <li>{t("home.promise.l1", "Free to use, with no account needed")}</li>
            <li>
              {t(
                "home.promise.l2",
                "Every claim labelled by how strong the evidence is"
              )}
            </li>
            <li>{t("home.promise.l3", "Clear signs for when to see a doctor")}</li>
          </ul>
        </div>
        <img className="promise-img" src={heart} alt="" width="720" height="720" loading="lazy" decoding="async" />
      </section>
    </div>
  );
}