import { createClient } from "@supabase/supabase-js";
import { CAUSES } from "../server/causes.js";

const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const MAX_CHARS = 300; // longest message a person can send
const HISTORY_LIMIT = 6; // how many earlier messages the AI sees
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Shown instead of an AI answer. Never counted, never saved, no AI call.
const EMERGENCY_TEXT =
  "It sounds like you may be going through something serious. Please don't wait.\n\n" +
  "If you are in immediate danger or may harm yourself, call 112 (India's emergency number) now. " +
  "For someone to talk to, Tele-MANAS is free and open 24/7 on 14416 or 1800-891-4416, and KIRAN is on 1800-599-0019. " +
  "If this is a medical emergency, call 112 or go to the nearest hospital.\n\n" +
  "HairAlly only gives hair-care information and cannot help in an emergency.\n\n" +
  "---\n\n" +
  "ऐसा लगता है कि आप किसी गंभीर स्थिति से गुज़र रहे हैं। कृपया इंतज़ार न करें।\n\n" +
  "अगर आप तुरंत ख़तरे में हैं या खुद को नुकसान पहुँचा सकते हैं, तो अभी 112 (भारत का आपातकालीन नंबर) पर कॉल करें। " +
  "बात करने के लिए Tele-MANAS मुफ़्त है और 24 घंटे चालू रहती है: 14416 या 1800-891-4416। KIRAN का नंबर 1800-599-0019 है। " +
  "अगर यह मेडिकल इमरजेंसी है, तो 112 पर कॉल करें या नज़दीकी अस्पताल जाएँ।\n\n" +
  "HairAlly सिर्फ़ बालों की जानकारी देता है और आपात स्थिति में मदद नहीं कर सकता।";

// Keyword lists are imperfect, so they lean towards showing help.
const EMERGENCY =
  /(suicid|kill(ing)? myself|end(ing)? my life|want to die|wanna die|don'?t want to (live|be alive)|hurt(ing)? myself|self[- ]?harm|cutting myself|take my own life|can'?t breathe|cannot breathe|trouble breathing|chest pain|unconscious|seizure|overdos|swallowed (poison|pills)|heavy bleeding|bleeding (a lot|heavily)|खुदकुशी|आत्महत्या|जान दे(ना|ने)|मरना चाह|मर जाना चाह|जीना नहीं चाह|खुद को (मार|नुकसान)|सांस नहीं|साँस नहीं|सीने में दर्द|बेहोश|ज़हर|जहर खा|ओवरडोज|marna chah|mar jana chah|mar jaana chah|jaan de(na|ne)|zindagi khatam|jeena nahi chah|saans nahi|seene mein dard|behosh|zeher)/i;

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE = /(?:\+?\d[\s-]?){10,}/;

// ---- Which script should the answer use? Decided here, in code. ----
const DEVANAGARI = /[\u0900-\u097F]/;
const HINGLISH_WORDS = new Set([
  "mere", "mera", "meri", "mujhe", "mujhko", "hum", "hamare", "baal",
  "baalon", "balon", "jhad", "jhadna", "jhadte", "jhadne", "jhar", "kya",
  "kyun", "kyu", "kaise", "kaisa", "kaun", "kaunsa", "konsa", "kab", "kahan",
  "hai", "hain", "hota", "hoti", "hote", "nahi", "nahin", "nhi", "karun",
  "karu", "karna", "kare", "karo", "rahe", "raha", "rahi", "hoga", "achha",
  "achhi", "accha", "acchi", "acha", "theek", "thik", "aur", "bahut",
  "bohot", "zyada", "jyada", "thoda", "roz", "khujli", "safed", "safaid",
  "dawai", "dava", "bataiye", "batao", "bataye", "chahiye", "sakta",
  "sakti", "sakte", "lagta", "lagti", "laga", "lagana", "ke", "ki", "ko",
  "ka", "liye", "wala", "wali", "mein", "upay", "ilaj", "ilaaj", "khana",
]);

function detectStyle(message) {
  if (DEVANAGARI.test(message)) return "devanagari";
  const words = message.toLowerCase().match(/[a-z]+/g) || [];
  const hits = new Set(words.filter((w) => HINGLISH_WORDS.has(w)));
  return hits.size >= 2 ? "hinglish" : "english";
}

const STYLE_NOTE = {
  english: "Reply in simple English.",
  devanagari: "Reply in simple Hindi written in Devanagari script.",
  hinglish:
    'Reply in Hinglish: simple Hindi written with English (Roman) letters, for example: "Baal jhadne ke kai karan ho sakte hain." Do not use any Devanagari characters at all.',
};

const STYLE_SHORT = {
  english: "",
  devanagari: "\n\n(Answer in Hindi, Devanagari script.)",
  hinglish: "\n\n(Answer in Hinglish, Roman letters only, no Devanagari.)",
};

const SYSTEM_PROMPT = `You are the HairAlly assistant, a friendly guide for hair, scalp, and greying questions for people in India. You give general educational information only.

Rules you must always follow:
1. Scope: answer only about hair, scalp, greying, and closely related general diet, sleep, stress, and hair-care habits. For anything else, politely say you can only help with hair and scalp questions.
2. Never diagnose. Use words like "may", "could", or "it is possible". Never say the person "has" a condition.
3. Never recommend or name prescription medicines, doses (of medicines or supplements), or specific brands and products. Do not name specific vitamins, minerals, or supplements as things to take or add to the diet. Talk about food groups instead: dal and pulses, eggs, milk and curd, paneer, green leafy vegetables, nuts, seeds, and fruit. If nutrition may be a cause, say a doctor can check with a blood test first.
4. For sudden patchy hair loss, scalp pain, pus or crusting, fast worsening, signs of thyroid or hormonal problems, or any real worry, advise seeing a doctor or dermatologist.
5. Be honest about evidence. Never promise that anything will regrow hair or reverse greying. No miracle cures.
6. If you are not sure, say so and suggest asking a doctor. Only state widely accepted points.
7. Possible causes from the person's symptom checker (if given below) are background only, not a diagnosis.
8. When asked in general why hair falls, mention that family history (genetics) is a common cause, along with stress or illness a few months earlier, nutrition, scalp problems, styling habits, and thyroid or hormone