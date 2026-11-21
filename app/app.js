// Leonida Trophy Guide — tracker and roadmap for the 55 GTA VI trophies.
// Plain static app: it fetches only data/trophies.json from its own folder,
// saves progress in localStorage, and makes no network request of any kind.
const DATA_URL = 'data/trophies.json';
const CHECK_KEY = 'leonida-trophy-guide-v1';
const SPOILER_KEY = 'leonida-trophy-guide-spoiler-v1';
const REVEAL_KEY = 'leonida-trophy-guide-revealed-v1';

// The platinum roadmap, in play order. Stage 1 is the story; the missable
// meditation is flagged in stage 1's blurb and lives in stage 5's list.
const ROADMAP = [
  { title: 'Stage 1 — Story first', ids: ['just-like-paradise', 'paradise-lost', 'tits-ass-drug-money', 'vice-city-baby', 'top-of-the-world-ma', 'trust', 'break-the-bank', 'family-matters', 'dwnfall', 'hi-jacked', 'snow-storm', 'you-gotta-know-when-to-get-off'], blurb: 'Play the story straight through, Chapters 1 to 5. Every story trophy pops on its own — except one thing: the morning after Down to Earth in Chapter 1, follow Lucia to the balcony and accept her meditation. It may be the missable one.' },
  { title: 'Stage 2 — Friends and strangers', ids: ['road-to-rehabilitation', 'this-was-no-boat-accident', 'the-lone-rider', 'supply-and-demand', 'spin-on-this', 'fair-game', 'strangers-and-freaks'], blurb: 'Character quests and stranger strands. Most stay open after the story, so there is no rush — do them when their texts arrive.' },
  { title: 'Stage 3 — Play Leonida', ids: ['cunning-stunts', 'master-of-none', 'the-shootist', 'top-fun', 'earn-cash-not-kudos', 'baited-my-tackle', 'stick-fiddler'], blurb: 'The activities of Leonida: stunts, ranges, races, fishing, arcade games. Most of these come naturally while you play.' },
  { title: 'Stage 4 — Crime and combat', ids: ['hot-together', 'retail-therapy', 'sneakthief', 'maximum-withdrawal', 'a-classic-blitz-play', 'pest-control', 'dime-on-the-dollar', 'gunslinger', 'catch-me-if-you-can', 'challenging-tank'], blurb: 'Vaults, shops, trucks, gangs and laundering — plus the combat trophies. Body armor and a fast bike help.' },
  { title: 'Stage 5 — See everything', ids: ['the-goodtime-state', 'whip-it-good', 'you-wainker', 'dont-touch-my-deck', 'little-boxes', 'on-the-spot', 'treat-yo-self', 'one-last-thing', 'lets-go-bowling', 'personal-best', 'actions-speak-louder', 'in-the-beginning', 'capital-offense', 'the-truth-is-out-there', 'bad-luck-i-guess', 'ten-pin', 'positive-mental-attitude'], blurb: 'Exploration and cleanup: the map, vehicles, WAiNK scans, cards, garages and shops. Start the meditations in Chapter 1 — the first one is the missable.' },
  { title: 'Stage 6 — The long road', ids: ['a-long-road', 'vice-got-a-price'], blurb: 'The 100% checklist after the story, then the platinum. Around 100 hours on its own — the longest stretch of the run.' },
];

const rowsEl = document.getElementById('rows');
const stagesEl = document.getElementById('stages');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const spoilerEl = document.getElementById('spoiler');
const unconfirmedEl = document.getElementById('unconfirmed-only');
const hideEarnedEl = document.getElementById('hide-earned');

let trophies = [];
let meta = null;
let earned = new Set(readJson(CHECK_KEY, []));
let revealed = new Set(readJson(REVEAL_KEY, []));
let spoilerOn = readJson(SPOILER_KEY, true);
let openId = null;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(CHECK_KEY, JSON.stringify([...earned]));
  localStorage.setItem(SPOILER_KEY, JSON.stringify(spoilerOn));
  localStorage.setItem(REVEAL_KEY, JSON.stringify([...revealed]));
}

function trophyById(id) {
  return trophies.find((t) => t.id === id);
}

function stageOf(id) {
  for (let i = 0; i < ROADMAP.length; i += 1) {
    if (ROADMAP[i].ids.includes(id)) return i;
  }
  return ROADMAP.length;
}

function isSpoiled(t) {
  return spoilerOn && t.hidden && !earned.has(t.id) && !revealed.has(t.id);
}

