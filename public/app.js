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
    install: 'Install',
    installed: 'AIQUIZ installed! Open it from your home screen.',
    ios_install: 'To install: tap Share, then “Add to Home Screen”.',
    quick_topics: '⚡ Quick topics — tap to start',
    chips: ['General Knowledge', 'Indian Polity', 'History', 'Geography', 'General Science', 'Current Affairs', 'Mathematics', 'Reasoning'],
    loading_msgs: ['Reading your material…', 'Finding the key concepts…', 'Writing exam-style questions…', 'Almost ready…'],
    neg_mark: '✍️ Exam mode — negative marking (−0.25 per wrong)',
    quiz_lang: 'Quiz language',
    mode: 'Quiz type', mode_study: '📚 Study material', mode_observe: '🔍 Observe a picture',
    exit: 'Exit', remove: 'Remove', close: 'Close',
    blurry: '📷 Photo looks blurry — tap it to check, or retake for a better quiz.',
    no_voice: '🔊 Voice for this language is not installed on your device — narration may be silent.',
    st_total: 'Quizzes', st_avg: 'Avg score', st_best: 'Best', st_streak: 'Day streak',
    net_score: (n, t) => `Net score: ${n} / ${t} (with negative marking)`,
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
    install: 'ఇన్‌స్టాల్',
    installed: 'AIQUIZ ఇన్‌స్టాల్ అయింది! హోమ్ స్క్రీన్ నుండి తెరవండి.',
    ios_install: 'ఇన్‌స్టాల్ చేయడానికి: Share నొక్కి, “Add to Home Screen” ఎంచుకోండి.',
    quick_topics: '⚡ త్వరిత టాపిక్‌లు — నొక్కి మొదలుపెట్టండి',
    chips: ['జనరల్ నాలెడ్జ్', 'ఇండియన్ పాలిటీ', 'చరిత్ర', 'భూగోళశాస్త్రం', 'జనరల్ సైన్స్', 'కరెంట్ అఫైర్స్', 'గణితం', 'రీజనింగ్'],
    loading_msgs: ['మీ మెటీరియల్ చదువుతోంది…', 'ముఖ్య అంశాలు కనుగొంటోంది…', 'పరీక్ష-శైలి ప్రశ్నలు రాస్తోంది…', 'దాదాపు సిద్ధం…'],
    neg_mark: '✍️ ఎగ్జామ్ మోడ్ — నెగటివ్ మార్కింగ్ (తప్పుకు −0.25)',
    quiz_lang: 'క్విజ్ భాష',
    mode: 'క్విజ్ రకం', mode_study: '📚 స్టడీ మెటీరియల్', mode_observe: '🔍 ఫోటోను గమనించు',
    exit: 'నిష్క్రమించు', remove: 'తొలగించు', close: 'మూసివేయి',
    blurry: '📷 ఫోటో మసకగా ఉంది — చూడటానికి నొక్కండి, లేదా మంచి క్విజ్ కోసం మళ్లీ తీయండి.',
    no_voice: '🔊 ఈ భాష వాయిస్ మీ ఫోన్‌లో లేదు — నేరేషన్ వినిపించకపోవచ్చు.',
    st_total: 'క్విజ్‌లు', st_avg: 'సగటు స్కోర్', st_best: 'అత్యుత్తమం', st_streak: 'రోజుల స్ట్రీక్',
    net_score: (n, t) => `నెట్ స్కోర్: ${n} / ${t} (నెగటివ్ మార్కింగ్‌తో)`,
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
    install: 'इंस्टॉल',
    installed: 'AIQUIZ इंस्टॉल हो गया! होम स्क्रीन से खोलें।',
    ios_install: 'इंस्टॉल करने के लिए: Share दबाएं, फिर “Add to Home Screen” चुनें।',
    quick_topics: '⚡ त्वरित टॉपिक — टैप करके शुरू करें',
    chips: ['सामान्य ज्ञान', 'भारतीय राजव्यवस्था', 'इतिहास', 'भूगोल', 'सामान्य विज्ञान', 'करंट अफेयर्स', 'गणित', 'रीज़निंग'],
    loading_msgs: ['आपकी सामग्री पढ़ी जा रही है…', 'मुख्य अवधारणाएं ढूंढी जा रही हैं…', 'परीक्षा-शैली के प्रश्न लिखे जा रहे हैं…', 'लगभग तैयार…'],
    neg_mark: '✍️ एग्ज़ाम मोड — नेगेटिव मार्किंग (गलत पर −0.25)',
    quiz_lang: 'क्विज़ भाषा',
    mode: 'क्विज़ प्रकार', mode_study: '📚 अध्ययन सामग्री', mode_observe: '🔍 तस्वीर देखें',
    exit: 'बाहर', remove: 'हटाएं', close: 'बंद करें',
    blurry: '📷 तस्वीर धुंधली लग रही है — देखने के लिए टैप करें, या बेहतर क्विज़ के लिए फिर से लें.',
    no_voice: '🔊 इस भाषा की आवाज़ आपके फ़ोन में नहीं है — नैरेशन शायद न सुनाई दे.',
    st_total: 'क्विज़', st_avg: 'औसत स्कोर', st_best: 'सर्वश्रेष्ठ', st_streak: 'दिन स्ट्रीक',
    net_score: (n, t) => `नेट स्कोर: ${n} / ${t} (नेगेटिव मार्किंग के साथ)`,
  },
};
// BCP-47 codes for speech synthesis.
const SPEECH_LANG = { english: 'en-IN', telugu: 'te-IN', hindi: 'hi-IN' };

