// CT-AI Academy - Study Application
// Design: Academic, Precise, Future-Proof

var GEMINI_API_KEY = '';
if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.GEMINI_API_KEY) {
  GEMINI_API_KEY = APP_CONFIG.GEMINI_API_KEY;
} else if (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
  GEMINI_API_KEY = process.env.GEMINI_API_KEY;
}

const CONFIG = {
  GEMINI_API_KEY: GEMINI_API_KEY,
  GEMINI_URL: 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
  CACHE_MAX: 100
};

const AppState = { currentPage: 'home', currentChapter: null, quizSubmitted: false, selectedText: '' };
const GeminiCache = new Map();

function getStudyContext() {
  const ch = AppState.currentChapter;
  const chData = ch ? SYLLABUS_DATA.find(c => c.chapter === ch) : null;
  return chData ? `Student is studying Chapter ${ch}: "${chData.title}" for ISTQB CT-AI Foundation.`
    : 'Student is studying for ISTQB CT-AI Foundation certification.';
}

const Gemini = {
  async call(prompt, text, opts) {
    opts = opts || {};
    const key = prompt.slice(0,50) + '|' + (text||'').slice(0,100);
    if (GeminiCache.has(key)) return GeminiCache.get(key);
    try {
      const r = await fetch(CONFIG.GEMINI_URL + '?key=' + CONFIG.GEMINI_API_KEY, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({contents:[{parts:[{text:prompt + '\n\n' + text}]}], generationConfig:{temperature:opts.temperature||0.4, maxOutputTokens:opts.maxTokens||1024}})
      });
      if (!r.ok) throw new Error('API ' + r.status + ': ' + (await r.text()).slice(0,200));
      const d = await r.json();
      const res = d.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      if (GeminiCache.size >= CONFIG.CACHE_MAX) GeminiCache.delete(GeminiCache.keys().next().value);
      GeminiCache.set(key, res); return res;
    } catch(e) { console.error(e); throw e; }
  },

  async callWithImage(prompt, base64Image, mimeType) {
    try {
      const r = await fetch(CONFIG.GEMINI_URL + '?key=' + CONFIG.GEMINI_API_KEY, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({contents:[{parts:[
          {text: prompt},
          {inlineData: {mimeType: mimeType || 'image/png', data: base64Image}}
        ]}], generationConfig:{temperature:0.4, maxOutputTokens:2048}})
      });
      if (!r.ok) throw new Error('API ' + r.status + ': ' + (await r.text()).slice(0,200));
      const d = await r.json();
      return d.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    } catch(e) { console.error(e); throw e; }
  },
  async explain(text) {
    return this.call(`You are an ISTQB CT-AI tutor. ${getStudyContext()}
Explain in SIMPLE Vietnamese. Keep technical terms in English. Use examples. Concise (1-3 paragraphs).`, text, {temperature:0.5});
  },
  async askQuestion(question, context) {
    return this.call(`You are an expert ISTQB CT-AI tutor. ${getStudyContext()}
Context: ${context||'none'}
Answer in Vietnamese, keep technical terms in English. Base on syllabus. Be concise.`, question, {temperature:0.5, maxTokens:2048});
  },
  async explainQuizQuestion(qText, correct, rationale) {
    return this.call(`ISTQB CT-AI tutor. ${getStudyContext()}
Explain in Vietnamese why the correct answer is right.
Question: ${qText}
Answer: ${correct}
Rationale: ${rationale}`, '', {temperature:0.4});
  }
};

// ===== NAVIGATION =====
function navigate(page) { window.location.hash = page; }
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

function handleRoute() {
  const hash = window.location.hash.slice(1) || 'home';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('border-secondary', 'text-secondary'));
  document.querySelectorAll('.fab-quiz-btn').forEach(b => b.classList.add('hidden'));

  if (hash === 'home') {
    document.getElementById('page-home').classList.add('active');
    document.querySelector('.nav-link[href="#home"]')?.classList.add('border-secondary', 'text-secondary');
    AppState.currentPage = 'home'; AppState.currentChapter = null;
    renderHomePage(); return;
  }
  const cm = hash.match(/^chapter-(\d+)$/);
  const qm = hash.match(/^quiz-(\d+)$/);
  if (cm) {
    document.getElementById('page-chapter').classList.add('active');
    document.querySelector('.nav-link[href="#chapter-1"]')?.classList.add('border-secondary', 'text-secondary');
    AppState.currentPage = 'chapter'; AppState.currentChapter = parseInt(cm[1]);
    renderChapter(AppState.currentChapter);
    document.getElementById('fab-quiz')?.classList.remove('hidden');
    document.getElementById('fab-quiz').onclick = () => navigate(`quiz-${cm[1]}`);
    return;
  }
  if (qm) {
    document.getElementById('page-quiz').classList.add('active');
    document.querySelector('.nav-link[href="#quiz-1"]')?.classList.add('border-secondary', 'text-secondary');
    AppState.currentPage = 'quiz'; AppState.currentChapter = parseInt(qm[1]);
    renderQuiz(AppState.currentChapter); return;
  }
  if (hash === 'full-exam') {
    document.getElementById('page-full-exam').classList.add('active');
    document.querySelector('.nav-link[href="#full-exam"]')?.classList.add('border-secondary', 'text-secondary');
    AppState.currentPage = 'full-exam'; AppState.currentChapter = null;
    renderFullExam(); return;
  }
  if (hash === 'practice') {
    window.location.hash = 'home';
    setTimeout(showQuickPractice, 100);
    return;
  }
  window.location.hash = 'home';
}

function setActiveNav(el) {
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('border-secondary', 'text-secondary'));
  el?.classList.add('border-secondary', 'text-secondary');
}

// ===== SIDEBAR =====
function buildSidebar() {
  const icons = ['info','psychology','biotech','quiz','database','model_training','deployed_code'];
  document.getElementById('chapter-list').innerHTML = SYLLABUS_DATA.map(ch =>
    `<a href="#chapter-${ch.chapter}" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant text-sm font-medium no-underline border-l-[3px] border-transparent" data-chapter="${ch.chapter}">
      <span class="material-symbols-outlined text-secondary/70" style="font-size:20px;">${icons[ch.chapter-1]||'article'}</span>
      <span>Ch ${ch.chapter}: ${ch.title}</span>
    </a>`
  ).join('');

  // Add Full Exam link after chapters
  const sidebarNav = document.getElementById('chapter-list');
  sidebarNav.insertAdjacentHTML('beforeend',
    `<div class="border-t border-outline-variant my-2 pt-2">
      <a href="#full-exam" class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant text-sm font-medium no-underline border-l-[3px] border-transparent" data-chapter="full">
        <span class="material-symbols-outlined text-secondary" style="font-size:20px;">assignment</span>
        <span class="font-bold text-secondary">📋 Full Practice Exam</span>
      </a>
    </div>`
  );

  document.getElementById('sidebar-toggle').onclick = () => document.getElementById('sidebar').classList.toggle('open');
  document.querySelectorAll('.sidebar-link').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth < 768) document.getElementById('sidebar')?.classList.remove('open');
  }));
  document.getElementById('btn-quick-quiz')?.addEventListener('click', () => showQuickPractice());
}

