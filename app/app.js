// Leonida Trophy Guide — GTA VI (PS5), all 55 trophies.
// Offline, no network at runtime. Progress lives in localStorage.

const $ = (s) => document.querySelector(s);
const DATA_URL = "data/trophies.json";
const LS_EARNED = "gta6-trophies-earned";
const LS_SPOILER = "gta6-spoiler";

const KIND_LABELS = {
  all: "All", story: "Story", side: "Side stories", missable: "Missable",
  unconfirmed: "Unconfirmed",
  collectibles: "Collectibles", activities: "Activities", crime: "Crime",
  money: "Money", "one-off": "One-offs", online: "Online (0)"
};
const KIND_DISPLAY = {
  story: "Story", side: "Side story", collectibles: "Collectible",
  activities: "Activity", crime: "Crime", money: "Money", "one-off": "One-off"
};

const STAGES = [
  { n: 1, title: "Story — Chapters 1 to 5", hours: "60–80 h", text: "Play the whole story once. There is no mission replay, so use the manual saves at the start and end of each chapter. Do Lucia's Chapter 1 meditation right after the mission Down to Earth — it is the one thing in the game that can be missed. Everything else can be finished after the story." },
  { n: 2, title: "Side stories & stranger strands", hours: "10–20 h", text: "Clear the stranger questlines: Andy, Kenton, Billy, Randy, Tyrone and Bret, plus Cal's fishing and the eight strands Strangers & Freaks wants. They are all still open in free-roam." },
  { n: 3, title: "The 100% checklist", hours: "~100 h", text: "The big one. All 100 optional missions, 200 of 277 vehicles scanned, 100 of 255 animals, 70 of 80 challenges and 300 stunts. Track everything under Progress in-game. This is what the platinum is really made of." },
  { n: 4, title: "Collectibles & activities", hours: "15–25 h", text: "Scan 100 WAiNK locations, finish 3 card sets, discover 100 vehicles, fully unfog the map, win 20 different races and finish one arcade game. Much of it overlaps with the checklist, so a lot is already done." },
  { n: 5, title: "Crime", hours: "~10 h", text: "Partner robberies, bank vaults, armored trucks, gang operations, the tank, the plane and 5 kills in one Combat Focus. Call your partner with hold-right plus triangle once Chapter 2 lets you roam together." },
  { n: 6, title: "Money & one-offs", hours: "~10 h", text: "Launder $250,000 of marked bills, spend $100,000 in shops, buy all 8 garages, register 10 vehicles with Scooter Bros, and pick up the odd one-offs: the cocktail, the Banshee through the window, bowling, max strength with both characters, the UFO, and whatever Bad Luck, I Guess and Ten Pin turn out to be." }
];

const SOURCES = []; // filled from data.guide_sources in init()
let AGREEMENTS = [];

let trophies = [];
let earned = new Set();
let spoilerOn = true;
let filterKind = "all";
let filterGrade = "all";
let query = "";
let detailId = null;
let openRoadmap = false;

function loadState() {
  try { earned = new Set(JSON.parse(localStorage.getItem(LS_EARNED) || "[]").filter(Number.isInteger)); } catch { earned = new Set(); }
  const saved = localStorage.getItem(LS_SPOILER);
  spoilerOn = saved === null ? true : saved === "1";
}
function saveState() {
  localStorage.setItem(LS_EARNED, JSON.stringify([...earned].sort((a, b) => a - b)));
  localStorage.setItem(LS_SPOILER, spoilerOn ? "1" : "0");
}

function applyUrlParams() {
  const p = new URLSearchParams(location.search);
  const f = p.get("filter");
  if (f && KIND_LABELS[f]) filterKind = f;
  const g = p.get("grade");
  if (g && ["platinum", "gold", "silver", "bronze"].includes(g)) filterGrade = g;
  const q = p.get("q");
  if (q) query = q;
  const sp = p.get("spoiler");
  if (sp === "off") spoilerOn = false;
  if (sp === "on") spoilerOn = true;
  const e = p.get("earned");
  if (e) e.split(",").map((x) => parseInt(x, 10)).filter(Number.isInteger).forEach((id) => earned.add(id));
  if (p.get("view") === "roadmap") openRoadmap = true;
  const t = parseInt(p.get("trophy") || "", 10);
  if (Number.isInteger(t)) detailId = t;
}