// ---------- AI narrator character (lip-sync + expressions) ----------
const Mascot = {
  el: null, talkTimer: null, blinkTimer: null,
  init() {
    this.el = document.getElementById('mascot');
    if (!this.el) return;
    this.blinkTimer = setInterval(() => this.blink(), 3600);
  },
  blink() {
    if (!this.el || this.el.classList.contains('talking')) return;
    this.el.classList.add('blink');
    setTimeout(() => this.el && this.el.classList.remove('blink'), 150);
  },
  expr(state) {
    if (!this.el) return;
    this.el.classList.remove('happy', 'sad');
    const smile = document.getElementById('smile');
    const bL = document.getElementById('browL'), bR = document.getElementById('browR');
    if (state === 'happy') {
      this.el.classList.add('happy');
      smile.setAttribute('d', 'M42 74 Q60 94 78 74');
      bL.setAttribute('y1', '40'); bL.setAttribute('y2', '40');
      bR.setAttribute('y1', '40'); bR.setAttribute('y2', '40');
    } else if (state === 'sad') {
      this.el.classList.add('sad');
      smile.setAttribute('d', 'M46 88 Q60 74 74 88');
      bL.setAttribute('y1', '40'); bL.setAttribute('y2', '46');   // angled down (worried)
      bR.setAttribute('y1', '46'); bR.setAttribute('y2', '40');
    } else { // idle
      smile.setAttribute('d', 'M46 78 Q60 88 74 78');
      bL.setAttribute('y1', '42'); bL.setAttribute('y2', '42');
      bR.setAttribute('y1', '42'); bR.setAttribute('y2', '42');
    }
  },
  startTalk() {
    if (!this.el) return;
    this.el.classList.add('talking');
    clearInterval(this.talkTimer);
    const mg = document.getElementById('mouthG');
    this.talkTimer = setInterval(() => {
      mg.style.transform = `scaleY(${(0.15 + Math.random() * 0.85).toFixed(2)})`;
    }, 95);
  },
  stopTalk() {
    if (!this.el) return;
    this.el.classList.remove('talking');
    clearInterval(this.talkTimer);
    const mg = document.getElementById('mouthG');
    if (mg) mg.style.transform = 'scaleY(0.08)';
  },
  speak(text) {
    if (!('speechSynthesis' in window) || !text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = SPEECH_LANG[$('quizLang') ? $('quizLang').value : lang] || SPEECH_LANG[lang] || 'en-IN';
    u.rate = 0.98; u.pitch = 1.15;
    u.onstart = () => this.startTalk();
    u.onboundary = () => {
      const mg = document.getElementById('mouthG');
      if (mg) mg.style.transform = 'scaleY(0.9)';
    };
    u.onend = () => this.stopTalk();
    u.onerror = () => this.stopTalk();
    this.startTalk(); // some browsers fire onstart late
    synth.speak(u);
  },
  stop() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    this.stopTalk();
  },
};

