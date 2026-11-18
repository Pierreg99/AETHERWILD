# AETHERWILD — Build Specification & Master Prompt for Grok 4.7

**What this file is:** one copy-paste prompt that instructs Grok 4.7 to autonomously build a complete, playable, commercially-safe creature-collection RPG.

**Why it's shaped this way:** Grok 4.7 has a 500k context window and ships as the default model in **Grok Build** (xAI's terminal coding agent). It is built for long-horizon agentic coding and self-verification. So this is written as an *engineering task spec* — phased, gated, and self-verifying — not a chat request. A vague creative brief handed to a 500k-context model produces 40 half-finished files; a gated spec produces a shipped game.

---

## How to use this

**Option A — Grok Build (recommended).** Init an empty repo, drop this prompt in as `BRIEF.md`, point Grok Build at the folder, run with `reasoning_effort: xhigh`. Let it work through the phases. It commits per phase, so you can stop and resume at any point.

**Option B — API / Cursor.** Paste the prompt block below verbatim as the system prompt, then send `"Execute Phase 0."` as the first user turn. After each phase report, send `"Proceed to Phase N."`.

**Option C — grok.com chat.** Works, but weak. Phase 8+ (renderer, audio) needs a real filesystem. If you're in chat, start at Appendix A (the condensed brief) and accept you'll have to paste code back and forth.

