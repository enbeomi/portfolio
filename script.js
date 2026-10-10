/* ================= EDIT THIS PART ================= */
const TOTAL_WEEKS = 14;

// The logbook lecturers see. Add a new object each week (status: 'done' | 'doing' | 'blocked').
const LOGBOOK = [
  { week: 1, date: '2026-10-05', hours: 4, status: 'done', title: 'Workshop kickoff', notes: 'Brainstormed ideas, set up repo.' }
];
/* ================================================== */

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* navigation: header links scroll to each section */
const pages = [['home', 'Home'], ['about', 'About'], ['work', 'Work'], ['logbook', 'Logbook'], ['contact', 'Contact']];
$('nav').innerHTML = pages.map(([id, l]) => `<a href="#${id}">${l}</a>`).join('');
// highlight the link of the section currently on screen
const links = [...document.querySelectorAll('nav a')];
const spy = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('.view').forEach(v => spy.observe(v));

/* work */
$('workGrid').innerHTML = PROJECTS.map((p, i) => {
  const bg = p.cover ? `url('${esc(p.cover)}')` : esc(p.color);
  return `<div class="card"><div class="ph" style="--r:${[-2, 1.5, -1, 2][i % 4]}deg"><i style="background:${bg} center/cover"></i><span>${esc(p.title)}, ${esc(p.year)}</span></div><h3>${esc(p.title)}</h3><p class="muted">${esc(p.subtitle)}</p><a href="project.html?p=${esc(p.slug)}">View project</a></div>`;
}).join('');

/* draggable home screen */
// To use your own cutouts: replace the html with '<img src="images/cutout1.png" style="width:220px" alt="">'
const ITEMS = [
  // [ html,                                                              left%, top%, rotation ]
  ['<img src="images/cherry.png"   style="width:260px" alt="">',            6, 28,  -6],
  ['<img src="images/ribbon.png"   style="width:250px" alt="">',           24, 10,   5],
  ['<img src="images/camera.png" style="width:240px" alt="">',           56,  8,  -4],
   ['<img src="images/love.png" style="width:100px" alt="">',           17,  8,  -4],
  ['<img src="images/earphone.png"    style="width:230px" alt="">',           64, 40,   0],
  ['<img src="images/tag.png"   style="width:100px" alt="">',           22, 66,  -7],
  ['<img src="images/rc.jpg"   style="width:200px" alt="">',           78, 52,   9]
];
const stage = $('stage');
let z = 10, active = null, ox = 0, oy = 0;
ITEMS.forEach(([html, x, y, r]) => {
  const el = document.createElement('div');
  el.className = 'item'; el.innerHTML = html; el.dataset.rot = r;
  Object.assign(el.style, { left: x + '%', top: y + '%', transform: `rotate(${r}deg)`, zIndex: ++z });
  stage.appendChild(el);
});
stage.addEventListener('pointerdown', e => {
  const el = e.target.closest('.item'); if (!el) return;
  active = el; el.setPointerCapture(e.pointerId);
  const r = el.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top;
  el.classList.add('drag'); el.style.zIndex = ++z;
  el.style.transform = `rotate(${el.dataset.rot}deg) scale(1.03)`;
});
stage.addEventListener('pointermove', e => {
  if (!active) return;
  const s = stage.getBoundingClientRect(); // stage moves while page scrolls
  active.style.left = e.clientX - s.left - ox + 'px'; active.style.top = e.clientY - s.top - oy + 'px';
});
const drop = () => { if (active) { active.classList.remove('drag'); active.style.transform = `rotate(${active.dataset.rot}deg)`; active = null; } };
stage.addEventListener('pointerup', drop);
stage.addEventListener('pointercancel', drop);

/* logbook */
const KEY = 'logbook-drafts';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} };
let drafts = load();
const label = { done: 'Done', doing: 'In progress', blocked: 'Blocked' };

function renderLog() {
  const all = [...LOGBOOK.map(e => ({ ...e, draft: false })), ...drafts.map(e => ({ ...e, draft: true }))]
    .sort((a, b) => b.week - a.week || (b.date || '').localeCompare(a.date || ''));
  const hours = all.reduce((s, e) => s + (+e.hours || 0), 0);
  const weeks = new Set(all.map(e => e.week)).size;
  $('sEntries').textContent = all.length;
  $('sHours').textContent = hours;
  $('sDone').textContent = all.filter(e => e.status === 'done').length;
  $('weeksTxt').textContent = `${weeks} of ${TOTAL_WEEKS} weeks logged`;
  $('bar').style.width = Math.min(100, weeks / TOTAL_WEEKS * 100) + '%';
  $('logTable').innerHTML = all.length
    ? '<tr><th>Week</th><th>Entry</th><th>Hours</th><th>Status</th></tr>' + all.map(e =>
      `<tr><td>${esc(e.week)}<div class="muted">${esc(e.date)}</div></td><td>${esc(e.title)}${e.draft ? ' <span class="muted">(draft, only on this device)</span>' : ''}<div class="muted">${esc(e.notes)}</div></td><td>${esc(e.hours)}</td><td><span class="pill ${esc(e.status)}">${label[e.status] || ''}</span></td></tr>`).join('')
    : '<p class="muted">No entries yet.</p>';
}
$('form').addEventListener('submit', e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  d.week = +d.week; d.hours = +d.hours;
  drafts.push(d); save(drafts); e.target.reset(); renderLog();
});
$('copyBtn').addEventListener('click', async () => {
  const code = drafts.map(d => '  ' + JSON.stringify(d)).join(',\n');
  try { await navigator.clipboard.writeText(code); $('copyBtn').textContent = 'Copied'; } catch { prompt('Copy this:', code); }
  setTimeout(() => $('copyBtn').textContent = 'Copy drafts as code', 1500);
});
renderLog();