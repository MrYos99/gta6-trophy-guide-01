# Leonida Trophy Guide — GTA VI, all 55 PS5 trophies

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/MrYos99/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/MrYos99/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for Grand Theft Auto VI on PlayStation 5: every trophy
with its official name and description, a guide in plain words with a source beside it,
a checklist that saves in your browser, a roadmap to the platinum, missable flags, a
spoiler setting, and export/import of your progress. No network at runtime, no images
from the game, no account.

## The numbers

- 55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. 28 hidden, 0 online.
- About 200 hours to the platinum. Difficulty 4/10.
- Exactly 1 trophy is missable: **Positive Mental Attitude** — meditate with Lucia in
  Chapter 1, after the mission Down to Earth, before the chapter ends.
- 197 cited steps across all 55 trophies (3–5 per trophy), each with its own
  source link, from 10 sources. Per-trophy sources: GTABase 40, Push Square 9,
  PowerPyx 5, Exophase 1.
- 5 trophies have no confirmed trigger yet (Bad Luck, I Guess; Ten Pin;
  In The Beginning…; Capital Offense; The Truth Is Out There) — the guide says
  so plainly and shows the best-known route only where a source gives one.
  Which animal triggers Fair Game is also not yet confirmed.

## How to use it

1. Open `app/index.html` (or serve the folder with `node serve.ts` and open
   http://localhost:8080).
2. Tick a trophy off when you earn it. It stays ticked in this browser.
3. **Filters** — by kind (Story, Side stories, Missable, Collectibles, Activities,
   Crime, Money, One-offs, Online), by grade, and by search.
4. **Hide story spoilers** is on by default: hidden trophies you have not earned yet
   show as "Hidden trophy" and their guides stay closed until you turn it off.
5. **Roadmap to platinum** — six stages in order, with the time each takes and which
   trophies belong to it. The missable one is flagged at the top.
6. **Export progress** saves a JSON file; **Import progress** loads it back.
7. Every trophy's guide opens in a panel with the source it came from.

You can also share a view with a link: `?view=roadmap`, `?trophy=28`,
`?filter=missable`, `?spoiler=off`, `?earned=1,2,3`, `?q=meditate`.

## The roadmap in short

1. **Story, Chapters 1–5** (60–80 h) — play once, save at each chapter, do Lucia's
   Chapter 1 meditation.
2. **Side stories & stranger strands** (10–20 h) — Andy, Kenton, Billy, Randy,
   Tyrone, Bret, Cal's fishing.
3. **The 100% checklist** (~100 h) — 100 optional missions, 200 of 277 vehicles
   scanned, 100 of 255 animals, 70 of 80 challenges, 300 stunts.
4. **Collectibles & activities** (15–25 h) — WAiNK, card sets, vehicles, map, races,
   arcade.
5. **Crime** (~10 h) — partner robberies, bank vaults, gang operations, tank, plane.
6. **Money & one-offs** (~10 h) — laundering, spending, garages, Scooter Bros, and
   the odd one-offs.

There is no mission replay, but everything the platinum needs is still reachable
after the story. Cheats disable trophies and saving, so leave them alone.

## Where the facts come from

Guide sources (per-trophy guides and steps):

- PowerPyx — GTA 6 Trophy Guide & Roadmap
  https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- GTABase — GTA 6 Trophy Guide & Achievements List
  https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series
- Push Square — GTA 6: Trophy Guide & Roadmap (WIP)
  https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap
- GTADb — GTA 6 PS5 Trophies & Platinum Guide
  https://gtadb.net/articles/gta-6-trophies-platinum-guide/

List sources (the 55 names, descriptions and grades, cross-checked):

- Exophase — Grand Theft Auto VI trophies
  https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- The GTA 6 Guide — Trophy List (28 Hidden)
  https://thegta6guide.com/gta-6-trophy-list/
- PSNProfiles — Grand Theft Auto VI trophies
  https://psnprofiles.com/trophies/43531-grand-theft-auto-vi
- Insider Gaming — Complete GTA 6 Trophy List
  https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/
- GTA BOOM — Every GTA 6 Trophy and Achievement
  https://www.gtaboom.com/every-gta-6-trophy-and-achievement-at-launch-and-how-to-unlock-them-fc5f
- The Big Lead — GTA 6 trophy/achievement list
  https://www.thebiglead.com/gta-6-trophy-achievement-list/

All ten sources agree on the same 55 trophies (1 platinum, 2 gold, 6 silver,
46 bronze, 28 hidden, 0 online). Where they disagree, the guide says so in the
app's "How the sources agree" section: time to platinum is ~200 hours per
PowerPyx, GTABase and GTADb but 250+ per Push Square; Positive Mental Attitude
is flagged as possibly missable by PowerPyx, GTABase and GTADb while Push
Square lists none known yet. Two sources were checked and dropped: GamesRadar
(blocked, content unverifiable on 2026-11-20) and PlayStationTrophies.org
(no guide exists yet).

Trophy names and descriptions are the official PlayStation text. The guides are
written for this page, in our own words, from the sources above. Five trophies
(Bad Luck, I Guess; Ten Pin; In The Beginning…; Capital Offense; The Truth Is
Out There) have no confirmed trigger yet — the guide says so plainly instead of
guessing, and shows PowerPyx's route only where one exists, marked unconfirmed.

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the app.
- `app/data/trophies.json` — the 55 trophies: official name, description, grade,
  hidden flag, kind, missable flag, roadmap stage, guide, steps, and source.
- `screenshots/` — 4 screenshots of the app (guide open over the checklist,
  missable filter with the sources list and agreement notes, roadmap part 1:
  stages 1–4, roadmap part 2: stages 5–6 plus the roadmap note). The roadmap
  is split across two shots because all six stage cards do not fit one 1280px
  frame; the missable trophy is shown in shot 1 (guide open, Missable flag),
  in shot 2 (the missable filter alone) and in the roadmap's missable callout
  in shot 3. Shot 1 also shows the numbered steps, each with its own source.
- `main.ts` — copies `app/` and `screenshots/` to the output and writes
  `dossier.json` via the vendored make.fun library.
- `serve.ts` — a small static server for local development.

## Build

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This is an unofficial fan guide, not affiliated with Rockstar Games or
Take-Two Interactive.
