# Leonida Trophy Guide

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/MrYos99/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/MrYos99/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline checklist and platinum roadmap for all **55 Grand Theft Auto VI trophies** on PlayStation 5.

- **55 trophies:** 1 platinum, 2 gold, 6 silver, 46 bronze
- **28 hidden** trophies, with spoiler mode **on by default** (details blurred until you reveal them or earn them)
- **Exactly 1 missable trophy:** "Positive Mental Attitude" — the guide warns you before Chapter 1
- **6-stage platinum roadmap** (~200 hours) plus a **"Next up"** card that suggests the next trophy to chase (missable first)
- **Checklist with localStorage persistence** — tick trophies off, your progress survives reloads
- **Filters** by grade and kind (story, missable, collectibles, activities, crime, exploration, combat, character quests), search, export and import of progress
- **Fully offline at runtime** — no external requests once the page loads

## Honesty rules

Two trophies have **no confirmed trigger** in any source and this guide never invents one:

- **"Bad Luck, I Guess"** — unconfirmed
- **"Ten Pin"** — unconfirmed

Four more are marked **partial** (a known direction, but no confirmed exact steps yet): "Fair Game", "In The Beginning…", "Capital Offense", "The Truth Is Out There".

## Sources

- GTABase — GTA 6 Trophy Guide & Achievements List (PS5 & Xbox Series X|S), November 2026
- PSNProfiles — Grand Theft Auto VI Trophies
- Push Square — GTA 6: Trophy Guide & Roadmap

Guides are written for this entry in its own words; official trophy names and descriptions are shown as PlayStation publishes them.

## Run it

```sh
node serve.ts            # dev server, http://localhost:8080/
node main.ts             # hand-in: copies app/ + screenshots/ to /output and writes dossier.json
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts   # hand-in to a local directory instead
```

Or serve the `app/` directory with any static file server. The app fetches `app/data/trophies.json` (same origin) and nothing else.

## Verification

This build was verified in the browser before submission:

- All 55 trophies render as checklist rows; the official names were checked against the competition starter's list (54 of 55 matched by script after normalisation, and the one name that needed fixing — "T**s Ass Drug Money" — now matches exactly).
- 0 console errors on load, and ticking a trophy off survives a reload (localStorage persistence).
- The 4 screenshots in `screenshots/` are real renders of this app in headless Chrome: the checklist, the 6-stage roadmap, spoiler mode revealing a hidden trophy, and the missable trophy's guide open.
- `node main.ts` hands in cleanly and the written `dossier.json` is byte-for-byte what the kit's `buildDossier` produces.

## Files

- `main.ts` — hand-in program, copies app/ + screenshots/ to /output and writes dossier.json
- `serve.ts` — dev server with request log
- `app/index.html`, `app/app.js`, `app/style.css` — the app
- `app/data/trophies.json` — all 55 trophies in this project's own JSON schema
- `vendor/makefun-frontend.ts` — kit vendor file, copied byte-for-byte from the starter
- `screenshots/` — 4 screenshots of the running app (see `shots.json`)

## License

See `LICENSE`. Unofficial fan guide — not affiliated with Rockstar Games or Take-Two Interactive.
