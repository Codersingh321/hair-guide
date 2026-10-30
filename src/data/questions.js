// Symptom checker questions.
// showIf receives (answers, profile), so questions can depend on age and sex.
// DRAFT: have a doctor or medical student review these before launch.

const isHairFall = (a) => a.concern === "shedding" || a.concern === "thinning";
const isGrey = (a) => a.concern === "greying";
const isScalpRelated = (a) => isHairFall(a) || a.concern === "scalp";

const isFemale = (p) => p.sex === "female";
const isMale = (p) => p.sex === "male";
const isOlder = (p) => p.ageGroup === "46-60" || p.ageGroup === "60+";

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

  // ----- Location of thinning: general / male set -----
  {
    id: "location",
    text: "Where is the thinning most noticeable?",
    showIf: (a, p) => isHairFall(a) && !isFemale(p),
    options: [
      { value: "hairline", label: "Hairline or temples", scores: { pattern: 2 } },
      { value: "crown", label: "Crown (top back of the head)", scores: { pattern: 2 } },
      { value: "all", label: "Evenly all over", scores: { telogen: 1, nutrition: 1, hormonal: 1 } },
      { value: "unsure", label: "Not sure" },
    ],
  },

  // ----- Female set -----
  {
    id: "locationFemale",
    text: "Where is the thinning most noticeable?",
    showIf: (a, p) => isHairFall(a) && isFemale(p),
    options: [
      { value: "parting", label: "Parting getting wider, or thinner on top", scores: { pattern: 3 } },
      { value: "hairline", label: "Hairline or temples", scores: { pattern: 1, styling: 1 } },
      { value: "all", label: "Evenly all over", scores: { telogen: 1, nutrition: 1, hormonal: 1 } },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "periods",
    text: "How have your periods been recently?",
    showIf: (a, p) => isHairFall(a) && isFemale(p) && !isOlder(p),
    options: [
      { value: "regular", label: "Regular" },
      { value: "irregular", label: "Irregular", scores: { hormonal: 2 } },
      { value: "heavy", label: "Very heavy", scores: { nutrition: 2 } },
      {
        value: "missed",
        label: "Missed for 3 months or more (and not pregnant)",
        scores: { hormonal: 3, nutrition: 1 },
        redFlag: "Missed periods together with hair changes should be checked by a doctor.",
      },
      { value: "na", label: "Not applicable to me" },
    ],
  },
  {
    id: "menopause",
    text: "Have your periods become irregular or stopped, or have you reached menopause?",
    showIf: (a, p) => isHairFall(a) && isFemale(p) && isOlder(p),
    options: [
      { value: "yes", label: "Yes", scores: { hormonal: 3, pattern: 1 } },
      { value: "no", label: "No, they are still regular" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "hormoneChange",
    text: "In the last 6 months, did any of these apply to you?",
    showIf: (a, p) => isHairFall(a) && isFemale(p) && !isOlder(p),
    options: [
      { value: "birthcontrol", label: "Started, stopped, or changed birth control", scores: { telogen: 2, hormonal: 1 } },
      { value: "hormonemeds", label: "Taking other hormone medicines or fertility treatment", scores: { hormonal: 2 } },
      { value: "none", label: "None of these" },
    ],
  },
  {
    id: "acneHair",
    text: "Have you noticed new acne along the jawline, or new darker hair on your face, chest, or belly?",
    showIf: (a, p) => isHairFall(a) && isFemale(p),
    options: [
      {
        value: "yes",
        label: "Yes",
        scores: { hormonal: 3 },
        redFlag:
          "New acne or extra face or body hair together with hair thinning can be linked to hormonal conditions. A doctor can check this with simple tests.",
      },
      { value: "no", label: "No" },
    ],
  },

  // ----- Male set -----
  {
    id: "maleSupp",
    text: "Do you use protein powders, gym supplements, or any hormone or steroid products?",
    showIf: (a, p) => isHairFall(a) && isMale(p),
    options: [
      { value: "no", label: "No" },
      { value: "gym", label: "Protein powder or gym supplements only" },
      {
        value: "steroids",
        label: "Steroids or other hormone products",
        scores: { hormonal: 2, pattern: 1 },
        redFlag:
          "Steroid or hormone products can affect hair and your health. Please tell a doctor exactly what you use.",
      },
    ],
  },

  // ----- Everyone with hair fall -----
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
    text: "Do you have unusual tiredness, unexplained weight change, or do you often feel cold?",
    showIf: isHairFall,
    options: [
      {
        value: "yes",
        label: "Yes",
        scores: { hormonal: 3, nutrition: 1 },
        redFlag:
          "Hair loss with tiredness, weight change, or feeling cold can point to a thyroid or hormonal issue. A doctor can check this with a simple blood test.",
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

  // ----- Greying -----
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