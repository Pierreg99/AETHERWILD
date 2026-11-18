# Progress

Date of this record: 2026-10-03.

The survey is playable from a static `dist/`, and gates 1–8 passed on the commands below. The spec's definition of done is not met. A browser play through all eight Sanctums and the Prime Voice was not done. This file does not mark the project done.

## Phase 8 — Verify and polish — IN PROGRESS

Phases 0–7 are implemented in the tree and committed as slices of that tree. Phase 8's gates passed. The remaining gap is manual: Sanctums B–H and the Prime Voice have not been driven from the keyboard.

**Known limitations**

- Playwright covers the title, a First Resonance, a wild Phrase, Attunement, a grind to Choir Level 24 and Resonance 120, Ascension, a heal, Sanctum A with two Vigor Tonics, save and reload, then Ashfen, Saltspan (the rival), and Duskstair. It does not clear seals B–H or the Prime Voice.
- A pure-engine sample used while tuning Sanctum F and Sanctum H was deleted. It is a calculation, not a played session. See `DECISIONS.md` items 13, 14, and 25.
- Headless Chromium skips WebAudio and gamepad polling (`navigator.webdriver`).
- Contact-sheet art repeats silhouettes. Detail is in manual check 10.
- This sandbox is Node 18.20.4. The spec text asks for Node 20. `package.json` allows Node 18.

## Gate output

Commands were the script bodies (`node tools/run.mjs …` and `node tools/ip-scan.mjs`), which is what `npm run` invokes. `tsc --noEmit` prints nothing when it is clean. The chain below is one shell: typecheck, then test, then the later gates. Exit code of the chain was 0.

```
$ node tools/run.mjs typecheck && node tools/run.mjs test && node tools/run.mjs ssr tools/validate-content.ts && node tools/run.mjs ssr tools/name-check.ts && node tools/run.mjs ssr tools/fuzz-battle.ts && node tools/run.mjs build && node tools/run.mjs ssr tools/asset-scan.ts && node tools/ip-scan.mjs && gzip -c dist/assets/*.js | wc -c
(node:10854) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
(node:11144) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)

 RUN  v2.1.8 /root/projects/AETHERWILD

(node:11358) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
(node:11362) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
(node:11364) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
(node:11360) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
(node:11370) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
(node:11366) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
(node:11368) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
 ✓ src/engine/__tests__/battle.test.ts (8 tests) 105ms
 ✓ src/engine/__tests__/core.test.ts (10 tests) 461ms
   ✓ rng > repeats a 10_000 draw sequence for the same seed 371ms

 Test Files  2 passed (2)
      Tests  18 passed (18)
   Start at  07:24:55
   Duration  6.91s (transform 3.25s, setup 0ms, collect 4.41s, tests 566ms, environment 2ms, prepare 2.40s)

(node:11847) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
validate-content ok motifs=120 resonants=78 ascensions=18 npcs=40 tiles=40
(node:12073) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
name-check ok species=78 motifs=120
(node:12299) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
fuzz-battle ok battles=10000 wins=4549 losses=5451 longest=17 peak=r06 150/259 rate=0.579
(node:12877) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
vite v5.4.11 building for production...
transforming...
✓ 55 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  1.03 kB │ gzip:  0.59 kB
dist/assets/index-DppqRPVL.js  154.21 kB │ gzip: 36.46 kB
✓ built in 11.04s
(node:13234) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
asset-scan ok
fatal: your current branch 'main' does not have any commits yet
ip-scan ok needles=276
36432
```

Gate notes from that paste:

- Gate 1 typecheck: no `tsc` diagnostics. The chain continued, so the exit was 0.
- Gate 2: 18 tests passed, 2 files. The determinism test asserts each of 10,000 draws, so the assertion count is above the 120 floor. Vitest prints tests, not assertions.
- Gate 3: `validate-content ok motifs=120 resonants=78 ascensions=18 npcs=40 tiles=40`
- Name check (extra script): `name-check ok species=78 motifs=120`
- Gate 4: `fuzz-battle ok battles=10000 wins=4549 losses=5451 longest=17 peak=r06 150/259 rate=0.579`. The `rate` figure is that species' win share (150 of 259), under the 90% cap. It is not anything else.
- Gate 5: Vite build succeeded. JS gzip size measured 36432 bytes. Limit is 900 KB.
- Gate 6: `asset-scan ok`
- Gate 7 at that moment: `ip-scan ok needles=276`, plus git's message that `main` had no commits yet.