function isMasked(t) { return spoilerOn && t.hidden && !earned.has(t.id); }
function displayName(t) { return isMasked(t) ? "Hidden trophy" : t.name; }
function displayDesc(t) { return isMasked(t) ? "Hidden on PlayStation until earned." : t.description; }

function filtered() {
  return trophies.filter((t) => {
    if (filterKind === "online") return false;
    if (filterKind === "missable" && !t.missable) return false;
    if (filterKind === "unconfirmed" && !t.unconfirmed) return false;
    if (filterKind !== "all" && filterKind !== "missable" && filterKind !== "unconfirmed" && t.kind !== filterKind) return false;
    if (filterGrade !== "all" && t.grade !== filterGrade) return false;
    if (query) {
      const hay = isMasked(t) ? "" : (t.name + " " + t.description).toLowerCase();
      if (!hay.includes(query.toLowerCase())) return false;
    }
    return true;
  });
}

function renderProgress() {
  const n = earned.size, total = trophies.length;
  $("#progressText").textContent = `${n} of ${total} earned`;
  $("#progressLeft").textContent = n === total ? "Platinum earned — well done" : `${total - n} to go`;
  $("#progressFill").style.width = total ? (n / total * 100).toFixed(1) + "%" : "0%";
}

function renderChips() {
  const wrap = $("#kindChips");
  wrap.innerHTML = "";
  for (const [value, label] of Object.entries(KIND_LABELS)) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.setAttribute("aria-pressed", String(filterKind === value));
    b.addEventListener("click", () => { filterKind = value; renderChips(); renderList(); });
    wrap.appendChild(b);
  }
}

function tagHtml(t) {
  const tags = [`<span class="tag">${KIND_DISPLAY[t.kind] || t.kind}</span>`];
  if (t.hidden) tags.push(`<span class="tag hidden">Hidden</span>`);
  if (t.missable) tags.push(`<span class="tag missable">Missable</span>`);
  if (t.unconfirmed) tags.push(`<span class="tag unconfirmed">Unconfirmed</span>`);
  if (earned.has(t.id)) tags.push(`<span class="tag earned-tag">Earned</span>`);
  return tags.join("");
}

