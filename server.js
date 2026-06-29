// ScanQuiz: scan one or more pages (or a topic) and get an AI-generated quiz.
// Built for competitive-exam aspirants. Reads images with Google Gemini (free tier),
// supports English / Telugu / Hindi, and returns a structured quiz.

const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Support several free keys (comma-separated) so we can rotate when one hits its
// daily limit — that multiplies the free quota at zero cost.
const GEMINI_KEYS = (process.env.GEMINI_API_KEY || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const GEMINI_API_KEY = GEMINI_KEYS[0] || '';
// Vision + text model on the free tier. Reads the page and writes the quiz.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Keep uploaded photos in memory; we forward them straight to Gemini.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024, files: 10 },
});

const LANGUAGES = {
  english: 'English',
  telugu: 'Telugu (తెలుగు script)',
  hindi: 'Hindi (हिन्दी / Devanagari script)',
};

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, configured: !!GEMINI_API_KEY, model: GEMINI_MODEL })
);

const JSON_SHAPE =
  `Respond with STRICT JSON only (no markdown, no code fences) in this shape:\n` +
  `{\n` +
  `  "topic": "short title",\n` +
  `  "summary": "1-2 sentence summary",\n` +
  `  "questions": [\n` +
  `    {\n` +
  `      "question": "...",\n` +
  `      "options": ["A", "B", "C", "D"],\n` +
  `      "correctIndex": 0,\n` +
  `      "explanation": "why the correct answer is right"\n` +
  `    }\n` +
  `  ]\n` +
  `}\n`;

function buildPrompt({ count, difficulty, language, topic, mode }) {
  const n = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);
  const diff = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';
  const lang = LANGUAGES[language] || LANGUAGES.english;

  // Observation mode: a quiz about WHAT is in a photo and WHERE it is.
  if (mode === 'observe') {
    return (
      `You are creating an OBSERVATION quiz. Look very carefully at the attached photo(s) — ` +
      `a room, scene, or arrangement of objects.\n\n` +
      `Create exactly ${n} multiple-choice questions at ${diff} difficulty that test how ` +
      `carefully someone observed the picture. Focus on: which objects are present; WHERE each ` +
      `object is placed (left/right, top/bottom, foreground/background, on/under/next to/behind ` +
      `other objects); their colours; how many there are (counts); sizes; and spatial ` +
      `relationships between objects (e.g. "what is placed to the left of the bottle?"). ` +
      `Base every question and answer STRICTLY on what is actually visible in the image — ` +
      `never invent objects. Each question has exactly 4 options with ONE correct answer.\n\n` +
      `Write EVERYTHING (questions, options, explanations, topic, summary) in ${lang}.\n\n` +
      JSON_SHAPE +
      `If the image is blank or unclear, return {"error":"no_content"}.`
    );
  }

  // Default: study/competitive-exam quiz.
  const source = topic
    ? `the topic "${topic}"`
    : 'the attached image(s) of textbook pages, notes, or study material';
  return (
    `You are an expert tutor who prepares students for competitive exams ` +
    `(UPSC, SSC, banking, railways, state PSCs, GATE, entrance tests, etc.).\n\n` +
    `Study ${source}. If multiple images are given, treat them as consecutive pages of the ` +
    `same material and cover all of them together.\n\n` +
    `Create exactly ${n} exam-style multiple-choice questions at ${diff} difficulty. ` +
    `Questions must test real understanding (concepts, facts, application) the way a ` +
    `competitive exam would — not trivial wording. Each question has exactly 4 options with ` +
    `ONE correct answer.\n\n` +
    `Write EVERYTHING (questions, options, explanations, topic, summary) in ${lang}.\n\n` +
    JSON_SHAPE +
    (topic ? '' : `If the image(s) have no readable study content, return {"error":"no_content"}.`)
  );
}

// Pull the first JSON object out of the model's text response.
function parseQuiz(text) {
  if (!text) throw new Error('Empty response from model.');
  let s = text.trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Model did not return JSON.');
  return JSON.parse(s.slice(start, end + 1));
}

// Each model has its own free-tier quota, so if the primary is exhausted we
// fall back to the next one automatically.
const MODEL_CHAIN = [
  GEMINI_MODEL,
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
].filter((m, i, a) => m && a.indexOf(m) === i);

// Try every key × model combination; only an AI_LIMIT (quota/busy) error advances.
// This multiplies free capacity: each key has its own quota, each model too.
async function generateQuiz(files, opts) {
  let lastErr;
  for (const key of GEMINI_KEYS) {
    for (const model of MODEL_CHAIN) {
      try {
        return await generateWithModel(model, key, files, opts);
      } catch (e) {
        lastErr = e;
        if (e.code !== 'AI_LIMIT') throw e; // real error → stop
        // else: this key+model is rate-limited, try the next combination
      }
    }
  }
  throw lastErr;
}

async function generateWithModel(model, key, files, opts) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const parts = [{ text: buildPrompt(opts) }];
  for (const f of files) {
    parts.push({
      inline_data: { mime_type: f.mimetype || 'image/jpeg', data: f.buffer.toString('base64') },
    });
  }
  const body = {
    contents: [{ parts }],
    generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
  };
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) {
    const msg = data?.error?.message || `Gemini failed (${r.status})`;
    // Quota (429) or model overloaded/high-demand (503) → try the next model.
    if (
      r.status === 429 ||
      r.status === 503 ||
      /quota|rate limit|resource has been exhausted|high demand|overloaded|unavailable/i.test(msg)
    ) {
      const e = new Error(
        'The free AI is busy or its daily limit was reached. Please try again in a minute.'
      );
      e.code = 'AI_LIMIT';
      throw e;
    }
    throw new Error(msg);
  }
  const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
  return parseQuiz(text);
}

app.post('/api/quiz', upload.array('images', 10), async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res
      .status(503)
      .json({ error: 'Quiz AI is not configured yet — set GEMINI_API_KEY on the server.' });
  }
  const files = req.files || [];
  const topic = (req.body.topic || '').trim();
  const mode = req.body.mode === 'observe' ? 'observe' : 'study';
  if (mode === 'observe' && !files.length) {
    return res.status(400).json({ error: 'Capture or upload a picture to make an observation quiz.' });
  }
  if (!files.length && !topic) {
    return res.status(400).json({ error: 'Capture at least one page, or type a topic.' });
  }
  try {
    const baseOpts = {
      count: req.body.count,
      difficulty: req.body.difficulty,
      language: req.body.language,
      topic,
    };
    let quiz = await generateQuiz(files, { ...baseOpts, mode });
    // Study mode but the photo has no readable text (e.g. a room/scene)?
    // Auto-switch to observation questions so any picture still works.
    if (quiz.error === 'no_content' && mode === 'study' && files.length) {
      quiz = await generateQuiz(files, { ...baseOpts, mode: 'observe' });
    }
    if (quiz.error === 'no_content') {
      return res
        .status(422)
        .json({ error: 'Could not read the photo — try a clearer, closer, well-lit picture.' });
    }
    if (!Array.isArray(quiz.questions) || !quiz.questions.length) {
      return res.status(422).json({ error: 'No questions could be generated. Try again.' });
    }
    res.json(quiz);
  } catch (e) {
    res.status(e.code === 'AI_LIMIT' ? 429 : 502).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Scan-Quiz running on http://localhost:${PORT}`));