let narratorOn = localStorage.getItem('aiquiz_narrator') !== 'off';
let voiceWarned = false;
// Warn once if the chosen quiz language has no installed TTS voice.
function checkVoice() {
  if (voiceWarned || !('speechSynthesis' in window)) return;
  const want = (SPEECH_LANG[$('quizLang') ? $('quizLang').value : lang] || 'en').slice(0, 2);
  const voices = window.speechSynthesis.getVoices();
  if (voices.length && !voices.some((v) => (v.lang || '').toLowerCase().startsWith(want))) {
    voiceWarned = true;
    banner(t('no_voice'));
  }
}
function narrate() {
  if (!quiz) return;
  checkVoice();
  const q = quiz.questions[current];
  const text = `${q.question}. ${q.options.map((o, i) => `${i + 1}. ${o}`).join('. ')}`;
  Mascot.speak(text);
}

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
  const ql = $('quizLang');
  if (ql) ql.value = lang; // default quiz language follows the app language (user can override)
  renderChips();
}

// Quick-topic chips — tap to fill the topic and enable Generate.
function renderChips() {
  const box = $('topicChips');
  if (!box) return;
  box.innerHTML = '';
  (t('chips') || []).forEach((label) => {
    const c = document.createElement('button');
    c.className = 'chip';
    c.type = 'button';
    c.textContent = label;
    c.onclick = () => {
      const already = $('topicInput').value.trim() === label;
      $('topicInput').value = already ? '' : label;
      box.querySelectorAll('.chip').forEach((x) => x.classList.remove('active'));
      if (!already) c.classList.add('active');
      syncGenerate();
    };
    box.appendChild(c);
  });
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
let loadingTimer = null;
function show(name) {
  sections.forEach((s) => ($(s).hidden = s !== name));
  const wrap = document.querySelector('.wrap');
  if (wrap) wrap.scrollTo({ top: 0, behavior: 'smooth' });
  clearInterval(loadingTimer);
  if (name === 'loading') {
    const msgs = t('loading_msgs') || [t('loading_title')];
    const h = document.querySelector('#loading h2');
    let i = 0;
    h.textContent = msgs[0];
    loadingTimer = setInterval(() => {
      i = (i + 1) % msgs.length;
      h.textContent = msgs[i];
    }, 2500);
  }
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
    // Request the highest resolution the browser will allow (usually up to 4K / ~12MP).
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: facing,
        width: { ideal: 4096 },
        height: { ideal: 4096 },
        advanced: [{ width: 4096, height: 4096 }],
      },
      audio: false,
    });
    video.srcObject = stream;
    video.hidden = false;
    $('frameGuide').hidden = false;
    $('shutterBtn').hidden = false;
    $('camError').hidden = true;
    setupTorch();
  } catch (e) {
    video.hidden = true;
    $('frameGuide').hidden = true;
    $('shutterBtn').hidden = true;
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
    const isPdf = p.blob.type === 'application/pdf';
    div.className = 'page-thumb' + (isPdf ? ' pdf' : '');
    const body = isPdf
      ? `<span class="pdf-ico">📄</span>PDF`
      : `<img src="${p.url}" alt="">`;
    div.innerHTML = `<span class="num">${i + 1}</span><button class="del">✕</button>${body}`;
    div.querySelector('.del').onclick = (e) => {
      e.stopPropagation();
      URL.revokeObjectURL(p.url);
      pages.splice(i, 1);
      renderPages();
    };
    if (!isPdf) div.onclick = () => openPreview(i); // tap thumbnail to view full-size
    strip.appendChild(div);
  });
  syncGenerate();
}

// Full-size photo preview so users can check clarity before generating.
let previewIdx = -1;
function openPreview(i) {
  previewIdx = i;
  $('previewImg').src = pages[i].url;
  $('previewModal').hidden = false;
}
$('previewClose').onclick = () => ($('previewModal').hidden = true);
$('previewRetake').onclick = () => {
  if (previewIdx >= 0 && pages[previewIdx]) {
    URL.revokeObjectURL(pages[previewIdx].url);
    pages.splice(previewIdx, 1);
    renderPages();
  }
  $('previewModal').hidden = true;
};
$('previewModal').onclick = (e) => { if (e.target.id === 'previewModal') $('previewModal').hidden = true; };
function capture() {
  if (!stream) return banner(t('no_cam'));
  // flash animation + haptic for a satisfying "snap"
  const fl = $('flash');
  fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
  if (navigator.vibrate) navigator.vibrate(15);
  const w = video.videoWidth || 1280;
  const h = video.videoHeight || 960;
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(video, 0, 0, w, h);
  if (sharpnessScore(canvas) < 22) setTimeout(() => banner(t('blurry')), 250); // gentle blur nudge
  canvas.toBlob((blob) => addPage(blob), 'image/jpeg', 0.95);
}