function tierLabel(tier) {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

async function loadTrophies() {
  const res = await fetch(DATA_URL);
  const doc = await res.json();
  trophies = doc.trophies;
  meta = doc.meta;
}

function renderCounts() {
  const c = meta.counts;
  const el = document.getElementById('counts');
  el.replaceChildren();
  const bits = [
    `${meta.total} trophies`,
    `${c.platinum} platinum`,
    `${c.gold} gold`,
    `${c.silver} silver`,
    `${c.bronze} bronze`,
    `${c.hidden} hidden`,
    '1 missable',
  ];
  for (const b of bits) {
    const s = document.createElement('span');
    s.className = 'count';
    s.textContent = b;
    el.append(s);
  }
}

function renderProgress() {
  const done = trophies.filter((t) => earned.has(t.id)).length;
  const pct = trophies.length === 0 ? 0 : Math.round((done / trophies.length) * 100);
  document.getElementById('barfill').style.width = `${pct}%`;
  document.getElementById('progresstext').textContent = `${done} of ${trophies.length} earned — ${pct}% to the platinum`;
}

function nextUpTrophy() {
  const open = trophies.filter((t) => !earned.has(t.id));
  if (open.length === 0) return null;
  const ranked = [...open].sort((a, b) => {
    const miss = (b.missable ? 1 : 0) - (a.missable ? 1 : 0);
    if (miss !== 0) return miss;
    const stage = stageOf(a.id) - stageOf(b.id);
    if (stage !== 0) return stage;
    return trophies.indexOf(a) - trophies.indexOf(b);
  });
  return ranked[0];
}

function renderNextUp() {
  const body = document.getElementById('nextup-body');
  body.replaceChildren();
  const t = nextUpTrophy();
  if (t === null) {
    const p = document.createElement('p');
    p.textContent = 'Platinum earned — every trophy on this list is checked off. Leonida Legend.';
    body.append(p);
    return;
  }
  const name = document.createElement('p');
  name.className = 'nextup-name';
  name.textContent = isSpoiled(t) ? 'Hidden trophy — reveal it in the list below' : t.name;
  if (isSpoiled(t)) name.classList.add('blurred');
  const guide = document.createElement('p');
  guide.className = 'nextup-guide';
  guide.textContent = isSpoiled(t) ? 'A hidden story trophy is next. Turn spoiler mode off, or reveal it in the list.' : t.guide;
  if (isSpoiled(t)) guide.classList.add('blurred');
  const why = document.createElement('p');
  why.className = 'nextup-why';
  why.textContent = t.missable
    ? 'Suggested first because it is the one missable trophy on the list.'
    : t.category === 'story'
      ? 'Suggested next: the story, in order.'
      : `Suggested next: stage ${stageOf(t.id) + 1} of the roadmap.`;
  const link = document.createElement('a');
  link.href = `#trophy-${t.id}`;
  link.textContent = 'Open its guide ↓';
  link.addEventListener('click', (ev) => {
    ev.preventDefault();
    openId = t.id;
    renderRows();
    document.getElementById(`trophy-${t.id}`)?.scrollIntoView({ block: 'start' });
  });
  body.append(name, guide, why, link);
}

function renderStages() {
  stagesEl.replaceChildren();
  ROADMAP.forEach((stage, i) => {
    const box = document.createElement('div');
    box.className = 'stage';
    const head = document.createElement('h3');
    const done = stage.ids.filter((id) => earned.has(id)).length;
    head.textContent = `${stage.title} — ${done}/${stage.ids.length}`;
    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;
    const list = document.createElement('ul');
    for (const id of stage.ids) {
      const t = trophyById(id);
      if (!t) continue;
      const li = document.createElement('li');
      li.className = earned.has(id) ? 'done' : '';
      li.textContent = `${earned.has(id) ? '✓ ' : '○ '}${isSpoiled(t) ? 'Hidden trophy' : t.name} (${tierLabel(t.tier)})`;
      list.append(li);
    }
    box.append(head, blurb, list);
    stagesEl.append(box);
  });
}

function badge(text, cls) {
  const s = document.createElement('span');
  s.className = `badge ${cls}`;
  s.textContent = text;
  return s;
}

function rowFor(t) {
  const art = document.createElement('article');
  art.className = 'trophy';
  art.id = `trophy-${t.id}`;
  if (earned.has(t.id)) art.classList.add('earned');
  const spoiled = isSpoiled(t);

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', `Earned: ${spoiled ? 'hidden trophy' : t.name}`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id);
    else earned.delete(t.id);
    saveState();
    renderAll();
  });
  const tier = badge(tierLabel(t.tier), `tier-${t.tier}`);
  const nameBtn = document.createElement('button');
  nameBtn.type = 'button';
  nameBtn.className = 'trophy-name';
  nameBtn.textContent = spoiled ? 'Hidden trophy' : t.name;
  if (spoiled) nameBtn.classList.add('blurred');
  nameBtn.addEventListener('click', () => {
    openId = openId === t.id ? null : t.id;
    renderRows();
  });
  head.append(box, tier, nameBtn);
  if (t.missable) head.append(badge('Missable', 'missable'));
  if (t.hidden) head.append(badge('Hidden', 'hidden'));
  if (t.status === 'partial') head.append(badge('Partial', 'partial'));
  if (t.status === 'unconfirmed') head.append(badge('Unconfirmed', 'unconfirmed'));
  art.append(head);

  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = spoiled ? 'Hidden until earned or revealed.' : t.desc;
  if (spoiled) desc.classList.add('blurred');
  art.append(desc);

  if (spoiled) {
    const reveal = document.createElement('button');
    reveal.type = 'button';
    reveal.className = 'reveal';
    reveal.textContent = 'Reveal this trophy (spoiler)';
    reveal.addEventListener('click', () => {
      revealed.add(t.id);
      saveState();
      openId = t.id;
      renderAll();
    });
    art.append(reveal);
  } else if (openId === t.id) {
    const guide = document.createElement('p');
    guide.className = 'trophy-guide';
    guide.textContent = t.guide;
    art.append(guide);
    if (t.steps && t.steps.length > 0) {
      const ol = document.createElement('ol');
      ol.className = 'trophy-steps';
      for (const s of t.steps) {
        const li = document.createElement('li');
        li.textContent = s;
        ol.append(li);
      }
      art.append(ol);
    }
    if (t.unconfirmedNote) {
      const note = document.createElement('p');
      note.className = 'trophy-note';
      note.textContent = t.unconfirmedNote;
      art.append(note);
    }
    const src = document.createElement('p');
    src.className = 'trophy-source';
    src.textContent = `Source: ${t.source}`;
    art.append(src);
  } else {
    const hint = document.createElement('p');
    hint.className = 'trophy-hint';
    hint.textContent = 'Click the name to open its guide.';
    art.append(hint);
  }
  return art;
}

