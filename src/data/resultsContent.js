// Short, scannable content for each possible cause.
// DRAFT: check every line against AAD / NHS pages (ideally with a doctor)
// before real users rely on it.

export const supplementNote =
  "Supplements: get a blood test first. Iron, biotin, or vitamins taken without a confirmed deficiency may not help, and high doses of some can cause problems. Ask a doctor or pharmacist.";

export const resultsContent = {
  telogen: {
    short: "Stress shedding",
    problem:
      "Your hair may be shedding more because your body was stressed about 2 to 3 months ago, for example by illness, childbirth, or crash dieting. It is usually temporary.",
    solutions: [
      "Give it time. Hair often recovers over several months once the trigger has passed.",
      "Keep a regular sleep routine and manage stress where you can.",
      "Handle your hair gently, especially when it is wet.",
    ],
    diet: [
      "Eat regular meals with protein in each one: dal, eggs, curd, or paneer.",
      "Add iron-rich foods such as leafy greens, chana, or rajma.",
      "Avoid crash dieting, which can keep the shedding going.",
    ],
    avoid: [
      "Crash diets and skipping meals.",
      "Expensive hair-fall kits before you know the cause.",
      "Harsh chemical treatments while shedding is heavy.",
    ],
  },

  pattern: {
    short: "Genetic thinning",
    problem:
      "Slow thinning at the hairline, temples, or crown that often runs in families. It usually progresses gradually over years.",
    solutions: [
      "See a dermatologist early. Treatments with evidence exist, but they need a doctor's guidance.",
      "Take photos in the same light every few weeks to see real change.",
      "Ask about the monthly cost and generic options before you start anything.",
    ],
    diet: [
      "No food has been proven to reverse genetic thinning.",
      "A balanced diet with enough protein supports the hair you have.",
    ],
    avoid: [
      "Products that promise regrowth without evidence.",
      "Starting prescription treatments without a doctor.",
      "Judging any treatment in the first few weeks.",
    ],
  },

  nutrition: {
    short: "Nutrition",
    problem:
      "Low protein, low iron, other nutrient gaps, or very restrictive eating can increase shedding.",
    solutions: [
      "Ask a doctor about simple blood tests (such as haemoglobin, ferritin, vitamin D, and B12) before treating yourself.",
      "If a deficiency is found, follow the doctor's plan. Hair often improves over months.",
      "Eat regularly and don't skip meals.",
    ],
    diet: [
      "Have protein at every main meal: dal, pulses, eggs, curd, paneer, fish, or chicken.",
      "Eat iron-rich foods such as leafy greens and chana, with lemon or amla to help absorption.",
    ],
    avoid: [
      "High-dose supplements without a confirmed deficiency.",
      "Strict or crash diets.",
      "Tea or coffee right with iron-rich meals, which may reduce iron absorption.",
    ],
  },

  hormonal: {
    short: "Thyroid / hormonal",
    problem:
      "Thyroid or hormonal changes can affect hair, often along with tiredness, weight change, or changes in periods.",
    solutions: [
      "Book a doctor's visit for a blood test, such as a thyroid test.",
      "Treating the underlying condition often improves hair over time.",
      "Write down your other symptoms to tell the doctor.",
    ],
    diet: [
      "Eat balanced meals at regular times.",
      "Don't change your diet drastically or start supplements before you have test results.",
    ],
    avoid: [
      "Treating yourself with thyroid or hormone products.",
      "Waiting a long time if your symptoms are getting worse.",
    ],
  },

  scalp: {
    short: "Scalp condition",
    problem:
      "Flaking and itching are commonly linked to a yeast on the scalp, oil, and skin sensitivity. It is not caused by poor hygiene.",
    solutions: [
      "Wash regularly with a gentle shampoo.",
      "Try a medicated anti-dandruff shampoo (ketoconazole or zinc pyrithione) and follow the label.",
      "See a dermatologist if there is no improvement after a few weeks.",
    ],
    diet: [
      "No diet is proven to cure dandruff.",
      "A balanced diet supports general skin health.",
    ],
    avoid: [
      "Scratching hard or picking at crusts.",
      "Heavy oiling on a flaky, itchy scalp, which may make it worse for some people.",
    ],
  },

  styling: {
    short: "Styling damage",
    problem:
      "Tight hairstyles, frequent heat, or harsh chemical treatments can break hair or strain the roots.",
    solutions: [
      "Loosen tight styles and give your hair rest days.",
      "Use a wide-tooth comb, gently, on wet hair.",
      "Space out colouring, straightening, and other chemical treatments.",
    ],
    diet: [
      "The fix here is mostly in your styling habits.",
      "Balanced meals with enough protein still help hair stay strong.",
    ],
    avoid: [
      "Tight ponytails, braids, or buns every day.",
      "Daily high-heat styling.",
      "Brushing hard when your hair is wet.",
    ],
  },

  greyGenetic: {
    short: "Natural greying",
    problem:
      "Genetics and age are the main reasons hair loses colour. It is a natural process, and nothing has been proven to reverse it.",
    solutions: [
      "Henna or hair colour can cover grey hair temporarily.",
      "Keep your scalp and hair healthy with gentle care.",
      "If greying is sudden or comes with hair loss, ask a doctor.",
    ],
    diet: [
      "No food has been proven to bring back hair colour.",
      "A varied diet supports your overall health.",
    ],
    avoid: [
      "Products that promise to reverse grey hair.",
      "Strong dyes or bleach if your scalp is sensitive.",
    ],
  },

  greyCheck: {
    short: "Possible health factor",
    problem:
      "Early greying is sometimes linked to low vitamin B12 or other health factors. It is worth checking with a doctor.",
    solutions: [
      "Ask a doctor about a blood test, including vitamin B12.",
      "If a deficiency is found, follow the doctor's plan.",
      "Colour may not fully return in hairs that are already grey.",
    ],
    diet: [
      "B12 comes mainly from animal foods such as eggs, milk, curd, fish, and meat.",
      "If you are vegetarian or vegan, ask a doctor about a B12 test.",
    ],
    avoid: [
      "High-dose supplements without a test.",
      "Relying on supplements to reverse grey hair.",
    ],
  },

  greyLifestyle: {
    short: "Lifestyle factors",
    problem:
      "Smoking has been linked to earlier greying in several studies. Links with stress and sleep are less clear.",
    solutions: [
      "Quitting smoking is good for your health overall.",
      "Regular sleep and stress management help general wellbeing.",
    ],
    diet: [
      "No food has been proven to restore hair colour.",
      "A balanced diet supports general health.",
    ],
    avoid: [
      "Smoking.",
      "Expecting lifestyle changes to bring back colour in hairs that are already grey.",
    ],
  },
};