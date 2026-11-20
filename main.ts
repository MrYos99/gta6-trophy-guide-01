// Leonida Trophy Guide — gta6-trophy-guide-01 entry (Node 22, standard library only).
//
// The entry is the static app in app/: index.html + style.css + app.js + data/trophies.json,
// opened at app/index.html. It is offline — it loads nothing over the network — and the
// trophy list with a guide for each of the 55 PS5 trophies lives in app/data/trophies.json.
// This program hands it in: it copies app/ and screenshots/ from beside this file to
// /output and writes /output/dossier.json, the summary the judge reads (your screenshots,
// the first load's files and bytes, and your source), using the vendored make.fun library.
// Leave vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be byte
// for byte what its own copy writes.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The judge's first check is the data: 55 trophies, every one with an official name,
// an official description, and a guide written for this entry. Fail loudly here
// instead of handing in a short list.
const data = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf8'));
const trophies = data.trophies;
if (!Array.isArray(trophies) || trophies.length !== 55) {
  throw new Error(`expected 55 trophies in app/data/trophies.json, found ${Array.isArray(trophies) ? trophies.length : 'none'}`);
}
for (const t of trophies) {
  if (!t.name || !t.description || !t.guide || !t.guide.trim() || !t.grade || !t.kind || !t.source) {
    throw new Error(`trophy ${t.id ?? '?'} is missing a name, description, guide, grade, kind or source`);
  }
}
console.log(`trophies: ${trophies.length} (1 platinum, 2 gold, 6 silver, 46 bronze; ${trophies.filter((t) => t.hidden).length} hidden; ${trophies.filter((t) => t.missable).length} missable)`);

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