// Rough sharpness metric (variance of Laplacian on a downscaled grayscale copy).
// Higher = sharper. Used only to nudge the user, never to block.
function sharpnessScore(srcCanvas) {
  try {
    const w = 160, h = 120;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    ctx.drawImage(srcCanvas, 0, 0, w, h);
    const d = ctx.getImageData(0, 0, w, h).data;
    const g = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    let mean = 0, n = 0;
    const lap = new Float32Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const v = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w];
        lap[i] = v; mean += v; n++;
      }
    }
    mean /= n;
    let varSum = 0;
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const v = lap[y * w + x] - mean; varSum += v * v; }
    return Math.sqrt(varSum / n);
  } catch { return 999; }
}

// Torch / flashlight (supported on most Android back cameras)
let torchOn = false;
function setupTorch() {
  const track = stream && stream.getVideoTracks()[0];
  const caps = track && track.getCapabilities ? track.getCapabilities() : {};
  $('torchBtn').hidden = !(caps && caps.torch);
  torchOn = false;
}
$('torchBtn').onclick = async () => {
  const track = stream && stream.getVideoTracks()[0];
  if (!track) return;
  try {
    torchOn = !torchOn;
    await track.applyConstraints({ advanced: [{ torch: torchOn }] });
    $('torchBtn').classList.toggle('active', torchOn);
  } catch { /* not supported */ }
};
function syncGenerate() {
  $('generateBtn').disabled = pages.length === 0 && !$('topicInput').value.trim();
}

$('snapBtn').onclick = capture;
$('shutterBtn').onclick = capture;
$('flipBtn').onclick = () => {
  facing = facing === 'environment' ? 'user' : 'environment';
  startCamera();
};
$('fileInput').onchange = async (e) => {
  const files = [...e.target.files];
  e.target.value = '';
  for (const f of files) addPage(await normalizeImage(f));
};

