export const TOKENS = [
  {
    "id": "t01",
    "name": "Vigor Tonic",
    "kind": "heal",
    "price": 40,
    "description": "Restores a share of Vigor."
  },
  {
    "id": "t02",
    "name": "Chorus Salve",
    "kind": "fullheal",
    "price": 55,
    "description": "Restores Vigor fully."
  },
  {
    "id": "t03",
    "name": "Stillwater",
    "kind": "clear",
    "price": 70,
    "description": "Clears a status."
  },
  {
    "id": "t04",
    "name": "Gleam Mote",
    "kind": "gleam",
    "price": 85,
    "description": "A small traded gleam."
  },
  {
    "id": "t05",
    "name": "Bond Salt",
    "kind": "bond",
    "price": 100,
    "description": "Raises Resonance."
  },
  {
    "id": "t06",
    "name": "Sanctum Seal",
    "kind": "heal",
    "price": 115,
    "description": "Restores a share of Vigor."
  },
  {
    "id": "t07",
    "name": "Cadence Bell",
    "kind": "fullheal",
    "price": 130,
    "description": "Restores Vigor fully."
  },
  {
    "id": "t08",
    "name": "Ward Chalk",
    "kind": "clear",
    "price": 145,
    "description": "Clears a status."
  },
  {
    "id": "t09",
    "name": "Lumen Shard",
    "kind": "gleam",
    "price": 160,
    "description": "A small traded gleam."
  },
  {
    "id": "t10",
    "name": "Ash Lozeng",
    "kind": "bond",
    "price": 175,
    "description": "Raises Resonance."
  },
  {
    "id": "t11",
    "name": "Vigor Tonic 10",
    "kind": "heal",
    "price": 190,
    "description": "Restores a share of Vigor."
  },
  {
    "id": "t12",
    "name": "Chorus Salve 11",
    "kind": "fullheal",
    "price": 205,
    "description": "Restores Vigor fully."
  },
  {
    "id": "t13",
    "name": "Stillwater 12",
    "kind": "clear",
    "price": 220,
    "description": "Clears a status."
  },
  {
    "id": "t14",
    "name": "Gleam Mote 13",
    "kind": "gleam",
    "price": 235,
    "description": "A small traded gleam."
  },
  {
    "id": "t15",
    "name": "Bond Salt 14",
    "kind": "bond",
    "price": 250,
    "description": "Raises Resonance."
  },
  {
    "id": "t16",
    "name": "Sanctum Seal 15",
    "kind": "heal",
    "price": 265,
    "description": "Restores a share of Vigor."
  },
  {
    "id": "t17",
    "name": "Cadence Bell 16",
    "kind": "fullheal",
    "price": 280,
    "description": "Restores Vigor fully."
  },
  {
    "id": "t18",
    "name": "Ward Chalk 17",
    "kind": "clear",
    "price": 295,
    "description": "Clears a status."
  },
  {
    "id": "t19",
    "name": "Lumen Shard 18",
    "kind": "gleam",
    "price": 310,
    "description": "A small traded gleam."
  },
  {
    "id": "t20",
    "name": "Ash Lozeng 19",
    "kind": "bond",
    "price": 325,
    "description": "Raises Resonance."
  },
  {
    "id": "t21",
    "name": "Vigor Tonic 20",
    "kind": "heal",
    "price": 340,
    "description": "Restores a share of Vigor."
  },
  {
    "id": "t22",
    "name": "Chorus Salve 21",
    "kind": "fullheal",
    "price": 355,
    "description": "Restores Vigor fully."
  },
  {
    "id": "t23",
    "name": "Stillwater 22",
    "kind": "clear",
    "price": 370,
    "description": "Clears a status."
  },
  {
    "id": "t24",
    "name": "Gleam Mote 23",
    "kind": "gleam",
    "price": 385,
    "description": "A small traded gleam."
  },
  {
    "id": "t25",
    "name": "Bond Salt 24",
    "kind": "key",
    "price": 400,
    "description": "Opens a sealed way."
  },
  {
    "id": "t26",
    "name": "Sanctum Seal 25",
    "kind": "key",
    "price": 415,
    "description": "Opens a sealed way."
  },
  {
    "id": "t27",
    "name": "Cadence Bell 26",
    "kind": "key",
    "price": 430,
    "description": "Opens a sealed way."
  },
  {
    "id": "t28",
    "name": "Ward Chalk 27",
    "kind": "key",
    "price": 445,
    "description": "Opens a sealed way."
  },
  {
    "id": "t29",
    "name": "Lumen Shard 28",
    "kind": "key",
    "price": 460,
    "description": "Opens a sealed way."
  },
  {
    "id": "t30",
    "name": "Ash Lozeng 29",
    "kind": "key",
    "price": 475,
    "description": "Opens a sealed way."
  }
] as const;
export const PRIME = {
  "id": "prime",
  "name": "Prime Voice Ivo Quarne",
  "title": "Prime Voice",
  "harmonic": "Bile",
  "team": [
    "r25",
    "r26",
    "r27",
    "r36"
  ],
  "levels": [
    36,
    38,
    40,
    42
  ],
  "opener": "h70"
} as const;
export const RIVAL = {
  "id": "rival",
  "name": "Rival Nerris Vale",
  "stages": [
    "r01",
    "r04",
    "r07"
  ]
} as const;
export const SANCTUM_RULES = [
  {
    "id": "A",
    "rule": {
      "kind": "harmonic-lock",
      "harmonic": "Cindersong"
    }
  },
  {
    "id": "B",
    "rule": {
      "kind": "solo"
    }
  },
  {
    "id": "C",
    "rule": {
      "kind": "non-harmonic-only"
    }
  },
  {
    "id": "D",
    "rule": {
      "kind": "swap-at-half"
    }
  },
  {
    "id": "E",
    "rule": {
      "kind": "bench-pool"
    }
  },
  {
    "id": "F",
    "rule": {
      "kind": "phrase-limit",
      "max": 8
    }
  },
  {
    "id": "G",
    "rule": {
      "kind": "endure",
      "phrases": 3
    }
  },
  {
    "id": "H",
    "rule": {
      "kind": "reverse"
    }
  }
] as const;
