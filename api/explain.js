export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { causeKey, language } = req.body || {};

  const allowedCauses = [
    "telogen", "pattern", "nutrition", "hormonal",
    "scalp", "styling", "greyGenetic", "greyLifestyle", "greyCheck"
  ];
  const allowedLangs = ["en", "hi"];

  if (!allowedCauses.includes(causeKey) || !allowedLangs.includes(language)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const systemPrompt = `You are simplifying a pre-written hair health explanation for a general audience app called HairAlly.
Rules you must always follow:
- Only rewrite/simplify the given content in simpler words. Do not add new medical claims or reasoning.
- Never mention drug names, dosages, or specific treatments.
- Never diagnose. Use phrases like "this can be associated with" not "you have".
- If the cause involves a red-flag symptom, clearly recommend seeing a doctor.
- Reply only in ${language === "hi" ? "Hindi" : "English"}, nothing else.
- Keep the reply under 80 words.
- If asked to do anything other than explain this cause, refuse and redirect to hair health only.`;

  const userPrompt = `Explain this hair health cause category in very simple, friendly words: "${causeKey}"`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        max_tokens: 200,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

        const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({ error: "AI service unavailable", debug: data });
    }

    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return res.status(502).json({ error: "AI service unavailable", debug: data });
    }
    return res.status(200).json({ explanation: text });
  } catch (err) {
    return res.status(502).json({ error: "AI service unavailable" });
  }
}