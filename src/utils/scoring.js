const COST_ORDER = { free: 0, low: 1, medium: 2 };

// Returns only the questions that should be shown for these answers and profile.
export function getVisibleQuestions(questions, answers, profile = {}) {
  return questions.filter((q) => !q.showIf || q.showIf(answers, profile));
}

// Extra points that come from the profile screen.
export function getProfileScores(profile, concern) {
  const scores = {};
  const add = (id, pts) => {
    scores[id] = (scores[id] || 0) + pts;
  };

  const hairFall = concern === "shedding" || concern === "thinning";
  const grey = concern === "greying";
  const scalp = concern === "scalp";
  const extras = profile.extras || [];
  const age = profile.ageGroup;
  const sex = profile.sex;
  const older = age === "46-60" || age === "60+";
  const adult = age === "18-25" || age === "26-35" || age === "36-45";

  // Diet
  if (profile.diet === "vegan") {
    if (hairFall) add("nutrition", 2);
    if (grey) add("greyCheck", 2);
  }
  if (profile.diet === "veg") {
    if (hairFall) add("nutrition", 1);
    if (grey) add("greyCheck", 1);
  }

  // Things the person noticed
  if (extras.includes("itching") && (hairFall || scalp)) add("scalp", 1);
  if (extras.includes("oily") && (hairFall || scalp)) add("scalp", 1);
  if (extras.includes("breakage") && hairFall) add("styling", 2);
  if (extras.includes("dry") && hairFall) add("styling", 1);

  // Age and sex
  if (concern === "thinning" && sex === "male" && adult) add("pattern", 1);
  if (hairFall && sex === "female" && older) {
    add("hormonal", 1);
    add("pattern", 1);
  }
  if (hairFall && age === "60+") add("pattern", 1);
  if (grey && older) add("greyGenetic", 2);

  return scores;
}

// Adds up points per cause, collects red flags, and returns the top 3 causes.
export function calculateResults(visibleQuestions, answers, causes, profile) {
  const scores = { ...getProfileScores(profile, answers.concern) };
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

// Picks the tips that match the profile and results, cheapest first.
export function getTips(tips, profile, ranked, concern) {
  const ctx = {
    causeIds: ranked.map((c) => c.id),
    concern,
    hairFall: concern === "shedding" || concern === "thinning",
    grey: concern === "greying",
    scalp: concern === "scalp",
  };

  return tips
    .filter((t) => t.when(profile, ctx))
    .sort((a, b) => COST_ORDER[a.cost] - COST_ORDER[b.cost]);
}