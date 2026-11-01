// src/lib/advisorGuardrails.js

/**
 * STRICT SYSTEM PROMPT (Used when connected to Gemini / OpenAI / Backend LLM endpoint)
 * Enforces Role, Scope, and Refusal Guardrails.
 */
export const SYSTEM_INSTRUCTION = `
You are the official CareerCompass Academic Advisor for South African high school and matric students.
STRICT DOMAIN GUARDRAILS:
1. ALLOWED TOPICS: South African universities (UJ, Wits, UP, UCT, etc.), NSC Matric subjects, APS (Admission Point Score) calculations, NSFAS funding, NQF levels, degree requirements, and navigating the CareerCompass app (scanning PDFs, confirming grades, viewing matches, applying via portals).
2. FORBIDDEN TOPICS: Anything outside South African higher education, careers, or this app (e.g., cooking recipes like muffins, gaming, celebrity gossip, general coding homework, politics).
3. REFUSAL PROTOCOL: If a user asks an off-topic question, DO NOT answer it. Immediately reply: "I am strictly programmed to assist with South African university applications, APS scores, and navigating CareerCompass. I cannot help with off-topic requests."
Keep answers concise (under 4 sentences), encouraging, and specific to South Africa.
`.trim();

// Input Intent Firewall: Keywords that immediately trigger an off-topic refusal before wasting API tokens
const OFF_TOPIC_TRIGGERS = [
  'muffin', 'recipe', 'bake', 'cook', 'cake', 'food', 'pizza',
  'movie', 'song', 'lyrics', 'joke', 'poem', 'story',
  'bitcoin', 'crypto', 'forex', 'weather', 'soccer', 'football', 'ps5', 'xbox'
];

// On-Topic Knowledge Base (Deterministic local fallback + instant zero-latency answers)
const DOMAIN_KNOWLEDGE_BASE = [
  {
    keywords: ['aps', 'score', 'calculate', 'points', 'level'],
    reply:
      'Your APS (Admission Point Score) converts your NSC subject percentages into levels from 1 to 7 (e.g., 80%+ = 7 points, 70-79% = 6 points). Most SA universities like UJ and Wits exclude Life Orientation or cap it when calculating your final 6-subject total.'
  },
  {
    keywords: ['scan', 'pdf', 'upload', 'transcript', 'report', 'grades'],
    reply:
      'To scan your matric results: Go to the Scan tab, upload your NSC statement of results PDF, and verify the extracted percentages on the Confirm Grades screen so we can calculate your matches!'
  },
  {
    keywords: ['apply', 'portal', 'website', 'link', 'application'],
    reply:
      'Tap on any matched degree to open the Degree Overview screen. At the bottom, you can open the Pre-Application Checklist or tap "Apply on Official SA University Portal" to jump straight to that university’s verified .ac.za admission page.'
  },
  {
    keywords: ['nsfas', 'bursary', 'funding', 'money', 'financial aid', 'fees'],
    reply:
      'For public South African universities (.ac.za), you can apply for NSFAS funding at my.nsfas.org.za if your combined household income is under R350,000 per year. Always submit your NSFAS application alongside your university application!'
  },
  {
    keywords: ['nqf', 'bachelor', 'diploma', 'higher certificate'],
    reply:
      'In South Africa: Higher Certificates are NQF Level 5, National Diplomas are NQF Level 6, and Bachelor’s Degrees are NQF Level 7 (usually requiring 3 to 4 years of study and a Bachelor pass endorsement).'
  },
  {
    keywords: ['uj', 'wits', 'up', 'tuks', 'uct', 'stellenbosch', 'ukzn', 'unisa', 'tut', 'university'],
    reply:
      'CareerCompass matches your NSC subject marks against South African public universities. Check your Matches tab to see which degrees you qualify for, then use our verified .ac.za portal redirect to apply directly.'
  }
];

/**
 * Evaluates user input against domain guardrails and returns an advisor response.
 */
export const getAdvisorResponse = async (userMessage, currentScreen = 'App') => {
  const cleanMsg = (userMessage || '').toLowerCase().trim();

  if (!cleanMsg) {
    return 'Ask me anything about your APS score, university requirements, or how to use CareerCompass!';
  }

  // LAYER 1: Pre-Flight Off-Topic Firewall (The "No Muffins" Gate)
  const hitForbiddenTopic = OFF_TOPIC_TRIGGERS.some((word) => cleanMsg.includes(word));
  if (hitForbiddenTopic) {
    return '🔒 Guardrail Active: I am strictly programmed to assist with South African university admissions, APS calculations, and navigating the CareerCompass app. I cannot help with recipes or off-topic requests!';
  }

  // LAYER 2: Check Optional Live Gemini API (If EXPO_PUBLIC_GEMINI_API_KEY is added to .env later)
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents: [
              {
                role: 'user',
                parts: [{ text: `[User is currently on screen: ${currentScreen}] Question: ${userMessage}` }]
              }
            ],
            generationConfig: { temperature: 0.2, maxOutputTokens: 180 }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) return aiText.trim();
      }
    } catch (err) {
      console.warn('[AdvisorBot] Falling back to local domain engine:', err.message);
    }
  }

  // LAYER 3: Deterministic Local Domain Engine (Works 100% offline with zero API keys needed)
  for (const item of DOMAIN_KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => cleanMsg.includes(kw))) {
      return item.reply;
    }
  }

  // LAYER 4: Strict Default Scope Enforcement
  if (cleanMsg.includes('hello') || cleanMsg.includes('hi') || cleanMsg.includes('hey') || cleanMsg.includes('help')) {
    return `Hi! I'm your CareerCompass Advisor (currently assisting you on ${currentScreen}). Ask me how APS points work, how to scan your PDF report, or how to apply to SA universities!`;
  }

  return "I only answer questions related to South African university admissions, NSC grades, APS scores, and navigating CareerCompass. Try asking: 'How is my APS calculated?' or 'How do I scan my results?'";
};