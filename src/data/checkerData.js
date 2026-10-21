const isHairFall = (a) => a.concern === "shedding" || a.concern === "thinning";
const isGrey = (a) => a.concern === "greying";
const isScalpRelated = (a) => isHairFall(a) || a.concern === "scalp";

export const questions = [
  {
    id: "concern",
    text: "What is your main concern?",
    options: [
      { value: "shedding", label: "More hair fall than usual (comb, shower, pillow)", scores: { telogen: 1 } },
      { value: "thinning", label: "Slow thinning (wider parting or receding hairline)", scores: { pattern: 2 } },
      {
        value: "patches",
        label: "Sudden bald patches",
        redFlag:
          "Sudden patchy hair loss can have medical causes (for example, alopecia areata) and should be checked by a doctor or dermatologist.",
      },
      { value: "scalp", label: "Itchy or flaky scalp", scores: { scalp: 2 } },
      { value: "greying", label: "Early greying" },
    ],
  },
  {
    id: "duration",
    text: "How long has this been going on?",
    showIf: isHairFall,
    options: [
      { value: "lt2w", label: "Less than 2 weeks" },
      { value: "2w3m", label: "2 weeks to 3 months", scores: { telogen: 1 } },
      { value: "3m6m", label: "3 to 6 months", scores: { telogen: 1, pattern: 1 } },
      { value: "gt6m", label: "More than 6 months", scores: { pattern: 2 } },
    ],
  },
  {
    id: "trigger",
    text: "In the last 3 months, did any of these happen?",
    showIf: isHairFall,
    options: [
      { value: "illness", label: "High fever, serious illness, or surgery", scores: { telogen: 3 } },
      { value: "childbirth", label: "Childbirth", scores: { telogen: 3 } },
      { value: "stress", label: "A major stressful event", scores: { telogen: 2 } },
      { value: "crashdiet", label: "Crash dieting or rapid weight loss", scores: { telogen: 2, nutrition: 2 } },
      { value: "none", label: "None of these" },
    ],
  },
  {
    id: "family",
    text: "Does hair thinning or baldness run in your family?",
    showIf: isHairFall,
    options: [
      { value: "yes", label: "Yes", scores: { pattern: 3 } },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure", scores: { pattern: 1 } },
    ],
  },
  {
    id: "location",
    text: "Where is the thinning most noticeable?",
    showIf: isHairFall,
    options: [
      { value: "hairline", label: "Hairline or temples", scores: { pattern: 2 } },
      { value: "crown", label: "Parting or crown", scores: { pattern: 2 } },
      { value: "all", label: "Evenly all over", scores: { telogen: 1, nutrition: 1, hormonal: 1 } },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "diet",
    text: "How would you describe your usual diet?",
    showIf: isHairFall,
    options: [
      { value: "balanced", label: "Mostly balanced" },
      { value: "lowprotein", label: "Low in protein or iron-rich foods", scores: { nutrition: 3 } },
      { value: "restrictive", label: "Restrictive, or I often skip meals", scores: { nutrition: 3, telogen: 1 } },
    ],
  },
  {
    id: "body",
    text: "Do you have unusual tiredness, unexplained weight change, feeling cold often, or irregular periods?",
    showIf: isHairFall,
    options: [
      {
        value: "yes",
        label: "Yes",
        scores: { hormonal: 3, nutrition: 1 },
        redFlag:
          "Hair loss with tiredness, weight change, or irregular periods can point to a thyroid or hormonal issue. A doctor can check this with a simple blood test.",
      },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "scalp",
    text: "How does your scalp feel?",
    showIf: isScalpRelated,
    options: [
      { value: "normal", label: "Normal, no symptoms" },
      { value: "flakes", label: "Mild white flakes", scores: { scalp: 2 } },
      { value: "red", label: "Itchy, red, or greasy scales", scores: { scalp: 3 } },
      {
        value: "painful",
        label: "Painful, with pus or thick crusts",
        scores: { scalp: 1 },
        redFlag:
          "A painful scalp with pus or crusting may be an infection or another condition that needs a doctor's check.",
      },
    ],
  },
  {
    id: "styling",
    text: "Do you often use tight hairstyles, heat styling, or chemical treatments?",
    showIf: isHairFall,
    options: [
      { value: "often", label: "Often", scores: { styling: 3 } },
      { value: "sometimes", label: "Sometimes", scores: { styling: 1 } },
      { value: "rarely", label: "Rarely or never" },
    ],
  },
  {
    id: "greyAge",
    text: "When did you start noticing grey hair?",
    showIf: isGrey,
    options: [
      { value: "after30", label: "After age 30", scores: { greyGenetic: 1 } },
      { value: "20to30", label: "Between 20 and 30", scores: { greyGenetic: 2 } },
      { value: "before20", label: "Before age 20", scores: { greyGenetic: 1, greyCheck: 2 } },
    ],
  },
  {
    id: "greyFamily",
    text: "Did your parents or close relatives go grey early?",
    showIf: isGrey,
    options: [
      { value: "yes", label: "Yes", scores: { greyGenetic: 3 } },
      { value: "no", label: "No", scores: { greyCheck: 1 } },
      { value: "unsure", label: "Not sure", scores: { greyGenetic: 1 } },
    ],
  },
  {
    id: "greySpeed",
    text: "How quickly did the greying happen?",
    showIf: isGrey,
    options: [
      { value: "slow", label: "Gradually, over years", scores: { greyGenetic: 2 } },
      { value: "months", label: "A noticeable change within a few months", scores: { greyCheck: 2 } },
      {
        value: "sudden",
        label: "Very suddenly, along with hair loss or scalp changes",
        scores: { greyCheck: 2 },
        redFlag: "Sudden greying together with hair loss or scalp changes should be checked by a doctor.",
      },
    ],
  },
  {
    id: "greyLifestyle",
    text: "Do you smoke, or have long-term high stress or poor sleep?",
    showIf: isGrey,
    options: [
      { value: "yes", label: "Yes", scores: { greyLifestyle: 3 } },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "greyDiet",
    text: "Do you eat very little dairy, eggs, or meat (for example, a strict vegetarian or vegan diet without B12 supplements)?",
    showIf: isGrey,
    options: [
      { value: "yes", label: "Yes", scores: { greyCheck: 3 } },
      { value: "no", label: "No" },
    ],
  },
];

export const causes = {
  telogen: {
    title: "Stress- or illness-related shedding (telogen effluvium)",
    description:
      "Shedding often starts 2 to 3 months after illness, childbirth, major stress, or crash dieting. It is usually temporary, and hair often recovers over several months once the trigger passes.",
    care: [
      "Be patient. Recovery usually takes months, not days.",
      "Eat regular, balanced meals with enough protein.",
      "Prioritise sleep and stress-management routines.",
      "Handle hair gently, especially when wet.",
    ],
  },
  pattern: {
    title: "Genetic pattern thinning (androgenetic hair loss)",
    description:
      "Gradual thinning at the hairline, temples, parting, or crown. It often runs in families and progresses slowly over years.",
    care: [
      "See a dermatologist early. Treatments with evidence exist, but they need a doctor's guidance.",
      "Be cautious of products promising regrowth without evidence.",
      "Take photos in the same light and angle every few weeks to see real change.",
    ],
  },
  nutrition: {
    title: "Possible nutritional factor (iron, vitamin D, B12, or low protein)",
    description:
      "Low levels of some nutrients, or very restrictive eating, can increase shedding.",
    care: [
      "Ask a doctor about simple blood tests before taking any supplements.",
      "Avoid high-dose supplements without a confirmed deficiency.",
      "Eat regular meals with protein sources such as pulses, eggs, dairy, or meat.",
    ],
  },
  hormonal: {
    title: "Possible thyroid or hormonal factor",
    description:
      "Thyroid and hormonal conditions can affect hair, often along with tiredness, weight change, or cycle changes.",
    care: [
      "Book a doctor's visit for a blood test.",
      "Treating the underlying condition often improves hair over time.",
    ],
  },
  scalp: {
    title: "Scalp condition (dandruff or seborrheic dermatitis)",
    description:
      "Flaking and itching are commonly linked to a yeast on the scalp, oil production, and skin sensitivity. It is not caused by poor hygiene.",
    care: [
      "Wash regularly with a gentle shampoo.",
      "Medicated anti-dandruff shampoos have good evidence. Follow the product label.",
      "Avoid scratching hard, which can irritate the scalp.",
      "See a dermatologist if there is no improvement after a few weeks.",
    ],
  },
  styling: {
    title: "Hair damage or tension from styling",
    description:
      "Tight hairstyles, frequent heat, and harsh chemical treatments can break hair or strain follicles.",
    care: [
      "Loosen tight styles and give your hair rest days.",
      "Reduce heat styling and space out chemical treatments.",
      "Use a wide-tooth comb on wet hair.",
    ],
  },
  greyGenetic: {
    title: "Natural or genetic greying",
    description:
      "Genetics and age are the main reasons hair loses colour. Nothing has been proven to reverse it.",
    care: [
      "Henna and hair colour can cover grey temporarily.",
      "Be cautious of products that promise to reverse greying.",
      "Keep your scalp and hair healthy with gentle care.",
    ],
  },
  greyCheck: {
    title: "Possible nutritional or health factor",
    description:
      "Some reports link early greying with low vitamin B12 or other health factors. This is worth checking with a doctor.",
    care: [
      "Ask a doctor about a blood test, including vitamin B12.",
      "Supplements are unlikely to restore colour unless you have a deficiency.",
      "Avoid self-treating with high-dose supplements.",
    ],
  },
  greyLifestyle: {
    title: "Lifestyle factors (limited evidence)",
    description:
      "Smoking has been linked to earlier greying in several studies. Links with stress and sleep are less clear.",
    care: [
      "Quitting smoking is good for your overall health.",
      "Don't expect lifestyle changes to bring back grey hair's colour.",
    ],
  },
};