**Non-negotiable instruction to the model** (already inside the prompt, restated here so you don't remove it):

> **Do not ask clarifying questions. Make a reasonable decision, implement it, and log it in `DECISIONS.md`.** You are expected to work unattended for hours. Stalling for approval is failure.

---

## THE PROMPT

Copy everything between the `BEGIN COPY` and `END COPY` markers.

<!-- ==================== BEGIN COPY ==================== -->

~~~markdown
# TASK: Build AETHERWILD — a complete, playable, copyright-free creature-collection RPG

You are the lead engineer, designer, and QA analyst for this project. You will work
autonomously and unattended until the game is finished and every gate passes.
You have a 500k context window and a long runtime budget. Use it.

**Do not ask clarifying questions.** Make a reasonable decision, implement it, and log
it in `DECISIONS.md` with a one-line rationale. Stalling for approval is failure.
If a requirement is genuinely ambiguous, pick the option that best serves the player,
note it, and move on.

---

## 0. MISSION

Build a complete, polished, browser-playable creature-collection RPG in the spirit of the
genre — overworld exploration, wild encounters, turn-based elemental combat, collecting
and bonding with creatures, progression, a league structure — that is **legally clean from
first line to last.**

You will build the game the player *expects* — it should be fun, deep, and complete — using
a fully original world, original creature designs, original terminology, original
mechanics, and procedurally generated art and audio.

"Copyright-free" is not a disclaimer you append at the end. It is a hard architectural
constraint that shapes every decision you make. If you cannot build a feature without
borrowing protected material, you build a *different* feature that delivers the same player
experience.

---

## 1. THE IP BIBLE (read this before writing any code)

### 1.1 World

The **Lumenfall** was a star that died above the world of **Aetherwild**, raining down
crystallized light for a thousand years. Where its shards struck the soil, living things
grew out of stored light. These beings are called **Resonants**.

The Lumenfall is now fracturing. The **Harmonic Index** — the fundamental record of every
Resonant's nature — is tearing. Resonants are going silent. The world is losing its song.

You are an **Attunement Surveyor**. You walk the wild zones, attune to Resonants, record
them in your Index, and climb the **Choir** — a chain of eight Sanctums, each guarded by a
Warden who has mastered one Harmonic.

**The antagonist is the Conductor** — someone who believes the only way to stop the
fracture is to silence every Resonant forever. Silence the world to save it. This is a
plausible, sympathetic wrong position, not a moustache.

### 1.2 Terminology map — use these words, never the genre's usual ones

| Concept | THIS PROJECT | Never use |
|---|---|---|
| Creature | **Resonant** | "Pokemon", "monster", "creature-mon" |
| Elemental type | **Harmonic** | "type", "element", "Fire/Water/Grass..." |
| Attack / move | **Motif** | "move", "attack" (as the noun) |
| Energy / PP | **Cadence** | "PP", "energy points" |
| Party | **Choir** (max 6) | "team", "party" |
| Capture | **Attunement** | "catching", "capture a Pokemon" |
| Capture device | **Censer** | "Poke Ball", "ball" |
| Pokedex | **Harmonic Index** | "Pokedex", "dex" |
| Evolution | **Ascension** | "evolve", "evolution" |
| Bond / friendship | **Resonance** (0–255) | "friendship", "happiness" |
| Gym | **Sanctum** | "gym" |
| Gym leader | **Warden** | "gym leader" |
| Elite challenge | **The Chorus** | "Elite Four" |
| Champion | **Prime Voice** | "Champion" |
| Battle turn | **Phrase** | "turn", "round" |
| PC box | **Resonance Vault** | "PC", "box" |
| Items | **Tokens** | "items" |
| Shiny variant | **Prismatic** | "shiny" |
| Starter | **First Resonance** | "starter" |
| EXP | **Resonance gain** | "EXP", "experience points" |
| Day/night | **Waxing / Waning of the Lumenfall** | "day/night cycle" |
| Battle stats | **Vigor, Focus, Guard, Spirit, Edge, Tempo** | HP/ATK/DEF/SpA/SpD/SPE |
| Status (sleep) | **Dimmed** | "asleep" |
| Status (paralysis) | **Riven** | "paralyzed" |
| Status (poison) | **Brambled** | "poisoned" |
| Status (burn) | **Scorched** | "burned" |

### 1.3 The nine Harmonics

Nine elements, not eighteen. Each Resonant has a **primary Harmonic** and a **secondary
Harmonic** (the secondary may be `—`).

| # | Harmonic | Theme | Strong vs | Weak vs |
|---|----------|-------|-----------|---------|
| 1 | **Cindersong** | Fire, heat, destruction | Biterroot, Husk | Tide, Murmur |
| 2 | **Brine** | Water, ice, flow | Cindersong, Scorch | Solace, Lattice |
| 3 | **Stratum** | Earth, stone, structure | Spark, Filament | Biterroot, Sprout |
| 4 | **Draft** | Air, wind, motion | Stratum, Husk | Rivet, Solace |
| 5 | **Gloom** | Shadow, void, silence | Spirit, Lumen | Solace, Halo |
| 6 | **Biteroot** | Plant, growth, decay | Tide, Murmur | Cindersong, Rivet |
| 7 | **Rivet** | Metal, machine, force | Biteroot, Sprout | Stratum, Lattice |
| 8 | **Spark** | Lightning, energy | Brine, Murmur | Stratum, Fossil |
| 9 | **Bile** | Poison, toxin, corrosion | Biteroot, Rivet | Stratum, Husk |

Every Harmonic has exactly 2 strong-against and 2 weak-against entries. This must be
validated programmatically — a 9×9 matrix where any column or row is unbalanced is a bug.

Implement as an explicit `Harmonic → { strong: Harmonic[], weak: Harmonic[] }` map, then
derive the full matrix. Do not hand-type a 9×9 grid; generate it.

### 1.4 Ward — the per-creature twist

On top of the global chart, every Resonant has a **Ward**: a value from `0.0` to `1.5` for
each of the 9 Harmonics. `ward[h]` is the damage multiplier this Resonant takes from
Harmonic `h`.

This is the design's core differentiator: a Stratum Resonant might ward `1.4` against Spark
(crushing) but `1.2` against Cindersong (heat-shattering rock). The same species fights
differently depending on its individual Ward spread. Ward is also **inherited from parents
with ±0.1 jitter**, which makes bred/ascended Resonants distinct individuals.

**Ward is the answer to the obvious counter-argument** ("so it's just Pokémon with
different words"). It is a real mechanical addition, not a reskin.

### 1.5 Attunement — replacing the capture mechanic

There is **no throw-and-RNG ball mechanic.** Attunement is a deliberate, turn-based
sub-sequence and it is the most important system to get right.

**Procedure:**
1. Enter an Attunement with a wild Resonant. A **Guard** value (0–255) is shown. It is
   derived from the Resonant's level, rarity, and Ward profile — do not use a fixed curve.
2. You have **3 Hum slots**. Each turn you pick a **Hum** from your available pitches and a
   Motif to play simultaneously.
3. A Hum is one of: **Low / Mid / High** (a pitch), or the **wild Harmonic name**.
4. **Resolution:**
   - Hum matches the Resonant's **dominant Ward spike** (its highest-ward Harmonic is
     Cindersong → hum **Cindersong**) → **−45 Guard**
   - Hum is the correct **pitch class** (Low/Mid/High per the Resonant's resonance
     profile) → **−25 Guard**
   - Hum is wrong → **+15 Guard** (it recoils)
   - Playing a **Kindling-class Motif** (see §1.6) → **−10 Guard** regardless
   - Your Resonant is at low Vigor (< 25% max) → Attunement is **impossible**; the wild
     Resonant flees
5. If **Guard ≤ 0**, the Resonant attunes. It is yours, and it arrives at **Resonance 70**
   ("Familiar") regardless of how you got there.
6. If Guard survives 3 slots, the Resonant flees.

Make this *feel* good: audio pitch per Hum, a Ward ring that visibly cracks as Guard drops,
and a distinct emotional beat on success. This is the moment the player will screenshot.

**Never** make Attunement a flat percentage roll.

### 1.6 Motifs

A **Motif** has: name, Harmonic, class, power, accuracy, Cadence cost, effect, and a
0–100 **Harmony** value (how much it lowers Guard when played during Attunement).

**Classes:**
- `Kindling` — low power, high Harmony (30–55). The Attunement tools. 12 of these.
- `Pulse` — the special-mover class. Status, multi-hit, drain, recoil, stat change. 18 total.
- `Guard` — defensive. Raises Guard, wards, blocks. 14 total.
- **Harmonic classes** — Cindersong, Brine, Stratum, Draft, Gloom, Biteroot, Rivet, Spark,
  Bile. 76 total, ~8–9 per Harmonic.

**Target: 120 Motifs total.**

### 1.7 Ascension — replacing evolution

**Ascension is driven by play, not by level alone.** Each Resonant line has 1–2 Ascension
stages. A stage requires **all** of:

1. Choir Level threshold (stage 1: **16**, stage 2: **34**)
2. **Resonance ≥ 120** ("Kindred")
3. A **stage condition** — one of:
   - `motif_category` — ≥ 5 uses of a specific Motif class
   - `harmonic_affinity` — won ≥ 8 battles while primary Harmonic was `X`
   - `biome` — reached Choir Level threshold while inside biome `X`
   - `bond_peak` — reached Resonance ≥ 200 at least once
   - `no_faint` — reached the level threshold without ever fainting this Resonant

Implement as a declarative `AscensionRule` union type. The engine evaluates all rules and
exposes `evaluateAscension(state): AscensionResult` — pure, testable, no side effects.

**Nine First Resonance lines** (the starter families) each have 3 stages. **51 other
Resonants** are single-stage. **Total Index entries: 78.**

### 1.8 Stats

Six stats, no HP-in-the-battle-spirit confusion:

| Stat | Internal | Role |
|------|----------|------|
| **Vigor** | `vigor` | HP pool |
| **Focus** | `focus` | Physical damage |
| **Guard** | `guard` | Physical mitigation |
| **Spirit** | `spirit` | Harmonic damage |
| **Edge** | `edge` | Harmonic mitigation |
| **Tempo** | `tempo` | Phrase order (higher moves first) |

Base stat total per Resonant: **290–620** by rarity tier (`common`, `uncommon`, `rare`,
`mythic`).

### 1.9 Naming — generate, don't copy

Every Resonant name is an **original compound** built from a strict phonotactic spec:

- Syllable banks: `BRIN, TAL, MOR, VESH, KAL, ORU, DRAY, LUM, SEV, NIXA, PELL, GRAV, TIND,
  OSK, WYN, HOLLOW-ish: ULM, ZEPH, MYRR, QUIN, SABLE-ish: KARU, SOLM, VIRE, ODEL, NYX, THUR`
- Suffixes by harmonic: Cindersong `‑ember, ‑flare, ‑coal` · Brine `‑tide, ‑melt, ‑drown` ·
  Stratum `‑stone, ‑crag, ‑slab` · Draft `‑wing, ‑gust, ‑veil` · Gloom `‑shade, ‑hollow, ‑dusk` ·
  Biteroot `‑thorn, ‑bloom, ‑frond` · Rivet `‑bolt, ‑rivet, ‑anvil` · Spark `‑arc, ‑flick, ‑charge` ·
  Bile `‑spore, ‑venom, ‑blight`
- **Hard rules:** 2–3 syllables; no real-world person's name; no dictionary word longer than
  4 letters as a syllable; the resulting string must not appear in `tools/ip-blocklist.txt`
  (case-insensitive substring match).

Provide the generator. Use it. Do not hand-name 78 creatures by vibes — hand-named lists
drift into the blocklist, and `npm run ip-scan` will catch it. Names generated by a script
with a blocklist filter are structurally safe.

Run a name-collision check across all 78 and guarantee uniqueness. Also note in the README
that the title is a placeholder pending a trademark search, and add an
`npm run name-check` script that flags obvious conflicts.

---

## 2. HARD CONSTRAINTS

### 2.1 Copyright and IP (non-negotiable, machine-enforced)

1. **Zero third-party assets.** No `.png` `.jpg` `.svg` `.mp3` `.wav` `.ogg` `.mp3` `.ttf`
   `.otf` `.woff` in the source tree. All art is drawn at runtime on Canvas. All audio is
   synthesized at runtime with the Web Audio API.
2. **No Pokédex.** Do not use the word in any form, in code, comments, or strings.
3. **No borrowed silhouettes.** No yellow electric-mouse-creature, no quadrupedal
   fire-lizard, no blue water-turtle, no green plant-vine-dinosaur, no purple psychic
   hand-fox, etc. If a design drifts toward a recognisable famous creature, redesign it.
   Deliberately choose body plans that are **not** the obvious mammal/lizard/turtle/bird
   set: go for crystalline constructs, colonial organisms, geomorphic forms, filament
   colonies, tidal abstractions, symmetric mineral bodies.
4. **No borrowed terminology.** The map in §1.2 is binding.
5. **No borrowed mechanics-as-formula.** Attunement (§1.5), Ward (§1.4), and Ascension
   (§1.7) must be *implemented as specified above*, not as renamed copies of the
   genre-standard systems. If you catch yourself writing `catchRate = f(hp, status)`, stop.
6. **Procedural art descriptors are seeded**, so the art is deterministic and auditable.

Enforce all of the above with `npm run ip-scan` (§6, Gate 7). It is a hard CI gate.

### 2.2 Stack — do not substitute

- **TypeScript 5.x**, `strict: true`. No `any` without an explicit `// eslint-disable` and
  a reason.
- **Vite 5+** for dev/build. No webpack, no Next.js, no Remix.
- **HTML5 Canvas 2D** for rendering. **No Phaser, no PixiJS, no game framework.** You are
  writing the engine.
- **Vitest** for unit tests. **Playwright** for the headless smoke test.
- **Node 20+.** ESM throughout (`"type": "module"`).
- **No runtime dependencies** beyond `vite`, `vitest`, `@playwright/test`, `typescript`.
  Adding a dep for art, audio, physics, or state is a failure — write it.
- **No network calls at runtime.** Fully offline after first load. No analytics, no CDN,
  no font fetch, no telemetry.
- **No backend, no auth, no multiplayer, no monetization, no accounts.**

### 2.3 Scope discipline — YAGNI

Build what is specified. Do **not** add: multiplayer, trading, breeding (Ward inheritance
seeds it, that's enough), a second game mode, achievements, a level editor, mod support
beyond "data is data", or any "while we're here" refactor.

Exception: `DECISIONS.md` may propose future work. Propose, don't build.

---

## 3. ARCHITECTURE

### 3.1 The one rule

**The battle engine is pure.** It imports nothing from `render/`, `audio/`, `game/`, or the
DOM. It takes a `BattleState` and a command, returns a new `BattleState` plus events. This
is what makes the 10,000-battle fuzz test possible, and it is the highest-leverage decision
in this project. Do not compromise it.

### 3.2 File tree — create exactly this

```
aetherwild/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── playwright.config.ts
├── index.html
├── README.md
├── BRIEF.md                     # copy of this prompt
├── PROGRESS.md                  # living status, updated every phase
├── DECISIONS.md                 # every judgment call + rationale
├── LICENSE                      # MIT
├── .gitignore
├── src/
│   ├── engine/                  # PURE. No DOM, no I/O, no imports outside engine/
│   │   ├── types.ts             # all domain types
│   │   ├── rng.ts               # seeded PRNG (mulberry32) + helpers
│   │   ├── harmonics.ts         # the 9 Harmonics + derived matrix
│   │   ├── ward.ts              # ward generation + inheritance w/ jitter
│   │   ├── stats.ts             # stat computation, level curve
│   │   ├── damage.ts            # damage formula
│   │   ├── status.ts            # status effects + ticking
│   │   ├── battle.ts            # the state machine
│   │   ├── attunement.ts        # §1.5
│   │   ├── ascension.ts         # §1.7
│   │   ├── experience.ts        # resonance gain curve
│   │   ├── learnset.ts           # motif learning
│   │   ├── ai.ts                # wild + Warden AI
│   │   └── __tests__/           # *.test.ts co-located
│   ├── data/                    # PURE data modules, no logic
│   │   ├── harmonics.ts
│   │   ├── motifs.ts            # 120
│   │   ├── resonants.ts         # 78 Index entries
│   │   ├── wardenNames.ts
│   │   ├── zones.ts             # 9 biomes + transitions
│   │   ├── npcs.ts
│   │   ├── dialogue.ts
│   │   ├── story.ts
│   │   └── strings.ts           # i18n string table
│   ├── render/
│   │   ├── palette.ts
│   │   ├── creature-art.ts      # seeded procedural renderer
│   │   ├── contact-sheet.ts     # dev tool, renders all 78
│   │   ├── tileset.ts           # seeded procedural tiles
│   │   ├── overworld.ts
│   │   ├── battle-scene.ts
│   │   └── ui/
│   │       ├── text.ts          # wrapping, portraits, speed control
│   │       ├── dialogue-box.ts
│   │       ├── party-panel.ts
│   │       ├── harmonic-index.ts
│   │       ├── attunement-ring.ts
│   │       ├── main-menu.ts
│   │       ├── settings.ts
│   │       └── toast.ts
│   ├── audio/
│   │   ├── synth.ts             # Web Audio graph
│   │   ├── music.ts             # procedural score
│   │   └── sfx.ts
│   ├── game/
│   │   ├── state.ts             # global state + reducers
│   │   ├── save.ts              # versioned localStorage
│   │   ├── input.ts             # keyboard + gamepad
│   │   ├── rng-world.ts         # world seed plumbing
│   │   └── scenes/
│   │       ├── title-scene.ts
│   │       ├── overworld-scene.ts
│   │       ├── battle-scene.ts
│   │       ├── attune-scene.ts
│   │       ├── sanctum-scene.ts
│   │       ├── vault-scene.ts   # Resonance Vault (PC)
│   │       ├── shop-scene.ts
│   │       └── choir-scene.ts   # the 8-Warden league run
│   ├── generator/
│   │   └── names.ts             # §1.9 phonotactic generator
│   └── main.ts
├── tools/
│   ├── ip-blocklist.txt
│   ├── ip-scan.mjs
│   ├── validate-content.ts
│   ├── name-check.ts
│   ├── fuzz-battle.ts
│   ├── render-sheet.ts
│   └── asset-scan.ts
├── tests/
│   ├── smoke.spec.ts            # Playwright
│   └── e2e-journey.spec.ts
└── public/                      # EMPTY except favicon.svg
```

### 3.3 Core types

```ts
export type Harmonic =
  | 'Cindersong' | 'Brine' | 'Stratum' | 'Draft' | 'Gloom'
  | 'Biteroot' | 'Rivet'   | 'Spark'  | 'Bile';

export type HarmonicClass =
  | 'Kindling' | 'Pulse' | 'Guard'
  | 'Cindersong' | 'Brine' | 'Stratum' | 'Draft' | 'Gloom'
  | 'Biteroot' | 'Rivet' | 'Spark' | 'Bile';

export type Ward = Readonly<Record<Harmonic, number>>; // 0.0 – 1.5

export type Stats = Readonly<{
  vigor: number; focus: number; guard: number;
  spirit: number; edge: number;  tempo: number;
}>;

export type ResonanceStage = 'Stranger' | 'Familiar' | 'Trusted' | 'Kindred' | 'Chorus';
// thresholds: 0 / 70 / 130 / 200 / 250

export type MotifEffect =
  | { kind: 'none' }
  | { kind: 'status';    status: StatusId; chance: number }
  | { kind: 'drain';     ratio: number }
  | { kind: 'recoil';    ratio: number }
  | { kind: 'multihit';  min: number; max: number }
  | { kind: 'stat';      target: 'self' | 'foe'; stat: StatId; stages: number }
  | { kind: 'ward';      harmonic: Harmonic; delta: number }
  | { kind: 'heal';      ratio: number };

export interface Motif {
  readonly id: string;
  readonly name: string;
  readonly harmonic: Harmonic;
  readonly cls: HarmonicClass;
  readonly power: number;        // 0 for status
  readonly accuracy: number;     // 0 – 100
  readonly cadenceCost: number;  // 1 – 5
  readonly harmony: number;      // 0 – 100, Attunement potency
  readonly effect: MotifEffect;
  readonly description: string;
}

export type AscensionCondition =
  | { kind: 'motif_category';  cls: HarmonicClass;    uses: number }
  | { kind: 'harmonic_affinity'; harmonic: Harmonic;   wins: number }
  | { kind: 'biome';           biomeId: string }
  | { kind: 'bond_peak';       resonance: number }
  | { kind: 'no_faint' };

export interface AscensionStage {
  readonly to: string;                                  // resultant Resonant id
  readonly minLevel: number;
  readonly minResonance: number;
  readonly condition: AscensionCondition;
}

export interface ResonantSpecies {
  readonly id: string;
  readonly dexNumber: number;          // Index number, 1–78
  readonly name: string;
  readonly primary: Harmonic;
  readonly secondary: Harmonic | null;
  readonly rarity: 'common' | 'uncommon' | 'rare' | 'mythic';
  readonly baseStats: Stats;
  readonly baseWard: Ward;
  readonly catchDifficulty: number;    // 1 – 100, feeds Attunement Guard
  readonly artSeed: number;            // deterministic creature art
  readonly learnset: readonly { level: number; motifId: string }[];
  readonly ascension: readonly AscensionStage[];
  readonly evolvesFrom: string | null;
  readonly flavor: string;             // 1–2 sentences, Index entry
  readonly habitatBiomes: readonly string[];
}

// --- battle state: plain data, serialisable, no class instances, no functions
export interface BattleState {
  readonly seed: number;
  readonly turn: number;
  readonly phase: 'intro' | 'choose-action' | 'resolving' | 'forced-switch'
               | 'attunement' | 'finished';
  readonly player: Fighter;
  readonly foe: Fighter;
  readonly log: readonly BattleEvent[];
  readonly result: 'ongoing' | 'win' | 'loss' | 'fled' | 'caught';
}

export interface Fighter {
  readonly team: readonly ResonantInstance[];  // 1 active + bench
  readonly activeIndex: number;
}

export interface ResonantInstance {
  readonly uid: string;              // stable instance id
  readonly speciesId: string;
  readonly nickname: string | null;
  readonly level: number;
  readonly stats: Stats;
  readonly ward: Ward;               // inherited + jittered
  readonly currentVigor: number;
  readonly cadence: Readonly<Record<string, number>>; // motifId -> remaining
  readonly knownMotifs: readonly string[];
  readonly resonance: number;        // 0 – 255
  readonly status: StatusId | null;
  readonly stages: Readonly<Record<StatId, number>>;   // -6 .. +6
  readonly battleStats: {
    usedMotifCategory: Readonly<Record<HarmonicClass, number>>;
    winsByHarmonic:  Readonly<Partial<Record<Harmonic, number>>>;
    reachedBiomeId:  string | null;
    bondPeak:        number;
    everFainted:     boolean;
  };
  readonly experience: number;
}
```

### 3.4 Damage formula — implement exactly

```ts
export function computeDamage(
  atk: ResonantInstance, def: ResonantInstance,
  motif: Motif, roll: number, // 0..1, from the injected RNG
): number {
  if (motif.power === 0) return 0;

  const atkStat = motif.cls === 'Kindling' ? 0 : isHarmonicClass(motif.cls) ? 'spirit' : 'focus';
  // Kindling/Pulse/Guard resolve against `focus`; harmonic classes against `spirit`.

  const defStat = isHarmonicClass(motif.cls) ? 'edge' : 'guard';

  const base   = Math.floor(((2 * atk.level) / 5 + 2) * motif.power * atk.stats[atkStat] / def.stats[defStat]) / 50 + 2;

  const stab   = motif.harmonic === atk.species.primary || motif.harmonic === atk.species.secondary ? 1.25 : 1.0;
  const ward   = atk.ward[def.species.primary];                        // see note below
  const global = globalMultiplier(motif.harmonic, def.species.primary); // §1.3 matrix, or 1.0 if secondary
  const stages = stageMultiplier(atk.stages[atkStat] - def.stages[defStat]);
  const mood   = statusMultiplier(atk.status);                          // 0.75 if Scorched/Brambled
  const crit   = roll < 0.0625 ? 1.5 : 1.0;
  const vary   = 0.85 + roll * 0.15;

  return Math.max(1, Math.floor(base * stab * ward * global * stages * mood * crit * vary));
}
```

**Ward note — read carefully.** `ward` in the formula is the *attacker's* Ward value for
the defender's **primary** Harmonic, because Ward represents an individual's inherent
vulnerability *to* things that resonate with it. So a Resonant with `ward.Cindersong = 1.4`
takes 40% extra Cindersong damage. Global chart and Ward **multiply**. State this clearly in
a code comment — it is the single most confusing line in the project.

**Crits** are 1/16, ×1.5. **Variation** is uniform 0.85–1.00. **Minimum damage is 1**,
always — never 0, so battles always terminate.

### 3.5 Battle loop

- **Phrase order** is by `tempo` (with stage modifiers), descending. Ties broken by
  `rng.next()` — pass the RNG in, never use `Math.random()`.
- Player picks Motif + target (self/foe/bench as the effect requires).
- Both sides resolve in order. Effects apply after the acting Resonant's move, before the
  other acts.
- **Statuses tick at end of Phrase.** `Scorched` / `Brambled`: maxVigor/16. `Dimmed`: 1–3
  Phrases. `Riven`: 25% skip.
- **Faint** → forced switch, or loss at Choir size 0.
- **Hard turn cap of 200 Phrases.** If reached, the Resonant with higher current Vigor
  fraction wins. This is a safety net, not a game mechanic — the fuzz test must never hit
  it, and if it does, that is a bug to report.

**Cadence** = PP. A Resonant at 0 Cadence for a chosen Motif cannot use it; the UI must
grey it out and the engine must reject it with a typed error, not silently substitute.

### 3.6 Experience

`gain = floor(6 * enemyLevel^2 / 7 * rarityFactor * bossMultiplier)`

`rarityFactor`: common 1.0 · uncommon 1.15 · rare 1.3 · mythic 1.5
Level cap **50**. `experienceForLevel(n)` must be pure and table-testable.

### 3.7 Save format

- `localStorage`, key `aetherwild.save.v1`
- Explicit `SAVE_VERSION`. Migrations are a `Record<number, (s: Save) => Save>` map; unknown
  future versions load read-only with a warning instead of crashing.
- Export/Import to base64 JSON string (a shareable seed + state for bug reports).
- Autosave on: zone transition, Sanctum clear, battle end, Resonance Vault exit.
- **Never lose a save to a crash.** Wrap load in try/catch; on parse failure, offer to start
  new *without* destroying the corrupt blob.

---

## 4. RENDERING — procedural, no asset files

### 4.1 Creature art

Each Resonant has an `artSeed`. `renderResonant(ctx, species, x, y, scale, opts)` is
**deterministic**: same seed + same size = same pixels, every time, forever.

Build a **descriptor** from the seed, then draw it:
1. Hash the seed with mulberry32 → pick a **body plan** from a hardcoded set of at least
   **12 templates**: `crystalline`, `colonial`, `geomorphic`, `filament`, `tidal`,
   `symmetric-mineral`, `laminar`, `porous`, `coiled`, `orbiting`, `lattice`, `bloom`.
   **The 12 templates are the IP firewall.** Read §2.1.3 — the whole point is that the
   silhouette space is not mammal/lizard/turtle/bird.
2. Derive: facet count, spine count, limb count, symmetry, texture (facet / smooth / banded
   / porous / fibrous), and a **3–5 colour palette** harmonised by HSL distance rules.
3. Draw: base silhouette → structural elements → texture overlay → core glow → outline.
4. Animated layers (drift, pulse, spin) are driven by a **time** parameter that is separate
   from `artSeed`, so art is deterministic but motion is not.

Also emit an `Emblem`: a small glyph derived from the same seed, used in party rows,
the Index, and the Vault. One seed, two consistent representations.

### 4.2 Rendering requirements

- **Target 60fps.** Fixed-timestep simulation (accumulator, 60Hz logic) decoupled from
  render. Never step logic per frame.
- **Pixel-perfect** integer scaling. Internal resolution 480×360, integer scale to fit.
- **Tilemap** 16px tiles, procedurally drawn into an offscreen canvas once per biome and
  cached. Do not redraw tiles per frame.
- **Culling** — only draw entities in the viewport.
- **Asset scan**: `npm run asset-scan` fails if any binary asset appears in `src/`.
- **Contact sheet**: `npm run render-sheet` writes `atlas.png` (78 Resonants + 9 Sanctum
  crests + 9 biome tilesets) so you can *look* at the art and fix it. Do this in Phase 5 and
  actually inspect the output.

### 4.3 Accessibility (WCAG 2.1 AA)

- Full **keyboard** play. Full **gamepad** play (standard mapping). Rebindable.
- Text speed, instant-to-full toggle, and a **battle log always visible** option.
- Never encode information by colour alone — always pair with shape, icon, or text.
- Minimum 4.5:1 contrast for all UI text. Type scale ≥ 16px at 1× internal res, with the
  internal resolution large enough that it renders ≥ 14 CSS px.
- Screen-reader-accessible live region announcing Phrase results and status changes.
- Reduced-motion setting honoured for all screen shake and flashing.
- Text is rendered from a **procedural bitmap font** you generate in code (a 5×7 glyph
  atlas built at boot from a compact encoded string). No font files. This is a hard
  constraint, not a preference.

---

## 5. CONTENT TARGETS

| Content | Count | Notes |
|---|---|---|
| Harmonics | 9 | §1.3, matrix validated |
| Motifs | 120 | §1.6 — 12 Kindling, 18 Pulse, 14 Guard, 76 harmonic |
| Resonants | **78** Index entries | 9 three-stage lines (27) + 51 single-stage |
| Ascensions | 18 | 9 lines × 2 stages |
| Ward profiles | 78 | each individually interesting |
| Biomes | 9 + 2 transitions | one per Harmonic |
| Zones | 3 explorable regions | each spanning 2–3 biomes |
| NPCs | 40+ | named, with real dialogue |
| Wardens | 8 | one per Harmonic, distinct personalities + signature Motifs |
| Prime Voice | 1 | final boss |
| Rival | 1 | recurring, ascends alongside you |
| First Resonances | 9 | starter families, 3 offered at start |
| Sanctum puzzles | 8 | **mechanically varied** — see below |
| Tokens (items) | 30 | healing, ward-modifying, cadence-restoring, key items |
| Resonant Index | 78 entries | flavor + stats + Ward radar + art |

**Sanctum puzzles must not be eight copies of "fight harder."** One distinct mechanic each,
e.g.: type-lock duel · Warden holds two Resonants, you must beat them with one · mandatory
non-Harmonic Motifs only · Warden swaps mid-battle at 50% · a Resonance Vault gauntlet where
your bench is your only HP · speed-race (win in ≤ 8 Phrases) · survive 3 Phrases without
attacking · reverse-battle (your Resonants are weakened, the Warden's are not).

All dialogue through `data/strings.ts` for i18n readiness. Do not hardcode player-visible
strings in scene files.

---

## 6. GATES — every one must pass before you may claim completion

Implement all eight as scripts. Run them. Show the output. Do not summarise from memory —
**paste the real terminal output.** A gate that passes vacuously is worse than one that
fails.

| # | Command | Passes when |
|---|---|---|
| 1 | `npm run typecheck` | `tsc --noEmit` clean, zero errors |
| 2 | `npm test` | all Vitest suites green, ≥ 120 assertions |
| 3 | `npm run validate-content` | zero dangling refs: every `motifId` exists, every `ascension.to` exists, every `evolvesFrom` exists, all 9 Harmonics referenced, all 78 `dexNumber` unique and 1–78, all 9 Harmony-matrix rows balanced (2 strong / 2 weak) |
| 4 | `npm run fuzz-battle` | **10,000** randomised battles across all 78 Resonants, random levels 1–50, random Motifs. Asserts: zero crashes, zero infinite loops, every battle terminates < 200 Phrases, no NaN damage, no negative Vigor, both outcomes occur (> 0 win, > 0 loss), no single Resonant wins > 90% of its matchups |
| 5 | `npm run build` | `vite build` succeeds, `dist/` produced, bundle < 900 KB gzipped |
| 6 | `npm run asset-scan` | zero binary asset files in `src/`; audio is synthesized; no `fetch`/`<img src>` to an external URL |
| 7 | `npm run ip-scan` | zero hits for the §2.1 forbidden terms in **all** tracked files, including comments and commit messages |
| 8 | `npm run e2e` | Playwright: boots, new game, receive First Resonance, walk 3 zones, trigger a wild encounter, win a battle, complete an Attunement, Ascend a Resonant, enter a Sanctum, clear it, save, reload, verify the save restored |

Plus two manual checks you must perform and describe honestly:

9. **Run it.** `npm run dev`, then actually play it via Playwright driving keyboard input:
   title → new game → starter choice → overworld movement → first encounter → first win →
   first Attunement. Describe what you observed. If you did not run it, say so.
10. **Look at the art.** Open `atlas.png` after `npm run render-sheet`. Describe three
    Resonants in detail and name anything that looks wrong, generic, or derivative.

### 6.1 `tools/ip-blocklist.txt`

Populate with, at minimum (lowercase, one per line, plus all obvious additions — the trainer
consensus names, the item names, the region names, the game-title variants, the ball
terminology, the dex terminology, and every species name you can recall):

```
pokemon
pokémon
pikachu
charizard
bulbasaur
squirtle
mewtwo
mewtwo
pokeball
pokéball
poe ball
great ball
ultra ball
pokedex
pokédex
pokedollar
pokeball
nidoran
gengar
munchlax
eevee
umbreon
espeon
blaziken
greninja
lucario
rayquaza
groudon
kyogre
gengar
snorlax
tangela
dratini
machamp
golem
onix
scyther
dragonite
aerodactyl
tyranitar
metagross
alakazam
machoke
gastly
haunter
poliwrath
kabutops
rhydon
ditto
ditto
farfetchd
```

`ip-scan` does a case-insensitive substring match on the whole file tree **and** the git log.
**If a gate is failing because a blocklist entry is itself a substring of a legitimate word,
fix the blocklist (use word boundaries), not the gate.** Do not weaken the check to make it
pass.

---

## 7. PHASE PLAN — execute strictly in order

Do not begin Phase *N+1* until Phase *N*'s gates pass and the phase is committed.

**Phase 0 — Scaffold.** Repo, toolchain, all 8 gate scripts wired into `npm test` /
`npm run verify`, empty content, CI-less local `verify` script. `README.md`, `PROGRESS.md`,
`DECISIONS.md`, `LICENSE`, `.gitignore`. Gates 1, 5, 6, 7 pass on an empty project.
*Commit: `chore: scaffold project and verification gates`*

**Phase 1 — Domain core.** `types.ts`, `rng.ts`, `harmonics.ts` (matrix + validation),
`ward.ts`, `stats.ts`, `damage.ts`, `experience.ts`, `status.ts`.
Tests: matrix balance, RNG determinism (same seed → same sequence, 10k draws), damage
monotonicity, no-NaN property test, ward inheritance jitter bounds.
*Commit: `feat: pure domain core`*

**Phase 2 — Battle engine.** `battle.ts` state machine, `learnset.ts`, forced switches,
status ticking, faint handling, turn cap. Full Vitest coverage of edge cases: both faint
same phrase · status at 0 Cadence · multi-hit kill mid-sequence · bench empty.
*Commit: `feat: turn-based battle state machine`*

**Phase 3 — Attunement + Ascension + AI.** `attunement.ts` (including the 3-slot puzzle
and the low-Vigor flee rule), `ascension.ts` (all 5 condition kinds), `ai.ts` (wild: level
scaled + biome-weighted; Warden: authored opener + difficulty-scaled selection).
*Commit: `feat: attunement, ascension and AI`*

**Phase 4 — Content.** All 78 Resonants, 120 Motifs, 18 Ascensions, 9 biomes, 3 zones, 40+
NPCs, 8 Wardens, 30 Tokens, the rival, the Prime Voice, the full script, and the
`names.ts` generator driving every creature name. `validate-content` must pass with zero
errors. This is the largest phase — if context gets tight, split it, but do not leave it
half-done.
*Commit: `feat: full content set`*

**Phase 5 — Renderer.** `creature-art.ts` (all 12 body-plan templates), `tileset.ts`,
`palette.ts`, `contact-sheet.ts`, procedural bitmap font, `render-sheet` → inspect
`atlas.png` and fix what looks wrong. Visual quality is a gate, not a nice-to-have.
*Commit: `feat: procedural renderer`*

**Phase 6 — Audio.** `synth.ts`, `music.ts` (distinct themes for overworld / battle /
Sanctum / Attunement; layered so it never gets fatiguing), `sfx.ts` (Hum pitches must be
audibly distinct per pitch class).
*Commit: `feat: procedural audio`*

**Phase 7 — Game layer.** `state.ts`, `save.ts` (+ migrations), `input.ts` (keyboard +
gamepad), all 9 scenes, full UI set, settings, toasts, a11y live region, reduced motion.
*Commit: `feat: game layer and scenes`*

**Phase 8 — Verify and polish.** Run all 10 checks. Fix what fails. Then:
`npm run build` · read the bundle size · profile a battle · fix frame drops ·
play-test 30 minutes via Playwright and report honestly on what feels bad ·
write the README (controls, mechanics, Ward, Attunement, Ascension, architecture,
how to extend, licence, and a clear IP-safety statement).
*Commit: `chore: verification pass and documentation`*

### 7.1 Anti-patterns — do not do these

- No `// TODO`, no `throw new Error('not implemented')`, no empty stub functions in
  shipped code. Every listed feature works.
- No `Math.random()` anywhere in `engine/` or `render/` — the injected RNG only.
- No adding a 10th Harmonic without updating the matrix, the validation, and the
  Ward type together.
- No putting a Ward value in a config file and reading it as ground truth — Ward is
  derived from `baseWard` + inheritance jitter, always.
- No placeholder art ("a coloured circle with eyes") that survives to Phase 8.
- No silently swallowing errors to make a gate pass.
- No claiming a gate passed without pasting its real output.
- Do not ask the user anything. Work.

### 7.2 Output contract — after every phase, output exactly:

```
## Phase N — <name> — COMPLETE / IN PROGRESS / BLOCKED

**Files created:**    <path> (<lines>) …
**Files modified:**   <path> …
**Commits:**          <sha> <subject> …

**Gate output (verbatim, no summary):**
$ npm run typecheck
<paste real output>
$ npm test
<paste real output>
$ npm run validate-content
<paste real output>
…every gate you ran…

**Decisions:**  <one line each, or "none">
**Known limitations:**  <honest list, or "none">
**Next:**  <what Phase N+1 will do>
```

If you are BLOCKED, say exactly what is blocking you and what you tried. Do not fake
progress.

---

## 8. DEFINITION OF DONE

The project is done when, and only when:

- [ ] All 8 automated gates pass, with real output pasted
- [ ] Manual checks 9 and 10 were actually performed and honestly reported
- [ ] `npm run dev` plays end-to-end: new game → 3 zones → 8 Sanctums → Prime Voice
- [ ] All 78 Resonants are catchable, ascendable, and reachable
- [ ] All 120 Motifs are obtainable and usable
- [ ] Zero binary assets, zero external network requests, zero ip-scan hits
- [ ] Zero TODOs or stubs
- [ ] `README.md` written with an explicit IP-safety statement
- [ ] All work committed with meaningful messages

**Do not declare completion on partial work.** If a gate fails, fix it. If a phase is
genuinely blocked, report it as blocked. A truthful BLOCKED report is a success; a false
COMPLETE is the worst possible outcome.
~~~

<!-- ==================== END COPY ==================== -->

---

## Appendix A — Condensed 20-line version (for chat interfaces)

If you're pasting into grok.com rather than a coding harness, use this instead. It keeps the
essential constraints and drops the type definitions.

```
Build AETHERWILD: a complete, playable, browser-based creature-collection RPG in
TypeScript + Vite + HTML5 Canvas 2D. Fully original IP — no copyrighted names, designs,
assets, audio, or terminology.

World: light crystallised from a dead star (the Lumenfall) grew into living "Resonants".
You are an Attunement Surveyor recording them before the world's song dies.

Terminology: Resonant (creature), Harmonic (element), Motif (move), Cadence (PP),
Choir (party, max 6), Censer (capture device), Harmonic Index (dex), Ascension (evolution),
Resonance 0-255 (friendship), Sanctum (gym), Warden (leader), Phrase (turn), Token (item),
Prismatic (shiny variant). Never use the genre's usual words.

9 Harmonics (not 18): Cindersong, Brine, Stratum, Draft, Gloom, Biteroot, Rivet, Spark, Bile.
Each is strong vs 2 and weak vs 2. Derive the 9x9 matrix programmatically and validate it.

Per-creature Ward (0.0-1.5 per Harmonic, inherited with ±0.1 jitter) multiplies the global
chart. This is the mechanical differentiator — implement it properly.

Attunement replaces ball-catching: 3 Hum slots (Low/Mid/High pitch or a Harmonic name).
Matching the dominant Ward spike −45 Guard, correct pitch class −25, wrong +15, Kindling
Motif −10. Guard ≤ 0 = caught. Never a flat percentage roll.

Ascension requires level AND Resonance ≥ 120 AND a play-style condition (motif-class usage,
harmonic win count, biome reached, bond peak, or no-faint). 5 condition kinds, declarative,
pure and testable.

78 Resonants (9 three-stage starter lines + 51 single-stage), 120 Motifs, 9 biomes,
3 zones, 8 Sanctums with 8 mechanically distinct puzzles, 40+ NPCs, 30 Tokens.

Art: 100% procedural on Canvas from an artSeed, using at least 12 body-plan templates that
are deliberately NOT mammal/lizard/turtle/bird. Deterministic. Audio: 100% Web Audio
synthesis. Zero asset files. Zero network calls at runtime. Fonts generated in code.

Pure engine (no DOM) + seeded RNG + Vitest + a 10,000-battle fuzz test proving termination
and no NaN. Playwright e2e. Gamepad + keyboard. WCAG 2.1 AA.

Eight hard gates, including `npm run ip-scan` (case-insensitive blocklist scan of the whole
tree AND git log) and `npm run asset-scan` (fails on any binary asset). Wire them into
`npm run verify`.

Work autonomously in 9 phases, committing each. Do not ask questions — decide, implement,
log to DECISIONS.md. Never fake a passing gate: paste real terminal output. A truthful
BLOCKED is a success; a false COMPLETE is the worst outcome.
```

---

## Appendix B — German Kurzfassung

Ein einziger Prompt, der **Grok 4.7** anweist, ein vollständiges, spielbares
Creature-Collection-RPG zu bauen — rechtlich sauber von der ersten bis zur letzten Zeile.

**Kernentscheidungen:**

- **100 % prozedurale Kunst und Audio.** Keine Asset-Dateien existieren, also kann keine
  Urheberrechtsverletzung entstehen. Kein Download, unbegrenzt skalierbar.
- **9 „Harmonics" statt 18 Typen.** Original *und* balancierbar. Die 9×9-Matrix wird
  generiert und validiert, nicht von Hand getippt.
- **„Ward"** — jeder Resonant hat pro Harmonic einen individuellen Schwachstellenwert
  (0,0–1,5), der von den Eltern mit ±0,1 Jitter vererbt wird. Das ist der echte
  mechanische Unterschied, nicht nur neues Vokabular.
- **„Attunement" statt Ball-Wurf.** Drei Hum-Slots, Guard-Abbau durch Raten — kein
  Prozentwurf. Kein nachgerechnetes Pokémon-System.
- **„Ascension" statt Evolution.** Level **und** Bindung ≥ 120 **und** eine
  Spielweise-Bedingung. Fünf deklarative Regelarten, pur und testbar.
- **Reine Engine + Fuzz-Test.** 10.000 zufällige Kämpfe beweisen Terminierung und
  NaN-Freiheit. Die Engine ist der Kern, der Renderer ist Kleinkram.
- **`npm run ip-scan` als hartes CI-Gate.** „Copyright-free" wird *erzwungen*, nicht
  versprochen. Scannt den gesamten Baum **und** die Git-Historie.

**Technik:** TypeScript 5 strict · Vite · Canvas 2D ohne Game-Framework · Vitest ·
Playwright · Web Audio · keine Runtime-Dependencies · offlinefähig · keine Assets.

**Wichtigste Anweisung im Prompt:**

> Stelle keine Rückfragen. Triff eine vernünftige Entscheidung, implementiere sie,
> protokolliere sie in `DECISIONS.md`. Auf Nachfragen warten ist ein Fehlschlag.

Ein wahrer **BLOCKED**-Bericht ist ein Erfolg. Ein falsches **COMPLETE** ist das
schlimmste mögliche Ergebnis.

---

## Appendix C — Tuning knobs

Change these at the top of the prompt before pasting if you want a different shape:

| Knob | Default | Change to… |
|---|---|---|
| Harmonic count | 9 | 6 (simpler) or 12 (deeper, harder to balance) |
| Resonant count | 78 | 40 (shippable fast) or 120+ (long grind) |
| Motif count | 120 | 70 (minimum viable) or 200 (rich) |
| Level cap | 50 | 100 (longer game, needs re-tuned curves) |
| Ward range | 0.0–1.5 | 0.5–2.0 (much swingier battles) |
| Attunement slots | 3 | 2 (brutal) or 5 (forgiving) |
| Team size | 6 | 4 (tighter strategy) or 8 (easier) |
| Biomes / zones | 9 / 3 | 4 / 1 (vertical slice) or 12 / 5 (bigger world) |
| Internal resolution | 480×360 | 320×240 (chunkier retro) or 640×480 (more detail) |
| Fuzz battle count | 10,000 | 100,000 (overnight run, much stronger guarantee) |
| Sanctuary puzzles | 8 distinct | 4 (MVP) or 12 (add depth) |
| Target runtime | browser | add "and a CLI test harness" for headless CI |

**Recommended starting point if you want something finished this week, not this month:**
Harmonics 9 · Resonants 40 · Motifs 70 · 4 biomes · 1 zone · 4 Sanctum puzzles ·
Choir 4 · Fuzz 10,000. Keep every one of the 8 gates — the gates are the project, the
content volume is just content.

---

*Spec written 2026-10-03. No external skill or framework was used to produce this file;
it is a self-contained engineering brief.*
