import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------
// Approved facts. The AI may only reword these. Nothing the user
// types is ever sent to the AI. DRAFT: not clinically reviewed.
// ---------------------------------------------------------------
const CAUSES = {
  telogen: {
    name: "stress- or illness-related shedding (telogen effluvium)",
    facts: [
      "Shedding often starts about 2 to 3 months after illness, childbirth, major stress, or crash dieting.",
      "It is usually temporary, and hair often recovers over several months.",
      "Regular balanced meals, good sleep, and gentle handling of hair help.",
    ],
  },
  pattern: {
    name: "genetic pattern thinning (androgenetic hair loss)",
    facts: [
      "Gradual thinning at the hairline, temples, parting, or crown that often runs in families.",
      "It usually progresses slowly over years.",
      "A dermatologist can explain treatments that have evidence, but they need a doctor's guidance.",
      "Be cautious of products that promise regrowth without evidence.",
    ],
  },
  nutrition: {
    name: "a possible nutritional factor",
    facts: [
      "Low protein, low iron, other nutrient gaps, or very restrictive eating can increase shedding.",
      "A doctor can arrange simple blood tests before any supplements are taken.",
      "Regular meals with protein help. High-dose supplements without a confirmed deficiency are not advised.",
    ],
  },
  hormonal: {
    name: "a possible thyroid or hormonal factor",
    facts: [
      "Thyroid or hormonal changes can affect hair, often together with tiredness, weight change, or changes in periods.",
      "A doctor can check this with a blood test.",
      "Treating the underlying condition often improves hair over time.",
    ],
  },
  scalp: {
    name: "a scalp condition such as dandruff",
    facts: [
      "Flaking and itching are commonly linked to a yeast on the scalp, oil, and skin sensitivity. It is not caused by poor hygiene.",
      "Gentle regular washing and medicated anti-dandruff shampoos can help, following the product label.",
      "See a dermatologist if there is no improvement after a few weeks.",
    ],
  },
  styling: {
    name: "damage or tension from styling",
    facts: [
      "Tight hairstyles, frequent heat, or harsh chemical treatments can break hair or strain the roots.",
      "Loosening styles, resting the hair, and gently using a wide-tooth comb can help.",
    ],
  },
  greyGenetic: {
    name: "natural or genetic greying",
    facts: [
      "Genetics and age are the main reasons hair loses colour. It is a natural process.",
      "Nothing has been proven to reverse it.",
      "Henna or hair colour can cover grey hair temporarily.",
    ],
  },
  greyCheck: {
    name: "a possible nutritional or health factor behind early greying",
    facts: [
      "Early greying is sometimes linked to low vitamin B12 or other health factors.",
      "A doctor can check this with a blood test.",
      "Supplements are unlikely to restore colour unless there is a deficiency.",
    ],
  },
  greyLifestyle: {
    name: "lifestyle factors linked to greying",
    facts: [
      "Smoking has been linked to earlier greying in several studies. Links with stress and sleep are less clear.",
      "Lifestyle changes are good for health but are not proven to bring back colour in hairs that are already grey.",
    ],
  },
};

const SYSTEM_PROMPT = `You write short, friendly explanations for HairAlly, a free hair-care information website for people in India.
You are given a list of possible causes with approved facts. Explain them in simple words.

Rules:
- Use ONLY the approved facts you are given. Do not add new medical claims, causes, treatments, medicine names, supplement names, doses, or numbers.
- These are possibilities, not a diagnosis. Never say the person "has" a condition. Use words like "may", "could", or "it is possible".
- If more than one possible cause is listed, say that the first is listed as most likely and the others are also possible.
- Always finish with one short sentence advising them to see a doctor or dermatologist, especially if the problem is sudden, painful, or getting worse.
- Keep it under 140 words. Use short sentences and plain words. No headings, no lists, no emojis.
- Output plain text only.`;

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

function buildUserMessage(ids, lang) {
  const lines = ids.map((id, i) => {
    const c = CAUSES[id];
    return `${i + 1}. ${c.name}\n${c.facts.map((f) => `   - ${f}`).join("\n")}`;
  });
  const language =
    lang === "hi"
      ? "Write in simple Hindi (Devanagari script). The first time you use a medical term, put the English term in brackets, for example रूसी (Dandruff)."
      : "Write in simple English.";
  return `Possible causes, most likely first:\n${lines.join("\n")}\n\n${language}`;
}

function parseBody(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  return body;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const reply = (status, payload) => res.status(status).json(payload);

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return reply(405, { error: "method_not_allowed" });
  }
  if (!process.env.GROQ_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
    console.error("explain: missing environment variables");
    return reply(500, { error: "not_configured" });
  }

  // 1. Check the input. Only known cause names and a language are allowed.
  const body = parseBody(req.body);
  const lang = body?.lang === "hi" ? "hi" : "en";
  const ids = Array.isArray(body?.causes) ? [...new Set(body.causes)] : [];
  if (
    ids.length < 1 ||
    ids.length > 3 ||
    !ids.every((id) => typeof id === "string" && Object.hasOwn(CAUSES, id))
  ) {
    return reply(400, { error: "bad_request" });
  }

  // 2. Check who is calling (the login token is verified by Supabase)
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return reply(401, { error: "not_signed_in" });

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser(
    token
  );
  if (userError || !userData?.user) {
    return reply(401, { error: "not_signed_in" });
  }

  // 3. Adult check and daily limits, done inside the database
  const { data: verdict, error: usageError } = await supabase.rpc(
    "ai_try_consume"
  );
  if (usageError) {
    console.error("explain: usage check failed", usageError.code);
    return reply(500, { error: "usage_check_failed" });
  }
  if (verdict !== "ok") {
    return reply(verdict === "not_adult" ? 403 : 429, { error: verdict });
  }

  // 4. Ask the AI to reword the approved facts
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const payload = {
      model: MODEL,
      temperature: 0.3,
      max_completion_tokens: lang === "hi" ? 1600 : 900,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(ids, lang) },
      ],
    };
    // These models think before answering. Keep that short and hide it.
    if (MODEL.startsWith("openai/gpt-oss")) {
      payload.reasoning_effort = "low";
      payload.include_reasoning = false;
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      }
    );

    if (response.status === 429) return reply(503, { error: "provider_busy" });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 300);
      console.error("explain: provider error", response.status, detail);
      return reply(502, { error: "provider_error" });
    }

    const data = await response.json();
    const text = (data?.choices?.[0]?.message?.content || "").trim();
    if (!text) return reply(502, { error: "empty_answer" });

    // Safety check: no dose-like numbers (for example "5 mg") are allowed
    if (/\b\d+(\.\d+)?\s?(mg|mcg|µg|iu|ml)\b/i.test(text)) {
      console.error("explain: answer blocked by dose check");
      return reply(502, { error: "unsafe_answer" });
    }

    return reply(200, { text, lang });
  } catch (err) {
    const timedOut = err?.name === "AbortError";
    console.error("explain: request failed", timedOut ? "timeout" : err?.name);
    return reply(timedOut ? 504 : 502, {
      error: timedOut ? "timeout" : "provider_error",
    });
  } finally {
    clearTimeout(timer);
  }
}