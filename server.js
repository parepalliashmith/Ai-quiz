// ScanQuiz: scan one or more pages (or a topic) and get an AI-generated quiz.
// Built for competitive-exam aspirants. Reads images with Google Gemini (free tier),
// supports English / Telugu / Hindi, and returns a structured quiz.

const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
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

function buildPrompt({ count, difficulty, language, topic }) {
  const n = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);
  const diff = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';
  const lang = LANGUAGES[language] || LANGUAGES.english;
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
    `Respond with STRICT JSON only (no markdown, no code fences) in this shape:\n` +
    `{\n` +
    `  "topic": "short title of the subject",\n` +
    `  "summary": "1-2 sentence summary of the material",\n` +
    `  "questions": [\n` +
    `    {\n` +
    `      "question": "...",\n` +
    `      "options": ["A", "B", "C", "D"],\n` +
    `      "correctIndex": 0,\n` +
    `      "explanation": "why the correct answer is right"\n` +
    `    }\n` +
    `  ]\n` +
    `}\n` +
    (topic
      ? ''
      : `If the image(s) have no readable study content, return {"error":"no_content"}.`)
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

// files: array of { buffer, mimetype } (may be empty when a text topic is given)
async function generateQuiz(files, opts) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=` +
    GEMINI_API_KEY;
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.message || `Gemini failed (${r.status})`);
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
  if (!files.length && !topic) {
    return res.status(400).json({ error: 'Capture at least one page, or type a topic.' });
  }
  try {
    const quiz = await generateQuiz(files, {
      count: req.body.count,
      difficulty: req.body.difficulty,
      language: req.body.language,
      topic,
    });
    if (quiz.error === 'no_content') {
      return res
        .status(422)
        .json({ error: 'Could not find readable study content — try clearer, closer photos.' });
    }
    if (!Array.isArray(quiz.questions) || !quiz.questions.length) {
      return res.status(422).json({ error: 'No questions could be generated. Try again.' });
    }
    res.json(quiz);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Scan-Quiz running on http://localhost:${PORT}`));
