import { Link } from "react-router-dom";

const features = [
  {
    title: "Symptom Checker",
    text: "Answer a few questions about your hair and get likely causes, general care steps, and warning signs.",
    to: "/check",
  },
  {
    title: "Learn",
    text: "Plain explanations of hair fall, greying, and dandruff. Every claim is labelled by how strong the evidence is.",
    to: "/learn",
  },
  {
    title: "15-Day Tracker",
    text: "Log your shedding and hair condition, then see your early trend on a simple chart.",
    to: "/tracker",
  },
];

export default function Home() {
  return (
    <div>
      <section className="hero">
        <h1>Understand your hair before you spend money on it</h1>
        <p>
          Free, research-based guidance on hair fall, greying, and scalp care.
          We tell you what is proven, what isn't, and when to see a doctor.
        </p>
        <div className="hero-actions">
          <Link to="/check" className="btn btn-primary">
            Check my symptoms
          </Link>
          <Link to="/learn" className="btn btn-secondary">
            Learn about hair problems
          </Link>
        </div>
      </section>

      <section className="features">
        {features.map((f) => (
          <Link to={f.to} className="card feature-card" key={f.title}>
            <h2>{f.title}</h2>
            <p>{f.text}</p>
          </Link>
        ))}
      </section>

      <section className="trust">
        <strong>Our promise:</strong> No products to sell, no miracle claims.
        Just honest, evidence-labelled information.
      </section>
    </div>
  );
}