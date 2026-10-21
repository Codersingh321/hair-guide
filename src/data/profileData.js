const has = (ctx, ...ids) => ids.some((id) => ctx.causeIds.includes(id));

export const profileQuestions = [
  {
    id: "diet",
    text: "What best describes your diet?",
    options: [
      { value: "veg", label: "Vegetarian (no eggs)" },
      { value: "egg", label: "Vegetarian with eggs" },
      { value: "nonveg", label: "Non-vegetarian" },
      { value: "vegan", label: "Vegan" },
      { value: "skip", label: "Prefer not to say" },
    ],
  },
  {
    id: "place",
    text: "Where do you live?",
    options: [
      { value: "city", label: "City" },
      { value: "town", label: "Town" },
      { value: "village", label: "Village" },
      { value: "skip", label: "Prefer not to say" },
    ],
  },
  {
    id: "budget",
    text: "What is your budget for hair care?",
    options: [
      { value: "low", label: "Very limited: free or cheap steps first" },
      { value: "medium", label: "Moderate" },
      { value: "flexible", label: "Flexible" },
      { value: "skip", label: "Prefer not to say" },
    ],
  },
];

export const extraConcerns = [
  { value: "itching", label: "Itching" },
  { value: "breakage", label: "Hair breaks easily" },
  { value: "oily", label: "Oily scalp" },
  { value: "dry", label: "Dry, rough hair" },
];

// Each tip: when(profile, ctx) decides if it is shown.
// cost: "free" | "low" | "medium". evidence (optional): "strong" | "limited" | "weak".
export const tips = [
  {
    id: "plant-protein",
    cost: "low",
    evidence: "limited",
    when: (p, ctx) =>
      (p.diet === "veg" || p.diet === "vegan") &&
      (ctx.hairFall || has(ctx, "nutrition", "telogen")),
    text: "Affordable protein and iron sources: dal, chana, rajma, moong, soy chunks, peanuts, curd, and green leafy vegetables. Try to include one in each main meal. Having lemon or amla with iron-rich meals helps your body absorb the iron.",
  },
  {
    id: "animal-protein",
    cost: "low",
    evidence: "limited",
    when: (p, ctx) => (p.diet === "egg" || p.diet === "nonveg") && ctx.hairFall,
    text: "Eggs, milk, curd, fish, and chicken are good protein sources. Eggs and pulses are usually the cheapest options.",
  },
  {
    id: "b12",
    cost: "low",
    evidence: "limited",
    when: (p, ctx) =>
      (p.diet === "veg" || p.diet === "vegan") &&
      (ctx.grey || has(ctx, "nutrition", "greyCheck")),
    text: "Vitamin B12 comes mainly from animal foods, so vegetarians and especially vegans can run low. Ask a doctor about a B12 blood test before buying supplements.",
  },
  {
    id: "budget-low",
    cost: "free",
    when: (p) => p.budget === "low",
    text: "Skip expensive growth kits, serums, and supplements until a doctor says you need them. Balanced meals, gentle washing, and looser hairstyles cost nothing and are the right place to start.",
  },
  {
    id: "health-centre",
    cost: "low",
    when: (p, ctx) =>
      (p.place === "village" || p.place === "town") &&
      has(ctx, "nutrition", "hormonal", "greyCheck", "telogen"),
    text: "Ask at your nearest government health centre or district hospital about basic blood tests (such as haemoglobin and thyroid) and what they cost there. Availability and prices vary.",
  },
  {
    id: "telemedicine",
    cost: "free",
    when: (p) => p.place === "village" || p.place === "town",
    text: "e-Sanjeevani is a government telemedicine service for consulting a doctor remotely. Check whether it is available in your area.",
  },
  {
    id: "city-dust",
    cost: "free",
    evidence: "limited",
    when: (p, ctx) => p.place === "city" && (ctx.hairFall || ctx.scalp),
    text: "Dust and pollution can build up on the scalp. Wash regularly with a gentle shampoo and cover your hair on dusty commutes.",
  },
  {
    id: "hard-water",
    cost: "free",
    evidence: "limited",
    when: (p, ctx) => ctx.hairFall || ctx.scalp,
    text: "If your tap water is hard (white marks on taps, soap that does not lather well), rinse your hair thoroughly so no shampoo residue is left. Evidence that hard water causes hair loss is limited.",
  },
  {
    id: "medicated-shampoo",
    cost: "low",
    evidence: "strong",
    when: (p, ctx) => has(ctx, "scalp"),
    text: "Anti-dandruff shampoos with ketoconazole or zinc pyrithione are sold at most pharmacies. Ask the pharmacist for a low-cost generic and follow the label.",
  },
  {
    id: "breakage",
    cost: "low",
    evidence: "limited",
    when: (p) => p.extras.includes("breakage") || p.extras.includes("dry"),
    text: "Use a wide-tooth comb, be gentle with wet hair, and limit heat. Plain oil before washing may reduce damage from friction. Evidence that oils grow hair is limited.",
  },
  {
    id: "pattern-cost",
    cost: "medium",
    when: (p, ctx) => has(ctx, "pattern"),
    text: "If a doctor confirms genetic thinning, treatments exist but usually need long-term use. Ask about the total monthly cost and generic options before you start.",
  },
];