function renderNextUp() {
  const el = $("#nextUp");
  const ordered = trophies.slice().sort((a, b) => (a.stage - b.stage) || (a.id - b.id));
  const next = ordered.find((t) => !earned.has(t.id));
  if (!next) { el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = `Next up: <strong>${displayName(next)}</strong> — Stage ${next.stage}`;
}

function renderUnconfirmed() {
  const section = $("#unconfirmedCallout");
  const ul = $("#unconfirmedList");
  ul.innerHTML = "";
  const list = trophies.filter((t) => t.unconfirmed);
  if (!list.length) { section.hidden = true; return; }
  section.hidden = false;
  for (const t of list) {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    // Names stay masked while story spoilers are hidden, exactly like the list.
    b.textContent = (earned.has(t.id) ? "✓ " : "") + (isMasked(t) ? `Hidden trophy · ${t.grade} · ${t.gamerscore}G` : t.name);
    if (earned.has(t.id)) b.classList.add("earned");
    b.addEventListener("click", () => openDetail(t.id));
    li.appendChild(b);
    const tag = document.createElement("span");
    tag.className = "tag unconfirmed";
    tag.textContent = "Unconfirmed";
    li.appendChild(tag);
    ul.appendChild(li);
  }
}

function renderList() {
  renderNextUp();
  renderUnconfirmed();
  const list = filtered();
  const ul = $("#list");
  const empty = $("#emptyState");
  ul.innerHTML = "";
  if (filterKind === "online") {
    empty.hidden = false;
    empty.textContent = "GTA VI has no online trophies. All 55 are earned offline — the online list is empty on purpose.";
  } else if (list.length === 0) {
    empty.hidden = false;
    empty.textContent = "Nothing matches. Try a different filter or search.";
  } else {
    empty.hidden = true;
  }
  for (const t of list) {
    const li = document.createElement("li");
    li.className = "trophy" + (earned.has(t.id) ? " earned" : "");
    const masked = isMasked(t);
    li.innerHTML = `
      <input type="checkbox" ${earned.has(t.id) ? "checked" : ""} aria-label="Mark ${masked ? "hidden trophy" : t.name} as earned">
      <span class="grade-badge grade-${t.grade}">${t.grade}</span>
      <div class="trophy-main">
        <p class="trophy-name">${displayName(t)}${masked ? ' <span class="hidden-tag">(hidden)</span>' : ""}</p>
        <p class="trophy-desc">${displayDesc(t)}</p>
        <div class="trophy-tags">${tagHtml(t)}<span class="tag">${t.gamerscore}G</span></div>
      </div>
      <button type="button" class="guide-btn">${masked ? "Guide (spoiler)" : "Guide"}</button>`;
    li.querySelector("input").addEventListener("change", (ev) => {
      if (ev.target.checked) earned.add(t.id); else earned.delete(t.id);
      saveState(); renderProgress(); renderList(); renderRoadmap(); if (detailId === t.id) renderDetail();
    });
    li.querySelector(".guide-btn").addEventListener("click", () => openDetail(t.id));
    ul.appendChild(li);
  }
  renderProgress();
}

function renderRoadmap() {
  const ol = $("#stages");
  ol.innerHTML = "";
  for (const s of STAGES) {
    const ts = trophies.filter((t) => t.stage === s.n);
    const li = document.createElement("li");
    li.id = "stage-" + s.n;
    li.innerHTML = `
      <span class="stage-num">${s.n}</span>
      <div>
        <h3>${s.title} <span>· ${s.hours} · ${ts.filter((t) => earned.has(t.id)).length}/${ts.length} earned</span></h3>
        <p>${s.text}</p>
        <div class="stage-trophies"></div>
      </div>`;
    const chips = li.querySelector(".stage-trophies");
    for (const t of ts) {
      const b = document.createElement("button");
      b.type = "button";
      // A masked chip cannot show the name, but "Hidden trophy" twelve times
      // tells the reader nothing. Grade + gamerscore at least tell them apart.
      b.textContent = (earned.has(t.id) ? "✓ " : "") + (isMasked(t) ? `Hidden · ${t.grade} · ${t.gamerscore}G` : t.name);
      if (earned.has(t.id)) b.classList.add("earned");
      b.addEventListener("click", () => openDetail(t.id));
      chips.appendChild(b);
    }
    ol.appendChild(li);
  }
}

function renderSources() {
  const ul = $("#sourceList");
  ul.innerHTML = "";
  for (const s of SOURCES) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = s.url; a.target = "_blank"; a.rel = "noopener"; a.textContent = s.name;
    li.appendChild(a);
    const role = document.createElement("span");
    role.className = "source-role";
    role.textContent = ` — ${s.role}: ${s.covers}`;
    li.appendChild(role);
    if (s.updated) {
      const date = document.createElement("span");
      date.className = "source-date";
      date.textContent = s.updated === "undated" ? " · No date shown" : ` · Updated ${s.updated}`;
      li.appendChild(date);
    }
    const cited = trophies.filter((t) => t.source === s.name).length;
    const steps = trophies.reduce((n, t) => n + (t.steps || []).filter((st) => (typeof st === "object" ? st.source : "") === s.name).length, 0);
    if (cited || steps) {
      const counts = document.createElement("span");
      counts.className = "source-counts";
      counts.textContent = ` (${cited} ${cited === 1 ? "trophy" : "trophies"}, ${steps} cited ${steps === 1 ? "step" : "steps"})`;
      li.appendChild(counts);
    }
    ul.appendChild(li);
  }
}

