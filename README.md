# Leonida Trophy Guide — GTA VI, all 55 PS5 trophies

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

- PowerPyx — GTA 6 Trophy Guide & Roadmap
  https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/
- The GTA 6 Guide — Full Trophy & Achievement List
  https://thegta6guide.com/trophy-achievement-list/
- Exophase — Grand Theft Auto VI trophies
  https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- PSNProfiles — GTA VI trophy list
  https://psnprofiles.com/trophies/25264-grand-theft-auto-vi
- GamesRadar — GTA 6 trophy list
  https://www.gamesradar.com/games/grand-theft-auto/gta-6-trophies-achievements-list/

Trophy names and descriptions are the official PlayStation text. The guides are
written for this page, in our own words, from the sources above. Two trophies
(Bad Luck, I Guess and Ten Pin) have no confirmed trigger yet — the guide says so
plainly instead of guessing.

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the app.
- `app/data/trophies.json` — the 55 trophies: official name, description, grade,
  hidden flag, kind, missable flag, roadmap stage, guide, steps, and source.
- `screenshots/` — 4 screenshots of the app (checklist, open guide, roadmap,
  missable filter).
- `main.ts` — copies `app/` and `screenshots/` to the output and writes
  `dossier.json` via the vendored make.fun library.
- `serve.ts` — a small static server for local development.

## Build

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This is an unofficial fan guide, not affiliated with Rockstar Games or
Take-Two Interactive.
