const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* navigation: header links scroll to each section */
const pages = [['home', 'Home'], ['logbook', 'Logbook'], ['work', 'Work'], ['about', 'About'], ['contact', 'Contact']];
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

/* ===================== LOGBOOK ===================== */
// Data lives in logbook.js. This part only draws it.
fetch('logbook.json', { cache: 'no-store' }).then(r => r.json()).then(LB => {
  const STATUS = { done: 'Done', doing: 'In progress', blocked: 'Blocked', todo: 'Not started' };
  const real = list => (list || []).filter(e => !e.sample);               // examples are not counted
  const tag = e => e.sample ? '<span class="pill sample">Sample</span>' : '';
  const empty = msg => `<p class="muted">${msg}</p>`;
  const fmtDate = d => {
    if (!d) return '';
    const t = new Date(d + 'T00:00:00');
    return isNaN(t) ? String(d) : t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const row = (label, text) => text ? `<div><dt>${label}</dt><dd>${esc(text)}</dd></div>` : '';
  const isImg = s => /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(s.split('?')[0]);
  const fileTag = s => (s.match(/\.(pdf|docx?|pptx?|xlsx?|mp4|mov)$/i) || [, 'link'])[1].toUpperCase();
  const thumbs = list => (list && list.length)
    ? '<div class="lb-thumbs">' + list.filter(x => x && (typeof x === 'string' || x.src)).map(x => {
        const src = typeof x === 'string' ? x : x.src;
        const label = (typeof x === 'string' ? '' : x.label) || '';
        if (isImg(src)) {
          return `<a href="${esc(src)}" target="_blank" rel="noopener"><img src="${esc(src)}" alt="${esc(label || 'Evidence')}" loading="lazy"></a>`;
        }
        return `<a class="lb-file" href="${esc(src)}" target="_blank" rel="noopener"><b>${fileTag(src)}</b> ${esc(label || 'Open file')}</a>`;
      }).join('') + '</div>'
    : '';
  const openLink = url => url ? `<p><a class="btn small" href="${esc(url)}" target="_blank" rel="noopener">Open link</a></p>` : '';
  const pct = (n, total) => Math.min(100, total ? n / total * 100 : 0);

  // week number today, worked out from semesterStart in logbook.js
  const weekNow = () => {
    if (!LB.semesterStart) return null;
    const start = new Date(LB.semesterStart + 'T00:00:00');
    if (isNaN(start)) return null;
    const w = Math.floor((Date.now() - start) / 864e5 / 7) + 1;
    return w >= 1 && w <= LB.totalWeeks ? w : null;
  };

  /* Overview: who/what, the counters, and the timeline */
  const overview = () => {
    const i = LB.info || {};
    const rows = [['Short film', i.film], ['Genre', i.genre], ['Group', i.group], ['My position', i.position], ['Supervisor', i.supervisor]].filter(r => r[1]);
    const tasks = (i.tasks || []).filter(Boolean);
    const info = (rows.length || tasks.length)
      ? '<div class="lb-info">' + rows.map(([k, v]) => `<div><span class="muted">${k}</span><p>${esc(v)}</p></div>`).join('') +
        (tasks.length ? `<div class="wide"><span class="muted">What I am responsible for</span><ul>${tasks.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>` : '') + '</div>'
      : '';

    const r = LB.rules;
    const meets = real(LB.meetings);
    const early = meets.filter(m => +m.week < r.beforeWeek).length;
    const weeks = new Set(real(LB.weekly).map(e => e.week)).size;
    const items = LB.parts.flatMap(p => p.items);
    const done = items.filter(x => x.status === 'done').length;
    const aiCount = real(LB.ai).length;
    const now = weekNow();

    const stats = `<div class="stats">
      <div><strong>${meets.length}/${r.meetings}</strong>supervisor meetings</div>
      <div><strong>${early}/${r.early}</strong>meetings before Week ${r.beforeWeek}</div>
      <div><strong>${weeks}</strong>weeks logged</div>
      <div><strong>${done}/${items.length}</strong>items done</div>
      <div><strong>${aiCount}</strong>AI uses recorded</div>
    </div>`;

    const mile = '<ol class="lb-mile">' + LB.milestones.map(m => {
      const cls = now == null ? '' : (now >= m.from && now <= m.to ? 'is-now' : (now > m.to ? 'is-past' : ''));
      return `<li class="${cls}"><span class="muted">Weeks ${esc(m.weeks)}${cls === 'is-now' ? ' · now' : ''}</span><b>${esc(m.label)}</b><small>${esc(m.what)}</small></li>`;
    }).join('') + '</ol>';

    return info + stats + (now ? `<p class="lb-now muted">It is Week ${now} of ${LB.totalWeeks}.</p>` : '') + '<h3 class="lb-sub">Timeline</h3>' + mile;
  };

  /* Weekly log: newest week first */
  const weekly = () => {
    const list = [...(LB.weekly || [])].sort((a, b) => (b.week - a.week) || (b.date || '').localeCompare(a.date || ''));
    if (!list.length) return empty('No weekly entries yet.');
    return '<div class="lb-list">' + list.map(e => `<article class="lb-item">
      <header><span class="lb-wk">Week ${esc(e.week)}</span><span class="muted">${esc(fmtDate(e.date))}${e.hours ? ' · ' + esc(e.hours) + ' h' : ''}</span>${e.status ? `<span class="pill ${esc(e.status)}">${STATUS[e.status] || ''}</span>` : ''}${tag(e)}</header>
      <h3>${esc(e.title)}</h3>
      ${e.role ? `<p class="muted">My role: ${esc(e.role)}</p>` : ''}
      ${e.notes ? `<p>${esc(e.notes)}</p>` : ''}
      ${thumbs(e.evidence)}${openLink(e.link)}
    </article>`).join('') + '</div>';
  };

  /* Supervisor meetings: numbered oldest to newest, shown newest first */
  const meetings = () => {
    const r = LB.rules;
    const all = real(LB.meetings);
    const early = all.filter(m => +m.week < r.beforeWeek).length;
    const head = `<div class="lb-count">
      <p><strong>${all.length}</strong> of ${r.meetings} supervision meetings</p>
      <div class="bar"><b style="width:${pct(all.length, r.meetings)}%"></b></div>
      <p class="muted">${early} of ${r.early} completed before Week ${r.beforeWeek}</p>
    </div>`;
    let n = 0;
    const list = [...(LB.meetings || [])].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      .map(m => ({ ...m, label: m.sample ? 'Example meeting' : 'Meeting ' + (++n) })).reverse();
    if (!list.length) return head + empty('No meetings recorded yet.');
    return head + '<div class="lb-list">' + list.map(m => `<article class="lb-item">
      <header><span class="lb-wk">${esc(m.label)}</span><span class="muted">Week ${esc(m.week)} · ${esc(fmtDate(m.date))}${m.mode ? ' · ' + esc(m.mode) : ''}</span>${tag(m)}</header>
      <dl class="lb-dl">${row('What we discussed', m.discussed)}${row('Supervisor feedback', m.feedback)}${row('Next steps', m.next)}</dl>
      ${thumbs(m.evidence)}
    </article>`).join('') + '</div>';
  };

  /* AI usage: the six things the briefing asks for */
  const ai = () => {
    const list = [...(LB.ai || [])].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const note = '<p class="lb-note">Every use of AI in this project is recorded here: the date and activity, the tool, the purpose, the result, and how the output was used, modified or improved.</p>';
    if (!list.length) return note + empty('No AI use recorded yet.');
    return note + '<div class="lb-list">' + list.map(e => `<article class="lb-item">
      <header><span class="lb-wk">${esc(fmtDate(e.date))}</span><span class="muted">${esc(e.tool)}</span>${tag(e)}</header>
      <dl class="lb-dl">${row('Activity', e.activity)}${row('AI tool / platform', e.tool)}${row('Purpose', e.purpose)}${row('Output / result', e.output)}${row('How it was used, modified or improved', e.usage)}</dl>
      ${thumbs(e.evidence)}
    </article>`).join('') + '</div>';
  };

  /* My work: grouped by progress report */
  const work = () => LB.parts.map(p => {
    const done = p.items.filter(x => x.status === 'done').length;
    return `<section class="lb-part">
      <h3 class="lb-sub">${esc(p.title)}</h3>
      <p class="muted">${[p.report, p.weeks].filter(Boolean).map(esc).join(' · ')} · ${done} of ${p.items.length} done</p>
      <div class="lb-cards">${p.items.map(x => `<article class="lb-card">
        <header><h4>${esc(x.name)}</h4><span class="pill ${esc(x.status)}">${STATUS[x.status] || ''}</span></header>
        ${x.note ? `<p>${esc(x.note)}</p>` : ''}
        ${thumbs(x.evidence)}${openLink(x.link)}
      </article>`).join('')}</div>
    </section>`;
  }).join('');

  Object.entries({ overview, weekly, meetings, ai, work }).forEach(([id, draw]) => {
    const el = $('lb-' + id);
    if (el) el.innerHTML = draw();
  });

  /* Tabs (mouse and arrow keys) */
  const tabs = [...document.querySelectorAll('.lb-tab')];
  const pick = id => {
    tabs.forEach(t => { const on = t.dataset.tab === id; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
    document.querySelectorAll('.lb-panel').forEach(p => (p.hidden = p.id !== 'lb-' + id));
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pick(t.dataset.tab));
    t.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus(); pick(next.dataset.tab);
    });
  });
}).catch(err => console.error('Could not load logbook.json', err));