// Extra profile questions: age group and gender.
// These stay in the browser and are never stored.
export const demographicQuestions = [
  {
    id: "ageGroup",
    text: "What is your age group?",
    options: [
      { value: "u18", label: "Under 18" },
      { value: "18-25", label: "18 to 25" },
      { value: "26-35", label: "26 to 35" },
      { value: "36-45", label: "36 to 45" },
      { value: "46-60", label: "46 to 60" },
      { value: "60+", label: "Over 60" },
      { value: "skip", label: "Prefer not to say" },
    ],
  },
  {
    id: "sex",
    text: "Gender",
    hint: "We ask different questions because causes like hormones can differ between women and men. Choose Prefer not to say for the general set.",
    options: [
      { value: "female", label: "Female" },
      { value: "male", label: "Male" },
      { value: "skip", label: "Prefer not to say" },
    ],
  },
];

// One short, specific line per cause, shown in the results by sex.
// DRAFT: have a doctor review these.
export const sexExtras = {
  pattern: {
    female: {
      problem:
        "In women, pattern thinning usually shows as a wider parting or thinner hair on top. The front hairline often stays.",
      solution:
        "Ask a dermatologist which treatments suit women. Some are not safe in pregnancy.",
    },
    male: {
      problem:
        "In men, pattern thinning often starts at the temples or crown. It tends to progress, so earlier checks give more options.",
      solution: "See a dermatologist before buying treatments online.",
    },
  },
  hormonal: {
    female: {
      problem:
        "Changes in periods, acne, or extra body hair alongside hair loss are worth telling a doctor about.",
      solution:
        "Mention any period changes to the doctor. They may suggest thyroid, iron, and hormone tests.",
    },
    male: {
      problem:
        "Gym supplements, steroids, and other hormone products can affect hair.",
      solution: "Tell the doctor exactly which products you use.",
    },
  },
  nutrition: {
    female: {
      problem:
        "Heavy periods can lower iron, which is a common reason for shedding in women.",
      solution:
        "When you get blood tests, ask whether ferritin (your iron store) can be included.",
    },
    male: {
      problem:
        "Heavy training with low calories or protein, or crash cutting, can cause shedding.",
      solution:
        "Don't crash-diet while training. Eat regular meals with protein.",
    },
  },
  telogen: {
    female: {
      problem:
        "Shedding is common a few months after childbirth and usually settles over several months.",
      solution:
        "If it started after childbirth, be patient and see a doctor if it hasn't settled.",
    },
  },
};