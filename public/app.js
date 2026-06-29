// ScanQuiz frontend: multi-page capture, topic mode, languages, score history.

const $ = (id) => document.getElementById(id);
const sections = {
  capture: $('capture'),
  loading: $('loading'),
  quiz: $('quiz'),
  results: $('results'),
};
function show(name) {
  Object.entries(sections).forEach(([k, el]) => (el.hidden = k !== name));
}
function banner(msg) {
  const b = $('banner');
  b.textContent = msg;
  b.hidden = false;
  clearTimeout(banner._t);
  banner._t = setTimeout(() => (b.hidden = true), 4500);
}

// --- Camera ---------------------------------------------------------------
const video = $('video');
const canvas = $('canvas');
let stream = null;
let facing = 'environment'; // back camera preferred for scanning pages
let pages = []; // [{ blob, url }] captured/uploaded pages

async function startCamera() {
  stopCamera();
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facing },
      audio: false,
    });
    video.srcObject = stream;
    video.hidden = false;
    $('camError').hidden = true;
  } catch (e) {
    video.hidden = true;
    const err = $('camError');
    err.hidden = false;
    err.textContent =
      'Camera unavailable (' + (e.name || 'error') + '). Use 🖼️ Upload or type a topic below.';
  }
}
function stopCamera() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
}

function addPage(blob) {
  pages.push({ blob, url: URL.createObjectURL(blob) });
  renderPages();
}

function renderPages() {
  const strip = $('pageStrip');
  strip.innerHTML = '';
  strip.hidden = pages.length === 0;
  pages.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'page-thumb';
    div.innerHTML =
      `<span class="num">${i + 1}</span>` +
      `<button class="del" title="Remove">✕</button>` +
      `<img src="${p.url}" alt="Page ${i + 1}" />`;
    div.querySelector('.del').onclick = () => {
      URL.revokeObjectURL(p.url);
      pages.splice(i, 1);
      renderPages();
    };
    strip.appendChild(div);
  });
  syncGenerate();
}

function capture() {
  if (!stream) return banner('No camera — use Upload or type a topic.');
  const w = video.videoWidth || 1280;
  const h = video.videoHeight || 960;
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(video, 0, 0, w, h);
  canvas.toBlob((blob) => addPage(blob), 'image/jpeg', 0.9);
}

// Enable "Generate" when there's at least one page or a typed topic.
function syncGenerate() {
  $('generateBtn').disabled = pages.length === 0 && !$('topicInput').value.trim();
}

$('snapBtn').onclick = capture;
$('flipBtn').onclick = () => {
  facing = facing === 'environment' ? 'user' : 'environment';
  startCamera();
};
$('fileInput').onchange = (e) => {
  [...e.target.files].forEach((f) => addPage(f));
  e.target.value = '';
};
$('topicInput').oninput = syncGenerate;

// --- Generate quiz --------------------------------------------------------
$('generateBtn').onclick = async () => {
  const topic = $('topicInput').value.trim();
  if (pages.length === 0 && !topic) return banner('Add a page or type a topic first.');
  show('loading');
  const fd = new FormData();
  pages.forEach((p, i) => fd.append('images', p.blob, `page${i + 1}.jpg`));
  fd.append('count', $('count').value);
  fd.append('difficulty', $('difficulty').value);
  fd.append('language', $('language').value);
  if (topic) fd.append('topic', topic);
  try {
    const r = await fetch('/api/quiz', { method: 'POST', body: fd });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Failed to generate quiz.');
    startQuiz(data);
  } catch (e) {
    banner(e.message);
    show('capture');
  }
};

// --- Quiz runtime ---------------------------------------------------------
let quiz = null;
let current = 0;
let score = 0;
let answers = [];

function startQuiz(data) {
  quiz = data;
  current = 0;
  score = 0;
  answers = [];
  $('quizTopic').textContent = data.topic || 'Your quiz';
  $('quizSummary').textContent = data.summary || '';
  show('quiz');
  renderQuestion();
}

