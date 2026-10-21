// Returns only the questions that should be shown for the current answers.
export function getVisibleQuestions(questions, answers) {
  return questions.filter((q) => !q.showIf || q.showIf(answers));
}

// Adds up points per cause, collects red flags, and returns the top 3 causes.
export function calculateResults(visibleQuestions, answers, causes) {
  const scores = {};
  const redFlags = [];

  for (const q of visibleQuestions) {
    const chosen = answers[q.id];
    if (chosen === undefined) continue;

    const option = q.options.find((o) => o.value === chosen);
    if (!option) continue;

    if (option.scores) {
      for (const [causeId, points] of Object.entries(option.scores)) {
        scores[causeId] = (scores[causeId] || 0) + points;
      }
    }
    if (option.redFlag) {
      redFlags.push(option.redFlag);
    }
  }

  const ranked = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id, score]) => ({ id, score, ...causes[id] }));

  return { ranked, redFlags };
}