function renderMatrix() {
  const ul = $("#agreementList");
  ul.innerHTML = "";
  for (const line of AGREEMENTS) {
    const li = document.createElement("li");
    li.textContent = line;
    ul.appendChild(li);
  }
}

function setRoadmapVisible(v, scroll = true) {
  $("#roadmap").hidden = !v;
  $("#roadmapBtn").setAttribute("aria-pressed", String(v));
  if (v && scroll) $("#roadmap").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openDetail(id) {
  detailId = id;
  renderDetail();
  $("#detail").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeDetail() {
  detailId = null;
  $("#detail").hidden = true;
  document.body.style.overflow = "";
}

function renderDetail() {
  const t = trophies.find((x) => x.id === detailId);
  if (!t) return;
  const masked = isMasked(t);
  $("#detailGrade").textContent = t.grade;
  $("#detailKind").textContent = KIND_DISPLAY[t.kind] || t.kind;
  $("#detailHidden").textContent = t.hidden ? "Hidden" : "Shown";
  $("#detailMissable").textContent = t.missable ? "Missable" : "";
  $("#detailMissable").style.display = t.missable ? "" : "none";
  $("#detailUnconfirmed").textContent = t.unconfirmed ? "Unconfirmed trigger" : "";
  $("#detailUnconfirmed").style.display = t.unconfirmed ? "" : "none";
  $("#detailName").textContent = displayName(t);
  $("#detailDesc").textContent = displayDesc(t);
  $("#detailMeta").textContent = `${t.gamerscore} gamerscore · Trophy ${t.id} of 55 · ${earned.has(t.id) ? "Earned" : "Not earned yet"}`;
  const answerEl = $("#detailAnswer");
  if (!masked && t.answer) {
    answerEl.hidden = false;
    answerEl.innerHTML = "";
    answerEl.appendChild(document.createTextNode("In short: " + t.answer + " "));
    const src = document.createElement("a");
    src.className = "step-source";
    src.href = t.answer_source_url || "#";
    src.target = "_blank"; src.rel = "noopener";
    src.textContent = "— " + t.answer_source;
    answerEl.appendChild(src);
  } else {
    answerEl.hidden = true;
    answerEl.innerHTML = "";
  }
  const missableEl = $("#detailMissableNote");
  if (!masked && t.missable_note) {
    missableEl.hidden = false;
    missableEl.textContent = t.missable_note;
  } else {
    missableEl.hidden = true;
    missableEl.textContent = "";
  }
  const targetEl = $("#detailTarget");
  if (!masked && t.target) {
    const done = earned.has(t.id) ? t.target.count : 0;
    targetEl.hidden = false;
    targetEl.innerHTML = `${done}/${t.target.count} <span>${t.target.unit}</span>`;
  } else {
    targetEl.hidden = true;
  }
  if (masked) {
    $("#detailGuide").textContent = "This is a hidden story trophy. Turn off “Hide story spoilers” above to read its guide.";
    $("#detailSteps").innerHTML = "";
    $("#detailSource").textContent = t.source;
    $("#detailSource").href = t.source_url;
  } else {
    $("#detailGuide").textContent = t.guide;
    const ol = $("#detailSteps");
    ol.innerHTML = "";
    (t.steps || []).forEach((s) => {
      const li = document.createElement("li");
      if (typeof s === "object" && s !== null) {
        li.appendChild(document.createTextNode(s.text + " "));
        const src = document.createElement("a");
        src.className = "step-source";
        src.href = s.source_url || "#";
        src.target = "_blank"; src.rel = "noopener";
        src.textContent = "— " + s.source;
        li.appendChild(src);
      } else {
        li.textContent = s;
      }
      ol.appendChild(li);
    });
    $("#detailSource").textContent = t.source;
    $("#detailSource").href = t.source_url;
  }
  $("#detailToggle").textContent = earned.has(t.id) ? "Mark as not earned" : "Mark as earned";
  const list = filtered();
  const i = list.findIndex((x) => x.id === t.id);
  $("#detailPrev").disabled = i <= 0;
  $("#detailNext").disabled = i < 0 || i >= list.length - 1;
}

function exportProgress() {
  const payload = {
    app: "gta6-trophy-guide",
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b)
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gta6-trophies-progress.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result));
      const ids = Array.isArray(data) ? data : data.earned;
      if (!Array.isArray(ids)) throw new Error("no earned list");
      const valid = new Set(trophies.map((t) => t.id));
      const next = new Set();
      for (const id of ids) if (valid.has(id)) next.add(id);
      earned = next;
      saveState(); renderList(); renderRoadmap();
      alert(`Imported ${earned.size} earned trophies.`);
    } catch {
      alert("That file is not a valid progress export.");
    }
  };
  reader.readAsText(file);
}

