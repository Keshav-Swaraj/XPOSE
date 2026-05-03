// ── Savings counter animation
const TARGET = 32847500;
let current = 0;
const el = document.getElementById('savingsCounter');
if (el) {
  const step = Math.ceil(TARGET / 120);
  const fmt = v => '₹' + (v >= 1e7 ? (v/1e7).toFixed(2)+' Cr' : v >= 1e5 ? (v/1e5).toFixed(1)+' L' : v.toLocaleString('en-IN'));
  const tick = () => { current = Math.min(current + step, TARGET); el.textContent = fmt(current); if (current < TARGET) requestAnimationFrame(tick); };
  setTimeout(tick, 500);
}

// ── Navbar scroll effect
window.addEventListener('scroll', () => {
  document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobileMenu')?.classList.toggle('open');
});

// ── Filter buttons
let activeCategory = 'all';
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    renderLeaderboard();
  });
});

// ── Render leaderboard
function renderLeaderboard() {
  const body = document.getElementById('lbBody');
  if (!body) return;
  const data = activeCategory === 'all' ? LEADERBOARD_DATA : LEADERBOARD_DATA.filter(d => d.category === activeCategory);
  body.innerHTML = data.map((d, i) => `
    <div class="lb-row" onclick="window.location.href='score.html?idx=${LEADERBOARD_DATA.indexOf(d)}'">
      <div class="lb-td rank">
        <span class="rank-num ${i < 3 ? 'top-' + (i+1) : ''}">${i+1}</span>
      </div>
      <div class="lb-td site">
        <div class="site-emoji">${d.emoji}</div>
        <div class="site-info">
          <div class="site-name">${d.name}</div>
          <div class="site-url">${d.url}</div>
        </div>
      </div>
      <div class="lb-td score">
        <div class="score-bar-wrap">
          <div class="score-bar-fill ${d.verdictClass}" style="width:${d.score}%"></div>
        </div>
        <span class="score-num ${d.verdictClass}">${d.score}</span>
      </div>
      <div class="lb-td patterns">
        <span class="pattern-count ${d.patterns > 10 ? 'high' : d.patterns > 5 ? 'med' : 'low'}">${d.patterns}</span>
      </div>
      <div class="lb-td trend">
        ${d.trendVal < 0
          ? `<span class="trend-good">▼ ${Math.abs(d.trendVal)}</span>`
          : d.trendVal === 0
          ? `<span class="trend-stable">→ Stable</span>`
          : `<span class="trend-bad">▲ +${d.trendVal}</span>`}
      </div>
      <div class="lb-td verdict">
        <span class="verdict-badge ${d.verdictClass}">${d.verdict}</span>
      </div>
      <div class="lb-td action">
        <button class="view-btn">View →</button>
      </div>
    </div>
  `).join('');
}

// ── Modal
function openModal(idx) {
  const d = LEADERBOARD_DATA[idx];
  document.getElementById('modalIcon').textContent = d.emoji;
  document.getElementById('modalName').textContent = d.name;
  document.getElementById('modalUrl').textContent = d.url;
  document.getElementById('modalScoreVal').textContent = d.score;
  document.getElementById('mmPatterns').textContent = d.patterns;
  document.getElementById('mmFees').textContent = d.hiddenFees;
  document.getElementById('mmComplaints').textContent = d.complaints;

  const ring = document.getElementById('modalScoreRing');
  const circ = 207.3;
  const offset = circ - (circ * d.score / 100);
  const color = d.verdictClass === 'safe' ? '#10B981' : d.verdictClass === 'attention' ? '#F59E0B' : '#E24B4A';
  ring.style.strokeDashoffset = circ;
  ring.style.stroke = color;
  setTimeout(() => { ring.style.strokeDashoffset = offset; }, 50);

  document.getElementById('modalViolations').innerHTML = `
    <div class="mv-label">Violations &amp; Dark Patterns</div>
    ${d.violations.map(v => `
      <div class="mv-item ${v.type.toLowerCase()}">
        <div class="mv-type">${v.type}</div>
        <div class="mv-body">
          <div class="mv-title">${v.title}</div>
          <div class="mv-desc">${v.desc}</div>
          <div class="mv-reg">📋 ${v.reg}</div>
        </div>
      </div>
    `).join('')}
  `;
  document.getElementById('siteModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('siteModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('siteModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('siteModal')) closeModal();
});

renderLeaderboard();

// ── Toast
function showToast(e) {
  if (e) e.preventDefault();
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}
