// AIQUIZ frontend: i18n UI, theme toggle, multi-page capture, smarter quiz, history.

const $ = (id) => document.getElementById(id);

// ---------- Translations (full app UI) ----------
const I18N = {
  english: {
    hero_title: 'Turn any page into a quiz',
    hero_sub: 'Scan your books or notes, or just type a topic — AIQUIZ builds exam-style questions so you learn faster. Made for competitive exam aspirants.',
    step1_t: 'Scan or type', step1_d: 'Capture pages or enter a topic',
    step2_t: 'AI builds a quiz', step2_d: 'Instant questions on your material',
    step3_t: 'Test & improve', step3_d: 'Score, review, track progress',
    get_started: 'Get started →',
    cap_title: 'Scan your study material',
    cap_sub: "Add as many pages as you like — we'll build one quiz from all of them.",
    cap_hint: '📋 Place the page flat inside the frame and tap “Add page”.',
    add_page: 'Add page', upload: 'Upload', or: 'or',
    type_topic: 'Type a topic instead', topic_ph: 'e.g. Indian Polity – Fundamental Rights',
    questions: 'Questions', difficulty: 'Difficulty',
    easy: 'Easy', medium: 'Medium', hard: 'Hard',
    generate: 'Generate quiz',
    history_title: '📊 Your score history', clear_all: 'Clear all',
    clear_confirm: 'Delete all saved scores?', cleared: 'Score history cleared.',
    loading_title: 'Reading your material…',
    loading_sub: 'Understanding the topic and writing questions.',
    loading_note: 'First time may take up to a minute — please wait.',
    skip: 'Skip', next: 'Next', see_results: 'See results',
    score: 'Score', question_of: (a, b) => `Question ${a} of ${b}`,
    correct: 'Correct!', not_quite: 'Not quite.', skipped: 'Skipped.',
    retry: 'Retry', share: 'Share', wrong_only: 'Show wrong answers only',
    scan_another: 'Scan another',
    your_answer: 'Your answer', correct_ans: 'Correct', no_answer: '(skipped)',
    excellent: '🎉 Excellent!', good: '👍 Good effort!', keep: '📖 Keep studying!',
    scored: (s, t) => `You scored ${s} out of ${t}.`,
    need_input: 'Add a page or type a topic first.',
    share_text: (p, t) => `I scored ${p}% on "${t}" with AIQUIZ! Try it:`,
    copied: 'Result copied to clipboard!',
    no_cam: 'No camera — use Upload or type a topic.',
    cam_fail: (e) => `Camera unavailable (${e}). Use Upload or type a topic below.`,
  },
  telugu: {
    hero_title: 'ఏ పేజీనైనా క్విజ్‌గా మార్చండి',
    hero_sub: 'మీ పుస్తకాలు లేదా నోట్స్ స్కాన్ చేయండి, లేదా ఒక టాపిక్ టైప్ చేయండి — AIQUIZ పరీక్ష-శైలి ప్రశ్నలు తయారు చేస్తుంది. పోటీ పరీక్షల అభ్యర్థుల కోసం.',
    step1_t: 'స్కాన్ లేదా టైప్', step1_d: 'పేజీలు తీయండి లేదా టాపిక్ ఇవ్వండి',
    step2_t: 'AI క్విజ్ తయారు చేస్తుంది', step2_d: 'మీ మెటీరియల్‌పై వెంటనే ప్రశ్నలు',
    step3_t: 'పరీక్షించండి & మెరుగుపడండి', step3_d: 'స్కోర్, రివ్యూ, ప్రోగ్రెస్',
    get_started: 'ప్రారంభించండి →',
    cap_title: 'మీ స్టడీ మెటీరియల్ స్కాన్ చేయండి',
    cap_sub: 'ఎన్ని పేజీలైనా జోడించండి — అన్నింటిపై ఒకే క్విజ్ తయారు చేస్తాం.',
    cap_hint: '📋 పేజీని ఫ్రేమ్‌లో సరిగ్గా ఉంచి “పేజీ జోడించు” నొక్కండి.',
    add_page: 'పేజీ జోడించు', upload: 'అప్‌లోడ్', or: 'లేదా',
    type_topic: 'బదులుగా టాపిక్ టైప్ చేయండి', topic_ph: 'ఉదా: ఇండియన్ పాలిటీ – ప్రాథమిక హక్కులు',
    questions: 'ప్రశ్నలు', difficulty: 'కఠినత్వం',
    easy: 'తేలిక', medium: 'మధ్యమం', hard: 'కఠినం',
    generate: 'క్విజ్ తయారు చేయి',
    history_title: '📊 మీ స్కోర్ చరిత్ర', clear_all: 'అన్నీ తొలగించు',
    clear_confirm: 'సేవ్ చేసిన అన్ని స్కోర్‌లు తొలగించాలా?', cleared: 'స్కోర్ చరిత్ర తొలగించబడింది.',
    loading_title: 'మీ మెటీరియల్ చదువుతోంది…',
    loading_sub: 'టాపిక్‌ను అర్థం చేసుకుని ప్రశ్నలు రాస్తోంది.',
    loading_note: 'మొదటిసారి ఒక నిమిషం వరకు పట్టవచ్చు — దయచేసి వేచి ఉండండి.',
    skip: 'దాటవేయి', next: 'తదుపరి', see_results: 'ఫలితాలు చూడు',
    score: 'స్కోర్', question_of: (a, b) => `ప్రశ్న ${a} / ${b}`,
    correct: 'సరైనది!', not_quite: 'సరికాదు.', skipped: 'దాటవేశారు.',
    retry: 'మళ్లీ', share: 'షేర్', wrong_only: 'తప్పు సమాధానాలు మాత్రమే చూపు',
    scan_another: 'మరొకటి స్కాన్ చేయి',
    your_answer: 'మీ సమాధానం', correct_ans: 'సరైనది', no_answer: '(దాటవేశారు)',
    excellent: '🎉 అద్భుతం!', good: '👍 బాగుంది!', keep: '📖 ఇంకా చదవండి!',
    scored: (s, t) => `మీరు ${t}కి ${s} స్కోర్ చేశారు.`,
    need_input: 'ముందు పేజీ జోడించండి లేదా టాపిక్ టైప్ చేయండి.',
    share_text: (p, t) => `నేను AIQUIZ లో "${t}" పై ${p}% స్కోర్ చేశాను! మీరూ ప్రయత్నించండి:`,
    copied: 'ఫలితం కాపీ అయింది!',
    no_cam: 'కెమెరా లేదు — అప్‌లోడ్ వాడండి లేదా టాపిక్ టైప్ చేయండి.',
    cam_fail: (e) => `కెమెరా అందుబాటులో లేదు (${e}). అప్‌లోడ్ వాడండి లేదా టాపిక్ టైప్ చేయండి.`,
  },
  hindi: {
    hero_title: 'किसी भी पेज को क्विज़ में बदलें',
    hero_sub: 'अपनी किताबें या नोट्स स्कैन करें, या बस एक टॉपिक टाइप करें — AIQUIZ परीक्षा-शैली के प्रश्न बनाता है ताकि आप तेज़ी से सीखें। प्रतियोगी परीक्षा अभ्यर्थियों के लिए।',
    step1_t: 'स्कैन या टाइप', step1_d: 'पेज कैप्चर करें या टॉपिक डालें',
    step2_t: 'AI क्विज़ बनाता है', step2_d: 'आपकी सामग्री पर तुरंत प्रश्न',
    step3_t: 'परखें और सुधारें', step3_d: 'स्कोर, समीक्षा, प्रगति',
    get_started: 'शुरू करें →',
    cap_title: 'अपनी अध्ययन सामग्री स्कैन करें',
    cap_sub: 'जितने चाहें पेज जोड़ें — हम सबसे एक ही क्विज़ बनाएंगे।',
    cap_hint: '📋 पेज को फ्रेम में सीधा रखें और “पेज जोड़ें” दबाएं।',
    add_page: 'पेज जोड़ें', upload: 'अपलोड', or: 'या',
    type_topic: 'इसके बजाय टॉपिक टाइप करें', topic_ph: 'उदा: भारतीय राजव्यवस्था – मौलिक अधिकार',
    questions: 'प्रश्न', difficulty: 'कठिनाई',
    easy: 'आसान', medium: 'मध्यम', hard: 'कठिन',
    generate: 'क्विज़ बनाएं',
    history_title: '📊 आपका स्कोर इतिहास', clear_all: 'सब हटाएं',
    clear_confirm: 'सभी सहेजे गए स्कोर हटाएं?', cleared: 'स्कोर इतिहास हटा दिया गया।',
    loading_title: 'आपकी सामग्री पढ़ी जा रही है…',
    loading_sub: 'टॉपिक समझकर प्रश्न लिखे जा रहे हैं।',
    loading_note: 'पहली बार एक मिनट तक लग सकता है — कृपया प्रतीक्षा करें।',
    skip: 'छोड़ें', next: 'अगला', see_results: 'परिणाम देखें',
    score: 'स्कोर', question_of: (a, b) => `प्रश्न ${a} / ${b}`,
    correct: 'सही!', not_quite: 'सही नहीं।', skipped: 'छोड़ा गया।',
    retry: 'फिर से', share: 'शेयर', wrong_only: 'केवल गलत उत्तर दिखाएं',
    scan_another: 'दूसरा स्कैन करें',
    your_answer: 'आपका उत्तर', correct_ans: 'सही', no_answer: '(छोड़ा गया)',
    excellent: '🎉 शानदार!', good: '👍 अच्छा प्रयास!', keep: '📖 पढ़ते रहें!',
    scored: (s, t) => `आपने ${t} में से ${s} स्कोर किया।`,
    need_input: 'पहले पेज जोड़ें या टॉपिक टाइप करें।',
    share_text: (p, t) => `मैंने AIQUIZ पर "${t}" में ${p}% स्कोर किया! आप भी आज़माएं:`,
    copied: 'परिणाम कॉपी हो गया!',
    no_cam: 'कैमरा नहीं — अपलोड का उपयोग करें या टॉपिक टाइप करें।',
    cam_fail: (e) => `कैमरा उपलब्ध नहीं (${e})। अपलोड का उपयोग करें या टॉपिक टाइप करें।`,
  },
};

