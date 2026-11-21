# Leonida Trophy Guide

An offline checklist and platinum roadmap for all **55 Grand Theft Auto VI trophies** on PlayStation 5.

- **55 trophies:** 1 platinum, 2 gold, 6 silver, 46 bronze
- **28 hidden** trophies, with spoiler mode **on by default** (details blurred until you reveal them)
- **Exactly 1 missable trophy:** "Positive Mental Attitude" — the guide warns you before Chapter 1
- **6-stage platinum roadmap** (~200 hours) plus a **"Next up"** card that suggests the next trophy to chase
- **Checklist with localStorage persistence** — tick trophies off, your progress survives reloads
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

## Run it

```sh
bun main.ts        # production entrypoint, http://localhost:8080/
bun serve.ts       # dev server with request log, http://localhost:3000/
```

Or serve the `app/` directory with any static file server. The app fetches `app/data/trophies.json` (same origin) and nothing else.

## Files

- `main.ts` — entrypoint, serves the app
- `serve.ts` — dev server
- `app/index.html`, `app/app.js`, `app/style.css` — the app
- `app/data/trophies.json` — all 55 trophies in this project's own JSON schema
- `vendor/makefun-frontend.ts` — kit vendor file, copied byte-for-byte from the starter
- `screenshots/` — 4 screenshots of the running app (see `shots.json`)

## License

See `LICENSE`. Unofficial fan guide — not affiliated with Rockstar Games or Take-Two Interactive.
