const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slug = new URLSearchParams(location.search).get('p');
const i = PROJECTS.findIndex(p => p.slug === slug);
const root = document.getElementById('root');

// picture, or a color block if no image has been set yet
const pic = (src, color, alt) => src
  ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">`
  : `<div class="blank" style="background:${esc(color)}"></div>`;

if (i < 0) {
  root.innerHTML = '<section class="view"><h2>Not<br>found</h2><p class="lede"><a class="btn" href="index.html#work">Back to work</a></p></section>';
} else {
  const p = PROJECTS[i], next = PROJECTS[(i + 1) % PROJECTS.length];
  document.title = `${p.title} — Safiyah Sahrin`;
  const meta = [['Year', p.year], ['Category', p.category], ['Role', p.role], ['Tools', p.tools]];
  root.innerHTML = `
  <section class="view case-head">
    <h1 class="case-title">${esc(p.title)}</h1>
    <p class="case-sub">${esc(p.subtitle)}${p.badge ? ` <span class="pill">${esc(p.badge)}</span>` : ''}</p>
    <div class="case-meta">${meta.map(([k, v]) => `<div><span class="muted">${k}</span><br>${esc(v)}</div>`).join('')}</div>
    <div class="case-cover">${pic(p.cover, p.color, p.title)}</div>
  </section>

  <section class="case-sec"><h2>The idea</h2><p class="case-text">${esc(p.idea)}</p></section>

  <section class="case-sec"><h2>The process</h2>
    ${p.process.map(s => `<div class="step"><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div><div class="step-img">${pic(s.image, p.color, s.title)}</div></div>`).join('')}
  </section>

  <section class="case-sec"><h2>Final outcome</h2>
    <p class="case-text">${esc(p.outcome.text)}</p>
    <div class="shots">${p.outcome.images.map(src => `<div class="shot">${pic(src, p.color, p.title + ' final design')}</div>`).join('')}</div>
    ${p.outcome.link ? `<p><a class="btn" href="${esc(p.outcome.link)}" target="_blank" rel="noopener">Open prototype</a></p>` : ''}
  </section>

  <section class="case-sec case-foot">
    <a class="btn" href="index.html#home">← Back home</a>
    <a class="btn" href="project.html?p=${esc(next.slug)}">Next: ${esc(next.title)}</a>
  </section>`;
}