let lang = localStorage.getItem('aiquiz_lang') || 'english';
const t = (key) => (I18N[lang] && I18N[lang][key]) ?? I18N.english[key] ?? key;

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = t(el.getAttribute('data-i18n'));
    if (typeof v === 'string') el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const v = t(el.getAttribute('data-i18n-ph'));
    if (typeof v === 'string') el.placeholder = v;
  });
  document.documentElement.lang =
    lang === 'telugu' ? 'te' : lang === 'hindi' ? 'hi' : 'en';
  $('langSwitch').value = lang;
}

$('langSwitch').onchange = (e) => {
  lang = e.target.value;
  localStorage.setItem('aiquiz_lang', lang);
  applyLang();
  renderHistory();
};

// ---------- Theme ----------
let theme = localStorage.getItem('aiquiz_theme') || 'light';
function applyTheme() {
  document.documentElement.setAttribute('data-theme', theme);
  $('themeToggle').textContent = theme === 'light' ? '🌙' : '☀️';
}
$('themeToggle').onclick = () => {
  theme = theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('aiquiz_theme', theme);
  applyTheme();
};

// ---------- Screens ----------
const sections = ['onboarding', 'capture', 'loading', 'quiz', 'results'];
function show(name) {
  sections.forEach((s) => ($(s).hidden = s !== name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function banner(msg) {
  const b = $('banner');
  b.textContent = msg;
  b.hidden = false;
  clearTimeout(banner._t);
  banner._t = setTimeout(() => (b.hidden = true), 4500);
}

$('startBtn').onclick = () => {
  show('capture');
  startCamera();
};

// ---------- Camera ----------
const video = $('video');
const canvas = $('canvas');
let stream = null;
let facing = 'environment';
let pages = [];

async function startCamera() {
  stopCamera();
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
    video.srcObject = stream;
    video.hidden = false;
    $('frameGuide').hidden = false;
    $('camError').hidden = true;
  } catch (e) {
    video.hidden = true;
    $('frameGuide').hidden = true;
    const err = $('camError');
    err.hidden = false;
    err.textContent = t('cam_fail')(e.name || 'error');
  }
}
function stopCamera() {
  if (stream) stream.getTracks().forEach((tr) => tr.stop());
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
    div.innerHTML = `<span class="num">${i + 1}</span><button class="del">✕</button><img src="${p.url}" alt="">`;
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
  if (!stream) return banner(t('no_cam'));
  const w = video.videoWidth || 1280;
  const h = video.videoHeight || 960;
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(video, 0, 0, w, h);
  canvas.toBlob((blob) => addPage(blob), 'image/jpeg', 0.9);
}
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

// ---------- Generate ----------
$('generateBtn').onclick = async () => {
  const topic = $('topicInput').value.trim();
  if (pages.length === 0 && !topic) return banner(t('need_input'));
  show('loading');
  const fd = new FormData();
  pages.forEach((p, i) => fd.append('images', p.blob, `page${i + 1}.jpg`));
  fd.append('count', $('count').value);
  fd.append('difficulty', $('difficulty').value);
  fd.append('language', lang);
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

// ---------- Quiz ----------
let quiz = null, current = 0, score = 0, answers = [];
let timerId = null, elapsed = 0;

function fmtTime(s) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}
function startTimer() {
  elapsed = 0;
  $('timer').textContent = '⏱️ 0:00';
  clearInterval(timerId);
  timerId = setInterval(() => {
    elapsed++;
    $('timer').textContent = '⏱️ ' + fmtTime(elapsed);
  }, 1000);
}

function startQuiz(data) {
  quiz = data;
  current = 0;
  score = 0;
  answers = [];
  $('quizTopic').textContent = data.topic || 'Quiz';
  $('quizSummary').textContent = data.summary || '';
  show('quiz');
  startTimer();
  renderQuestion();
}

function renderQuestion() {
  const q = quiz.questions[current];
  const total = quiz.questions.length;
  $('progressBar').style.width = `${(current / total) * 100}%`;
  $('qCounter').textContent = t('question_of')(current + 1, total);
  $('liveScore').textContent = `${t('score')}: ${score}`;
  $('nextBtn').disabled = true;
  $('nextBtn').querySelector('span').textContent =
    current === total - 1 ? t('see_results') : t('next');
  $('skipBtn').hidden = false;

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
    btn.onclick = () => choose(i, area, q);
    area.appendChild(btn);
  });
}

