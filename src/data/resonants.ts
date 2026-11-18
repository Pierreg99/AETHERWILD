import type { ResonantSpecies } from '../engine/types';

export const RESONANTS: readonly ResonantSpecies[] = [
  {
    "id": "r01",
    "dexNumber": 1,
    "name": "Odelember",
    "primary": "Cindersong",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 86,
      "focus": 75,
      "guard": 81,
      "spirit": 73,
      "edge": 80,
      "tempo": 81
    },
    "baseWard": {
      "Cindersong": 1.42,
      "Biteroot": 0.9,
      "Stratum": 0.94,
      "Rivet": 0.42,
      "Brine": 0.78,
      "Spark": 0.88,
      "Draft": 0.89,
      "Gloom": 0.81,
      "Bile": 0.92
    },
    "catchDifficulty": 12,
    "artSeed": 113,
    "learnset": [
      {
        "level": 1,
        "motifId": "h01"
      },
      {
        "level": 1,
        "motifId": "k01"
      },
      {
        "level": 12,
        "motifId": "k05"
      },
      {
        "level": 26,
        "motifId": "h03"
      }
    ],
    "ascension": [
      {
        "to": "r02",
        "minLevel": 16,
        "minResonance": 120,
        "condition": {
          "kind": "biome",
          "biomeId": "emberwake"
        }
      }
    ],
    "evolvesFrom": null,
    "flavor": "A common Cindersong Resonant. Its colonial body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "emberwake",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r02",
    "dexNumber": 2,
    "name": "Ulmtindcoal",
    "primary": "Cindersong",
    "secondary": "Brine",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 62,
      "focus": 85,
      "guard": 111,
      "spirit": 96,
      "edge": 103,
      "tempo": 79
    },
    "baseWard": {
      "Cindersong": 1.3,
      "Biteroot": 1.08,
      "Stratum": 1.01,
      "Rivet": 0.44,
      "Brine": 1.1,
      "Spark": 0.89,
      "Draft": 1.09,
      "Gloom": 0.84,
      "Bile": 1.05
    },
    "catchDifficulty": 30,
    "artSeed": 126,
    "learnset": [
      {
        "level": 1,
        "motifId": "h02"
      },
      {
        "level": 1,
        "motifId": "k01"
      },
      {
        "level": 12,
        "motifId": "k06"
      },
      {
        "level": 26,
        "motifId": "h04"
      }
    ],
    "ascension": [
      {
        "to": "r03",
        "minLevel": 34,
        "minResonance": 120,
        "condition": {
          "kind": "motif_category",
          "cls": "Kindling",
          "uses": 5
        }
      }
    ],
    "evolvesFrom": "r01",
    "flavor": "A uncommon Cindersong Resonant. Its geomorphic body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "emberwake"
    ],
    "pitch": "High"
  },
  {
    "id": "r03",
    "dexNumber": 3,
    "name": "Drayorucoal",
    "primary": "Cindersong",
    "secondary": "Brine",
    "rarity": "rare",
    "baseStats": {
      "vigor": 52,
      "focus": 111,
      "guard": 91,
      "spirit": 83,
      "edge": 93,
      "tempo": 100
    },
    "baseWard": {
      "Cindersong": 1.28,
      "Biteroot": 0.81,
      "Stratum": 1.02,
      "Rivet": 0.54,
      "Brine": 0.81,
      "Spark": 0.94,
      "Draft": 1,
      "Gloom": 0.82,
      "Bile": 1.03
    },
    "catchDifficulty": 48,
    "artSeed": 139,
    "learnset": [
      {
        "level": 1,
        "motifId": "h03"
      },
      {
        "level": 1,
        "motifId": "k01"
      },
      {
        "level": 12,
        "motifId": "k07"
      },
      {
        "level": 26,
        "motifId": "h05"
      }
    ],
    "ascension": [],
    "evolvesFrom": "r02",
    "flavor": "A rare Cindersong Resonant. Its filament body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "emberwake"
    ],
    "pitch": "Low"
  },
  {
    "id": "r04",
    "dexNumber": 4,
    "name": "Myrrkalfrond",
    "primary": "Biteroot",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 56,
      "focus": 78,
      "guard": 82,
      "spirit": 91,
      "edge": 92,
      "tempo": 73
    },
    "baseWard": {
      "Cindersong": 0.9,
      "Biteroot": 1.4,
      "Stratum": 1.05,
      "Rivet": 0.84,
      "Brine": 0.42,
      "Spark": 0.96,
      "Draft": 0.76,
      "Gloom": 1.05,
      "Bile": 0.93
    },
    "catchDifficulty": 13,
    "artSeed": 152,
    "learnset": [
      {
        "level": 1,
        "motifId": "h10"
      },
      {
        "level": 1,
        "motifId": "k02"
      },
      {
        "level": 12,
        "motifId": "k08"
      },
      {
        "level": 26,
        "motifId": "h12"
      }
    ],
    "ascension": [
      {
        "to": "r05",
        "minLevel": 16,
        "minResonance": 120,
        "condition": {
          "kind": "motif_category",
          "cls": "Kindling",
          "uses": 5
        }
      }
    ],
    "evolvesFrom": null,
    "flavor": "A common Biteroot Resonant. Its tidal body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "thornmere",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r05",
    "dexNumber": 5,
    "name": "Tindthurthorn",
    "primary": "Biteroot",
    "secondary": "Spark",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 93,
      "focus": 88,
      "guard": 92,
      "spirit": 74,
      "edge": 81,
      "tempo": 71
    },
    "baseWard": {
      "Cindersong": 1.02,
      "Biteroot": 1.3,
      "Stratum": 1.06,
      "Rivet": 0.9,
      "Brine": 0.41,
      "Spark": 1.04,
      "Draft": 0.86,
      "Gloom": 0.97,
      "Bile": 1
    },
    "catchDifficulty": 31,
    "artSeed": 165,
    "learnset": [
      {
        "level": 1,
        "motifId": "h11"
      },
      {
        "level": 1,
        "motifId": "k02"
      },
      {
        "level": 12,
        "motifId": "k09"
      },
      {
        "level": 26,
        "motifId": "h13"
      }
    ],
    "ascension": [
      {
        "to": "r06",
        "minLevel": 34,
        "minResonance": 120,
        "condition": {
          "kind": "harmonic_affinity",
          "harmonic": "Biteroot",
          "wins": 8
        }
      }
    ],
    "evolvesFrom": "r04",
    "flavor": "A uncommon Biteroot Resonant. Its symmetric-mineral body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "thornmere"
    ],
    "pitch": "High"
  },
  {
    "id": "r06",
    "dexNumber": 6,
    "name": "Virethorn",
    "primary": "Biteroot",
    "secondary": "Spark",
    "rarity": "rare",
    "baseStats": {
      "vigor": 57,
      "focus": 94,
      "guard": 96,
      "spirit": 96,
      "edge": 114,
      "tempo": 112
    },
    "baseWard": {
      "Cindersong": 0.81,
      "Biteroot": 1.25,
      "Stratum": 0.86,
      "Rivet": 1.02,
      "Brine": 0.55,
      "Spark": 0.89,
      "Draft": 0.84,
      "Gloom": 0.92,
      "Bile": 0.96
    },
    "catchDifficulty": 49,
    "artSeed": 178,
    "learnset": [
      {
        "level": 1,
        "motifId": "h12"
      },
      {
        "level": 1,
        "motifId": "k02"
      },
      {
        "level": 12,
        "motifId": "k10"
      },
      {
        "level": 26,
        "motifId": "h14"
      }
    ],
    "ascension": [],
    "evolvesFrom": "r05",
    "flavor": "A rare Biteroot Resonant. Its laminar body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "thornmere"
    ],
    "pitch": "Low"
  },
  {
    "id": "r07",
    "dexNumber": 7,
    "name": "Ulmslab",
    "primary": "Stratum",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 103,
      "focus": 75,
      "guard": 75,
      "spirit": 77,
      "edge": 83,
      "tempo": 73
    },
    "baseWard": {
      "Cindersong": 0.84,
      "Biteroot": 0.96,
      "Stratum": 1.39,
      "Rivet": 0.97,
      "Brine": 0.9,
      "Spark": 0.36,
      "Draft": 0.94,
      "Gloom": 0.82,
      "Bile": 0.96
    },
    "catchDifficulty": 14,
    "artSeed": 191,
    "learnset": [
      {
        "level": 1,
        "motifId": "h19"
      },
      {
        "level": 1,
        "motifId": "k03"
      },
      {
        "level": 12,
        "motifId": "k11"
      },
      {
        "level": 26,
        "motifId": "h21"
      }
    ],
    "ascension": [
      {
        "to": "r08",
        "minLevel": 16,
        "minResonance": 120,
        "condition": {
          "kind": "harmonic_affinity",
          "harmonic": "Stratum",
          "wins": 8
        }
      }
    ],
    "evolvesFrom": null,
    "flavor": "A common Stratum Resonant. Its porous body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "slabgarden",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r08",
    "dexNumber": 8,
    "name": "Ulmkarustone",
    "primary": "Stratum",
    "secondary": "Draft",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 67,
      "focus": 87,
      "guard": 93,
      "spirit": 86,
      "edge": 95,
      "tempo": 103
    },
    "baseWard": {
      "Cindersong": 1.09,
      "Biteroot": 0.76,
      "Stratum": 1.43,
      "Rivet": 0.78,
      "Brine": 1.06,
      "Spark": 0.48,
      "Draft": 1.04,
      "Gloom": 0.88,
      "Bile": 0.8
    },
    "catchDifficulty": 32,
    "artSeed": 204,
    "learnset": [
      {
        "level": 1,
        "motifId": "h20"
      },
      {
        "level": 1,
        "motifId": "k03"
      },
      {
        "level": 12,
        "motifId": "k12"
      },
      {
        "level": 26,
        "motifId": "h22"
      }
    ],
    "ascension": [
      {
        "to": "r09",
        "minLevel": 34,
        "minResonance": 120,
        "condition": {
          "kind": "bond_peak",
          "resonance": 200
        }
      }
    ],
    "evolvesFrom": "r07",
    "flavor": "A uncommon Stratum Resonant. Its coiled body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "slabgarden"
    ],
    "pitch": "High"
  },
  {
    "id": "r09",
    "dexNumber": 9,
    "name": "Ulmpellcrag",
    "primary": "Stratum",
    "secondary": "Draft",
    "rarity": "rare",
    "baseStats": {
      "vigor": 69,
      "focus": 105,
      "guard": 91,
      "spirit": 86,
      "edge": 93,
      "tempo": 100
    },
    "baseWard": {
      "Cindersong": 0.86,
      "Biteroot": 0.82,
      "Stratum": 1.22,
      "Rivet": 0.75,
      "Brine": 1,
      "Spark": 0.41,
      "Draft": 1.04,
      "Gloom": 0.77,
      "Bile": 1.01
    },
    "catchDifficulty": 50,
    "artSeed": 217,
    "learnset": [
      {
        "level": 1,
        "motifId": "h21"
      },
      {
        "level": 1,
        "motifId": "k03"
      },
      {
        "level": 12,
        "motifId": "p01"
      },
      {
        "level": 26,
        "motifId": "h23"
      }
    ],
    "ascension": [],
    "evolvesFrom": "r08",
    "flavor": "A rare Stratum Resonant. Its orbiting body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "slabgarden"
    ],
    "pitch": "Low"
  },
  {
    "id": "r10",
    "dexNumber": 10,
    "name": "Nyxquinbolt",
    "primary": "Rivet",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 86,
      "focus": 86,
      "guard": 72,
      "spirit": 71,
      "edge": 72,
      "tempo": 66
    },
    "baseWard": {
      "Cindersong": 0.75,
      "Biteroot": 0.94,
      "Stratum": 0.86,
      "Rivet": 1.36,
      "Brine": 1.04,
      "Spark": 1.05,
      "Draft": 0.4,
      "Gloom": 1.05,
      "Bile": 1.04
    },
    "catchDifficulty": 15,
    "artSeed": 230,
    "learnset": [
      {
        "level": 1,
        "motifId": "h28"
      },
      {
        "level": 1,
        "motifId": "k04"
      },
      {
        "level": 12,
        "motifId": "p02"
      },
      {
        "level": 26,
        "motifId": "h30"
      }
    ],
    "ascension": [
      {
        "to": "r11",
        "minLevel": 16,
        "minResonance": 120,
        "condition": {
          "kind": "bond_peak",
          "resonance": 200
        }
      }
    ],
    "evolvesFrom": null,
    "flavor": "A common Rivet Resonant. Its lattice body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "rivetworks",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r11",
    "dexNumber": 11,
    "name": "Morbolt",
    "primary": "Rivet",
    "secondary": "Gloom",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 94,
      "focus": 72,
      "guard": 75,
      "spirit": 83,
      "edge": 86,
      "tempo": 80
    },
    "baseWard": {
      "Cindersong": 1.09,
      "Biteroot": 1.06,
      "Stratum": 1.06,
      "Rivet": 1.39,
      "Brine": 0.8,
      "Spark": 1.1,
      "Draft": 0.46,
      "Gloom": 0.98,
      "Bile": 0.81
    },
    "catchDifficulty": 33,
    "artSeed": 243,
    "learnset": [
      {
        "level": 1,
        "motifId": "h29"
      },
      {
        "level": 1,
        "motifId": "k04"
      },
      {
        "level": 12,
        "motifId": "p03"
      },
      {
        "level": 26,
        "motifId": "h31"
      }
    ],
    "ascension": [
      {
        "to": "r12",
        "minLevel": 34,
        "minResonance": 120,
        "condition": {
          "kind": "no_faint"
        }
      }
    ],
    "evolvesFrom": "r10",
    "flavor": "A uncommon Rivet Resonant. Its bloom body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "rivetworks"
    ],
    "pitch": "High"
  },
  {
    "id": "r12",
    "dexNumber": 12,
    "name": "Brinrivet",
    "primary": "Rivet",
    "secondary": "Gloom",
    "rarity": "rare",
    "baseStats": {
      "vigor": 104,
      "focus": 96,
      "guard": 90,
      "spirit": 80,
      "edge": 81,
      "tempo": 95
    },
    "baseWard": {
      "Cindersong": 0.8,
      "Biteroot": 0.95,
      "Stratum": 0.87,
      "Rivet": 1.31,
      "Brine": 1.07,
      "Spark": 1.1,
      "Draft": 0.41,
      "Gloom": 0.94,
      "Bile": 0.86
    },
    "catchDifficulty": 51,
    "artSeed": 256,
    "learnset": [
      {
        "level": 1,
        "motifId": "h30"
      },
      {
        "level": 1,
        "motifId": "k04"
      },
      {
        "level": 12,
        "motifId": "p04"
      },
      {
        "level": 26,
        "motifId": "h32"
      }
    ],
    "ascension": [],
    "evolvesFrom": "r11",
    "flavor": "A rare Rivet Resonant. Its crystalline body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "rivetworks"
    ],
    "pitch": "Low"
  },
  {
    "id": "r13",
    "dexNumber": 13,
    "name": "Oskmyrrmelt",
    "primary": "Brine",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 104,
      "focus": 73,
      "guard": 56,
      "spirit": 77,
      "edge": 79,
      "tempo": 77
    },
    "baseWard": {
      "Cindersong": 0.79,
      "Biteroot": 0.83,
      "Stratum": 0.91,
      "Rivet": 1.09,
      "Brine": 1.22,
      "Spark": 1.05,
      "Draft": 0.96,
      "Gloom": 0.51,
      "Bile": 1.04
    },
    "catchDifficulty": 16,
    "artSeed": 269,
    "learnset": [
      {
        "level": 1,
        "motifId": "h37"
      },
      {
        "level": 1,
        "motifId": "k05"
      },
      {
        "level": 12,
        "motifId": "p05"
      },
      {
        "level": 26,
        "motifId": "h39"
      }
    ],
    "ascension": [
      {
        "to": "r14",
        "minLevel": 16,
        "minResonance": 120,
        "condition": {
          "kind": "no_faint"
        }
      }
    ],
    "evolvesFrom": null,
    "flavor": "A common Brine Resonant. Its colonial body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "brinefen",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r14",
    "dexNumber": 14,
    "name": "Brintide",
    "primary": "Brine",
    "secondary": "Bile",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 84,
      "focus": 80,
      "guard": 73,
      "spirit": 87,
      "edge": 84,
      "tempo": 90
    },
    "baseWard": {
      "Cindersong": 0.89,
      "Biteroot": 1.06,
      "Stratum": 0.95,
      "Rivet": 1.07,
      "Brine": 1.26,
      "Spark": 0.93,
      "Draft": 1.05,
      "Gloom": 0.4,
      "Bile": 0.95
    },
    "catchDifficulty": 34,
    "artSeed": 282,
    "learnset": [
      {
        "level": 1,
        "motifId": "h38"
      },
      {
        "level": 1,
        "motifId": "k05"
      },
      {
        "level": 12,
        "motifId": "p06"
      },
      {
        "level": 26,
        "motifId": "h40"
      }
    ],
    "ascension": [
      {
        "to": "r15",
        "minLevel": 34,
        "minResonance": 120,
        "condition": {
          "kind": "biome",
          "biomeId": "brinefen"
        }
      }
    ],
    "evolvesFrom": "r13",
    "flavor": "A uncommon Brine Resonant. Its geomorphic body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "brinefen"
    ],
    "pitch": "High"
  },
  {
    "id": "r15",
    "dexNumber": 15,
    "name": "Myrrtide",
    "primary": "Brine",
    "secondary": "Bile",
    "rarity": "rare",
    "baseStats": {
      "vigor": 91,
      "focus": 90,
      "guard": 94,
      "spirit": 95,
      "edge": 80,
      "tempo": 89
    },
    "baseWard": {
      "Cindersong": 1.04,
      "Biteroot": 0.81,
      "Stratum": 0.93,
      "Rivet": 0.82,
      "Brine": 1.41,
      "Spark": 0.83,
      "Draft": 1.08,
      "Gloom": 0.58,
      "Bile": 0.99
    },
    "catchDifficulty": 52,
    "artSeed": 295,
    "learnset": [
      {
        "level": 1,
        "motifId": "h39"
      },
      {
        "level": 1,
        "motifId": "k05"
      },
      {
        "level": 12,
        "motifId": "p07"
      },
      {
        "level": 26,
        "motifId": "h41"
      }
    ],
    "ascension": [],
    "evolvesFrom": "r14",
    "flavor": "A rare Brine Resonant. Its filament body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "brinefen"
    ],
    "pitch": "Low"
  },
  {
    "id": "r16",
    "dexNumber": 16,
    "name": "Tindzephcharge",
    "primary": "Spark",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 71,
      "focus": 90,
      "guard": 86,
      "spirit": 90,
      "edge": 75,
      "tempo": 86
    },
    "baseWard": {
      "Cindersong": 0.94,
      "Biteroot": 1.05,
      "Stratum": 0.84,
      "Rivet": 0.83,
      "Brine": 1.09,
      "Spark": 1.43,
      "Draft": 1.02,
      "Gloom": 0.79,
      "Bile": 0.56
    },
    "catchDifficulty": 17,
    "artSeed": 308,
    "learnset": [
      {
        "level": 1,
        "motifId": "h45"
      },
      {
        "level": 1,
        "motifId": "k06"
      },
      {
        "level": 12,
        "motifId": "p11"
      },
      {
        "level": 26,
        "motifId": "h47"
      }
    ],
    "ascension": [
      {
        "to": "r17",
        "minLevel": 16,
        "minResonance": 120,
        "condition": {
          "kind": "biome",
          "biomeId": "arcfield"
        }
      }
    ],
    "evolvesFrom": null,
    "flavor": "A common Spark Resonant. Its tidal body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "arcfield",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r17",
    "dexNumber": 17,
    "name": "Zephdraycharge",
    "primary": "Spark",
    "secondary": "Cindersong",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 70,
      "focus": 74,
      "guard": 90,
      "spirit": 83,
      "edge": 95,
      "tempo": 87
    },
    "baseWard": {
      "Cindersong": 0.96,
      "Biteroot": 1.02,
      "Stratum": 0.98,
      "Rivet": 0.83,
      "Brine": 1.05,
      "Spark": 1.45,
      "Draft": 1.1,
      "Gloom": 0.9,
      "Bile": 0.43
    },
    "catchDifficulty": 35,
    "artSeed": 321,
    "learnset": [
      {
        "level": 1,
        "motifId": "h46"
      },
      {
        "level": 1,
        "motifId": "k06"
      },
      {
        "level": 12,
        "motifId": "p12"
      },
      {
        "level": 26,
        "motifId": "h48"
      }
    ],
    "ascension": [
      {
        "to": "r18",
        "minLevel": 34,
        "minResonance": 120,
        "condition": {
          "kind": "motif_category",
          "cls": "Kindling",
          "uses": 5
        }
      }
    ],
    "evolvesFrom": "r16",
    "flavor": "A uncommon Spark Resonant. Its symmetric-mineral body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "arcfield"
    ],
    "pitch": "High"
  },
  {
    "id": "r18",
    "dexNumber": 18,
    "name": "Draymyrrflick",
    "primary": "Spark",
    "secondary": "Cindersong",
    "rarity": "rare",
    "baseStats": {
      "vigor": 52,
      "focus": 107,
      "guard": 98,
      "spirit": 100,
      "edge": 101,
      "tempo": 110
    },
    "baseWard": {
      "Cindersong": 0.97,
      "Biteroot": 0.89,
      "Stratum": 0.94,
      "Rivet": 0.88,
      "Brine": 0.91,
      "Spark": 1.25,
      "Draft": 1.06,
      "Gloom": 1.07,
      "Bile": 0.42
    },
    "catchDifficulty": 53,
    "artSeed": 334,
    "learnset": [
      {
        "level": 1,
        "motifId": "h47"
      },
      {
        "level": 1,
        "motifId": "k06"
      },
      {
        "level": 12,
        "motifId": "p13"
      },
      {
        "level": 26,
        "motifId": "h49"
      }
    ],
    "ascension": [],
    "evolvesFrom": "r17",
    "flavor": "A rare Spark Resonant. Its laminar body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "arcfield"
    ],
    "pitch": "Low"
  },
  {
    "id": "r19",
    "dexNumber": 19,
    "name": "Lumveil",
    "primary": "Draft",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 69,
      "focus": 81,
      "guard": 79,
      "spirit": 82,
      "edge": 83,
      "tempo": 81
    },
    "baseWard": {
      "Cindersong": 0.55,
      "Biteroot": 0.97,
      "Stratum": 0.95,
      "Rivet": 0.8,
      "Brine": 1.02,
      "Spark": 1,
      "Draft": 1.4,
      "Gloom": 0.94,
      "Bile": 0.87
    },
    "catchDifficulty": 18,
    "artSeed": 347,
    "learnset": [
      {
        "level": 1,
        "motifId": "h53"
      },
      {
        "level": 1,
        "motifId": "k07"
      },
      {
        "level": 12,
        "motifId": "p14"
      },
      {
        "level": 26,
        "motifId": "h55"
      }
    ],
    "ascension": [
      {
        "to": "r20",
        "minLevel": 16,
        "minResonance": 120,
        "condition": {
          "kind": "motif_category",
          "cls": "Kindling",
          "uses": 5
        }
      }
    ],
    "evolvesFrom": null,
    "flavor": "A common Draft Resonant. Its porous body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "galebreak",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r20",
    "dexNumber": 20,
    "name": "Kalvirewing",
    "primary": "Draft",
    "secondary": "Biteroot",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 94,
      "focus": 74,
      "guard": 89,
      "spirit": 79,
      "edge": 74,
      "tempo": 84
    },
    "baseWard": {
      "Cindersong": 0.44,
      "Biteroot": 1.03,
      "Stratum": 1.06,
      "Rivet": 0.79,
      "Brine": 0.9,
      "Spark": 0.84,
      "Draft": 1.42,
      "Gloom": 1.08,
      "Bile": 0.82
    },
    "catchDifficulty": 36,
    "artSeed": 360,
    "learnset": [
      {
        "level": 1,
        "motifId": "h54"
      },
      {
        "level": 1,
        "motifId": "k07"
      },
      {
        "level": 12,
        "motifId": "p15"
      },
      {
        "level": 26,
        "motifId": "h56"
      }
    ],
    "ascension": [
      {
        "to": "r21",
        "minLevel": 34,
        "minResonance": 120,
        "condition": {
          "kind": "harmonic_affinity",
          "harmonic": "Draft",
          "wins": 8
        }
      }
    ],
    "evolvesFrom": "r19",
    "flavor": "A uncommon Draft Resonant. Its coiled body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "galebreak"
    ],
    "pitch": "High"
  },
  {
    "id": "r21",
    "dexNumber": 21,
    "name": "Orubringust",
    "primary": "Draft",
    "secondary": "Biteroot",
    "rarity": "rare",
    "baseStats": {
      "vigor": 92,
      "focus": 104,
      "guard": 75,
      "spirit": 83,
      "edge": 95,
      "tempo": 87
    },
    "baseWard": {
      "Cindersong": 0.52,
      "Biteroot": 1,
      "Stratum": 0.79,
      "Rivet": 1.04,
      "Brine": 1.05,
      "Spark": 0.82,
      "Draft": 1.29,
      "Gloom": 0.95,
      "Bile": 0.93
    },
    "catchDifficulty": 54,
    "artSeed": 373,
    "learnset": [
      {
        "level": 1,
        "motifId": "h55"
      },
      {
        "level": 1,
        "motifId": "k07"
      },
      {
        "level": 12,
        "motifId": "p16"
      },
      {
        "level": 26,
        "motifId": "h57"
      }
    ],
    "ascension": [],
    "evolvesFrom": "r20",
    "flavor": "A rare Draft Resonant. Its orbiting body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "galebreak"
    ],
    "pitch": "Low"
  },
  {
    "id": "r22",
    "dexNumber": 22,
    "name": "Wynmordusk",
    "primary": "Gloom",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 64,
      "focus": 78,
      "guard": 77,
      "spirit": 85,
      "edge": 78,
      "tempo": 77
    },
    "baseWard": {
      "Cindersong": 0.84,
      "Biteroot": 0.48,
      "Stratum": 0.81,
      "Rivet": 1.01,
      "Brine": 0.95,
      "Spark": 0.97,
      "Draft": 1.01,
      "Gloom": 1.33,
      "Bile": 0.99
    },
    "catchDifficulty": 19,
    "artSeed": 386,
    "learnset": [
      {
        "level": 1,
        "motifId": "h61"
      },
      {
        "level": 1,
        "motifId": "k08"
      },
      {
        "level": 12,
        "motifId": "p17"
      },
      {
        "level": 26,
        "motifId": "h63"
      }
    ],
    "ascension": [
      {
        "to": "r23",
        "minLevel": 16,
        "minResonance": 120,
        "condition": {
          "kind": "harmonic_affinity",
          "harmonic": "Gloom",
          "wins": 8
        }
      }
    ],
    "evolvesFrom": null,
    "flavor": "A common Gloom Resonant. Its lattice body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "duskveil",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r23",
    "dexNumber": 23,
    "name": "Quinmorshade",
    "primary": "Gloom",
    "secondary": "Stratum",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 95,
      "focus": 94,
      "guard": 85,
      "spirit": 81,
      "edge": 93,
      "tempo": 76
    },
    "baseWard": {
      "Cindersong": 0.83,
      "Biteroot": 0.56,
      "Stratum": 1.01,
      "Rivet": 0.83,
      "Brine": 0.76,
      "Spark": 1.01,
      "Draft": 1.02,
      "Gloom": 1.39,
      "Bile": 0.77
    },
    "catchDifficulty": 37,
    "artSeed": 399,
    "learnset": [
      {
        "level": 1,
        "motifId": "h62"
      },
      {
        "level": 1,
        "motifId": "k08"
      },
      {
        "level": 12,
        "motifId": "h01"
      },
      {
        "level": 26,
        "motifId": "h64"
      }
    ],
    "ascension": [
      {
        "to": "r24",
        "minLevel": 34,
        "minResonance": 120,
        "condition": {
          "kind": "bond_peak",
          "resonance": 200
        }
      }
    ],
    "evolvesFrom": "r22",
    "flavor": "A uncommon Gloom Resonant. Its bloom body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "duskveil"
    ],
    "pitch": "High"
  },
  {
    "id": "r24",
    "dexNumber": 24,
    "name": "Odelpelldusk",
    "primary": "Gloom",
    "secondary": "Stratum",
    "rarity": "rare",
    "baseStats": {
      "vigor": 63,
      "focus": 97,
      "guard": 98,
      "spirit": 123,
      "edge": 97,
      "tempo": 99
    },
    "baseWard": {
      "Cindersong": 0.96,
      "Biteroot": 0.39,
      "Stratum": 0.93,
      "Rivet": 0.95,
      "Brine": 0.93,
      "Spark": 0.87,
      "Draft": 0.84,
      "Gloom": 1.21,
      "Bile": 0.91
    },
    "catchDifficulty": 55,
    "artSeed": 412,
    "learnset": [
      {
        "level": 1,
        "motifId": "h63"
      },
      {
        "level": 1,
        "motifId": "k08"
      },
      {
        "level": 12,
        "motifId": "h02"
      },
      {
        "level": 26,
        "motifId": "h65"
      }
    ],
    "ascension": [],
    "evolvesFrom": "r23",
    "flavor": "A rare Gloom Resonant. Its crystalline body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "duskveil"
    ],
    "pitch": "Low"
  },
  {
    "id": "r25",
    "dexNumber": 25,
    "name": "Wynblight",
    "primary": "Bile",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 75,
      "focus": 70,
      "guard": 78,
      "spirit": 72,
      "edge": 73,
      "tempo": 73
    },
    "baseWard": {
      "Cindersong": 0.94,
      "Biteroot": 0.94,
      "Stratum": 0.5,
      "Rivet": 1.09,
      "Brine": 1.09,
      "Spark": 0.99,
      "Draft": 0.8,
      "Gloom": 0.99,
      "Bile": 1.43
    },
    "catchDifficulty": 20,
    "artSeed": 425,
    "learnset": [
      {
        "level": 1,
        "motifId": "h69"
      },
      {
        "level": 1,
        "motifId": "k09"
      },
      {
        "level": 12,
        "motifId": "h03"
      },
      {
        "level": 26,
        "motifId": "h71"
      }
    ],
    "ascension": [
      {
        "to": "r26",
        "minLevel": 16,
        "minResonance": 120,
        "condition": {
          "kind": "bond_peak",
          "resonance": 200
        }
      }
    ],
    "evolvesFrom": null,
    "flavor": "A common Bile Resonant. Its colonial body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "blightmire",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r26",
    "dexNumber": 26,
    "name": "Ulmblight",
    "primary": "Bile",
    "secondary": "Rivet",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 72,
      "focus": 78,
      "guard": 85,
      "spirit": 92,
      "edge": 90,
      "tempo": 73
    },
    "baseWard": {
      "Cindersong": 0.98,
      "Biteroot": 0.75,
      "Stratum": 0.35,
      "Rivet": 1.08,
      "Brine": 0.76,
      "Spark": 0.88,
      "Draft": 1.09,
      "Gloom": 1.08,
      "Bile": 1.37
    },
    "catchDifficulty": 38,
    "artSeed": 438,
    "learnset": [
      {
        "level": 1,
        "motifId": "h70"
      },
      {
        "level": 1,
        "motifId": "k09"
      },
      {
        "level": 12,
        "motifId": "h04"
      },
      {
        "level": 26,
        "motifId": "h72"
      }
    ],
    "ascension": [
      {
        "to": "r27",
        "minLevel": 34,
        "minResonance": 120,
        "condition": {
          "kind": "no_faint"
        }
      }
    ],
    "evolvesFrom": "r25",
    "flavor": "A uncommon Bile Resonant. Its geomorphic body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "blightmire"
    ],
    "pitch": "High"
  },
  {
    "id": "r27",
    "dexNumber": 27,
    "name": "Draykarublight",
    "primary": "Bile",
    "secondary": "Rivet",
    "rarity": "rare",
    "baseStats": {
      "vigor": 72,
      "focus": 88,
      "guard": 100,
      "spirit": 95,
      "edge": 94,
      "tempo": 103
    },
    "baseWard": {
      "Cindersong": 0.93,
      "Biteroot": 0.82,
      "Stratum": 0.49,
      "Rivet": 0.76,
      "Brine": 0.79,
      "Spark": 1.01,
      "Draft": 1.05,
      "Gloom": 0.95,
      "Bile": 1.33
    },
    "catchDifficulty": 56,
    "artSeed": 451,
    "learnset": [
      {
        "level": 1,
        "motifId": "h71"
      },
      {
        "level": 1,
        "motifId": "k09"
      },
      {
        "level": 12,
        "motifId": "h05"
      },
      {
        "level": 26,
        "motifId": "h73"
      }
    ],
    "ascension": [],
    "evolvesFrom": "r26",
    "flavor": "A rare Bile Resonant. Its filament body rings when the Lumenfall shifts.",
    "habitatBiomes": [
      "blightmire"
    ],
    "pitch": "Low"
  },
  {
    "id": "r28",
    "dexNumber": 28,
    "name": "Kaloruflare",
    "primary": "Cindersong",
    "secondary": null,
    "rarity": "mythic",
    "baseStats": {
      "vigor": 75,
      "focus": 102,
      "guard": 97,
      "spirit": 102,
      "edge": 114,
      "tempo": 121
    },
    "baseWard": {
      "Cindersong": 1.26,
      "Biteroot": 1,
      "Stratum": 0.95,
      "Rivet": 0.4,
      "Brine": 1.01,
      "Spark": 0.88,
      "Draft": 0.94,
      "Gloom": 0.94,
      "Bile": 0.99
    },
    "catchDifficulty": 15,
    "artSeed": 708,
    "learnset": [
      {
        "level": 1,
        "motifId": "h01"
      },
      {
        "level": 6,
        "motifId": "k01"
      },
      {
        "level": 14,
        "motifId": "k05"
      },
      {
        "level": 24,
        "motifId": "h04"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the emberwake. The Index marks it mythic.",
    "habitatBiomes": [
      "emberwake",
      "saltstair"
    ],
    "pitch": "High"
  },
  {
    "id": "r29",
    "dexNumber": 29,
    "name": "Mortalbloom",
    "primary": "Biteroot",
    "secondary": "Rivet",
    "rarity": "common",
    "baseStats": {
      "vigor": 93,
      "focus": 73,
      "guard": 64,
      "spirit": 68,
      "edge": 69,
      "tempo": 85
    },
    "baseWard": {
      "Cindersong": 1.04,
      "Biteroot": 1.35,
      "Stratum": 0.92,
      "Rivet": 0.99,
      "Brine": 0.39,
      "Spark": 0.97,
      "Draft": 0.75,
      "Gloom": 1.02,
      "Bile": 0.98
    },
    "catchDifficulty": 16,
    "artSeed": 719,
    "learnset": [
      {
        "level": 1,
        "motifId": "h11"
      },
      {
        "level": 6,
        "motifId": "k02"
      },
      {
        "level": 14,
        "motifId": "k06"
      },
      {
        "level": 24,
        "motifId": "h14"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the thornmere. The Index marks it common.",
    "habitatBiomes": [
      "thornmere",
      "ashford"
    ],
    "pitch": "Low"
  },
  {
    "id": "r30",
    "dexNumber": 30,
    "name": "Myrrlumslab",
    "primary": "Stratum",
    "secondary": "Brine",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 55,
      "focus": 95,
      "guard": 98,
      "spirit": 94,
      "edge": 93,
      "tempo": 101
    },
    "baseWard": {
      "Cindersong": 0.77,
      "Biteroot": 0.77,
      "Stratum": 1.28,
      "Rivet": 0.99,
      "Brine": 0.79,
      "Spark": 0.37,
      "Draft": 0.95,
      "Gloom": 0.83,
      "Bile": 0.92
    },
    "catchDifficulty": 17,
    "artSeed": 730,
    "learnset": [
      {
        "level": 1,
        "motifId": "h21"
      },
      {
        "level": 6,
        "motifId": "k03"
      },
      {
        "level": 14,
        "motifId": "k07"
      },
      {
        "level": 24,
        "motifId": "h24"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the slabgarden. The Index marks it uncommon.",
    "habitatBiomes": [
      "slabgarden",
      "saltstair"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r31",
    "dexNumber": 31,
    "name": "Solmbolt",
    "primary": "Rivet",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 53,
      "focus": 84,
      "guard": 87,
      "spirit": 95,
      "edge": 84,
      "tempo": 72
    },
    "baseWard": {
      "Cindersong": 1.08,
      "Biteroot": 1.07,
      "Stratum": 0.83,
      "Rivet": 1.24,
      "Brine": 1.03,
      "Spark": 0.76,
      "Draft": 0.55,
      "Gloom": 0.77,
      "Bile": 0.77
    },
    "catchDifficulty": 18,
    "artSeed": 741,
    "learnset": [
      {
        "level": 1,
        "motifId": "h31"
      },
      {
        "level": 6,
        "motifId": "k04"
      },
      {
        "level": 14,
        "motifId": "k08"
      },
      {
        "level": 24,
        "motifId": "h34"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the rivetworks. The Index marks it common.",
    "habitatBiomes": [
      "rivetworks",
      "ashford"
    ],
    "pitch": "High"
  },
  {
    "id": "r32",
    "dexNumber": 32,
    "name": "Quintide",
    "primary": "Brine",
    "secondary": "Draft",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 87,
      "focus": 84,
      "guard": 78,
      "spirit": 99,
      "edge": 73,
      "tempo": 77
    },
    "baseWard": {
      "Cindersong": 0.85,
      "Biteroot": 0.96,
      "Stratum": 1.01,
      "Rivet": 0.87,
      "Brine": 1.22,
      "Spark": 0.81,
      "Draft": 1.09,
      "Gloom": 0.54,
      "Bile": 0.82
    },
    "catchDifficulty": 19,
    "artSeed": 752,
    "learnset": [
      {
        "level": 1,
        "motifId": "h41"
      },
      {
        "level": 6,
        "motifId": "k05"
      },
      {
        "level": 14,
        "motifId": "k09"
      },
      {
        "level": 24,
        "motifId": "h44"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the brinefen. The Index marks it uncommon.",
    "habitatBiomes": [
      "brinefen",
      "saltstair"
    ],
    "pitch": "Low"
  },
  {
    "id": "r33",
    "dexNumber": 33,
    "name": "Vireflick",
    "primary": "Spark",
    "secondary": "Gloom",
    "rarity": "rare",
    "baseStats": {
      "vigor": 80,
      "focus": 97,
      "guard": 111,
      "spirit": 98,
      "edge": 103,
      "tempo": 84
    },
    "baseWard": {
      "Cindersong": 0.86,
      "Biteroot": 0.76,
      "Stratum": 0.82,
      "Rivet": 0.8,
      "Brine": 0.99,
      "Spark": 1.38,
      "Draft": 0.84,
      "Gloom": 1,
      "Bile": 0.35
    },
    "catchDifficulty": 20,
    "artSeed": 763,
    "learnset": [
      {
        "level": 1,
        "motifId": "h50"
      },
      {
        "level": 6,
        "motifId": "k06"
      },
      {
        "level": 14,
        "motifId": "k10"
      },
      {
        "level": 24,
        "motifId": "h45"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the arcfield. The Index marks it rare.",
    "habitatBiomes": [
      "arcfield",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r34",
    "dexNumber": 34,
    "name": "Lumulmgust",
    "primary": "Draft",
    "secondary": null,
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 54,
      "focus": 98,
      "guard": 91,
      "spirit": 105,
      "edge": 100,
      "tempo": 92
    },
    "baseWard": {
      "Cindersong": 0.38,
      "Biteroot": 0.78,
      "Stratum": 0.84,
      "Rivet": 0.86,
      "Brine": 0.8,
      "Spark": 0.81,
      "Draft": 1.41,
      "Gloom": 0.86,
      "Bile": 0.9
    },
    "catchDifficulty": 21,
    "artSeed": 774,
    "learnset": [
      {
        "level": 1,
        "motifId": "h59"
      },
      {
        "level": 6,
        "motifId": "k07"
      },
      {
        "level": 14,
        "motifId": "k11"
      },
      {
        "level": 24,
        "motifId": "h54"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the galebreak. The Index marks it uncommon.",
    "habitatBiomes": [
      "galebreak",
      "saltstair"
    ],
    "pitch": "High"
  },
  {
    "id": "r35",
    "dexNumber": 35,
    "name": "Vireulmdusk",
    "primary": "Gloom",
    "secondary": "Cindersong",
    "rarity": "common",
    "baseStats": {
      "vigor": 89,
      "focus": 88,
      "guard": 78,
      "spirit": 77,
      "edge": 72,
      "tempo": 62
    },
    "baseWard": {
      "Cindersong": 0.96,
      "Biteroot": 0.42,
      "Stratum": 1.1,
      "Rivet": 0.77,
      "Brine": 1.08,
      "Spark": 0.95,
      "Draft": 0.8,
      "Gloom": 1.36,
      "Bile": 1
    },
    "catchDifficulty": 22,
    "artSeed": 785,
    "learnset": [
      {
        "level": 1,
        "motifId": "h68"
      },
      {
        "level": 6,
        "motifId": "k08"
      },
      {
        "level": 14,
        "motifId": "k12"
      },
      {
        "level": 24,
        "motifId": "h63"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the duskveil. The Index marks it common.",
    "habitatBiomes": [
      "duskveil",
      "ashford"
    ],
    "pitch": "Low"
  },
  {
    "id": "r36",
    "dexNumber": 36,
    "name": "Gravvenom",
    "primary": "Bile",
    "secondary": "Biteroot",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 78,
      "focus": 86,
      "guard": 83,
      "spirit": 79,
      "edge": 99,
      "tempo": 103
    },
    "baseWard": {
      "Cindersong": 0.92,
      "Biteroot": 0.9,
      "Stratum": 0.38,
      "Rivet": 1.08,
      "Brine": 0.94,
      "Spark": 1.01,
      "Draft": 0.99,
      "Gloom": 1,
      "Bile": 1.22
    },
    "catchDifficulty": 23,
    "artSeed": 796,
    "learnset": [
      {
        "level": 1,
        "motifId": "h69"
      },
      {
        "level": 6,
        "motifId": "k09"
      },
      {
        "level": 14,
        "motifId": "p01"
      },
      {
        "level": 24,
        "motifId": "h72"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the blightmire. The Index marks it uncommon.",
    "habitatBiomes": [
      "blightmire",
      "saltstair"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r37",
    "dexNumber": 37,
    "name": "Tindcoal",
    "primary": "Cindersong",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 76,
      "focus": 85,
      "guard": 73,
      "spirit": 75,
      "edge": 74,
      "tempo": 63
    },
    "baseWard": {
      "Cindersong": 1.39,
      "Biteroot": 0.94,
      "Stratum": 0.87,
      "Rivet": 0.44,
      "Brine": 1.04,
      "Spark": 0.87,
      "Draft": 1.05,
      "Gloom": 0.87,
      "Bile": 1
    },
    "catchDifficulty": 24,
    "artSeed": 807,
    "learnset": [
      {
        "level": 1,
        "motifId": "h01"
      },
      {
        "level": 6,
        "motifId": "k10"
      },
      {
        "level": 14,
        "motifId": "p02"
      },
      {
        "level": 24,
        "motifId": "h04"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the emberwake. The Index marks it common.",
    "habitatBiomes": [
      "emberwake",
      "ashford"
    ],
    "pitch": "High"
  },
  {
    "id": "r38",
    "dexNumber": 38,
    "name": "Kalpellbloom",
    "primary": "Biteroot",
    "secondary": "Rivet",
    "rarity": "rare",
    "baseStats": {
      "vigor": 85,
      "focus": 104,
      "guard": 95,
      "spirit": 86,
      "edge": 90,
      "tempo": 86
    },
    "baseWard": {
      "Cindersong": 1.09,
      "Biteroot": 1.28,
      "Stratum": 0.76,
      "Rivet": 0.9,
      "Brine": 0.41,
      "Spark": 0.75,
      "Draft": 0.78,
      "Gloom": 0.84,
      "Bile": 0.85
    },
    "catchDifficulty": 25,
    "artSeed": 818,
    "learnset": [
      {
        "level": 1,
        "motifId": "h11"
      },
      {
        "level": 6,
        "motifId": "k11"
      },
      {
        "level": 14,
        "motifId": "p03"
      },
      {
        "level": 24,
        "motifId": "h14"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the thornmere. The Index marks it rare.",
    "habitatBiomes": [
      "thornmere",
      "saltstair"
    ],
    "pitch": "Low"
  },
  {
    "id": "r39",
    "dexNumber": 39,
    "name": "Pellnixastone",
    "primary": "Stratum",
    "secondary": "Brine",
    "rarity": "common",
    "baseStats": {
      "vigor": 65,
      "focus": 84,
      "guard": 83,
      "spirit": 80,
      "edge": 75,
      "tempo": 94
    },
    "baseWard": {
      "Cindersong": 0.98,
      "Biteroot": 0.79,
      "Stratum": 1.35,
      "Rivet": 1.1,
      "Brine": 0.96,
      "Spark": 0.41,
      "Draft": 0.92,
      "Gloom": 0.82,
      "Bile": 0.79
    },
    "catchDifficulty": 26,
    "artSeed": 829,
    "learnset": [
      {
        "level": 1,
        "motifId": "h21"
      },
      {
        "level": 6,
        "motifId": "k12"
      },
      {
        "level": 14,
        "motifId": "p04"
      },
      {
        "level": 24,
        "motifId": "h24"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the slabgarden. The Index marks it common.",
    "habitatBiomes": [
      "slabgarden",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r40",
    "dexNumber": 40,
    "name": "Gravulmbolt",
    "primary": "Rivet",
    "secondary": null,
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 53,
      "focus": 92,
      "guard": 92,
      "spirit": 93,
      "edge": 86,
      "tempo": 84
    },
    "baseWard": {
      "Cindersong": 1.1,
      "Biteroot": 0.93,
      "Stratum": 0.93,
      "Rivet": 1.39,
      "Brine": 1.01,
      "Spark": 1.1,
      "Draft": 0.36,
      "Gloom": 0.75,
      "Bile": 0.8
    },
    "catchDifficulty": 27,
    "artSeed": 840,
    "learnset": [
      {
        "level": 1,
        "motifId": "h31"
      },
      {
        "level": 6,
        "motifId": "k01"
      },
      {
        "level": 14,
        "motifId": "p05"
      },
      {
        "level": 24,
        "motifId": "h34"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the rivetworks. The Index marks it uncommon.",
    "habitatBiomes": [
      "rivetworks",
      "saltstair"
    ],
    "pitch": "High"
  },
  {
    "id": "r41",
    "dexNumber": 41,
    "name": "Lumdrown",
    "primary": "Brine",
    "secondary": "Draft",
    "rarity": "common",
    "baseStats": {
      "vigor": 52,
      "focus": 76,
      "guard": 86,
      "spirit": 78,
      "edge": 88,
      "tempo": 89
    },
    "baseWard": {
      "Cindersong": 0.83,
      "Biteroot": 0.82,
      "Stratum": 0.99,
      "Rivet": 0.8,
      "Brine": 1.37,
      "Spark": 0.99,
      "Draft": 0.82,
      "Gloom": 0.5,
      "Bile": 0.94
    },
    "catchDifficulty": 28,
    "artSeed": 851,
    "learnset": [
      {
        "level": 1,
        "motifId": "h42"
      },
      {
        "level": 6,
        "motifId": "k02"
      },
      {
        "level": 14,
        "motifId": "p06"
      },
      {
        "level": 24,
        "motifId": "h37"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the brinefen. The Index marks it common.",
    "habitatBiomes": [
      "brinefen",
      "ashford"
    ],
    "pitch": "Low"
  },
  {
    "id": "r42",
    "dexNumber": 42,
    "name": "Sevoruflick",
    "primary": "Spark",
    "secondary": "Gloom",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 56,
      "focus": 89,
      "guard": 81,
      "spirit": 109,
      "edge": 100,
      "tempo": 84
    },
    "baseWard": {
      "Cindersong": 1.02,
      "Biteroot": 0.81,
      "Stratum": 1.02,
      "Rivet": 0.85,
      "Brine": 0.99,
      "Spark": 1.39,
      "Draft": 0.87,
      "Gloom": 0.77,
      "Bile": 0.56
    },
    "catchDifficulty": 29,
    "artSeed": 862,
    "learnset": [
      {
        "level": 1,
        "motifId": "h51"
      },
      {
        "level": 6,
        "motifId": "k03"
      },
      {
        "level": 14,
        "motifId": "p07"
      },
      {
        "level": 24,
        "motifId": "h46"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the arcfield. The Index marks it uncommon.",
    "habitatBiomes": [
      "arcfield",
      "saltstair"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r43",
    "dexNumber": 43,
    "name": "Virekarugust",
    "primary": "Draft",
    "secondary": null,
    "rarity": "rare",
    "baseStats": {
      "vigor": 102,
      "focus": 85,
      "guard": 86,
      "spirit": 70,
      "edge": 97,
      "tempo": 97
    },
    "baseWard": {
      "Cindersong": 0.57,
      "Biteroot": 0.78,
      "Stratum": 0.99,
      "Rivet": 0.87,
      "Brine": 0.77,
      "Spark": 0.87,
      "Draft": 1.3,
      "Gloom": 0.83,
      "Bile": 1.06
    },
    "catchDifficulty": 30,
    "artSeed": 873,
    "learnset": [
      {
        "level": 1,
        "motifId": "h60"
      },
      {
        "level": 6,
        "motifId": "k04"
      },
      {
        "level": 14,
        "motifId": "p11"
      },
      {
        "level": 24,
        "motifId": "h55"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the galebreak. The Index marks it rare.",
    "habitatBiomes": [
      "galebreak",
      "ashford"
    ],
    "pitch": "High"
  },
  {
    "id": "r44",
    "dexNumber": 44,
    "name": "Brinorushade",
    "primary": "Gloom",
    "secondary": "Cindersong",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 104,
      "focus": 81,
      "guard": 91,
      "spirit": 80,
      "edge": 76,
      "tempo": 92
    },
    "baseWard": {
      "Cindersong": 0.9,
      "Biteroot": 0.42,
      "Stratum": 1.03,
      "Rivet": 1.04,
      "Brine": 1.02,
      "Spark": 0.85,
      "Draft": 0.84,
      "Gloom": 1.41,
      "Bile": 1.06
    },
    "catchDifficulty": 31,
    "artSeed": 884,
    "learnset": [
      {
        "level": 1,
        "motifId": "h61"
      },
      {
        "level": 6,
        "motifId": "k05"
      },
      {
        "level": 14,
        "motifId": "p12"
      },
      {
        "level": 24,
        "motifId": "h64"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the duskveil. The Index marks it uncommon.",
    "habitatBiomes": [
      "duskveil",
      "saltstair"
    ],
    "pitch": "Low"
  },
  {
    "id": "r45",
    "dexNumber": 45,
    "name": "Oruspore",
    "primary": "Bile",
    "secondary": "Biteroot",
    "rarity": "mythic",
    "baseStats": {
      "vigor": 79,
      "focus": 108,
      "guard": 99,
      "spirit": 110,
      "edge": 105,
      "tempo": 104
    },
    "baseWard": {
      "Cindersong": 1.09,
      "Biteroot": 0.81,
      "Stratum": 0.43,
      "Rivet": 0.78,
      "Brine": 1.08,
      "Spark": 0.96,
      "Draft": 0.96,
      "Gloom": 1.06,
      "Bile": 1.2
    },
    "catchDifficulty": 32,
    "artSeed": 895,
    "learnset": [
      {
        "level": 1,
        "motifId": "h70"
      },
      {
        "level": 6,
        "motifId": "k06"
      },
      {
        "level": 14,
        "motifId": "p13"
      },
      {
        "level": 24,
        "motifId": "h73"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the blightmire. The Index marks it mythic.",
    "habitatBiomes": [
      "blightmire",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r46",
    "dexNumber": 46,
    "name": "Zephflare",
    "primary": "Cindersong",
    "secondary": null,
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 99,
      "focus": 89,
      "guard": 83,
      "spirit": 86,
      "edge": 85,
      "tempo": 78
    },
    "baseWard": {
      "Cindersong": 1.27,
      "Biteroot": 0.89,
      "Stratum": 1.07,
      "Rivet": 0.4,
      "Brine": 0.93,
      "Spark": 0.79,
      "Draft": 0.83,
      "Gloom": 1.07,
      "Bile": 1.05
    },
    "catchDifficulty": 33,
    "artSeed": 906,
    "learnset": [
      {
        "level": 1,
        "motifId": "h01"
      },
      {
        "level": 6,
        "motifId": "k07"
      },
      {
        "level": 14,
        "motifId": "p14"
      },
      {
        "level": 24,
        "motifId": "h04"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the emberwake. The Index marks it uncommon.",
    "habitatBiomes": [
      "emberwake",
      "saltstair"
    ],
    "pitch": "High"
  },
  {
    "id": "r47",
    "dexNumber": 47,
    "name": "Talvirefrond",
    "primary": "Biteroot",
    "secondary": "Rivet",
    "rarity": "common",
    "baseStats": {
      "vigor": 77,
      "focus": 74,
      "guard": 80,
      "spirit": 75,
      "edge": 65,
      "tempo": 84
    },
    "baseWard": {
      "Cindersong": 0.81,
      "Biteroot": 1.27,
      "Stratum": 0.77,
      "Rivet": 1.06,
      "Brine": 0.51,
      "Spark": 1.09,
      "Draft": 0.77,
      "Gloom": 0.98,
      "Bile": 1.01
    },
    "catchDifficulty": 34,
    "artSeed": 917,
    "learnset": [
      {
        "level": 1,
        "motifId": "h11"
      },
      {
        "level": 6,
        "motifId": "k08"
      },
      {
        "level": 14,
        "motifId": "p15"
      },
      {
        "level": 24,
        "motifId": "h14"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the thornmere. The Index marks it common.",
    "habitatBiomes": [
      "thornmere",
      "ashford"
    ],
    "pitch": "Low"
  },
  {
    "id": "r48",
    "dexNumber": 48,
    "name": "Moroskcrag",
    "primary": "Stratum",
    "secondary": "Brine",
    "rarity": "rare",
    "baseStats": {
      "vigor": 63,
      "focus": 106,
      "guard": 114,
      "spirit": 97,
      "edge": 106,
      "tempo": 91
    },
    "baseWard": {
      "Cindersong": 1.03,
      "Biteroot": 0.86,
      "Stratum": 1.39,
      "Rivet": 0.93,
      "Brine": 0.89,
      "Spark": 0.58,
      "Draft": 1.09,
      "Gloom": 0.83,
      "Bile": 0.88
    },
    "catchDifficulty": 35,
    "artSeed": 928,
    "learnset": [
      {
        "level": 1,
        "motifId": "h21"
      },
      {
        "level": 6,
        "motifId": "k09"
      },
      {
        "level": 14,
        "motifId": "p16"
      },
      {
        "level": 24,
        "motifId": "h24"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the slabgarden. The Index marks it rare.",
    "habitatBiomes": [
      "slabgarden",
      "saltstair"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r49",
    "dexNumber": 49,
    "name": "Morrivet",
    "primary": "Rivet",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 49,
      "focus": 92,
      "guard": 102,
      "spirit": 90,
      "edge": 91,
      "tempo": 75
    },
    "baseWard": {
      "Cindersong": 1.09,
      "Biteroot": 0.8,
      "Stratum": 0.79,
      "Rivet": 1.45,
      "Brine": 0.84,
      "Spark": 0.78,
      "Draft": 0.45,
      "Gloom": 0.95,
      "Bile": 1.03
    },
    "catchDifficulty": 36,
    "artSeed": 939,
    "learnset": [
      {
        "level": 1,
        "motifId": "h31"
      },
      {
        "level": 6,
        "motifId": "k10"
      },
      {
        "level": 14,
        "motifId": "p17"
      },
      {
        "level": 24,
        "motifId": "h34"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the rivetworks. The Index marks it common.",
    "habitatBiomes": [
      "rivetworks",
      "ashford"
    ],
    "pitch": "High"
  },
  {
    "id": "r50",
    "dexNumber": 50,
    "name": "Sevdrown",
    "primary": "Brine",
    "secondary": "Draft",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 60,
      "focus": 83,
      "guard": 87,
      "spirit": 92,
      "edge": 84,
      "tempo": 89
    },
    "baseWard": {
      "Cindersong": 1.05,
      "Biteroot": 0.99,
      "Stratum": 0.91,
      "Rivet": 0.99,
      "Brine": 1.24,
      "Spark": 0.95,
      "Draft": 1.05,
      "Gloom": 0.55,
      "Bile": 0.84
    },
    "catchDifficulty": 37,
    "artSeed": 950,
    "learnset": [
      {
        "level": 1,
        "motifId": "h43"
      },
      {
        "level": 6,
        "motifId": "k11"
      },
      {
        "level": 14,
        "motifId": "h01"
      },
      {
        "level": 24,
        "motifId": "h38"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the brinefen. The Index marks it uncommon.",
    "habitatBiomes": [
      "brinefen",
      "saltstair"
    ],
    "pitch": "Low"
  },
  {
    "id": "r51",
    "dexNumber": 51,
    "name": "Solmtalflick",
    "primary": "Spark",
    "secondary": "Gloom",
    "rarity": "common",
    "baseStats": {
      "vigor": 77,
      "focus": 71,
      "guard": 86,
      "spirit": 75,
      "edge": 89,
      "tempo": 82
    },
    "baseWard": {
      "Cindersong": 0.83,
      "Biteroot": 0.96,
      "Stratum": 1.05,
      "Rivet": 0.97,
      "Brine": 0.85,
      "Spark": 1.26,
      "Draft": 0.92,
      "Gloom": 0.81,
      "Bile": 0.55
    },
    "catchDifficulty": 38,
    "artSeed": 961,
    "learnset": [
      {
        "level": 1,
        "motifId": "h52"
      },
      {
        "level": 6,
        "motifId": "k12"
      },
      {
        "level": 14,
        "motifId": "h02"
      },
      {
        "level": 24,
        "motifId": "h47"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the arcfield. The Index marks it common.",
    "habitatBiomes": [
      "arcfield",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r52",
    "dexNumber": 52,
    "name": "Talulmgust",
    "primary": "Draft",
    "secondary": null,
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 84,
      "focus": 91,
      "guard": 89,
      "spirit": 84,
      "edge": 92,
      "tempo": 97
    },
    "baseWard": {
      "Cindersong": 0.42,
      "Biteroot": 1.09,
      "Stratum": 1.09,
      "Rivet": 0.87,
      "Brine": 0.79,
      "Spark": 1.01,
      "Draft": 1.3,
      "Gloom": 0.95,
      "Bile": 1.02
    },
    "catchDifficulty": 39,
    "artSeed": 972,
    "learnset": [
      {
        "level": 1,
        "motifId": "h53"
      },
      {
        "level": 6,
        "motifId": "k01"
      },
      {
        "level": 14,
        "motifId": "h03"
      },
      {
        "level": 24,
        "motifId": "h56"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the galebreak. The Index marks it uncommon.",
    "habitatBiomes": [
      "galebreak",
      "saltstair"
    ],
    "pitch": "High"
  },
  {
    "id": "r53",
    "dexNumber": 53,
    "name": "Brinkaldusk",
    "primary": "Gloom",
    "secondary": "Cindersong",
    "rarity": "rare",
    "baseStats": {
      "vigor": 82,
      "focus": 113,
      "guard": 83,
      "spirit": 98,
      "edge": 89,
      "tempo": 97
    },
    "baseWard": {
      "Cindersong": 0.82,
      "Biteroot": 0.48,
      "Stratum": 0.82,
      "Rivet": 1.04,
      "Brine": 0.81,
      "Spark": 0.92,
      "Draft": 0.86,
      "Gloom": 1.3,
      "Bile": 0.86
    },
    "catchDifficulty": 40,
    "artSeed": 983,
    "learnset": [
      {
        "level": 1,
        "motifId": "h62"
      },
      {
        "level": 6,
        "motifId": "k02"
      },
      {
        "level": 14,
        "motifId": "h04"
      },
      {
        "level": 24,
        "motifId": "h65"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the duskveil. The Index marks it rare.",
    "habitatBiomes": [
      "duskveil",
      "ashford"
    ],
    "pitch": "Low"
  },
  {
    "id": "r54",
    "dexNumber": 54,
    "name": "Sevulmspore",
    "primary": "Bile",
    "secondary": "Biteroot",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 51,
      "focus": 72,
      "guard": 87,
      "spirit": 92,
      "edge": 106,
      "tempo": 95
    },
    "baseWard": {
      "Cindersong": 0.8,
      "Biteroot": 1.08,
      "Stratum": 0.58,
      "Rivet": 0.92,
      "Brine": 0.92,
      "Spark": 1.08,
      "Draft": 0.99,
      "Gloom": 1.1,
      "Bile": 1.42
    },
    "catchDifficulty": 41,
    "artSeed": 994,
    "learnset": [
      {
        "level": 1,
        "motifId": "h71"
      },
      {
        "level": 6,
        "motifId": "k03"
      },
      {
        "level": 14,
        "motifId": "h05"
      },
      {
        "level": 24,
        "motifId": "h74"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the blightmire. The Index marks it uncommon.",
    "habitatBiomes": [
      "blightmire",
      "saltstair"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r55",
    "dexNumber": 55,
    "name": "Ulmcoal",
    "primary": "Cindersong",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 76,
      "focus": 73,
      "guard": 81,
      "spirit": 88,
      "edge": 87,
      "tempo": 70
    },
    "baseWard": {
      "Cindersong": 1.29,
      "Biteroot": 0.98,
      "Stratum": 0.89,
      "Rivet": 0.55,
      "Brine": 0.79,
      "Spark": 0.85,
      "Draft": 1.03,
      "Gloom": 0.98,
      "Bile": 0.95
    },
    "catchDifficulty": 42,
    "artSeed": 1005,
    "learnset": [
      {
        "level": 1,
        "motifId": "h01"
      },
      {
        "level": 6,
        "motifId": "k04"
      },
      {
        "level": 14,
        "motifId": "h06"
      },
      {
        "level": 24,
        "motifId": "h04"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the emberwake. The Index marks it common.",
    "habitatBiomes": [
      "emberwake",
      "ashford"
    ],
    "pitch": "High"
  },
  {
    "id": "r56",
    "dexNumber": 56,
    "name": "Karubloom",
    "primary": "Biteroot",
    "secondary": "Rivet",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 70,
      "focus": 82,
      "guard": 90,
      "spirit": 100,
      "edge": 87,
      "tempo": 91
    },
    "baseWard": {
      "Cindersong": 0.95,
      "Biteroot": 1.25,
      "Stratum": 0.88,
      "Rivet": 0.87,
      "Brine": 0.59,
      "Spark": 1.1,
      "Draft": 0.93,
      "Gloom": 0.77,
      "Bile": 0.9
    },
    "catchDifficulty": 43,
    "artSeed": 1016,
    "learnset": [
      {
        "level": 1,
        "motifId": "h11"
      },
      {
        "level": 6,
        "motifId": "k05"
      },
      {
        "level": 14,
        "motifId": "h07"
      },
      {
        "level": 24,
        "motifId": "h14"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the thornmere. The Index marks it uncommon.",
    "habitatBiomes": [
      "thornmere",
      "saltstair"
    ],
    "pitch": "Low"
  },
  {
    "id": "r57",
    "dexNumber": 57,
    "name": "Pellpellslab",
    "primary": "Stratum",
    "secondary": "Brine",
    "rarity": "common",
    "baseStats": {
      "vigor": 87,
      "focus": 77,
      "guard": 85,
      "spirit": 88,
      "edge": 82,
      "tempo": 74
    },
    "baseWard": {
      "Cindersong": 0.85,
      "Biteroot": 0.93,
      "Stratum": 1.35,
      "Rivet": 0.79,
      "Brine": 0.77,
      "Spark": 0.45,
      "Draft": 0.89,
      "Gloom": 1.02,
      "Bile": 0.88
    },
    "catchDifficulty": 44,
    "artSeed": 1027,
    "learnset": [
      {
        "level": 1,
        "motifId": "h21"
      },
      {
        "level": 6,
        "motifId": "k06"
      },
      {
        "level": 14,
        "motifId": "h08"
      },
      {
        "level": 24,
        "motifId": "h24"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the slabgarden. The Index marks it common.",
    "habitatBiomes": [
      "slabgarden",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r58",
    "dexNumber": 58,
    "name": "Quinthurbolt",
    "primary": "Rivet",
    "secondary": null,
    "rarity": "rare",
    "baseStats": {
      "vigor": 59,
      "focus": 104,
      "guard": 98,
      "spirit": 98,
      "edge": 109,
      "tempo": 101
    },
    "baseWard": {
      "Cindersong": 0.81,
      "Biteroot": 0.94,
      "Stratum": 0.99,
      "Rivet": 1.2,
      "Brine": 0.79,
      "Spark": 0.99,
      "Draft": 0.39,
      "Gloom": 1.1,
      "Bile": 1.01
    },
    "catchDifficulty": 45,
    "artSeed": 1038,
    "learnset": [
      {
        "level": 1,
        "motifId": "h31"
      },
      {
        "level": 6,
        "motifId": "k07"
      },
      {
        "level": 14,
        "motifId": "h09"
      },
      {
        "level": 24,
        "motifId": "h34"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the rivetworks. The Index marks it rare.",
    "habitatBiomes": [
      "rivetworks",
      "saltstair"
    ],
    "pitch": "High"
  },
  {
    "id": "r59",
    "dexNumber": 59,
    "name": "Ulmtide",
    "primary": "Brine",
    "secondary": "Draft",
    "rarity": "common",
    "baseStats": {
      "vigor": 84,
      "focus": 78,
      "guard": 68,
      "spirit": 77,
      "edge": 77,
      "tempo": 78
    },
    "baseWard": {
      "Cindersong": 1.02,
      "Biteroot": 1.02,
      "Stratum": 0.85,
      "Rivet": 1.06,
      "Brine": 1.39,
      "Spark": 1.05,
      "Draft": 0.79,
      "Gloom": 0.53,
      "Bile": 1.01
    },
    "catchDifficulty": 46,
    "artSeed": 1049,
    "learnset": [
      {
        "level": 1,
        "motifId": "h44"
      },
      {
        "level": 6,
        "motifId": "k08"
      },
      {
        "level": 14,
        "motifId": "h10"
      },
      {
        "level": 24,
        "motifId": "h39"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the brinefen. The Index marks it common.",
    "habitatBiomes": [
      "brinefen",
      "ashford"
    ],
    "pitch": "Low"
  },
  {
    "id": "r60",
    "dexNumber": 60,
    "name": "Ulmarc",
    "primary": "Spark",
    "secondary": "Gloom",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 87,
      "focus": 77,
      "guard": 86,
      "spirit": 77,
      "edge": 88,
      "tempo": 80
    },
    "baseWard": {
      "Cindersong": 0.89,
      "Biteroot": 0.99,
      "Stratum": 0.98,
      "Rivet": 0.83,
      "Brine": 0.77,
      "Spark": 1.36,
      "Draft": 0.86,
      "Gloom": 0.97,
      "Bile": 0.58
    },
    "catchDifficulty": 47,
    "artSeed": 1060,
    "learnset": [
      {
        "level": 1,
        "motifId": "h45"
      },
      {
        "level": 6,
        "motifId": "k09"
      },
      {
        "level": 14,
        "motifId": "h11"
      },
      {
        "level": 24,
        "motifId": "h48"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the arcfield. The Index marks it uncommon.",
    "habitatBiomes": [
      "arcfield",
      "saltstair"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r61",
    "dexNumber": 61,
    "name": "Pellwing",
    "primary": "Draft",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 68,
      "focus": 75,
      "guard": 83,
      "spirit": 79,
      "edge": 80,
      "tempo": 89
    },
    "baseWard": {
      "Cindersong": 0.57,
      "Biteroot": 1.09,
      "Stratum": 1.07,
      "Rivet": 0.89,
      "Brine": 1.01,
      "Spark": 0.79,
      "Draft": 1.28,
      "Gloom": 0.86,
      "Bile": 0.81
    },
    "catchDifficulty": 48,
    "artSeed": 1071,
    "learnset": [
      {
        "level": 1,
        "motifId": "h54"
      },
      {
        "level": 6,
        "motifId": "k10"
      },
      {
        "level": 14,
        "motifId": "h12"
      },
      {
        "level": 24,
        "motifId": "h57"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the galebreak. The Index marks it common.",
    "habitatBiomes": [
      "galebreak",
      "ashford"
    ],
    "pitch": "High"
  },
  {
    "id": "r62",
    "dexNumber": 62,
    "name": "Taldusk",
    "primary": "Gloom",
    "secondary": "Cindersong",
    "rarity": "mythic",
    "baseStats": {
      "vigor": 71,
      "focus": 106,
      "guard": 107,
      "spirit": 118,
      "edge": 112,
      "tempo": 101
    },
    "baseWard": {
      "Cindersong": 0.84,
      "Biteroot": 0.58,
      "Stratum": 0.88,
      "Rivet": 1.02,
      "Brine": 0.75,
      "Spark": 0.82,
      "Draft": 0.83,
      "Gloom": 1.29,
      "Bile": 0.96
    },
    "catchDifficulty": 49,
    "artSeed": 1082,
    "learnset": [
      {
        "level": 1,
        "motifId": "h63"
      },
      {
        "level": 6,
        "motifId": "k11"
      },
      {
        "level": 14,
        "motifId": "h13"
      },
      {
        "level": 24,
        "motifId": "h66"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the duskveil. The Index marks it mythic.",
    "habitatBiomes": [
      "duskveil",
      "saltstair"
    ],
    "pitch": "Low"
  },
  {
    "id": "r63",
    "dexNumber": 63,
    "name": "Oskmyrrspore",
    "primary": "Bile",
    "secondary": "Biteroot",
    "rarity": "rare",
    "baseStats": {
      "vigor": 79,
      "focus": 95,
      "guard": 104,
      "spirit": 92,
      "edge": 88,
      "tempo": 97
    },
    "baseWard": {
      "Cindersong": 0.84,
      "Biteroot": 1,
      "Stratum": 0.56,
      "Rivet": 1.02,
      "Brine": 1.07,
      "Spark": 0.79,
      "Draft": 0.82,
      "Gloom": 0.96,
      "Bile": 1.43
    },
    "catchDifficulty": 50,
    "artSeed": 1093,
    "learnset": [
      {
        "level": 1,
        "motifId": "h72"
      },
      {
        "level": 6,
        "motifId": "k12"
      },
      {
        "level": 14,
        "motifId": "h14"
      },
      {
        "level": 24,
        "motifId": "h75"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the blightmire. The Index marks it rare.",
    "habitatBiomes": [
      "blightmire",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r64",
    "dexNumber": 64,
    "name": "Sevcoal",
    "primary": "Cindersong",
    "secondary": null,
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 105,
      "focus": 86,
      "guard": 76,
      "spirit": 80,
      "edge": 72,
      "tempo": 81
    },
    "baseWard": {
      "Cindersong": 1.23,
      "Biteroot": 0.8,
      "Stratum": 1.03,
      "Rivet": 0.43,
      "Brine": 1.06,
      "Spark": 0.88,
      "Draft": 1,
      "Gloom": 0.81,
      "Bile": 0.85
    },
    "catchDifficulty": 51,
    "artSeed": 1104,
    "learnset": [
      {
        "level": 1,
        "motifId": "h01"
      },
      {
        "level": 6,
        "motifId": "k01"
      },
      {
        "level": 14,
        "motifId": "h15"
      },
      {
        "level": 24,
        "motifId": "h04"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the emberwake. The Index marks it uncommon.",
    "habitatBiomes": [
      "emberwake",
      "saltstair"
    ],
    "pitch": "High"
  },
  {
    "id": "r65",
    "dexNumber": 65,
    "name": "Veshfrond",
    "primary": "Biteroot",
    "secondary": "Rivet",
    "rarity": "common",
    "baseStats": {
      "vigor": 62,
      "focus": 63,
      "guard": 86,
      "spirit": 92,
      "edge": 68,
      "tempo": 77
    },
    "baseWard": {
      "Cindersong": 0.83,
      "Biteroot": 1.32,
      "Stratum": 0.87,
      "Rivet": 1.01,
      "Brine": 0.43,
      "Spark": 0.94,
      "Draft": 0.98,
      "Gloom": 1.07,
      "Bile": 1.04
    },
    "catchDifficulty": 52,
    "artSeed": 1115,
    "learnset": [
      {
        "level": 1,
        "motifId": "h11"
      },
      {
        "level": 6,
        "motifId": "k02"
      },
      {
        "level": 14,
        "motifId": "h16"
      },
      {
        "level": 24,
        "motifId": "h14"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the thornmere. The Index marks it common.",
    "habitatBiomes": [
      "thornmere",
      "ashford"
    ],
    "pitch": "Low"
  },
  {
    "id": "r66",
    "dexNumber": 66,
    "name": "Ulmlumslab",
    "primary": "Stratum",
    "secondary": "Brine",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 88,
      "focus": 99,
      "guard": 76,
      "spirit": 81,
      "edge": 81,
      "tempo": 85
    },
    "baseWard": {
      "Cindersong": 0.86,
      "Biteroot": 0.95,
      "Stratum": 1.27,
      "Rivet": 1.1,
      "Brine": 0.81,
      "Spark": 0.36,
      "Draft": 0.84,
      "Gloom": 0.75,
      "Bile": 0.89
    },
    "catchDifficulty": 53,
    "artSeed": 1126,
    "learnset": [
      {
        "level": 1,
        "motifId": "h21"
      },
      {
        "level": 6,
        "motifId": "k03"
      },
      {
        "level": 14,
        "motifId": "h17"
      },
      {
        "level": 24,
        "motifId": "h24"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the slabgarden. The Index marks it uncommon.",
    "habitatBiomes": [
      "slabgarden",
      "saltstair"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r67",
    "dexNumber": 67,
    "name": "Virelumbolt",
    "primary": "Rivet",
    "secondary": null,
    "rarity": "common",
    "baseStats": {
      "vigor": 60,
      "focus": 85,
      "guard": 100,
      "spirit": 82,
      "edge": 78,
      "tempo": 91
    },
    "baseWard": {
      "Cindersong": 0.84,
      "Biteroot": 0.77,
      "Stratum": 0.85,
      "Rivet": 1.25,
      "Brine": 1,
      "Spark": 0.78,
      "Draft": 0.59,
      "Gloom": 0.9,
      "Bile": 0.83
    },
    "catchDifficulty": 54,
    "artSeed": 1137,
    "learnset": [
      {
        "level": 1,
        "motifId": "h31"
      },
      {
        "level": 6,
        "motifId": "k04"
      },
      {
        "level": 14,
        "motifId": "h18"
      },
      {
        "level": 24,
        "motifId": "h34"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the rivetworks. The Index marks it common.",
    "habitatBiomes": [
      "rivetworks",
      "ashford"
    ],
    "pitch": "High"
  },
  {
    "id": "r68",
    "dexNumber": 68,
    "name": "Odeldrown",
    "primary": "Brine",
    "secondary": "Draft",
    "rarity": "rare",
    "baseStats": {
      "vigor": 54,
      "focus": 97,
      "guard": 92,
      "spirit": 107,
      "edge": 99,
      "tempo": 81
    },
    "baseWard": {
      "Cindersong": 0.94,
      "Biteroot": 0.78,
      "Stratum": 0.83,
      "Rivet": 0.95,
      "Brine": 1.39,
      "Spark": 0.81,
      "Draft": 1.07,
      "Gloom": 0.4,
      "Bile": 0.95
    },
    "catchDifficulty": 15,
    "artSeed": 1148,
    "learnset": [
      {
        "level": 1,
        "motifId": "h37"
      },
      {
        "level": 6,
        "motifId": "k05"
      },
      {
        "level": 14,
        "motifId": "h19"
      },
      {
        "level": 24,
        "motifId": "h40"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the brinefen. The Index marks it rare.",
    "habitatBiomes": [
      "brinefen",
      "saltstair"
    ],
    "pitch": "Low"
  },
  {
    "id": "r69",
    "dexNumber": 69,
    "name": "Brinflick",
    "primary": "Spark",
    "secondary": "Gloom",
    "rarity": "common",
    "baseStats": {
      "vigor": 91,
      "focus": 71,
      "guard": 83,
      "spirit": 92,
      "edge": 75,
      "tempo": 75
    },
    "baseWard": {
      "Cindersong": 0.99,
      "Biteroot": 0.91,
      "Stratum": 0.88,
      "Rivet": 0.9,
      "Brine": 0.85,
      "Spark": 1.28,
      "Draft": 0.89,
      "Gloom": 0.89,
      "Bile": 0.39
    },
    "catchDifficulty": 16,
    "artSeed": 1159,
    "learnset": [
      {
        "level": 1,
        "motifId": "h46"
      },
      {
        "level": 6,
        "motifId": "k06"
      },
      {
        "level": 14,
        "motifId": "h20"
      },
      {
        "level": 24,
        "motifId": "h49"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the arcfield. The Index marks it common.",
    "habitatBiomes": [
      "arcfield",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r70",
    "dexNumber": 70,
    "name": "Lumgust",
    "primary": "Draft",
    "secondary": null,
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 95,
      "focus": 86,
      "guard": 96,
      "spirit": 86,
      "edge": 84,
      "tempo": 88
    },
    "baseWard": {
      "Cindersong": 0.59,
      "Biteroot": 1.08,
      "Stratum": 1.02,
      "Rivet": 1.1,
      "Brine": 0.88,
      "Spark": 1.01,
      "Draft": 1.3,
      "Gloom": 1.09,
      "Bile": 0.83
    },
    "catchDifficulty": 17,
    "artSeed": 1170,
    "learnset": [
      {
        "level": 1,
        "motifId": "h55"
      },
      {
        "level": 6,
        "motifId": "k07"
      },
      {
        "level": 14,
        "motifId": "h21"
      },
      {
        "level": 24,
        "motifId": "h58"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the galebreak. The Index marks it uncommon.",
    "habitatBiomes": [
      "galebreak",
      "saltstair"
    ],
    "pitch": "High"
  },
  {
    "id": "r71",
    "dexNumber": 71,
    "name": "Solmhollow",
    "primary": "Gloom",
    "secondary": "Cindersong",
    "rarity": "common",
    "baseStats": {
      "vigor": 51,
      "focus": 82,
      "guard": 87,
      "spirit": 80,
      "edge": 81,
      "tempo": 90
    },
    "baseWard": {
      "Cindersong": 0.84,
      "Biteroot": 0.43,
      "Stratum": 1.1,
      "Rivet": 0.78,
      "Brine": 0.89,
      "Spark": 0.81,
      "Draft": 0.84,
      "Gloom": 1.23,
      "Bile": 0.9
    },
    "catchDifficulty": 18,
    "artSeed": 1181,
    "learnset": [
      {
        "level": 1,
        "motifId": "h64"
      },
      {
        "level": 6,
        "motifId": "k08"
      },
      {
        "level": 14,
        "motifId": "h22"
      },
      {
        "level": 24,
        "motifId": "h67"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the duskveil. The Index marks it common.",
    "habitatBiomes": [
      "duskveil",
      "ashford"
    ],
    "pitch": "Low"
  },
  {
    "id": "r72",
    "dexNumber": 72,
    "name": "Zephblight",
    "primary": "Bile",
    "secondary": "Biteroot",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 96,
      "focus": 86,
      "guard": 95,
      "spirit": 98,
      "edge": 91,
      "tempo": 77
    },
    "baseWard": {
      "Cindersong": 0.8,
      "Biteroot": 0.75,
      "Stratum": 0.37,
      "Rivet": 0.93,
      "Brine": 0.89,
      "Spark": 0.92,
      "Draft": 0.98,
      "Gloom": 1.09,
      "Bile": 1.43
    },
    "catchDifficulty": 19,
    "artSeed": 1192,
    "learnset": [
      {
        "level": 1,
        "motifId": "h73"
      },
      {
        "level": 6,
        "motifId": "k09"
      },
      {
        "level": 14,
        "motifId": "h23"
      },
      {
        "level": 24,
        "motifId": "h76"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the blightmire. The Index marks it uncommon.",
    "habitatBiomes": [
      "blightmire",
      "saltstair"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r73",
    "dexNumber": 73,
    "name": "Tindflare",
    "primary": "Cindersong",
    "secondary": null,
    "rarity": "rare",
    "baseStats": {
      "vigor": 100,
      "focus": 87,
      "guard": 99,
      "spirit": 77,
      "edge": 85,
      "tempo": 84
    },
    "baseWard": {
      "Cindersong": 1.27,
      "Biteroot": 0.88,
      "Stratum": 0.88,
      "Rivet": 0.59,
      "Brine": 0.95,
      "Spark": 0.87,
      "Draft": 1.07,
      "Gloom": 0.89,
      "Bile": 0.9
    },
    "catchDifficulty": 20,
    "artSeed": 1203,
    "learnset": [
      {
        "level": 1,
        "motifId": "h01"
      },
      {
        "level": 6,
        "motifId": "k10"
      },
      {
        "level": 14,
        "motifId": "h24"
      },
      {
        "level": 24,
        "motifId": "h04"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the emberwake. The Index marks it rare.",
    "habitatBiomes": [
      "emberwake",
      "ashford"
    ],
    "pitch": "High"
  },
  {
    "id": "r74",
    "dexNumber": 74,
    "name": "Brinmyrrthorn",
    "primary": "Biteroot",
    "secondary": "Rivet",
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 88,
      "focus": 75,
      "guard": 89,
      "spirit": 76,
      "edge": 88,
      "tempo": 81
    },
    "baseWard": {
      "Cindersong": 0.8,
      "Biteroot": 1.37,
      "Stratum": 0.8,
      "Rivet": 0.97,
      "Brine": 0.43,
      "Spark": 0.81,
      "Draft": 1.08,
      "Gloom": 0.76,
      "Bile": 0.95
    },
    "catchDifficulty": 21,
    "artSeed": 1214,
    "learnset": [
      {
        "level": 1,
        "motifId": "h11"
      },
      {
        "level": 6,
        "motifId": "k11"
      },
      {
        "level": 14,
        "motifId": "h25"
      },
      {
        "level": 24,
        "motifId": "h14"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the thornmere. The Index marks it uncommon.",
    "habitatBiomes": [
      "thornmere",
      "saltstair"
    ],
    "pitch": "Low"
  },
  {
    "id": "r75",
    "dexNumber": 75,
    "name": "Kalkaruslab",
    "primary": "Stratum",
    "secondary": "Brine",
    "rarity": "common",
    "baseStats": {
      "vigor": 89,
      "focus": 79,
      "guard": 77,
      "spirit": 85,
      "edge": 83,
      "tempo": 83
    },
    "baseWard": {
      "Cindersong": 1.05,
      "Biteroot": 1.04,
      "Stratum": 1.43,
      "Rivet": 1.04,
      "Brine": 0.79,
      "Spark": 0.6,
      "Draft": 0.79,
      "Gloom": 0.92,
      "Bile": 0.98
    },
    "catchDifficulty": 22,
    "artSeed": 1225,
    "learnset": [
      {
        "level": 1,
        "motifId": "h21"
      },
      {
        "level": 6,
        "motifId": "k12"
      },
      {
        "level": 14,
        "motifId": "h26"
      },
      {
        "level": 24,
        "motifId": "h24"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the slabgarden. The Index marks it common.",
    "habitatBiomes": [
      "slabgarden",
      "ashford"
    ],
    "pitch": "Mid"
  },
  {
    "id": "r76",
    "dexNumber": 76,
    "name": "Sevanvil",
    "primary": "Rivet",
    "secondary": null,
    "rarity": "uncommon",
    "baseStats": {
      "vigor": 73,
      "focus": 95,
      "guard": 93,
      "spirit": 94,
      "edge": 99,
      "tempo": 85
    },
    "baseWard": {
      "Cindersong": 0.99,
      "Biteroot": 0.81,
      "Stratum": 0.79,
      "Rivet": 1.4,
      "Brine": 1.07,
      "Spark": 0.95,
      "Draft": 0.41,
      "Gloom": 0.79,
      "Bile": 0.84
    },
    "catchDifficulty": 23,
    "artSeed": 1236,
    "learnset": [
      {
        "level": 1,
        "motifId": "h31"
      },
      {
        "level": 6,
        "motifId": "k01"
      },
      {
        "level": 14,
        "motifId": "h27"
      },
      {
        "level": 24,
        "motifId": "h34"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the rivetworks. The Index marks it uncommon.",
    "habitatBiomes": [
      "rivetworks",
      "saltstair"
    ],
    "pitch": "High"
  },
  {
    "id": "r77",
    "dexNumber": 77,
    "name": "Solmmelt",
    "primary": "Brine",
    "secondary": "Draft",
    "rarity": "common",
    "baseStats": {
      "vigor": 98,
      "focus": 73,
      "guard": 78,
      "spirit": 92,
      "edge": 72,
      "tempo": 77
    },
    "baseWard": {
      "Cindersong": 0.89,
      "Biteroot": 1.07,
      "Stratum": 0.98,
      "Rivet": 0.85,
      "Brine": 1.25,
      "Spark": 0.92,
      "Draft": 0.99,
      "Gloom": 0.36,
      "Bile": 0.79
    },
    "catchDifficulty": 24,
    "artSeed": 1247,
    "learnset": [
      {
        "level": 1,
        "motifId": "h38"
      },
      {
        "level": 6,
        "motifId": "k02"
      },
      {
        "level": 14,
        "motifId": "h28"
      },
      {
        "level": 24,
        "motifId": "h41"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the brinefen. The Index marks it common.",
    "habitatBiomes": [
      "brinefen",
      "ashford"
    ],
    "pitch": "Low"
  },
  {
    "id": "r78",
    "dexNumber": 78,
    "name": "Tindodelarc",
    "primary": "Spark",
    "secondary": "Gloom",
    "rarity": "rare",
    "baseStats": {
      "vigor": 51,
      "focus": 125,
      "guard": 104,
      "spirit": 106,
      "edge": 97,
      "tempo": 94
    },
    "baseWard": {
      "Cindersong": 0.83,
      "Biteroot": 0.78,
      "Stratum": 0.86,
      "Rivet": 0.78,
      "Brine": 1.09,
      "Spark": 1.38,
      "Draft": 0.95,
      "Gloom": 1,
      "Bile": 0.39
    },
    "catchDifficulty": 25,
    "artSeed": 1258,
    "learnset": [
      {
        "level": 1,
        "motifId": "h47"
      },
      {
        "level": 6,
        "motifId": "k03"
      },
      {
        "level": 14,
        "motifId": "h29"
      },
      {
        "level": 24,
        "motifId": "h50"
      }
    ],
    "ascension": [],
    "evolvesFrom": null,
    "flavor": "Recorded in the arcfield. The Index marks it rare.",
    "habitatBiomes": [
      "arcfield",
      "saltstair"
    ],
    "pitch": "Mid"
  }
];