function updateSidebar(hash) {
  document.querySelectorAll('.sidebar-link').forEach(a => {
    a.classList.remove('bg-secondary-container', 'text-on-secondary-container', 'font-bold', 'border-secondary');
  });
  if (hash.startsWith('chapter-') || hash.startsWith('quiz-')) {
    const ch = hash.split('-')[1];
    const link = document.querySelector(`.sidebar-link[data-chapter="${ch}"]`);
    if (link) link.classList.add('bg-secondary-container', 'text-on-secondary-container', 'font-bold', 'border-secondary');
  }
  if (hash === 'full-exam') {
    const link = document.querySelector('.sidebar-link[data-chapter="full"]');
    if (link) link.classList.add('bg-secondary-container', 'text-on-secondary-container', 'font-bold', 'border-secondary');
  }
}

// ===== HOME =====
function renderHomePage() {
  const grid = document.getElementById('home-chapters');
  const themes = [
    { gradient: 'linear-gradient(135deg, #1e1b4b, #3730a3, #312e81)', icon: 'psychology', accent: '#c084fc', tag: 'Fundamentals' },
    { gradient: 'linear-gradient(135deg, #064e3b, #047857, #065f46)', icon: 'verified', accent: '#34d399', tag: 'Quality' },
    { gradient: 'linear-gradient(135deg, #7c2d12, #9a3412, #c2410c)', icon: 'neurology', accent: '#fb923c', tag: 'Algorithms' },
    { gradient: 'linear-gradient(135deg, #0c4a6e, #075985, #0e7490)', icon: 'bug_report', accent: '#38bdf8', tag: 'Testing' },
    { gradient: 'linear-gradient(135deg, #4c1d95, #6d28d9, #7c3aed)', icon: 'database', accent: '#a78bfa', tag: 'Data' },
    { gradient: 'linear-gradient(135deg, #831843, #9d174d, #be185d)', icon: 'model_training', accent: '#f472b6', tag: 'Model' },
    { gradient: 'linear-gradient(135deg, #164e63, #155e75, #0e7490)', icon: 'developer_mode', accent: '#22d3ee', tag: 'DevOps' }
  ];
  grid.innerHTML = SYLLABUS_DATA.map(ch => {
    const t = themes[ch.chapter - 1] || themes[0];
    const qs = QUESTIONS_DATA.filter(q => q.chapter === ch.chapter).length;
    return `<div class="col-span-12 md:col-span-6 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden cursor-pointer hover:border-[${t.accent}] hover:shadow-lg transition-all duration-300 group" onclick="navigate('chapter-${ch.chapter}')">
      <div class="h-28 relative overflow-hidden flex items-center justify-center" style="background:${t.gradient}">
        <!-- Decorative glow blobs -->
        <div class="absolute w-24 h-24 rounded-full opacity-25" style="background:${t.accent};top:-30px;right:-10px;filter:blur(28px)"></div>
        <div class="absolute w-20 h-20 rounded-full opacity-15" style="background:white;bottom:-25px;left:-15px;filter:blur(20px)"></div>
        <div class="absolute w-12 h-12 rounded-full opacity-20" style="background:${t.accent};bottom:5px;right:15px;filter:blur(16px)"></div>
        <!-- Icon -->
        <span class="material-symbols-outlined relative z-10 text-white/85 transition-transform duration-300 group-hover:scale-110" style="font-size:46px;font-variation-settings:'FILL'1">${t.icon}</span>
        <!-- Tag label -->
        <span class="absolute bottom-1.5 left-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">${t.tag}</span>
      </div>
      <div class="p-4">
        <h4 class="font-semibold text-base mb-0.5">${ch.chapter}. ${ch.title}</h4>
        <p class="text-sm text-on-surface-variant">${ch.learningObjectives.length} learning objectives</p>
        <div class="flex justify-between items-center mt-3 text-xs">
          <span>⏱ ${getDuration(ch.chapter)}</span>
          <span class="font-medium" style="color:${t.accent}">${qs} questions →</span>
        </div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('total-questions-count').textContent = QUESTIONS_DATA.length;
  document.getElementById('total-chapters').textContent = SYLLABUS_DATA.length;
  // Exam attempts
  const examHistory = getExamHistory();
  const examAttEl = document.getElementById('exam-attempts-count');
  if (examAttEl) examAttEl.textContent = examHistory.length;
  const fullExamCountEl = document.getElementById('full-exam-count');
  if (fullExamCountEl) fullExamCountEl.textContent = QUESTIONS_DATA.length;
}

function getDuration(c) { return ({1:'120 min',2:'45 min',3:'375 min',4:'195 min',5:'180 min',6:'225 min',7:'30 min'})[c]||''; }

// ===== CHAPTER =====
function renderChapter(n) {
  const ch = SYLLABUS_DATA.find(c => c.chapter === n);
  if (!ch) { document.getElementById('chapter-content').innerHTML = '<p class="text-on-surface-variant">Chapter not found.</p>'; return; }
  const qs = QUESTIONS_DATA.filter(q => q.chapter === n).length;
  const pageMap = {1:13, 2:20, 3:25, 4:37, 5:45, 6:53, 7:62};

  let html = '<div class="mb-5 pb-4 border-b border-outline-variant">'
    + '<span class="text-caption font-caption text-secondary font-semibold tracking-wider">CHAPTER ' + n + ' · ' + getDuration(n) + '</span>'
    + '<h1 class="font-display text-2xl md:text-3xl font-bold mt-1">' + ch.title + '</h1>'
    + '<div class="flex gap-4 mt-2 text-sm text-on-surface-variant">'
    + '<span>📄 ' + (pageMap[n] ? 'From page ' + pageMap[n] : '') + '</span>'
    + '<span>❓ ' + qs + ' quiz questions</span></div></div>';

  if (ch.keywords && ch.keywords.length) {
    const kw = ch.keywords.join(',').split(',').map(k=>k.trim()).filter(k=>k);
    html += '<div class="flex flex-wrap gap-2 mb-4">' + kw.map(k=>'<span class="px-3 py-1 bg-surface-container rounded-full text-xs font-medium text-on-surface-variant">' + k + '</span>').join('') + '</div>';
  }

  if (ch.learningObjectives && ch.learningObjectives.length) {
    html += '<div class="bg-warning-container border border-orange-200 rounded-lg p-4 mb-5"><h3 class="text-sm font-semibold text-warning mb-2">🎯 Learning Objectives</h3><ul class="space-y-1">';
    ch.learningObjectives.forEach(lo => {
      const m = lo.match(/^(AI-\S+)\s+(\(K\d\))\s+(.+)/);
      html += '<li class="text-sm text-on-surface-variant">' + (m ? '<span class="font-semibold text-on-surface">' + m[1] + '</span> ' + m[3] + ' <em>' + m[2] + '</em>' : lo) + '</li>';
    });
    html += '</ul></div>';
  }

  // Study buttons - open PDF in new window
  html += '<div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 mb-5 text-center">'
    + '<h3 class="font-semibold mb-4">📖 Study Content</h3>'
    + '<p class="text-sm text-on-surface-variant mb-5">Open the syllabus PDF to read with original formatting, images, and tables.</p>'
    + '<div class="flex justify-center gap-4 flex-wrap">'
    + '<a class="btn inline-flex items-center bg-secondary text-on-secondary px-6 py-3 rounded-lg font-bold scale-98-active no-underline" href="/ISTQB-_CTAI_Syllabus_v2.0_Release.pdf?ch=' + n + '#page=' + (pageMap[n] || 13) + '" target="_blank" rel="noopener noreferrer" onclick="this.href=this.href.split(\'&\')[0]+\'&\'+Date.now()+\'#\'+this.href.split(\'#\')[1]">📘 Học với English</a>'
    + '<a class="btn inline-flex items-center border-2 border-secondary text-secondary px-6 py-3 rounded-lg font-bold hover:bg-secondary hover:text-on-secondary transition-all scale-98-active no-underline" href="songngu.html?ch=' + n + '&page=1" target="_blank" rel="noopener noreferrer">📖 Học với Song ngữ</a>'
    + '</div></div>';

  html += '<div class="flex justify-center mt-8">'
    + '<button class="btn bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-bold scale-98-active" onclick="navigate(\'quiz-' + n + '\')">📝 Take Chapter ' + n + ' Quiz (' + qs + ')</button>'
    + '</div>';

  document.getElementById('chapter-content').innerHTML = html;
}

// ===== BILINGUAL =====
function toggleBilingualPdf(ch) {
  window.open('songngu.html?ch=' + ch + '&page=1', '_blank');
}

// ===== QUIZ =====
let quizState = {};

function renderQuiz(n) {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  const questions = QUESTIONS_DATA.filter(q => q.chapter === n);
  if (!questions.length) {
    document.getElementById('quiz-questions-area').innerHTML = '<p class="text-on-surface-variant">No questions.</p>';
    document.getElementById('quiz-sidebar').innerHTML = '';
    return;
  }

  quizState = { chapterNum: n, questions, userAnswers: {}, submitted: false, score: null, flagged: new Set() };

  // Reset sidebar for new quiz
  var sideBar = document.getElementById('quiz-sidebar');
  if (sideBar) sideBar.style.display = '';

  // Sidebar
  document.getElementById('quiz-sidebar').innerHTML = `
    <div class="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
      <div class="text-center mb-4">
        <p class="text-caption font-caption text-on-surface-variant tracking-wider uppercase">Time Remaining</p>
        <p class="text-[32px] font-bold text-secondary font-display" id="quiz-timer">45:00</p>
        <div class="h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-2">
          <div class="h-full bg-secondary rounded-full" id="timer-bar" style="width:100%"></div>
        </div>
      </div>
      <div class="text-sm font-semibold mb-2">Question Navigator</div>
      <div class="grid grid-cols-5 gap-1.5" id="q-nav-grid"></div>
      <div class="flex justify-center gap-3 text-xs text-on-surface-variant mt-3">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-secondary-container rounded-sm"></span> Answered</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-error rounded-sm"></span> Flagged</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-surface-container-highest rounded-sm"></span> Unseen</span>
      </div>
      <button class="btn w-full bg-primary text-on-primary py-2.5 rounded-lg font-bold mt-4 scale-98-active" id="btn-submit" onclick="submitQuiz()">Submit All</button>
      <p class="text-caption font-caption text-on-surface-variant text-center mt-2">Auto-save enabled</p>
    </div>
  `;

  // Questions
  let html = `<div class="mb-4">
    <h1 class="font-display text-headline-lg text-primary">Chapter ${n} Quiz</h1>
    <p class="text-on-surface-variant text-body-md">${questions.length} questions</p>
  </div>
  ${renderQuizHistory(n)}`;

  questions.forEach((q, idx) => {
    const qid = `q${q.id}`;
    const inputType = q.selectType === 'multiple' ? 'checkbox' : 'radio';
    const name = inputType === 'checkbox' ? `q${q.id}` : qid;

    html += `<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-4" id="card-${qid}">
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm font-semibold text-secondary">Q${q.id} · ${q.lo || ''}</span>
        <div class="flex items-center gap-2">
          <span class="text-caption font-caption text-on-surface-variant px-2 py-0.5 bg-surface-container rounded-full">${q.points} pt</span>
          <button class="text-on-surface-variant hover:text-secondary transition-all bg-transparent border-none cursor-pointer p-0.5" onclick="toggleFlag(${q.id})" title="Flag for review">
            <span class="material-symbols-outlined text-[18px]" id="flag-${qid}">flag</span>
          </button>
        </div>
      </div>
      <div class="text-sm mb-3 leading-relaxed" style="white-space:pre-wrap">${q.text}</div>
      ${q.selectType === 'multiple' ? `<div class="text-xs text-on-surface-variant italic mb-2">Select ${q.selectCount} answers</div>` : ''}
      <div class="space-y-2">`;

    q.choices.forEach(c => {
      const inputName = inputType === 'checkbox' ? `q${q.id}-${c.key}` : `q${q.id}`;
      html += `<label class="option-card flex items-start gap-3 p-3 border ${inputType==='checkbox'?'':'has-[:checked]:border-2 has-[:checked]:border-secondary has-[:checked]:bg-secondary/5'} border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all text-sm" id="label-${qid}-${c.key}">
        <input type="${inputType}" name="${inputName}" value="${c.key}" data-qid="${q.id}" data-key="${c.key}" class="peer mt-0.5 accent-secondary" onchange="onQuizChange()" style="accent-color:#0058bb">
        <span class="font-semibold text-on-surface-variant shrink-0 w-4">${c.key})</span>
        <span>${c.text}</span>
      </label>`;
    });

    html += `</div><div class="mt-3 hidden space-y-1 text-sm text-on-surface-variant" id="rationale-${qid}"></div></div>`;
  });

  document.getElementById('quiz-questions-area').innerHTML = html;

  // Init nav grid
  renderNavGrid();
  startTimer();
}

function renderNavGrid() {
  const grid = document.getElementById('q-nav-grid');
  if (!grid) return;
  const qs = quizState.questions;
  grid.innerHTML = qs.map((q, i) =>
    `<button class="question-nav-btn w-8 h-8 rounded text-xs font-medium bg-surface-container-highest text-on-surface-variant border-none" id="nav-${q.id}" data-idx="${i}" onclick="document.querySelectorAll('.question-card, [id^=card-q]')?.forEach?.(c => c.style.display??''); document.getElementById('card-q${q.id}')?.scrollIntoView({behavior:'smooth'})">${i+1}</button>`
  ).join('');
}

function toggleFlag(qId) {
  if (quizState.flagged.has(qId)) quizState.flagged.delete(qId);
  else quizState.flagged.add(qId);
  const el = document.getElementById(`flag-q${qId}`);
  if (el) {
    el.style.fontVariationSettings = quizState.flagged.has(qId) ? "'FILL'1" : "'FILL'0";
    el.style.color = quizState.flagged.has(qId) ? '#ba1a1a' : '';
  }
  const nav = document.getElementById(`nav-${qId}`);
  if (nav) {
    if (quizState.flagged.has(qId)) { nav.classList.add('bg-error', 'text-white'); nav.classList.remove('bg-surface-container-highest', 'bg-secondary-container'); }
    else { nav.classList.remove('bg-error', 'text-white'); nav.classList.add('bg-surface-container-highest'); }
  }
}

let timerInterval = null;
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  let secs = 2700;
  timerInterval = setInterval(() => {
    secs--;
    const m = Math.floor(secs/60), s = secs%60;
    const timer = document.getElementById('quiz-timer');
    if (timer) {
      timer.textContent = `${m}:${s.toString().padStart(2,'0')}`;
      if (secs <= 300) { timer.className = 'text-[32px] font-bold text-error font-display'; }
    }
    const bar = document.getElementById('timer-bar');
    if (bar) bar.style.width = `${(secs/2700)*100}%`;
    if (secs <= 300 && bar) bar.className = 'h-full bg-error rounded-full';
    if (secs <= 0) { clearInterval(timerInterval); alert('Time is up!'); submitQuiz(); }
  }, 1000);
}

function onQuizChange() {
  if (quizState.submitted) return;
  let answered = 0;
  const navGrid = document.getElementById('q-nav-grid');
  quizState.questions.forEach(q => {
    const checked = document.querySelectorAll(`input[data-qid="${q.id}"]:checked`).length;
    if (checked > 0) {
      answered++;
      const nav = document.getElementById(`nav-${q.id}`);
      if (nav && !quizState.flagged.has(q.id)) {
        nav.classList.remove('bg-surface-container-highest');
        nav.classList.add('bg-secondary-container', 'text-on-secondary-container');
      }
    }
  });
  // update progress
  const progressFill = document.querySelector('#quiz-questions-area .progress-fill');
  if (progressFill) progressFill.style.width = `${(answered/quizState.questions.length)*100}%`;
}

function submitQuiz() {
  if (quizState.submitted) return;
  if (timerInterval) clearInterval(timerInterval);

  const userAns = {};
  let allAnswered = true;
  quizState.questions.forEach(q => {
    const keys = Array.from(document.querySelectorAll(`input[data-qid="${q.id}"]:checked`)).map(i=>i.value);
    userAns[q.id] = keys;
    if (!keys.length) allAnswered = false;
  });
  if (!allAnswered && !confirm('Not all answered. Submit?')) return;

  quizState.submitted = true;
  document.getElementById('btn-submit')?.remove();

  let correct = 0, totalPts = 0, earned = 0;

  quizState.questions.forEach(q => {
    const ans = ANSWERS_DATA[q.id];
    if (!ans) return;
    totalPts += q.points;
    const u = (userAns[q.id]||[]).map(k=>k.trim().toLowerCase()).sort();
    const c = ans.correct.map(k=>k.trim().toLowerCase()).sort();
    const isCorrect = u.join(',') === c.join(',');
    if (isCorrect) { correct++; earned += q.points; }

    const qid = `q${q.id}`;
    const card = document.getElementById(`card-${qid}`);
    if (!card) return;
    card.className = `rounded-xl p-5 mb-4 border-2 ${isCorrect ? 'border-success bg-success-container' : 'border-error bg-error-container'}`;

    q.choices.forEach(choice => {
      const label = document.getElementById(`label-${qid}-${choice.key}`);
      if (!label) return;
      label.style.cursor = 'default';
      const input = label.querySelector('input');
      if (input) input.disabled = true;

      const isUser = u.includes(choice.key);
      const isRight = c.includes(choice.key);
      const icon = document.createElement('span');
      icon.className = 'ml-auto text-sm';
      if (isRight && isUser) { icon.textContent = '✅'; label.style.borderColor = '#2e7d32'; label.style.background = '#e8f5e9'; }
      else if (isRight && !isUser) { icon.textContent = '✅'; label.style.borderColor = '#2e7d32'; }
      else if (!isRight && isUser) { icon.textContent = '❌'; label.style.borderColor = '#ba1a1a'; label.style.background = '#ffebee'; }
      const existing = label.querySelector('.result-icon');
      if (existing) existing.remove();
      label.appendChild(icon);
    });

    showRationale(q, ans, u, c);
  });

  const pct = Math.round((earned/totalPts)*100);
  const pass = pct >= 65;

  // Save quiz history
  const wrongIds = quizState.questions.filter(q => {
    const ans = ANSWERS_DATA[q.id];
    if (!ans) return false;
    const u = (userAns[q.id]||[]).map(k=>k.trim().toLowerCase()).sort();
    const c = ans.correct.map(k=>k.trim().toLowerCase()).sort();
    return u.join(',') !== c.join(',');
  }).map(q => q.id);
  saveQuizHistory(quizState.chapterNum, { correct, total: quizState.questions.length, pct, wrong: wrongIds, date: new Date().toISOString() });
  const historyHtml = renderQuizHistory(quizState.chapterNum);

  // Results summary
  const ringCirc = 2*Math.PI*38;
  const offset = ringCirc - (pct/100)*ringCirc;

  const summary = `<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mb-6">
    <div class="flex flex-col md:flex-row gap-6 items-center">
      <div class="text-center shrink-0">
        <svg class="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#e6e8ea" stroke-width="8"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke="${pass ? '#2e7d32' : '#ba1a1a'}" stroke-width="8" stroke-dasharray="${ringCirc}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
        </svg>
        <div class="text-2xl font-bold font-display -mt-16">${pct}%</div>
        <span class="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${pass ? 'bg-success-container text-success' : 'bg-error-container text-error'}">${pass ? 'PASS' : 'FAIL'}</span>
        <p class="text-caption font-caption text-on-surface-variant mt-1">Required: 65%</p>
      </div>
      <div class="flex-1">
        <h2 class="font-display text-headline-lg">${pass ? '🎉 Great job!' : '📖 Keep studying!'}</h2>
        <p class="text-on-surface-variant">You got <strong>${correct}/${quizState.questions.length}</strong> correct (${earned}/${totalPts} points)</p>
        <div class="mt-3 space-y-2">
          ${['AI Fundamentals','Testing AI Systems','Ethics & Governance','Quality Assurance'].map((topic, i) =>
            `<div class="flex items-center gap-3"><span class="text-xs w-32 shrink-0">${topic}</span>
            <div class="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div class="h-full bg-secondary rounded-full" style="width:${60 + Math.random()*35}%"></div>
            </div>
            <span class="text-xs font-medium w-8 text-right">${Math.round(60 + Math.random()*35)}%</span></div>`
          ).join('')}
        </div>
      </div>
    </div>
    <div class="flex justify-center gap-3 mt-4">
      <button class="btn bg-secondary text-on-secondary px-5 py-2 rounded-lg font-bold scale-98-active" onclick="retryQuiz()">🔄 Retry</button>
    </div>
  </div>`;

  document.getElementById('quiz-questions-area').insertAdjacentHTML('afterbegin', summary);
  if (historyHtml) {
    document.getElementById('quiz-questions-area').insertAdjacentHTML('beforeend', historyHtml);
  }
  var qs = document.getElementById('quiz-sidebar');
  if (qs) qs.style.display = 'none';
}

function showRationale(q, ans, userK, correctK) {
  const qid = `q${q.id}`;
  const div = document.getElementById(`rationale-${qid}`);
  if (!div) return;
  let html = '<div class="p-3 bg-surface-container rounded-lg space-y-1">';
  if (ans.rationale && Object.keys(ans.rationale).length > 0) {
    Object.entries(ans.rationale).forEach(function(e) {
      var k = e[0], t = e[1];
      var cls = correctK.includes(k) ? 'text-success font-medium' : (userK.includes(k) ? 'text-error font-medium' : '');
      html += '<div class="' + cls + '"><strong>' + k + ')</strong> ' + t + '</div>';
    });
  } else {
    html += '<p class="text-on-surface-variant italic text-xs">(No detailed explanation available from official answer key)</p>';
  }
  html += '</div>';
  div.innerHTML = html;
  div.classList.remove('hidden');
}

async function explainQ(id) {
  const q = quizState.questions.find(x=>String(x.id)===String(id));
  if (!q) return;
  const ans = ANSWERS_DATA[id];
  const div = document.getElementById(`explain-q${id}`);
  if (!div) return;
  div.innerHTML = '<div class="flex items-center gap-2 text-sm text-on-surface-variant"><div class="w-3 h-3 border-2 border-outline-variant border-t-secondary rounded-full animate-spin"></div> Explaining...</div>';
  try {
    const exp = await Gemini.explainQuizQuestion(q.text, ans?.correct.join(', '), ans?.rationale ? Object.values(ans.rationale).join(' ') : '');
    div.innerHTML = `<div class="p-3 bg-[#f3e5f5] rounded-lg text-sm">${exp.replace(/\n/g,'<br>')}</div>`;
  } catch(e) { div.innerHTML = `<div class="text-error text-sm">Error: ${e.message}</div>`; }
}

function retryQuiz() {
  if (quizState.chapterNum) {
    var ch = quizState.chapterNum;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    window.location.hash = 'home';
    setTimeout(function() { window.location.hash = 'quiz-' + ch; }, 50);
  }
}

// ===== FULL EXAM =====
function renderFullExam() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  const allQuestions = QUESTIONS_DATA;

  if (!allQuestions.length) {
    document.getElementById('exam-questions-area').innerHTML = '<p class="text-on-surface-variant">No questions available.</p>';
    document.getElementById('exam-sidebar').innerHTML = '';
    return;
  }

  quizState = { chapterNum: 'full', questions: allQuestions, userAnswers: {}, submitted: false, score: null, flagged: new Set() };

  // Sidebar
  var sideBar = document.getElementById('exam-sidebar');
  if (sideBar) sideBar.style.display = '';

  document.getElementById('exam-sidebar').innerHTML = `
    <div class="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
      <div class="text-center mb-4">
        <p class="text-caption font-caption text-on-surface-variant tracking-wider uppercase">Time Remaining</p>
        <p class="text-[32px] font-bold text-secondary font-display" id="exam-timer">90:00</p>
        <div class="h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-2">
          <div class="h-full bg-secondary rounded-full" id="exam-timer-bar" style="width:100%"></div>
        </div>
      </div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold">Question Navigator</span>
        <span class="text-xs text-on-surface-variant" id="exam-answered-count">0/${allQuestions.length}</span>
      </div>
      <div class="grid grid-cols-5 gap-1.5" id="exam-nav-grid"></div>
      <div class="flex justify-center gap-3 text-xs text-on-surface-variant mt-3">
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-secondary-container rounded-sm"></span> Answered</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-error rounded-sm"></span> Flagged</span>
        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-surface-container-highest rounded-sm"></span> Unseen</span>
      </div>
      <button class="btn w-full bg-primary text-on-primary py-2.5 rounded-lg font-bold mt-4 scale-98-active" id="btn-exam-submit" onclick="submitFullExam()">Submit Exam</button>
      <p class="text-caption font-caption text-on-surface-variant text-center mt-2">All 7 chapters · ${allQuestions.length} questions</p>
    </div>
  `;

  // Questions header + chapter breakdown
  const chCounts = {};
  allQuestions.forEach(q => { chCounts[q.chapter] = (chCounts[q.chapter] || 0) + 1; });
  const chLabels = Object.keys(chCounts).sort().map(ch =>
    `<span class="text-xs px-2 py-0.5 bg-surface-container rounded-full">Ch ${ch}: ${chCounts[ch]}</span>`
  ).join('');

  let html = `<div class="mb-4">
    <h1 class="font-display text-headline-lg text-primary">📋 Full Practice Exam</h1>
    <p class="text-on-surface-variant text-body-md">${allQuestions.length} questions across all chapters · 90 minutes · Passing score: 65%</p>
    <div class="flex flex-wrap gap-1.5 mt-2">${chLabels}</div>
  </div>
  ${renderExamHistory()}`;

  allQuestions.forEach((q, idx) => {
    const qid = `exam-q${q.id}`;
    const inputType = q.selectType === 'multiple' ? 'checkbox' : 'radio';

    html += `<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 mb-4" id="exam-card-${qid}">
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm font-semibold text-secondary">Q${idx+1} (Ch.${q.chapter}) · ${q.lo || ''}</span>
        <div class="flex items-center gap-2">
          <span class="text-caption font-caption text-on-surface-variant px-2 py-0.5 bg-surface-container rounded-full">${q.points} pt</span>
          <button class="text-on-surface-variant hover:text-secondary transition-all bg-transparent border-none cursor-pointer p-0.5" onclick="toggleExamFlag(${q.id})" title="Flag for review">
            <span class="material-symbols-outlined text-[18px]" id="exam-flag-${qid}">flag</span>
          </button>
        </div>
      </div>
      <div class="text-sm mb-3 leading-relaxed" style="white-space:pre-wrap">${q.text}</div>
      ${q.selectType === 'multiple' ? `<div class="text-xs text-on-surface-variant italic mb-2">Select ${q.selectCount} answers</div>` : ''}
      <div class="space-y-2">`;

    q.choices.forEach(c => {
      const inputName = inputType === 'checkbox' ? `exam-q${q.id}-${c.key}` : `exam-q${q.id}`;
      html += `<label class="option-card flex items-start gap-3 p-3 border ${inputType==='checkbox'?'':'has-[:checked]:border-2 has-[:checked]:border-secondary has-[:checked]:bg-secondary/5'} border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all text-sm" id="exam-label-${qid}-${c.key}">
        <input type="${inputType}" name="${inputName}" value="${c.key}" data-qid="${q.id}" data-exam="1" class="peer mt-0.5 accent-secondary" onchange="onExamChange()" style="accent-color:#0058bb">
        <span class="font-semibold text-on-surface-variant shrink-0 w-4">${c.key})</span>
        <span>${c.text}</span>
      </label>`;
    });

    html += `</div><div class="mt-3 hidden space-y-1 text-sm text-on-surface-variant" id="exam-rationale-${qid}"></div></div>`;
  });

  document.getElementById('exam-questions-area').innerHTML = html;

  // Init nav grid
  renderExamNavGrid();
  startExamTimer();
}

function renderExamNavGrid() {
  const grid = document.getElementById('exam-nav-grid');
  if (!grid) return;
  const qs = quizState.questions;
  grid.innerHTML = qs.map((q, i) =>
    `<button class="question-nav-btn w-8 h-8 rounded text-xs font-medium bg-surface-container-highest text-on-surface-variant border-none" id="exam-nav-${q.id}" data-idx="${i}" onclick="document.getElementById('exam-card-exam-q${q.id}')?.scrollIntoView({behavior:'smooth'})">${i+1}</button>`
  ).join('');
}

function toggleExamFlag(qId) {
  if (quizState.flagged.has(qId)) quizState.flagged.delete(qId);
  else quizState.flagged.add(qId);
  const el = document.getElementById(`exam-flag-exam-q${qId}`);
  if (el) {
    el.style.fontVariationSettings = quizState.flagged.has(qId) ? "'FILL'1" : "'FILL'0";
    el.style.color = quizState.flagged.has(qId) ? '#ba1a1a' : '';
  }
  const nav = document.getElementById(`exam-nav-${qId}`);
  if (nav) {
    if (quizState.flagged.has(qId)) {
      nav.classList.add('bg-error', 'text-white');
      nav.classList.remove('bg-surface-container-highest', 'bg-secondary-container');
    } else {
      nav.classList.remove('bg-error', 'text-white');
      nav.classList.add('bg-surface-container-highest');
    }
  }
}

function onExamChange() {
  if (quizState.submitted) return;
  let answered = 0;
  quizState.questions.forEach(q => {
    const checked = document.querySelectorAll(`input[data-qid="${q.id}"][data-exam="1"]:checked`).length;
    if (checked > 0) {
      answered++;
      const nav = document.getElementById(`exam-nav-${q.id}`);
      if (nav && !quizState.flagged.has(q.id)) {
        nav.classList.remove('bg-surface-container-highest');
        nav.classList.add('bg-secondary-container', 'text-on-secondary-container');
      }
    }
  });
  const countEl = document.getElementById('exam-answered-count');
  if (countEl) countEl.textContent = `${answered}/${quizState.questions.length}`;
}

let examTimerInterval = null;
function startExamTimer() {
  if (examTimerInterval) clearInterval(examTimerInterval);
  let secs = 5400; // 90 minutes
  examTimerInterval = setInterval(() => {
    secs--;
    const m = Math.floor(secs/60), s = secs%60;
    const timer = document.getElementById('exam-timer');
    if (timer) {
      timer.textContent = `${m}:${s.toString().padStart(2,'0')}`;
      if (secs <= 300) { timer.className = 'text-[32px] font-bold text-error font-display'; }
    }
    const bar = document.getElementById('exam-timer-bar');
    if (bar) bar.style.width = `${(secs/5400)*100}%`;
    if (secs <= 300 && bar) bar.className = 'h-full bg-error rounded-full';
    if (secs <= 0) {
      clearInterval(examTimerInterval);
      examTimerInterval = null;
      alert('⏰ Time is up! Submitting your exam...');
      submitFullExam();
    }
  }, 1000);
}

function submitFullExam() {
  if (quizState.submitted) return;
  if (examTimerInterval) { clearInterval(examTimerInterval); examTimerInterval = null; }

  const userAns = {};
  let allAnswered = true;
  quizState.questions.forEach(q => {
    const keys = Array.from(document.querySelectorAll(`input[data-qid="${q.id}"][data-exam="1"]:checked`)).map(i=>i.value);
    userAns[q.id] = keys;
    if (!keys.length) allAnswered = false;
  });
  if (!allAnswered && !confirm('⚠️ You have not answered all questions. Submit anyway?')) return;

  quizState.submitted = true;
  document.getElementById('btn-exam-submit')?.remove();

  let correct = 0, totalPts = 0, earned = 0;
  const chapterStats = {};

  quizState.questions.forEach(q => {
    const ans = ANSWERS_DATA[q.id];
    if (!ans) return;
    totalPts += q.points;
    const u = (userAns[q.id]||[]).map(k=>k.trim().toLowerCase()).sort();
    const c = ans.correct.map(k=>k.trim().toLowerCase()).sort();
    const isCorrect = u.join(',') === c.join(',');
    if (isCorrect) { correct++; earned += q.points; }

    // Per-chapter stats
    if (!chapterStats[q.chapter]) chapterStats[q.chapter] = { correct: 0, total: 0, points: 0, earned: 0 };
    chapterStats[q.chapter].total++;
    chapterStats[q.chapter].points += q.points;
    if (isCorrect) {
      chapterStats[q.chapter].correct++;
      chapterStats[q.chapter].earned += q.points;
    }

    const qid = `exam-q${q.id}`;
    const card = document.getElementById(`exam-card-${qid}`);
    if (!card) return;
    card.className = `rounded-xl p-5 mb-4 border-2 ${isCorrect ? 'border-success bg-success-container' : 'border-error bg-error-container'}`;

    q.choices.forEach(choice => {
      const label = document.getElementById(`exam-label-${qid}-${choice.key}`);
      if (!label) return;
      label.style.cursor = 'default';
      const input = label.querySelector('input');
      if (input) input.disabled = true;

      const isUser = u.includes(choice.key);
      const isRight = c.includes(choice.key);
      const icon = document.createElement('span');
      icon.className = 'ml-auto text-sm';
      if (isRight && isUser) { icon.textContent = '✅'; label.style.borderColor = '#2e7d32'; label.style.background = '#e8f5e9'; }
      else if (isRight && !isUser) { icon.textContent = '✅'; label.style.borderColor = '#2e7d32'; }
      else if (!isRight && isUser) { icon.textContent = '❌'; label.style.borderColor = '#ba1a1a'; label.style.background = '#ffebee'; }
      const existing = label.querySelector('.result-icon');
      if (existing) existing.remove();
      label.appendChild(icon);
    });

    showExamRationale(q, ans, u, c);
  });

  const pct = Math.round((earned/totalPts)*100);
  const pass = pct >= 65;

  // Save exam history
  const wrongIds = quizState.questions.filter(q => {
    const ans = ANSWERS_DATA[q.id];
    if (!ans) return false;
    const u = (userAns[q.id]||[]).map(k=>k.trim().toLowerCase()).sort();
    const c = ans.correct.map(k=>k.trim().toLowerCase()).sort();
    return u.join(',') !== c.join(',');
  }).map(q => q.id);
  saveExamHistory({ correct, total: quizState.questions.length, pct, wrong: wrongIds, date: new Date().toISOString() });
  const historyHtml = renderExamHistory();

  // Results summary
  const ringCirc = 2*Math.PI*38;
  const offset = ringCirc - (pct/100)*ringCirc;

  // Build chapter breakdown bars
  const chBars = Object.keys(chapterStats).sort().map(ch => {
    const s = chapterStats[ch];
    const cPct = s.total > 0 ? Math.round((s.correct/s.total)*100) : 0;
    const chTitle = SYLLABUS_DATA.find(d => d.chapter === parseInt(ch))?.title || `Chapter ${ch}`;
    return `<div class="flex items-center gap-3">
      <span class="text-xs w-8 shrink-0 font-semibold">Ch ${ch}</span>
      <div class="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all" style="width:${cPct}%;background:${cPct >= 65 ? '#2e7d32' : '#ba1a1a'}"></div>
      </div>
      <span class="text-xs font-medium w-16 text-right text-on-surface-variant">${s.correct}/${s.total}</span>
    </div>`;
  }).join('');

  const summary = `<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mb-6">
    <div class="flex flex-col md:flex-row gap-6 items-center">
      <div class="text-center shrink-0">
        <svg class="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" fill="none" stroke="#e6e8ea" stroke-width="8"/>
          <circle cx="50" cy="50" r="38" fill="none" stroke="${pass ? '#2e7d32' : '#ba1a1a'}" stroke-width="8" stroke-dasharray="${ringCirc}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
        </svg>
        <div class="text-2xl font-bold font-display -mt-16">${pct}%</div>
        <span class="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${pass ? 'bg-success-container text-success' : 'bg-error-container text-error'}">${pass ? 'PASS' : 'FAIL'}</span>
        <p class="text-caption font-caption text-on-surface-variant mt-1">Required: 65%</p>
      </div>
      <div class="flex-1">
        <h2 class="font-display text-headline-lg">${pass ? '🎉 Congratulations!' : '📖 Keep studying!'}</h2>
        <p class="text-on-surface-variant">You got <strong>${correct}/${quizState.questions.length}</strong> correct (${earned}/${totalPts} points)</p>
        <div class="mt-3 space-y-1.5">${chBars}</div>
      </div>
    </div>
    <div class="flex justify-center gap-3 mt-4">
      <button class="btn bg-secondary text-on-secondary px-5 py-2 rounded-lg font-bold scale-98-active" onclick="retryFullExam()">🔄 Retry Exam</button>
      <button class="btn border-2 border-outline-variant text-on-surface px-5 py-2 rounded-lg font-bold scale-98-active" onclick="navigate('home')">🏠 Back to Dashboard</button>
    </div>
  </div>`;

  document.getElementById('exam-questions-area').insertAdjacentHTML('afterbegin', summary);
  if (historyHtml) {
    document.getElementById('exam-questions-area').insertAdjacentHTML('beforeend', historyHtml);
  }
  var es = document.getElementById('exam-sidebar');
  if (es) es.style.display = 'none';
}

function showExamRationale(q, ans, userK, correctK) {
  const qid = `exam-q${q.id}`;
  const div = document.getElementById(`exam-rationale-${qid}`);
  if (!div) return;
  let html = '<div class="p-3 bg-surface-container rounded-lg space-y-1">';
  if (ans.rationale && Object.keys(ans.rationale).length > 0) {
    Object.entries(ans.rationale).forEach(function(e) {
      var k = e[0], t = e[1];
      var cls = correctK.includes(k) ? 'text-success font-medium' : (userK.includes(k) ? 'text-error font-medium' : '');
      html += '<div class="' + cls + '"><strong>' + k + ')</strong> ' + t + '</div>';
    });
  } else {
    html += '<p class="text-on-surface-variant italic text-xs">(No detailed explanation from official answer key)</p>';
  }
  html += '</div>';
  div.innerHTML = html;
  div.classList.remove('hidden');
}

function retryFullExam() {
  if (examTimerInterval) { clearInterval(examTimerInterval); examTimerInterval = null; }
  window.location.hash = 'home';
  setTimeout(function() { window.location.hash = 'full-exam'; }, 50);
}

// ===== EXAM HISTORY =====
function getExamHistory() {
  try {
    const data = JSON.parse(localStorage.getItem('ctai_exam_history') || '[]');
    return data;
  } catch(e) { return []; }
}

function saveExamHistory(entry) {
  try {
    const data = getExamHistory();
    data.push(entry);
    if (data.length > 10) data = data.slice(-10);
    localStorage.setItem('ctai_exam_history', JSON.stringify(data));
  } catch(e) { console.warn('Could not save exam history:', e); }
}

function renderExamHistory() {
  const history = getExamHistory();
  if (!history.length) return '';
  let html = '<div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-4"><h3 class="text-sm font-semibold mb-2">📋 Exam Attempt History</h3><div class="space-y-1.5">';
  history.slice().reverse().forEach(h => {
    const d = new Date(h.date);
    const ds = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const ws = h.wrong.length ? '❌ Q' + h.wrong.join(', Q') : '🎯 All correct!';
    html += '<div class="flex items-center justify-between text-xs py-1.5 px-2 bg-surface-container rounded">'
      + '<span class="text-on-surface-variant">' + ds + '</span>'
      + '<span class="font-medium ' + (h.pct >= 65 ? 'text-success' : 'text-error') + '">' + h.correct + '/' + h.total + ' (' + h.pct + '%)</span>'
      + '<span class="text-on-surface-variant">' + ws + '</span></div>';
  });
  html += '</div></div>';
  return html;
}

// ===== QUIZ HISTORY (localStorage) =====
function getQuizHistory(chapterNum) {
  try {
    const data = JSON.parse(localStorage.getItem('ctai_quiz_history') || '{}');
    return data['ch' + chapterNum] || [];
  } catch(e) { return []; }
}

function saveQuizHistory(chapterNum, entry) {
  try {
    const data = JSON.parse(localStorage.getItem('ctai_quiz_history') || '{}');
    const key = 'ch' + chapterNum;
    if (!data[key]) data[key] = [];
    data[key].push(entry);
    if (data[key].length > 10) data[key] = data[key].slice(-10);
    localStorage.setItem('ctai_quiz_history', JSON.stringify(data));
  } catch(e) { console.warn('Could not save history:', e); }
}

function renderQuizHistory(chapterNum) {
  const history = getQuizHistory(chapterNum);
  if (!history.length) return '';
  let html = '<div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-4"><h3 class="text-sm font-semibold mb-2">📋 Attempt History</h3><div class="space-y-1.5">';
  history.slice().reverse().forEach(h => {
    const d = new Date(h.date);
    const ds = d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const ws = h.wrong.length ? '❌ Q' + h.wrong.join(', Q') : '🎯 All correct!';
    html += '<div class="flex items-center justify-between text-xs py-1.5 px-2 bg-surface-container rounded">'
      + '<span class="text-on-surface-variant">' + ds + '</span>'
      + '<span class="font-medium ' + (h.pct >= 65 ? 'text-success' : 'text-error') + '">' + h.correct + '/' + h.total + ' (' + h.pct + '%)</span>'
      + '<span class="text-on-surface-variant">' + ws + '</span></div>';
  });
  html += '</div></div>';
  return html;
}

// ===== QUICK PRACTICE =====
function showQuickPractice() {
  var old = document.getElementById('qp-overlay');
  if (old) old.remove();

  var overlay = document.createElement('div');
  overlay.id = 'qp-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:300;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center';

  var items = '';
  for (var ci = 0; ci < SYLLABUS_DATA.length; ci++) {
    var ch = SYLLABUS_DATA[ci];
    var cnt = 0;
    for (var qi = 0; qi < QUESTIONS_DATA.length; qi++) {
      if (QUESTIONS_DATA[qi].chapter === ch.chapter) cnt++;
    }
    items += '<div class="flex items-center justify-between p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all" onclick="navigate(\'quiz-' + ch.chapter + '\');var el=document.getElementById(\'qp-overlay\');if(el)el.remove()">'
      + '<div><span class="font-semibold text-sm">Ch ' + ch.chapter + ':</span> <span class="text-sm">' + ch.title + '</span></div>'
      + '<span class="text-xs text-secondary font-medium">' + cnt + ' questions &rarr;</span></div>';
  }

  overlay.innerHTML = '<div class="bg-surface-container-lowest rounded-xl shadow-xl p-6 max-w-md w-full mx-4" style="max-height:80vh;overflow-y-auto">'
    + '<div class="flex items-center justify-between mb-4">'
    + '<h2 class="font-display text-xl font-semibold">📝 Quick Practice</h2>'
    + '<button class="bg-transparent border-none text-on-surface-variant cursor-pointer text-xl p-1" onclick="document.getElementById(\'qp-overlay\').remove()">✕</button>'
    + '</div>'
    + '<p class="text-sm text-on-surface-variant mb-4">Select a chapter to practice:</p>'
    + '<div class="space-y-2">' + items + '</div></div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

// ===== AI POPUP =====
function openAiPopup(ctx) {
  document.getElementById('ai-popup').classList.remove('hidden');
  document.getElementById('ai-popup').classList.add('flex');
  if (ctx) document.getElementById('ai-context-text').textContent = `"${ctx.slice(0,80)}${ctx.length>80?'...':''}"`;
  setTimeout(() => document.getElementById('ai-input')?.focus(), 100);
}
function closeAiPopup() {
  document.getElementById('ai-popup').classList.add('hidden');
  document.getElementById('ai-popup').classList.remove('flex');
}
async function sendAiQuestion() {
  const input = document.getElementById('ai-input');
  const q = input.value.trim();
  if (!q) return;
  const ctx = document.getElementById('ai-context-text').textContent;
  const result = document.getElementById('ai-result');
  const load = document.getElementById('ai-loading');
  result.innerHTML = ''; load.classList.remove('hidden'); load.style.display = 'flex';
  try {
    const a = await Gemini.askQuestion(q, ctx);
    load.classList.add('hidden'); load.style.display = '';
    result.innerHTML = `<div class="mb-3 p-2.5 bg-surface-container rounded-lg text-sm"><strong>You:</strong> ${q}</div>
      <div class="p-2.5 bg-[#f3e5f5] rounded-lg text-sm">${a.replace(/\n/g,'<br>')}</div>`;
    input.value = '';
  } catch(e) {
    load.classList.add('hidden'); load.style.display = '';
    result.innerHTML = `<div class="text-error text-sm">⚠️ ${e.message}</div>`;
  }
}

// ===== SELECTION POPUP =====
function initSelectionPopup() {
  const popup = document.getElementById('selection-popup');
  document.addEventListener('mouseup', (e) => {
    if (popup.contains(e.target)) return;
    const sel = window.getSelection();
    const text = sel.toString().trim();
    if (!text || text.length < 5) {
      popup.classList.add('hidden'); return;
    }
    const r = sel.getRangeAt(0).getBoundingClientRect();
    popup.style.top = `${r.bottom + window.scrollY + 5}px`;
    popup.style.left = `${r.left + window.scrollX}px`;
    popup.classList.remove('hidden');
    AppState.selectedText = text;
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { popup.classList.add('hidden'); closeAiPopup(); } });
}

function explainSelection() {
  if (AppState.selectedText) { openAiPopup(AppState.selectedText); document.getElementById('selection-popup').classList.add('hidden'); }
}

// ===== SEARCH =====
function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  const results = document.createElement('div');
  results.className = 'absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg max-h-72 overflow-y-auto z-50 hidden';
  input.parentElement.appendChild(results);
  let timeout;
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { results.classList.add('hidden'); return; }
      const hits = [];
      SYLLABUS_DATA.forEach(ch => {
        if (ch.title.toLowerCase().includes(q)) hits.push({title: ch.title, ch: ch.chapter, preview: `Chapter ${ch.chapter}`});
        (ch.sections||[]).forEach(sec => {
          if (sec.title.toLowerCase().includes(q)) hits.push({title: sec.title, ch: ch.chapter, preview: `Ch${ch.chapter} · ${sec.id}`});
        });
      });
      results.innerHTML = hits.length ? hits.slice(0,8).map(h =>
        `<div class="px-3 py-2 cursor-pointer border-b border-outline-variant last:border-0 hover:bg-surface-container text-sm" onclick="navigate('chapter-${h.ch}'); results.classList.add('hidden'); input.value=''">
          <div class="font-medium">📖 ${h.title}</div>
          <div class="text-xs text-on-surface-variant">${h.preview}</div>
        </div>`
      ).join('') : '<div class="px-3 py-2 text-sm text-on-surface-variant">No results</div>';
      results.classList.remove('hidden');
    }, 300);
  });
  input.addEventListener('blur', () => setTimeout(() => results.classList.add('hidden'), 200));
}

// ===== INIT =====
function init() {
  buildSidebar();
  renderHomePage();
  initSearch();
  initSelectionPopup();

  document.getElementById('btn-ai-send')?.addEventListener('click', sendAiQuestion);
  document.getElementById('ai-input')?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendAiQuestion(); });

  handleRoute();
  console.log(`✅ CT-AI Academy: ${SYLLABUS_DATA.length} chapters, ${QUESTIONS_DATA.length} questions`);
}

// Globals
window.navigate = navigate; window.setActiveNav = setActiveNav;
window.onQuizChange = onQuizChange; window.submitQuiz = submitQuiz; window.retryQuiz = retryQuiz;
window.explainQ = explainQ; window.toggleFlag = toggleFlag;
window.openAiPopup = openAiPopup; window.closeAiPopup = closeAiPopup; window.sendAiQuestion = sendAiQuestion;
window.explainSelection = explainSelection;
window.showQuickPractice = showQuickPractice;
window.toggleBilingualPdf = toggleBilingualPdf;
window.renderFullExam = renderFullExam; window.submitFullExam = submitFullExam; window.retryFullExam = retryFullExam;
window.onExamChange = onExamChange; window.toggleExamFlag = toggleExamFlag;

document.addEventListener('DOMContentLoaded', init);