function reveal(area, q, chosenIdx) {
  const buttons = area.querySelectorAll('.opt');
  buttons.forEach((b, idx) => {
    b.disabled = true;
    if (idx === q.correctIndex) {
      b.classList.add('correct');
      b.querySelector('.mark').textContent = '✓';
    }
    if (idx === chosenIdx && idx !== q.correctIndex) {
      b.classList.add('wrong');
      b.querySelector('.mark').textContent = '✗';
    }
  });
  const ex = document.createElement('div');
  ex.className = 'explain';
  const lead = chosenIdx === q.correctIndex ? t('correct') : chosenIdx === -1 ? t('skipped') : t('not_quite');
  ex.innerHTML = `<b>${lead}</b> ${q.explanation || ''}`;
  area.appendChild(ex);
  $('skipBtn').hidden = true;
  $('nextBtn').disabled = false;
}

function choose(i, area, q) {
  if (i === q.correctIndex) score++;
  answers.push({ q: q.question, chosen: q.options[i], correct: q.options[q.correctIndex], isRight: i === q.correctIndex });
  $('liveScore').textContent = `${t('score')}: ${score}`;
  reveal(area, q, i);
}

$('skipBtn').onclick = () => {
  const q = quiz.questions[current];
  answers.push({ q: q.question, chosen: null, correct: q.options[q.correctIndex], isRight: false });
  reveal($('questionArea'), q, -1);
};