// Keep full quality, but cap huge photos (e.g. 50MP) to a sharp, upload-safe size.
function normalizeImage(file) {
  return new Promise((resolve) => {
    if (file.type === 'application/pdf' || !file.type.startsWith('image/')) return resolve(file);
    const MAX = 3500; // long edge — plenty for crisp text, reliable upload
    const img = new Image();
    img.onload = () => {
      const long = Math.max(img.width, img.height);
      if (long <= MAX && file.size <= 6 * 1024 * 1024) { URL.revokeObjectURL(img.src); return resolve(file); }
      const s = Math.min(1, MAX / long);
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      c.toBlob((b) => resolve(b || file), 'image/jpeg', 0.95);
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}
$('topicInput').oninput = () => {
  $('topicChips').querySelectorAll('.chip').forEach((x) => x.classList.remove('active'));
  syncGenerate();
};
$('topicInput').onkeydown = (e) => {
  if (e.key === 'Enter' && !$('generateBtn').disabled) $('generateBtn').click();
};

// ---------- Generate ----------
$('generateBtn').onclick = async () => {
  const topic = $('topicInput').value.trim();
  if (pages.length === 0 && !topic) return banner(t('need_input'));
  show('loading');
  const fd = new FormData();
  pages.forEach((p, i) => fd.append('images', p.blob, `page${i + 1}.jpg`));
  fd.append('count', $('count').value);
  fd.append('difficulty', $('difficulty').value);
  fd.append('language', $('quizLang').value); // quiz output language (independent of app UI)
  fd.append('mode', $('mode').value); // 'study' or 'observe'
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
  Mascot.stop();
  Mascot.expr('idle');
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
  if (narratorOn) setTimeout(narrate, 350); // character reads the question aloud
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
  const right = i === q.correctIndex;
  if (right) score++;
  Mascot.stop();
  Mascot.expr(right ? 'happy' : 'sad');
  setTimeout(() => Mascot.expr('idle'), 1900);
  if (navigator.vibrate) navigator.vibrate(right ? 20 : [25, 40, 25]);
  answers.push({ q: q.question, chosen: q.options[i], correct: q.options[q.correctIndex], isRight: right });
  $('liveScore').textContent = `${t('score')}: ${score}`;
  reveal(area, q, i);
}

// Replay narration / tap the character to hear it again.
function toggleNarration() {
  if (!('speechSynthesis' in window)) return banner('🔊 not supported on this device.');
  if (window.speechSynthesis.speaking) Mascot.stop();
  else narrate();
}
$('speakBtn').onclick = toggleNarration;
$('mascot').onclick = toggleNarration;

// Narrator on/off (auto-read each question).
function updateMute() {
  $('muteBtn').textContent = narratorOn ? '🎙️' : '🔇';
  $('muteBtn').classList.toggle('active', narratorOn);
}
$('muteBtn').onclick = () => {
  narratorOn = !narratorOn;
  localStorage.setItem('aiquiz_narrator', narratorOn ? 'on' : 'off');
  updateMute();
  if (!narratorOn) Mascot.stop();
  else narrate();
};

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

// Exit the quiz back to the capture screen at any time.
$('quizBackBtn').onclick = () => {
  Mascot.stop();
  clearInterval(timerId);
  show('capture');
  startCamera();
};

function showResults() {
  clearInterval(timerId);
  Mascot.stop();
  show('results');
  const total = quiz.questions.length;
  const pct = Math.round((score / total) * 100);
  $('scoreRing').style.setProperty('--p', `${pct}%`);
  $('scoreText').textContent = `${pct}%`;
  $('scoreHeadline').textContent = pct >= 80 ? t('excellent') : pct >= 50 ? t('good') : t('keep');
  let detail = `${t('scored')(score, total)}  ⏱️ ${fmtTime(elapsed)}`;
  if ($('negMark').checked) {
    const wrongAttempted = answers.filter((a) => !a.isRight && a.chosen !== null).length;
    const net = Math.max(0, score - 0.25 * wrongAttempted);
    detail += `\n${t('net_score')(net.toFixed(2), total)}`;
  }
  $('scoreDetail').style.whiteSpace = 'pre-line';
  $('scoreDetail').textContent = detail;
  $('wrongOnly').checked = false;
  renderReview(false);
  saveHistory({ topic: quiz.topic || 'Quiz', score, total, pct });
  if (pct >= 70) {
    confetti();
    if (navigator.vibrate) navigator.vibrate([30, 50, 30, 50, 60]);
  }
}

// Lightweight DOM confetti — no library.
function confetti() {
  const colors = ['#4f46e5', '#7c6cff', '#06b6d4', '#16a34a', '#f59e0b', '#e11d48'];
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = (5 + (i / 36) * 90) + 'vw';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = (1.6 + (i % 5) * 0.25) + 's';
    p.style.animationDelay = (i % 8) * 0.06 + 's';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3200);
  }
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
  Mascot.stop();
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
  const now = new Date();
  hist.unshift({ ...entry, when: now.toLocaleString(), day: now.toISOString().slice(0, 10) });
  localStorage.setItem(HKEY, JSON.stringify(hist.slice(0, 50)));
}

function renderStats() {
  const hist = loadHistory();
  const box = $('statsBox');
  if (!hist.length) { box.hidden = true; return; }
  box.hidden = false;
  const total = hist.length;
  const avg = Math.round(hist.reduce((s, h) => s + h.pct, 0) / total);
  const best = Math.max(...hist.map((h) => h.pct));
  // streak: consecutive calendar days (ending today or yesterday) with a quiz
  const days = new Set(hist.map((h) => h.day).filter(Boolean));
  let streak = 0;
  const d = new Date();
  const iso = (x) => x.toISOString().slice(0, 10);
  if (!days.has(iso(d))) d.setDate(d.getDate() - 1); // allow today not done yet
  while (days.has(iso(d))) { streak++; d.setDate(d.getDate() - 1); }
  $('stTotal').textContent = total;
  $('stAvg').textContent = avg + '%';
  $('stBest').textContent = best + '%';
  $('stStreak').textContent = '🔥' + streak;
}
function renderHistory() {
  renderStats();
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
Mascot.init();
updateMute();

// Register service worker (makes the app installable / Play-Store ready).
// Auto-reload once when a new version takes over, so updates show immediately.
if ('serviceWorker' in navigator) {
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return;
    reloaded = true;
    window.location.reload();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => reg.update()).catch(() => {});
  });
}

// ---------- Install (Add to Home Screen) ----------
let deferredPrompt = null;
const installBtn = $('installBtn');
const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (!isStandalone) installBtn.hidden = false;
});
window.addEventListener('appinstalled', () => {
  installBtn.hidden = true;
  deferredPrompt = null;
  banner(t('installed'));
});
installBtn.onclick = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  } else if (isIOS) {
    banner(t('ios_install')); // iOS Safari has no prompt API
  }
};
// iOS never fires beforeinstallprompt — show the button with manual instructions.
if (isIOS && !isStandalone) installBtn.hidden = false;