After the eight implementation commits, with these docs still untracked, the same command scanned the git subjects:

```
$ node tools/ip-scan.mjs
ip-scan ok needles=276
```

```
$ node tools/run.mjs e2e
(node:13737) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)

Running 2 tests using 1 worker

(node:14101) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("/tmp/aw-resolve.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)

(node:14101) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.

[1/2] [chromium] › e2e-journey.spec.ts:102:1 › survey journey
[2/2] [chromium] › smoke.spec.ts:3:1 › title boots
  Slow test file: [chromium] › e2e-journey.spec.ts (1.6m)
  Consider splitting slow test files to speed up parallel execution
  2 passed (1.8m)
```

Gate 8: 2 passed. Exit code 0. Cursor-control codes from the Playwright reporter were removed in this paste. The test names, the slow-file note, and `2 passed (1.8m)` are the reporter's text.

## Manual check 9 — keyboard survey via Playwright

Performed. `tests/e2e-journey.spec.ts` drives keyboard input against `http://127.0.0.1:5193/?e2e=1`. What that run covers:

- Title boots to a ready canvas (`tests/smoke.spec.ts` as well).
- New survey, First Resonance r01, walk on Ashfen, a wild battle, a win.
- Grind until Choir Level is at least 24, Resonance is at least 120, the Resonant has ascended, and an Attunement has succeeded.
- Heal at the still pool. Sanctum A, spending a Vigor Tonic when Vigor is under half. Save, reload, continue.
- Walk Ashfen to Saltspan, meet the rival, then reach Duskstair.

What it does not cover, and what I did not play by hand: Sanctums B, C, D, E, F, G, and H, and the Prime Voice. I did not spend 30 minutes in a full survey. Calling that a finished climb would be false.

The harness also speeds the level curve (grant ×80, Resonance bonus 40). A normal `npm run dev` session uses the unscaled curve, so the same climb takes longer for a person at the keyboard.

## Manual check 10 — atlas.png

Performed. `node tools/render-sheet.mjs` wrote `atlas.png` and printed:

```
r01 Odelember plan=symmetric-mineral texture=banded facets=7 spines=6 limbs=6 symmetry=6 palette=hsl(258 67% 28%) hsl(276 61% 38%) hsl(294 57% 48%) hsl(312 60% 58%) hsl(330 51% 68%)
r28 Kaloruflare plan=symmetric-mineral texture=porous facets=7 spines=6 limbs=3 symmetry=3 palette=hsl(2 75% 28%) hsl(20 49% 38%) hsl(38 72% 48%) hsl(56 58% 58%) hsl(74 70% 68%)
r40 Gravulmbolt plan=symmetric-mineral texture=facet facets=8 spines=3 limbs=3 symmetry=2 palette=hsl(265 60% 28%) hsl(283 55% 38%) hsl(301 74% 48%) hsl(319 60% 58%) hsl(337 51% 68%)
render-sheet ok atlas.png
```

I opened `atlas.png`. Twelve columns. The Resonant cells are flat geometric icons on black: radial wedges, dotted discs, orbiting dots, spirals, square lattices, stacked tiers, blooms, cones, hourglasses, and a few crosses. The row after the Resonants is dark speckled squares, close to one another in value. The last row is regular polygons (triangle through hexagon) with a light stroke. I see no faces and no borrowed mascot silhouette.

Three cells, using dex order, twelve per row:

- r01 Odelember is the first cell: a violet-pink six-fold wedge burst. The log calls it banded symmetric-mineral with symmetry 6. On the sheet it reads as a starburst.
- r28 Kaloruflare is row 3, column 4: a warm three-fold shape that reads as a small bow. Same plan family, porous, symmetry 3.
- r40 Gravulmbolt is row 4, column 4: a violet two-fold shape that reads as an hourglass. Same plan family, facet, symmetry 2.

What looks wrong: those three seeds all rolled `symmetric-mineral`, so this look does not prove the other eleven plans. Across the grid, neighbors often share a silhouette and differ by hue. The biome squares are hard to tell apart. The crests are plain polygons. The sheet is a single frame, so nothing on it shows how a Resonant moves in a Phrase.

`atlas.png` is gitignored. It is generated, not a shipped binary asset.
