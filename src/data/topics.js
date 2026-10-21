export const topics = [
  {
    id: "hair-fall",
    title: "Hair fall (shedding)",
    summary:
      "Losing about 50 to 100 hairs a day is normal. Hair fall is worth checking when it's heavier than usual, sudden, or causes visible thinning.",
    points: [
      {
        evidence: "strong",
        text: "Hair grows in cycles of growth, rest, and shedding. At any time, most of your hair is in the growth phase.",
      },
      {
        evidence: "strong",
        text: "Common causes include androgenetic hair loss (genetic, pattern-based thinning), telogen effluvium (shedding triggered by illness, childbirth, major stress, or crash dieting, usually noticed 2 to 3 months later), and conditions like iron deficiency or thyroid problems.",
      },
      {
        evidence: "strong",
        text: "Gentle care helps: avoid very tight hairstyles, handle wet hair carefully, and treat any underlying condition your doctor finds.",
      },
      {
        evidence: "strong",
        text: "Some medical treatments have good evidence for pattern hair loss, such as topical minoxidil and oral finasteride. Only a doctor or dermatologist should decide whether they suit you.",
      },
    ],
    redFlags: [
      "Sudden patchy hair loss",
      "Scalp pain, redness, pus, or crusting",
      "Hair loss along with tiredness, weight change, or feeling cold (possible thyroid issue)",
      "Thinning that keeps getting worse over several months",
    ],
    sources: ["American Academy of Dermatology (aad.org)", "NHS (nhs.uk) hair loss guidance"],
  },
  {
    id: "greying",
    title: "Early greying",
    summary:
      "Grey hair happens when hair follicles make less melanin, the pigment that colours hair. Genetics and age are the main factors.",
    points: [
      {
        evidence: "strong",
        text: "Hair turns grey as follicles produce less melanin. Genetics and age are the main reasons, and it's a normal process.",
      },
      {
        evidence: "limited",
        text: "Smoking has been linked to earlier greying in several studies. Quitting won't restore grey hair, but it's a worthwhile health step.",
      },
      {
        evidence: "limited",
        text: "Stress is often blamed for greying. A few small studies show links, but stress has not been proven as a direct cause.",
      },
      {
        evidence: "limited",
        text: "Some reports link vitamin B12 deficiency with early greying. Checking your levels with a doctor is reasonable, but supplements alone are unlikely to reverse grey hair.",
      },
      {
        evidence: "strong",
        text: "Henna and herbal colours can cover grey hair temporarily by coating the hair. They don't restore the hair's own pigment.",
      },
      {
        evidence: "weak",
        text: "Products or home remedies that claim to reverse grey hair permanently are usually not backed by clinical trials. Be cautious with strong promises.",
      },
    ],
    redFlags: [
      "Sudden greying in a short time, especially with hair loss",
      "Patches of white hair with scalp changes or itching",
    ],
    sources: ["American Academy of Dermatology (aad.org)", "NHS (nhs.uk)"],
  },
  {
    id: "dandruff",
    title: "Dandruff",
    summary:
      "Dandruff is flaking of the scalp. It's very common and usually manageable with the right care.",
    points: [
      {
        evidence: "strong",
        text: "Dandruff is usually linked to a yeast that lives on most scalps, combined with oil production and skin sensitivity. It isn't caused by poor hygiene.",
      },
      {
        evidence: "strong",
        text: "Antidandruff shampoos with active ingredients such as ketoconazole, zinc pyrithione, or selenium sulfide have good evidence for reducing flakes. Follow the product label.",
      },
      {
        evidence: "limited",
        text: "Some natural remedies, such as tea tree oil, have small studies showing benefit. The results are less consistent than with medicated shampoos.",
      },
      {
        evidence: "strong",
        text: "Dandruff with redness, itching, or greasy scales can be seborrheic dermatitis, which may need prescription treatment. See a dermatologist if it doesn't improve after a few weeks of regular use.",
      },
    ],
    redFlags: [
      "Bleeding, oozing, or thick crusts on the scalp",
      "Flaking that spreads to the face, ears, or chest",
      "No improvement after several weeks of medicated shampoo",
    ],
    sources: ["American Academy of Dermatology (aad.org)", "NHS (nhs.uk)"],
  },
];