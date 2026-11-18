export const BIOMES = [
  {
    "id": "emberwake",
    "name": "Emberwake",
    "harmonic": "Cindersong",
    "transition": false
  },
  {
    "id": "brinefen",
    "name": "Brinefen",
    "harmonic": "Brine",
    "transition": false
  },
  {
    "id": "slabgarden",
    "name": "Slabgarden",
    "harmonic": "Stratum",
    "transition": false
  },
  {
    "id": "galebreak",
    "name": "Galebreak",
    "harmonic": "Draft",
    "transition": false
  },
  {
    "id": "duskveil",
    "name": "Duskveil",
    "harmonic": "Gloom",
    "transition": false
  },
  {
    "id": "thornmere",
    "name": "Thornmere",
    "harmonic": "Biteroot",
    "transition": false
  },
  {
    "id": "rivetworks",
    "name": "Rivetworks",
    "harmonic": "Rivet",
    "transition": false
  },
  {
    "id": "arcfield",
    "name": "Arcfield",
    "harmonic": "Spark",
    "transition": false
  },
  {
    "id": "blightmire",
    "name": "Blightmire",
    "harmonic": "Bile",
    "transition": false
  },
  {
    "id": "ashford",
    "name": "Ashford",
    "harmonic": null,
    "transition": true
  },
  {
    "id": "saltstair",
    "name": "Saltstair",
    "harmonic": null,
    "transition": true
  }
] as const;
export const MAPS = {
  "ashfen": [
    "########################",
    "#@......n......,,,,,..>#",
    "#......####............#",
    "#..+...#..#..$..,,,,,..#",
    "#......####......A.....#",
    "#..n.....n........B....#",
    "#,,,,,,,,,,,,,,,,,,,,,,#",
    "########################"
  ],
  "saltspan": [
    "########################",
    "#<....n.....~~~~..,,,,>#",
    "#..####....~~~~........#",
    "#..#V.#..$..n...C......#",
    "#..####........D.......#",
    "#......n.......E..,,,,,#",
    "#,,,,,,,,,,,,,,,,,,,,,,#",
    "########################"
  ],
  "duskstair": [
    "########################",
    "#<..n.....F...........>#",
    "#.....####.....G.......#",
    "#..+..#..#..n..H.......#",
    "#.....#Z.#.............#",
    "#.....####.....n..*....#",
    "#,,,,,,,,,,,,,,,,,,,,,,#",
    "########################"
  ],
  "hall": [
    "########################",
    "#n.n.n.n.n.n.n.n.n.n.n.#",
    "#n..n..n...............#",
    "#n.n.n.n.n.n.n.n.n.n.n.#",
    "#......................#",
    "#n.n.n.n.n.n.<.........#",
    "########################"
  ]
} as const;
export const ZONE_ORDER = ['ashfen', 'saltspan', 'duskstair'] as const;