$('nextBtn').onclick = () => {
  current++;
  if (current >= quiz.questions.length) showResults();
  else renderQuestion();
};

function showResults() {
  clearInterval(timerId);
  show('results');
  const total = quiz.questions.length;
  const pct = Math.round((score / total) * 100);
  $('scoreRing').style.setProperty('--p', `${pct}%`);
  $('scoreText').textContent = `${pct}%`;
  $('scoreHeadline').textContent = pct >= 80 ? t('excellent') : pct >= 50 ? t('good') : t('keep');
  $('scoreDetail').textContent = `${t('scored')(score, total)}  ⏱️ ${fmtTime(elapsed)}`;
  $('wrongOnly').checked = false;
  renderReview(false);
  saveHistory({ topic: quiz.topic || 'Quiz', score, total, pct });
}

function renderReview(wrongOnly) {
  const list = $('reviewList');
  list.innerHTML = '';
  answers.forEach((a, i) => {
    if (wrongOnly && a.isRight) return;
    const item = document.createElement('div');
    item.className = 'review-item';
    const yourAns = a.chosen === null ? t('no_answer') : a.chosen;
    item.innerHTML =
      `<div class="qq">${i + 1}. ${a.q}</div>` +
      `<div class="ans ${a.isRight ? 'ok' : 'no'}">${t('your_answer')}: ${yourAns} ${a.isRight ? '✓' : '✗'}</div>` +
      (a.isRight ? '' : `<div class="ans">${t('correct_ans')}: ${a.correct}</div>`);
    list.appendChild(item);
  });
}
$('wrongOnly').onchange = (e) => renderReview(e.target.checked);

