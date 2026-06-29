# ScanQuiz 📚

Point your camera at a textbook page, your notes, or anything about a topic — and get an
instant, interactive multiple-choice quiz to test yourself. Built to help people study better.

## How it works

1. The browser captures a photo of the page (back camera) or you upload one.
2. The server sends the image to **Google Gemini** (free `gemini-2.5-flash`), which reads the
   page and writes a quiz.
3. You answer the questions, see explanations as you go, and get a score with a review.

## Run locally

```bash
cd "D:/AI QUIZ"
npm install
# PowerShell:
$env:GEMINI_API_KEY="your_google_ai_studio_key"
npm start
```

Open http://localhost:3000 — get a free key at https://aistudio.google.com/apikey

> Camera access needs `localhost` or HTTPS. On `localhost` it works in the browser.
> If the camera is blocked, use the **🖼️ Upload** button instead.

## Deploy (Render)

The included `render.yaml` deploys it as a free web service. Set the `GEMINI_API_KEY`
environment variable in the Render dashboard (it's marked `sync: false` so it isn't committed).

## Config

| Env var | Default | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | — | Google AI Studio key (required) |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Vision+text model used |
| `PORT` | `3000` | Server port |
