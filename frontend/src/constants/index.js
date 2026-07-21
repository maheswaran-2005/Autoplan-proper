// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// constants/index.js
// All fixed data lives here — no logic, no JSX
// If you need to change a dropdown option,
// you change it HERE and it updates everywhere.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const STEPS_LIST = [
  { id: 1, lbl: 'Owner' },
  { id: 2, lbl: 'Plot'  },
  { id: 3, lbl: 'Rooms' },
  { id: 4, lbl: 'Style' },
  { id: 5, lbl: 'Plan'  },
]

export const PRESETS = [
  ['20x30', 6.10,  9.14 ],
  ['30x40', 9.14,  12.19],
  ['40x30', 12.19, 9.14 ],
  ['40x60', 12.19, 18.29],
  ['50x80', 15.24, 24.38],
  ['60x40', 18.29, 12.19],
]

export const DIRS = [
  ['North', 'N', 'Kubera — Best'  ],
  ['East',  'E', 'Sun — Excellent'],
  ['South', 'S', 'Common'         ],
  ['West',  'W', 'Acceptable'     ],
]

export const EXTRAS = [
  { k: 'hasDining',  lbl: 'Dining Room'  },
  { k: 'hasBalcony', lbl: 'Entry Porch'  },
  { k: 'hasPooja',   lbl: 'Pooja Room'   },
  { k: 'hasStudy',   lbl: 'Study'        },
  { k: 'hasGarage',  lbl: 'Garage'       },
  { k: 'hasStore',   lbl: 'Store Room'   },
  { k: 'hasStair',   lbl: 'Staircase'    },
  { k: 'hasServant', lbl: 'Servant Room' },
]

export const GENERATE_MSGS = [
  'Applying Vastu zones...',
  'Carving toilets inside bedrooms...',
  'Drawing walls, doors & windows...',
  'Adding furniture & dimensions...',
]

export const WALL_OPTIONS = [
  ['115', '115mm (4.5in)'],
  ['230', '230mm (9in)' ],
  ['350', '350mm (14in)'],
]

export const FLOOR_OPTIONS = [
  ['G',   'Ground Only'],
  ['G+1', 'G+1'        ],
  ['G+2', 'G+2'        ],
]

export const VASTU_OPTIONS = [
  ['strict',    'Strict Vastu'  ],
  ['preferred', 'Preferred'     ],
  ['none',      'Not Required'  ],
]

export const STYLE_OPTIONS = [
  ['traditional',  'Traditional Indian'],
  ['contemporary', 'Contemporary'      ],
  ['minimalist',   'Minimalist'        ],
]

export const CONSTRUCTION_OPTIONS = [
  ['rcc',   'RCC Frame'    ],
  ['load',  'Load Bearing' ],
  ['steel', 'Steel Frame'  ],
]

// Default values for the whole form
export const INIT_CFG = {
  owner: '', phone: '', address: '', siteAddress: '',
  date: new Date().toISOString().slice(0, 10),
  plotL: 12.19, plotW: 9.14,
  beds: 2, facing: 'South',
  hasBalcony: true,  hasGarage:  false,
  hasPooja:   true,  hasStudy:   false,
  hasServant: false, hasStore:   false,
  hasStair:   false, hasDining:  true,
  wallThick: 230, floors: 'G',
  vastu: 'strict', archStyle: 'traditional',
  construction: 'rcc', notes: '',
}

// Room color map used by canvas drawing
export const ROOM_COLORS = {
  bedroom:  { f: '#fff9f2', s: '#9a6820', l: '#6a4010' },
  bathroom: { f: '#edf4fb', s: '#2460a0', l: '#143c70' },
  living:   { f: '#f0f9f2', s: '#226040', l: '#124028' },
  kitchen:  { f: '#fff4ec', s: '#a03818', l: '#701808' },
  dining:   { f: '#fffaee', s: '#9a7018', l: '#6a4a08' },
  pooja:    { f: '#fffbf0', s: '#b08010', l: '#786000' },
  study:    { f: '#f4f0ff', s: '#4838b0', l: '#281880' },
  balcony:  { f: '#f0faf4', s: '#226040', l: '#124028' },
  garage:   { f: '#f3f3f3', s: '#606060', l: '#303030' },
  store:    { f: '#faf5ee', s: '#806030', l: '#503810' },
  stair:    { f: '#eef0ff', s: '#3840a0', l: '#181870' },
  servant:  { f: '#fff0f8', s: '#b04090', l: '#781868' },
}
