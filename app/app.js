// Leonida Trophy Guide — all logic runs locally, no network calls after load.
(function () {
  "use strict";

  var STORAGE_KEY = "leonida-trophy-guide-v1";
  var DATA_URL = "data/trophies.json";

  var ROADMAP = [
    {
      title: "Stage 1 — Before you start: the one missable trophy",
      text: "Do this first. Everything else can be cleaned up after the story, but one meditation can be missed forever.",
      ids: ["positive-mental-attitude"]
    },
    {
      title: "Stage 2 — Play the story, Chapters 1–5",
      text: "Just play. All 12 story trophies pop as you finish missions and chapters. Turn on progress and collectible notifications in Settings.",
      ids: ["just-like-paradise", "paradise-lost", "tits-ass-drug-money", "vice-city-baby", "top-of-the-world-ma", "you-gotta-know-when-to-get-off", "trust", "break-the-bank", "family-matters", "dwnfall", "hi-jacked", "snow-storm"]
    },
    {
      title: "Stage 3 — Character quests & strangers",
      text: "Finish the quest lines for Andy, Kenton, Billy, Randy, Tyrone and Bret, plus 8 stranger strands. None are needed for 100%, and all stay open after the story.",
      ids: ["road-to-rehabilitation", "this-was-no-boat-accident", "the-lone-rider", "strangers-and-freaks", "supply-and-demand", "spin-on-this", "fair-game"]
    },
    {
      title: "Stage 4 — Activities, races & skills",
      text: "Shooting ranges, stunts, drone races, car races, fishing, arcade games and Combat Focus. Most of this feeds the 100% checklist too.",
      ids: ["cunning-stunts", "master-of-none", "the-shootist", "top-fun", "earn-cash-not-kudos", "baited-my-tackle", "stick-fiddler", "gunslinger", "catch-me-if-you-can", "challenging-tank", "lets-go-bowling", "personal-best"]
    },
    {
      title: "Stage 5 — Crime, money & the map",
      text: "Bank vaults, shop robberies, gang operations, laundering marked bills, garages and exploring every corner of Leonida.",
      ids: ["hot-together", "retail-therapy", "sneakthief", "maximum-withdrawal", "a-classic-blitz-play", "pest-control", "dime-on-the-dollar", "treat-yo-self", "little-boxes", "on-the-spot", "whip-it-good", "the-goodtime-state"]
    },
    {
      title: "Stage 6 — Collectibles, 100% & clean-up",
      text: "The long tail: WAiNK scans, card sets, challenges, meditations, the last stragglers — then A Long Road (100% Completion) and the platinum.",
      ids: ["a-long-road", "dont-touch-my-deck", "you-wainker", "one-last-thing", "actions-speak-louder", "in-the-beginning", "capital-offense", "bad-luck-i-guess", "the-truth-is-out-there", "ten-pin", "vice-got-a-price"]
    }
  ];

  var CATEGORY_LABELS = {
    "platinum": "Platinum",
    "story": "Story",
    "completion": "100% Completion",
    "activities": "Activities",
    "character-quests": "Character quests",
    "collectibles": "Collectibles",
    "exploration": "Exploration",
    "crime": "Crime",
    "combat": "Combat",
    "misc": "Miscellaneous"
  };

  var state = { checked: {}, revealed: {}, spoiler: true };
  var data = null;
  var byId = {};

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved && typeof saved === "object") {
        if (Array.isArray(saved.checked)) {
          saved.checked.forEach(function (id) { state.checked[id] = true; });
        }
        if (Array.isArray(saved.revealed)) {
          saved.revealed.forEach(function (id) { state.revealed[id] = true; });
        }
        if (typeof saved.spoiler === "boolean") state.spoiler = saved.spoiler;
      }
    } catch (e) { /* corrupted save: start fresh */ }
  }

  function saveState() {
    var out = {
      checked: Object.keys(state.checked).filter(function (id) { return state.checked[id]; }),
      revealed: Object.keys(state.revealed).filter(function (id) { return state.revealed[id]; }),
      spoiler: state.spoiler
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(out)); } catch (e) { /* storage full or blocked */ }
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function trophyById(id) { return byId[id]; }

  function checkedCount() {
    return data.trophies.filter(function (t) { return state.checked[t.id]; }).length;
  }

  function tierCount(tier) {
    return data.trophies.filter(function (t) { return t.tier === tier && state.checked[t.id]; }).length;
  }

  function renderHero() {
    var box = document.getElementById("heroStats");
    box.innerHTML = "";
    var items = [
      ["55", " trophies"],
      ["1", " platinum · "],
      ["2", " gold · "],
      ["6", " silver · "],
      ["46", " bronze"],
      ["28", " hidden"],
      ["1", " missable"],
      ["~200 h", " to platinum"]
    ];
    items.forEach(function (pair) {
      var span = el("span", "stat");
      var b = el("b", null, pair[0]);
      span.appendChild(b);
      span.appendChild(document.createTextNode(pair[1]));
      box.appendChild(span);
    });
  }

  function renderProgress() {
    var done = checkedCount();
    var total = data.trophies.length;
    document.getElementById("progressText").textContent = done + " / " + total;
    var fill = document.getElementById("progressFill");
    fill.style.width = Math.round((done / total) * 100) + "%";
    var bar = document.getElementById("progressBarWrap");
    bar.setAttribute("aria-valuenow", String(done));
    var counts = document.getElementById("tierCounts");
    counts.innerHTML = "";
    ["platinum", "gold", "silver", "bronze"].forEach(function (tier) {
      var all = data.trophies.filter(function (t) { return t.tier === tier; }).length;
      var span = el("span", null, tier.charAt(0).toUpperCase() + tier.slice(1) + ": " + tierCount(tier) + " / " + all);
      counts.appendChild(span);
    });
    document.getElementById("platinumNote").textContent =
      done === total
        ? "Platinum earned — Vice Got a Price! Every trophy is checked. Leonida Legend."
        : "Platinum: Vice Got a Price! — unlocks when the other 54 are done. Estimated time to platinum: about 200 hours.";
  }

  function nextUpTrophy() {
    var order = [];
    ROADMAP.forEach(function (stage) { order = order.concat(stage.ids); });
    for (var i = 0; i < order.length; i++) {
      var t = trophyById(order[i]);
      if (t && !state.checked[t.id]) return t;
    }
    return null;
  }

  function stageOf(id) {
    for (var i = 0; i < ROADMAP.length; i++) {
      if (ROADMAP[i].ids.indexOf(id) !== -1) return i + 1;
    }
    return 0;
  }

  function renderNextUp() {
    var t = nextUpTrophy();
    var name = document.getElementById("nextUpName");
    var why = document.getElementById("nextUpWhy");
    var steps = document.getElementById("nextUpSteps");
    var btn = document.getElementById("nextUpDone");
    var revealBtn = document.getElementById("nextUpReveal");
    steps.innerHTML = "";
    if (!t) {
      name.textContent = "All done — platinum earned!";
      why.textContent = "Every trophy is checked. Vice Got a Price!";
      btn.style.display = "none";
      revealBtn.style.display = "none";
      return;
    }
    btn.style.display = "";
    name.textContent = t.name;
    var reason = t.missable
      ? "Missable — do this one first, in Chapter 1, or it is gone for the whole playthrough."
      : "Roadmap stage " + stageOf(t.id) + " of 6 · " + t.tier + " trophy" + (t.hidden ? " · hidden" : "") + ".";
    // Spoiler mode hides the details of hidden trophies here too, not just in the list.
    var censored = state.spoiler && t.hidden && !state.revealed[t.id];
    why.textContent = censored
      ? reason + " Hidden trophy — details stay hidden while spoiler mode is on."
      : reason + " " + t.desc;
    if (censored) {
      revealBtn.style.display = "";
      revealBtn.onclick = function () {
        state.revealed[t.id] = true;
        saveState();
        renderAll();
      };
      steps.appendChild(el("li", null, "Reveal this trophy to see its steps, or turn spoiler mode off."));
    } else {
      revealBtn.style.display = "none";
      if (t.status === "unconfirmed") {
        var li = el("li", null, "No confirmed trigger yet — this guide gives no steps rather than inventing one.");
        steps.appendChild(li);
      } else {
        t.steps.forEach(function (s) { steps.appendChild(el("li", null, s)); });
      }
    }
    btn.onclick = function () {
      state.checked[t.id] = true;
      saveState();
      renderAll();
    };
  }

  function renderRoadmap() {
    var list = document.getElementById("roadmapList");
    list.innerHTML = "";
    ROADMAP.forEach(function (stage, index) {
      var li = el("li");
      var h3 = el("h3", null, stage.title);
      var doneInStage = stage.ids.filter(function (id) { return state.checked[id]; }).length;
      var count = el("span", "stage-count", doneInStage + " / " + stage.ids.length + " done");
      h3.appendChild(count);
      li.appendChild(h3);
      li.appendChild(el("p", null, stage.text));
      var bar = el("div", "stage-bar");
      var fill = el("i");
      fill.style.width = Math.round((doneInStage / stage.ids.length) * 100) + "%";
      bar.appendChild(fill);
      li.appendChild(bar);
      var names = stage.ids.map(function (id) {
        var t = trophyById(id);
        return t ? t.name : id;
      });
      var line = el("p", "stage-trophies");
      var b = el("b", null, "Trophies: ");
      line.appendChild(b);
      line.appendChild(document.createTextNode(names.join(" · ")));
      li.appendChild(line);
      list.appendChild(li);
    });
  }

  function isHidden(t) { return t.hidden; }

  function detailsVisible(t) {
    if (!state.spoiler) return true;
    if (!isHidden(t)) return true;
    return !!state.revealed[t.id];
  }

  function renderList() {
    var list = document.getElementById("trophyList");
    list.innerHTML = "";
    var q = document.getElementById("searchBox").value.trim().toLowerCase();
    var tier = document.getElementById("tierFilter").value;
    var cat = document.getElementById("categoryFilter").value;
    var hideDone = document.getElementById("hideDoneToggle").checked;
    var unconfirmedOnly = document.getElementById("unconfirmedToggle").checked;

    var shown = 0;
    data.trophies.forEach(function (t) {
      if (q && (t.name + " " + t.desc).toLowerCase().indexOf(q) === -1) return;
      if (tier !== "all" && t.tier !== tier) return;
      if (cat !== "all" && t.category !== cat) return;
      if (hideDone && state.checked[t.id]) return;
      if (unconfirmedOnly && t.status !== "unconfirmed") return;
      shown++;

      var li = el("li", "trophy" + (state.checked[t.id] ? " done" : ""));
      li.id = "trophy-" + t.id;

      var top = el("div", "trophy-top");
      var check = document.createElement("input");
      check.type = "checkbox";
      check.className = "trophy-check";
      check.checked = !!state.checked[t.id];
      check.setAttribute("aria-label", "Mark " + t.name + " as done");
      check.addEventListener("change", function () {
        state.checked[t.id] = check.checked;
        saveState();
        renderAll();
      });
      top.appendChild(check);

      var body = el("div");
      var name = el("p", "trophy-name", t.name);
      body.appendChild(name);

      var badges = el("div", "badges");
      badges.appendChild(el("span", "badge " + t.tier, t.tier));
      if (t.hidden) badges.appendChild(el("span", "badge hidden", "hidden"));
      if (t.missable) badges.appendChild(el("span", "badge missable", "MISSABLE"));
      if (t.status === "unconfirmed") badges.appendChild(el("span", "badge unconfirmed", "UNCONFIRMED"));
      if (t.status === "partial") badges.appendChild(el("span", "badge partial", "PARTIAL — exact steps unconfirmed"));
      badges.appendChild(el("span", "badge", CATEGORY_LABELS[t.category] || t.category));
      body.appendChild(badges);

      var visible = detailsVisible(t);
      var desc = el("p", "trophy-desc" + (visible ? "" : " spoiler-blur"), t.desc);
      body.appendChild(desc);

      if (visible) {
        if (t.status === "unconfirmed") {
          body.appendChild(el("p", "unconfirmed-callout", t.unconfirmedNote));
        } else {
          var steps = el("ol", "steps");
          t.steps.forEach(function (s) { steps.appendChild(el("li", null, s)); });
          body.appendChild(steps);
          if (t.status === "partial") {
            body.appendChild(el("p", "unconfirmed-callout", "Exact steps are not confirmed yet for this trophy. The steps above are the best-known direction from the cited source."));
          }
        }
        body.appendChild(el("p", "trophy-source", "Source: " + t.source));
      } else {
        var tag = el("p", "spoiler-tag", "Hidden trophy — details blurred while spoiler mode is on.");
        body.appendChild(tag);
        var reveal = el("button", "reveal-btn", "Reveal this trophy");
        reveal.type = "button";
        reveal.addEventListener("click", function () {
          state.revealed[t.id] = true;
          saveState();
          renderList();
        });
        body.appendChild(reveal);
      }

      top.appendChild(body);
      li.appendChild(top);
      list.appendChild(li);
    });

    document.getElementById("countLine").textContent =
      shown === data.trophies.length
        ? "Showing all 55 trophies."
        : "Showing " + shown + " of 55 trophies.";
    if (shown === 0) {
      var empty = el("p", "empty-note", "No trophies match these filters.");
      list.appendChild(empty);
    }
  }

  function renderAll() {
    document.body.classList.toggle("spoiler-on", state.spoiler);
    document.getElementById("spoilerToggle").checked = state.spoiler;
    renderProgress();
    renderNextUp();
    renderRoadmap();
    renderList();
  }

  function buildCategoryFilter() {
    var select = document.getElementById("categoryFilter");
    var cats = [];
    data.trophies.forEach(function (t) {
      if (cats.indexOf(t.category) === -1) cats.push(t.category);
    });
    cats.sort().forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c;
      opt.textContent = CATEGORY_LABELS[c] || c;
      select.appendChild(opt);
    });
  }

  function bindControls() {
    document.getElementById("spoilerToggle").addEventListener("change", function (e) {
      state.spoiler = e.target.checked;
      saveState();
      renderAll();
    });
    document.getElementById("searchBox").addEventListener("input", renderList);
    document.getElementById("tierFilter").addEventListener("change", renderList);
    document.getElementById("categoryFilter").addEventListener("change", renderList);
    document.getElementById("hideDoneToggle").addEventListener("change", renderList);
    document.getElementById("unconfirmedToggle").addEventListener("change", renderList);
    document.getElementById("resetBtn").addEventListener("click", function () {
      if (window.confirm("Reset the whole checklist? This clears every checked trophy.")) {
        state.checked = {};
        state.revealed = {};
        saveState();
        renderAll();
      }
    });
  }

  function init() {
    loadState();
    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("Could not load trophy data (" + res.status + ")");
        return res.json();
      })
      .then(function (json) {
        data = json;
        data.trophies.forEach(function (t) { byId[t.id] = t; });
        renderHero();
        buildCategoryFilter();
        bindControls();
        renderAll();
      })
      .catch(function (err) {
        document.getElementById("trophyList").innerHTML =
          "<li class='empty-note'>Failed to load trophy data: " + err.message + "</li>";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
