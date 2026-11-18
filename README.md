# AETHERWILD

A browser survey RPG. You are an Attunement Surveyor. The Lumenfall is fracturing, Resonants are going quiet, and the Harmonic Index is tearing. Walk three zones, Attune a Choir, clear eight Sanctums, and face the Prime Voice.

The title is a placeholder pending a trademark search. `npm run name-check` flags generated names that collide with each other or with `tools/ip-blocklist.txt`.

## IP-safety statement

AETHERWILD is original work from the first line of the engine to the last line of dialogue.

- The world, the nine Harmonics, the Resonant names, the Motifs, the Wardens, and the script are original. Names come from `src/generator/names.ts` (syllable banks, Harmonic suffixes, uniqueness, blocklist filter). They are not a hand-copied roster.
- Art is drawn at runtime on Canvas 2D from a seeded body plan. Audio is synthesized with the Web Audio API. The bitmap font is drawn from bit masks in code. There is no runtime fetch, no CDN, and no borrowed image, audio, or font file.
- Player-facing words follow the project terminology: Resonant, Harmonic, Motif, Cadence, Choir, Censer, Harmonic Index, Ascension, Resonance, Sanctum, Warden, Phrase, Token, Prismatic, First Resonance, Vigor, Focus, Guard, Spirit, Edge, Tempo.
- `npm run ip-scan` checks the tree and the git subjects against `tools/ip-blocklist.txt`. `npm run asset-scan` rejects binary assets under `src/`.
- This statement is an engineering constraint, not a legal opinion and not a trademark clearance.

## Play

Requires Node 18 or newer (`package.json` engines). The spec text asks for Node 20. On a normal checkout:

```bash
npm install
npm run dev
```

The dev server binds `127.0.0.1:5193` (`vite.config.ts`, `strictPort`). Open that URL. `npm run build` writes a static `dist/` with `base: './'`, so the folder plays offline from any static host. `npm run preview` serves the build.

In this sandbox, `node_modules/vite` is absent and `tools/run.mjs` resolves the toolchain from `/tmp/aw-nm` through `/tmp/aw-resolve.mjs`. A checkout that has run `npm install` uses its own `node_modules` and does not need that loader.

### Controls

| Action | Keyboard | Gamepad |
|---|---|---|
| Walk | Arrows or W A S D | D-pad or left stick |
| Confirm | Z, Enter, or the key chosen in Settings | Button 0 |
| Cancel | X or Escape | Button 1 |
| Field notes | C | Button 9 |

Settings can cycle the confirm key through Z, K, and Enter, and can set volume, text speed, instant text, reduced motion, and whether the Phrase log stays open.

Field notes: Choir, Harmonic Index, Tokens, Save, Settings, Title. The record lives in `localStorage` under `aetherwild.save.v1`. Settings also exports and imports that record.

### A short survey

1. New survey. Choose a First Resonance (r01, r07, or r13).
2. Walk the grass in Ashfen. A wild Resonant rings. Win the Phrase, then Attune if you want it in the Choir.
3. A still pool (`+` on the map) restores Vigor. Exits (`>`) lead to Saltspan, then Duskstair.
4. Each Sanctum letter A–H has its own rule. Eight seals open the Prime Voice door on Duskstair.
5. A loss returns you to the Ashfen spawn and restores the Choir.

## Mechanics

### Harmonics

Nine Harmonics, in ring order: Cindersong, Biteroot, Stratum, Rivet, Brine, Spark, Draft, Gloom, Bile. Each is strong against the next two on the ring (multiplier 2) and weak against the two sitting four and five steps ahead (multiplier 0.5). The matrix is derived in `src/engine/harmonics.ts` and checked for two strong and two weak marks on every row and every column.

### Ward

Every Resonant has a Ward value in 0.0–1.5 for each Harmonic. Damage multiplies the global chart by the striker's Ward for the defender's primary Harmonic. Ward is derived from the species base plus inheritance jitter. It is not a table you edit and then trust as ground truth. An Attuned individual keeps the Ward it had in the wild.

### Motifs and Cadence

A Phrase plays one Motif. Kindling, Pulse, and Guard resolve with Focus against Guard. Harmonic classes resolve with Spirit against Edge. Same-Harmonic Motifs use a 1.25 factor. Power 0 deals 0. Any other Motif deals at least 1. One roll feeds both the crit check and the variance term. Cadence for a Motif is `16 - cost * 2`, refilled when that side enters the Phrase.