async function init() {
  loadState();
  applyUrlParams();
  const res = await fetch(DATA_URL);
  const data = await res.json();
  trophies = data.trophies.slice().sort((a, b) => a.id - b.id);
  SOURCES.push(...(data.guide_sources || []));
  AGREEMENTS = data.agreements || [];
  // Drop any earned id the data does not know (e.g. a stale ?earned= link),
  // so the progress count can never exceed 55.
  const valid = new Set(trophies.map((t) => t.id));
  earned = new Set([...earned].filter((id) => valid.has(id)));
  $("#search").value = query;
  $("#grade").value = filterGrade;
  $("#spoiler").checked = spoilerOn;
  renderChips();
  renderList();
  renderRoadmap();
  renderSources();
  renderMatrix();
  // The roadmap scroll has to wait until the stages exist, or the page
  // scrolls to an empty section and stays there. On a fresh load (?view=roadmap)
  // show it without scrolling: the hero and toolbar stay visible and the
  // roadmap starts right below them. Clicking the button still scrolls to it.
  if (openRoadmap) setRoadmapVisible(true, false);
  // A #stage-N deep link has to wait until the stages exist too: the browser
  // cannot jump to an element the fetch has not rendered yet.
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }

  $("#search").addEventListener("input", (ev) => { query = ev.target.value; renderList(); });
  $("#grade").addEventListener("change", (ev) => { filterGrade = ev.target.value; renderList(); });
  $("#spoiler").addEventListener("change", (ev) => { spoilerOn = ev.target.checked; saveState(); renderList(); renderRoadmap(); if (detailId !== null) renderDetail(); });
  $("#roadmapBtn").addEventListener("click", () => setRoadmapVisible($("#roadmap").hidden));
  $("#exportBtn").addEventListener("click", exportProgress);
  $("#importFile").addEventListener("change", (ev) => { if (ev.target.files[0]) importProgress(ev.target.files[0]); ev.target.value = ""; });
  $("#detailClose").addEventListener("click", closeDetail);
  $("#detail").addEventListener("click", (ev) => { if (ev.target.id === "detail") closeDetail(); });
  document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") closeDetail(); });
  $("#detailToggle").addEventListener("click", () => {
    const t = trophies.find((x) => x.id === detailId);
    if (!t) return;
    if (earned.has(t.id)) earned.delete(t.id); else earned.add(t.id);
    saveState(); renderList(); renderRoadmap(); renderDetail();
  });
  $("#detailPrev").addEventListener("click", () => {
    const list = filtered();
    const i = list.findIndex((x) => x.id === detailId);
    if (i > 0) { detailId = list[i - 1].id; renderDetail(); }
  });
  $("#detailNext").addEventListener("click", () => {
    const list = filtered();
    const i = list.findIndex((x) => x.id === detailId);
    if (i >= 0 && i < list.length - 1) { detailId = list[i + 1].id; renderDetail(); }
  });

  if (detailId !== null && trophies.some((t) => t.id === detailId)) openDetail(detailId);
}

init();
