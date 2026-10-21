import { useState } from "react";
import { topics } from "../data/topics.js";

const EVIDENCE_LABELS = {
  strong: { text: "Well supported", className: "badge badge-strong" },
  limited: { text: "Limited evidence", className: "badge badge-limited" },
  weak: { text: "Little or no evidence", className: "badge badge-weak" },
};

export default function Learn() {
  const [openId, setOpenId] = useState(null);
  const selected = topics.find((t) => t.id === openId);

  if (selected) {
    return (
      <div>
        <button onClick={() => setOpenId(null)}>← Back to topics</button>

        <div className="card topic">
          <h1>{selected.title}</h1>
          <p className="summary">{selected.summary}</p>

          <h3>What the research says</h3>
          <ul className="points">
            {selected.points.map((point, index) => {
              const label = EVIDENCE_LABELS[point.evidence];
              return (
                <li key={index}>
                  <span className={label.className}>{label.text}</span>
                  <p>{point.text}</p>
                </li>
              );
            })}
          </ul>

          <div className="red-flags">
            <h3>See a doctor if you notice:</h3>
            <ul>
              {selected.redFlags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))}
            </ul>
          </div>

          <p className="sources">
            <strong>Sources:</strong> {selected.sources.join(", ")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Learn</h1>
      <p>
        Each claim shows how strong the evidence is, so you can see what's
        proven and what isn't.
      </p>

      <div className="topic-list">
        {topics.map((topic) => (
          <div className="card topic-card" key={topic.id}>
            <h2>{topic.title}</h2>
            <p className="summary">{topic.summary}</p>
            <button onClick={() => setOpenId(topic.id)}>Read more</button>
          </div>
        ))}
      </div>
    </div>
  );
}