function matchesFilters(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (q !== '') {
    const hay = [t.name, t.desc, t.guide, ...(t.steps || [])].join(' ').toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (gradeEl.value !== 'all' && t.tier !== gradeEl.value) return false;
  if (kindEl.value === 'missable') {
    if (!t.missable) return false;
  } else if (kindEl.value !== 'all' && t.category !== kindEl.value) {
    return false;
  }
  if (unconfirmedEl.checked && t.status !== 'unconfirmed' && t.status !== 'partial') return false;
  if (hideEarnedEl.checked && earned.has(t.id)) return false;
  return true;
}

function renderRows() {
  rowsEl.replaceChildren();
  const shown = trophies.filter(matchesFilters);
  for (const t of shown) rowsEl.append(rowFor(t));
  document.getElementById('noresults').hidden = shown.length !== 0;
}

function renderAll() {
  renderCounts();
  renderProgress();
  renderNextUp();
  renderStages();
  renderRows();
}

function exportProgress() {
  const payload = { app: 'leonida-trophy-guide', exportedAt: new Date().toISOString(), earned: [...earned] };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    try {
      const data = JSON.parse(String(reader.result));
      const ids = Array.isArray(data.earned) ? data.earned : data;
      const known = new Set(trophies.map((t) => t.id));
      earned = new Set(ids.filter((id) => known.has(id)));
      saveState();
      renderAll();
    } catch {
      alert('That file is not a Leonida Trophy Guide progress export.');
    }
  });
  reader.readAsText(file);
}

function wireControls() {
  spoilerEl.checked = spoilerOn;
  spoilerEl.addEventListener('change', () => {
    spoilerOn = spoilerEl.checked;
    saveState();
    renderAll();
  });
  for (const el of [searchEl, gradeEl, kindEl, unconfirmedEl, hideEarnedEl]) {
    el.addEventListener('input', renderRows);
    el.addEventListener('change', renderRows);
  }
  document.getElementById('export').addEventListener('click', exportProgress);
  document.getElementById('import').addEventListener('click', () => {
    document.getElementById('import-file').click();
  });
  document.getElementById('import-file').addEventListener('change', (ev) => {
    const file = ev.target.files?.[0];
    if (file) importProgress(file);
    ev.target.value = '';
  });
  document.getElementById('reset').addEventListener('click', () => {
    if (window.confirm('Clear every tick and start over?')) {
      earned = new Set();
      revealed = new Set();
      openId = null;
      saveState();
      renderAll();
    }
  });
}

function honorHash() {
  const hash = window.location.hash;
  if (hash.startsWith('#trophy-')) {
    const id = hash.slice('#trophy-'.length);
    if (trophyById(id)) {
      openId = id;
      renderRows();
      document.getElementById(`trophy-${id}`)?.scrollIntoView();
      return;
    }
  }
  if (hash === '#roadmap') {
    document.getElementById('roadmap')?.scrollIntoView();
  }
}

await loadTrophies();
wireControls();
renderAll();
honorHash();