From Phrase 30, Lumenfall Pressure chips remaining Vigor so a Phrase cannot run forever. The fuzz gate requires every battle to end before Phrase 200.

### Attunement

Attunement is three Hum slots. A Hum is Low, Mid, High, or a Harmonic name. The screen shows the wild Resonant's spike and pitch profile.

- Hum matches the dominant Ward spike: Guard −45.
- Hum matches the pitch profile: Guard −25.
- Otherwise: Guard +15.
- A Kindling Motif also trims 10. Any other Motif trims `round(harmony / 20)`.

Guard at or below 0 means the Resonant joins the Choir (Resonance 70) or, if the Choir already holds six, the Resonance Vault. If your active Vigor is under a quarter of its maximum, the wild Resonant slips away.

### Ascension

An Ascension stage needs a Choir Level, Resonance of at least 120, and one declarative condition (Motif-class use, Harmonic win count, biome reached, bond peak, or never having fallen). Resonance stage names are Stranger, Familiar, Trusted, Kindred, and Chorus at 0, 70, 130, 200, and 250. The numeric gate used by Ascension is 120.

The level curve lives in `src/engine/experience.ts`: level 1 sits at 0, and later levels use `floor(4 * n^3 / 5)`.

### Sanctums

| Seal | Warden | Harmonic | Rule |
|---|---|---|---|
| A | Sera Vellum | Cindersong | Only Cindersong Motifs |
| B | Orth Kite | Biteroot | One Resonant against the Warden's line |
| C | Mael Quarne | Stratum | Kindling, Pulse, and Guard Motifs only |
| D | Nim Brack | Rivet | The Warden switches at half Vigor |
| E | Ys Morrow | Brine | The bench is the only Vigor pool |
| F | Cade Pinder | Spark | Win within 8 Phrases |
| G | Lark Hexel | Draft | Last 3 Phrases without striking |
| H | Tove Cairn | Gloom | Your Resonants are weakened |
| — | Ivo Quarne | Bile | Prime Voice, after all eight seals |

The rival is Nerris Vale. Sanctum F stays an 8-Phrase limit. A Rivet lead, which is strong into Spark, is the practical way through it. Sanctum H's line is Choir Level 24, 26, and 28.

## Architecture

The battle engine under `src/engine/` is pure. It takes a state and a command and returns a new state plus events. It does not import the DOM, the renderer, or the audio. That is what the 10,000-battle fuzz runs against.

| Path | Role |
|---|---|
| `src/engine/` | Harmonics, Ward, damage, Cadence, Attunement, Ascension, AI, battle state machine |
| `src/data/` | Resonants, Motifs, zones, strings, Wardens, script |
| `src/generator/names.ts` | Phonotactic names |
| `src/render/` | Canvas, tiles, creature art, bitmap font, UI |
| `src/audio/` | Synth, themes, Hum pitches |
| `src/game/` | Save, input, scenes, survey state |
| `tools/` | Gates, content generator, contact sheet |

`src/data/strings.ts` holds player-visible copy. Scene files call `t()`.

## How to extend

- Add or retune content through `tools/gen-content.ts`, then `npm run gen-content`, `npm run validate-content`, and `npm run name-check`.
- A new Sanctum rule needs a kind on the battle rule union, a case in the state machine, and a row in `SANCTUM_RULES`.
- A new body plan goes in `BODY_PLANS` inside `src/render/creature-art.ts`, then `npm run render-sheet` so you can look at `atlas.png`.
- Keep `src/engine/` free of `Math.random()`, the DOM, and network calls. Pass the seeded RNG in.

## Verify

`npm run verify` runs typecheck, unit tests, content validation, the battle fuzz, the production build, the asset scan, the IP scan, and the Playwright survey.

Playwright (`tests/e2e-journey.spec.ts`, `tests/smoke.spec.ts`) drives the keyboard with `?e2e=1`: fixed seed, a faster level curve, and an early wild ringing. That script is a gate. It is not the full eight-Sanctum survey. See `PROGRESS.md`.

## Licence

MIT. See `LICENSE`.
