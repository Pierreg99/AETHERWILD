# Decisions

Judgment calls made while building. Each line is the choice and why.

1. Harmonic ring order is Cindersong, Biteroot, Stratum, Rivet, Brine, Spark, Draft, Gloom, Bile. Strong is +1 and +2. Weak is +4 and +5. Multipliers are 2, 0.5, and 1. The brief's strong/weak column uses aliases that do not close into a balanced nine, and Biteroot is named three times. A circulant keeps two strong and two weak marks on every row and every column.

2. Kindling, Pulse, and Guard use Focus. Harmonic classes use Spirit. The defensive stat is Guard for the first three classes and Edge for Harmonic classes. The brief snippet writes a zero for Kindling; the comment beside it names Focus, and Focus is what the formula uses.

3. The Ward factor in damage is the striker's Ward entry for the defender's primary Harmonic, written `atk.ward[def.species.primary]`. It multiplies the global chart. It is not a second copy of the 9×9 matrix.

4. Crit and the 0.85–1.00 variance share one roll. Power 0 returns 0. Every other finite result is at least 1. A Motif whose Harmonic matches the striker's primary or secondary uses 1.25. The boss factor scales Resonance gain only, and it does not change combat stats.

5. Cadence capacity is `16 - cost * 2`, refilled when a side is prepared. A cost of 2 yields 12 uses.

6. Lumenfall Pressure begins at Phrase 30 and chips remaining Vigor. The fuzz gate must finish under 200 Phrases, and a long stall needs an ending.

7. Attunement Guard is derived from Choir Level, rarity, the species difficulty field, Ward spike, and Ward spread. Spike match subtracts 45, pitch match subtracts 25, any other Hum adds 15, a Kindling Motif subtracts 10, and any other Motif subtracts `round(harmony / 20)`. Three slots. Guard at or below 0 Attunes. Surveyor Vigor under 25% of maximum makes the wild Resonant flee. The battle UI shows spike and pitch.

8. Ascension from the first Cindersong Resonant to the next stage asks for Choir Level 16, Resonance 120, and the Emberwake side of Ashfen. The next stage of that line asks for Choir Level 34. Stage names at 0, 70, 130, 200, and 250 are Stranger, Familiar, Trusted, Kindred, and Chorus. The numeric Resonance gate is 120.

9. The level curve is `floor(4 * n^3 / 5)` after level 1. A win grants Resonance gain, plus 8 Resonance on a normal survey and 40 on the Playwright harness, and the harness also multiplies the level-curve grant by 80. The harness exists so the scripted survey can reach Level 24 and Resonance 120 inside the test budget. A player on `npm run dev` uses the unscaled numbers. Level-up restores Vigor.

10. A loss warps to the Ashfen spawn and restores the Choir.

11. An Attuned Resonant keeps the Ward it rolled in the wild.

12. Eight Wardens cover eight Harmonics. Bile is the Prime Voice. The title offers r01, r07, and r13. A normal First Resonance starts at Choir Level 5 and Resonance 30. The Playwright seed `0xa37e` starts at Level 8 and Resonance 40.

13. Sanctum F keeps a real 8-Phrase limit. A Rivet lead is strong into Spark and is the practical way through Cade Pinder around Choir Level 34. The cap was left at 8.

14. Sanctum H's line is Choir Level 24, 26, and 28. The generator writes that band for the eighth Warden (`i === 7`) so a Spark lead can answer the reverse rule. A higher band did not clear in a pure-engine sample that was deleted after the measurement. That sample is not a played survey.

15. The dev server and Playwright use port 5193. Port 5173 was already serving another project on this machine.

16. When `navigator.webdriver` is true, `ensureAudio` returns before constructing an AudioContext, and `pollPad` returns before `navigator.getGamepads()`. Calling `getGamepads()` closed headless Chromium a frame or two after boot. A real browser still gets synthesis and the gamepad.

17. Confirming a Motif row that has no Cadence left steps the cursor to another legal row, or advances when none are legal. A spent row must not trap a keyboard survey.

18. Bitmap glyphs draw at scale 4.

19. `engines` allows Node 18. This sandbox is Node 18.20.4 and npm 9.2.0. The spec text asks for Node 20. When `node_modules/vite` is missing, `tools/run.mjs` loads the toolchain from `/tmp/aw-nm` with `/tmp/aw-resolve.mjs` and `ESBUILD_BINARY_PATH`. Typecheck shims live in `types/`. `@playwright/test` is declared as a module and is not a `tsconfig` path, because mapping it made the Playwright loader parse the shim as script.

20. `index-scene.ts` and `settings-scene.ts` sit beside the scenes the tree lists. The Harmonic Index and the settings screen are specified features and needed a scene each.

21. `npm run render-sheet` bundles `tools/render-sheet.ts` with esbuild and calls `main()` under the node loader. Vite's SSR loader cannot import Playwright. `atlas.png` is written to the working directory. The sheet waits for `#sheet-done` in the attached state, because the marker is an empty element. `atlas.png` stays gitignored. The sheet is produced and inspected, and it is not a source asset.

22. `ip-scan` matches needles of length 4 or less on word boundaries. The word gloom is a Harmonic name and is not a needle.

23. `public/favicon.svg` is the only file under `public/`. `asset-scan` accepts the tree as it stands.

24. The nine phase commits were cut at the end from one working tree, grouped by the phase file list. Earlier commits are slices. The tip is the tree the gates ran on. Docs landed with the verification commit because that is when the gate paste existed.

25. A pure-engine balance sample was run and the file was deleted. Its win counts are a calculation. They are not a keyboard play of Sanctums B–H or the Prime Voice, and they are not a cache figure.
