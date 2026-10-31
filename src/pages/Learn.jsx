import { useState } from "react";
import { useTranslation } from "react-i18next";
import { topics } from "../data/topics.js";
import header from "../assets/photos/learn-header.webp";

const EVIDENCE_LABELS = {
  strong: { text: "Well supported", className: "badge badge-strong" },
  limited: { text: "Limited evidence", className: "badge badge-limited" },
  weak: { text: "Little or no evidence", className: "badge badge-weak" },
};

export default function Learn() {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState(null);
  const selected = topics.find((x) => x.id === openId);

  if (selected) {
    const id = selected.id;
    return (
      <div>
        <button onClick={() => setOpenId(null)}>
          {t("learn.back", "← Back to topics")}
        </button>

        <div className="card topic">
          <h1>{t(`topic.${id}.title`, selected.title)}</h1>
          <p className="summary">{t(`topic.${id}.summary`, selected.summary)}</p>

          <h3>{t("learn.heading", "What the research says")}</h3>
          <ul className="points">
            {selected.points.map((point, index) => {
              const label = EVIDENCE_LABELS[point.evidence];
              return (
                <li key={index}>
                  <span className={label.className}>
                    {t(`r.ev.${point.evidence}`, label.text)}
                  </span>
                  <p>{t(`topic.${id}.point.${index}`, point.text)}</p>
                </li>
              );
            })}
          </ul>

          <div className="red-flags">
            <h3>{t("learn.redflags", "See a doctor if you notice:")}</h3>
            <ul>
              {selected.redFlags.map((flag, index) => (
                <li key={index}>{t(`topic.${id}.rf.${index}`, flag)}</li>
              ))}
            </ul>
          </div>

          <p className="sources">
            <strong>{t("learn.sources", "Sources:")}</strong>{" "}
            {selected.sources.join(", ")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <img
        className="page-banner"
        src={header}
        alt=""
        width="1200"
        height="400"
        decoding="async"
      />
      <h1>{t("learn.title", "Learn")}</h1>
      <p>
        {t(
          "learn.intro",
          "Each claim shows how strong the evidence is, so you can see what's proven and what isn't."
        )}
      </p>

      <div className="topic-list">
        {topics.map((topic) => (
          <div className="card topic-card" key={topic.id}>
            <h2>{t(`topic.${topic.id}.title`, topic.title)}</h2>
            <p className="summary">
              {t(`topic.${topic.id}.summary`, topic.summary)}
            </p>
            <button onClick={() => setOpenId(topic.id)}>
              {t("learn.readMore", "Read more")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}