function renderQuestion() {
  const q = quiz.questions[current];
  const total = quiz.questions.length;
  $('progressBar').style.width = `${(current / total) * 100}%`;
  $('qCounter').textContent = `Question ${current + 1} of ${total}`;
  $('nextBtn').disabled = true;
  $('nextBtn').textContent = current === total - 1 ? 'See results →' : 'Next →';

  const area = $('questionArea');
  area.innerHTML = '';
  const qt = document.createElement('div');
  qt.className = 'q-text';
  qt.textContent = q.question;
  area.appendChild(qt);

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.innerHTML = `${opt}<span class="mark"></span>`;
    btn.onclick = () => choose(i, btn, area, q);
    area.appendChild(btn);
  });
}

function choose(i, btn, area, q) {
  const correct = q.correctIndex;
  const buttons = area.querySelectorAll('.opt');
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (idx === correct) {
      b.classList.add('correct');
      b.querySelector('.mark').textContent = '✓';
    }
    if (idx === i && i !== correct) {
      b.classList.add('wrong');
      b.querySelector('.mark').textContent = '✗';
    }
  });
  const isRight = i === correct;
  if (isRight) score++;
  answers.push({ q: q.question, chosen: q.options[i], correct: q.options[correct], isRight });

  const ex = document.createElement('div');
  ex.className = 'explain';
  ex.innerHTML = `<b>${isRight ? 'Correct!' : 'Not quite.'}</b> ${q.explanation || ''}`;
  area.appendChild(ex);
  $('nextBtn').disabled = false;
}

$('nextBtn').onclick = () => {
  current++;
  if (current >= quiz.questions.length) showResults();
  else renderQuestion();
};

function showResults() {
  show('results');
  const total = quiz.questions.length;
  const pct = Math.round((score / total) * 100);
  $('scoreRing').style.setProperty('--p', `${pct}%`);
  $('scoreText').textContent = `${pct}%`;
  $('scoreHeadline').textContent =
    pct >= 80 ? '🎉 Excellent!' : pct >= 50 ? '👍 Good effort!' : '📖 Keep studying!';
  $('scoreDetail').textContent = `You scored ${score} out of ${total}.`;

  const list = $('reviewList');
  list.innerHTML = '';
  answers.forEach((a, i) => {
    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML =
      `<div class="qq">${i + 1}. ${a.q}</div>` +
      `<div class="ans ${a.isRight ? 'ok' : 'no'}">Your answer: ${a.chosen} ${a.isRight ? '✓' : '✗'}</div>` +
      (a.isRight ? '' : `<div class="ans">Correct: ${a.correct}</div>`);
    list.appendChild(item);
  });

  saveHistory({ topic: quiz.topic || 'Quiz', score, total, pct });
}

$('restartBtn').onclick = () => {
  // clear captured pages for a fresh run
  pages.forEach((p) => URL.revokeObjectURL(p.url));
  pages = [];
  $('topicInput').value = '';
  renderPages();
  renderHistory();
  show('capture');
  startCamera();
};

// --- Score history (localStorage) ----------------------------------------
const HKEY = 'scanquiz_history';

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HKEY) || '[]');
  } catch {
    return [];
  }
}
function saveHistory(entry) {
  const hist = loadHistory();
  // Date.now via a fresh Date is fine in the browser (not the workflow sandbox).
  hist.unshift({ ...entry, when: new Date().toLocaleString() });
  localStorage.setItem(HKEY, JSON.stringify(hist.slice(0, 50)));
}
function renderHistory() {
  const hist = loadHistory();
  $('historyBox').hidden = hist.length === 0;
  const list = $('historyList');
  list.innerHTML = '';
  hist.forEach((h) => {
    const cls = h.pct >= 80 ? 'good' : h.pct >= 50 ? 'mid' : 'low';
    const item = document.createElement('div');
    item.className = 'hist-item';
    item.innerHTML =
      `<div class="h-left">` +
      `<div class="h-topic">${h.topic}</div>` +
      `<div class="h-meta">${h.when}</div>` +
      `</div>` +
      `<div class="h-score ${cls}">${h.pct}% <span class="h-meta">(${h.score}/${h.total})</span></div>`;
    list.appendChild(item);
  });
}
$('clearHistory').onclick = () => {
  if (!confirm('Delete all saved scores?')) return;
  localStorage.removeItem(HKEY);
  renderHistory();
  banner('Score history cleared.');
};

// Kick things off.
renderHistory();
startCamera();