$('retryBtn').onclick = () => {
  current = 0;
  score = 0;
  answers = [];
  show('quiz');
  startTimer();
  renderQuestion();
};

$('shareBtn').onclick = async () => {
  const total = quiz.questions.length;
  const pct = Math.round((score / total) * 100);
  const text = `${t('share_text')(pct, quiz.topic || 'Quiz')} ${location.origin}`;
  try {
    if (navigator.share) await navigator.share({ title: 'AIQUIZ', text });
    else {
      await navigator.clipboard.writeText(text);
      banner(t('copied'));
    }
  } catch { /* user cancelled */ }
};

$('restartBtn').onclick = () => {
  pages.forEach((p) => URL.revokeObjectURL(p.url));
  pages = [];
  $('topicInput').value = '';
  renderPages();
  renderHistory();
  show('capture');
  startCamera();
};

// ---------- History ----------
const HKEY = 'aiquiz_history';
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HKEY) || '[]'); } catch { return []; }
}
function saveHistory(entry) {
  const hist = loadHistory();
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
      `<div class="h-left"><div class="h-topic">${h.topic}</div><div class="h-meta">${h.when}</div></div>` +
      `<div class="h-score ${cls}">${h.pct}% <span class="h-meta">(${h.score}/${h.total})</span></div>`;
    list.appendChild(item);
  });
}
$('clearHistory').onclick = () => {
  if (!confirm(t('clear_confirm'))) return;
  localStorage.removeItem(HKEY);
  renderHistory();
  banner(t('cleared'));
};

// ---------- Init ----------
applyTheme();
applyLang();
renderHistory();
