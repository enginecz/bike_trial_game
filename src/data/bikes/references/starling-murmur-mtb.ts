export interface MtbResearchSource {
  label: string;
  url: string;
  accessedOn: string;
  sourceType: 'official-spec-page' | 'review' | 'secondary-analysis';
  notes: string;
}

export interface MtbReference {
  id: string;
  title: string;
  manufacturer: string;
  model: string;
  category: 'trail' | 'enduro' | 'downcountry' | 'all-mountain';
  suspensionLayout: {
    rearDesign: string;
    confidence: 1 | 2 | 3 | 4 | 5;
    notes: string;
  };
  selectionReason: string[];
  recommendedGameUse: string[];
  framePlatform: {
    materialFrontTriangle: string;
    materialRearTriangle: string;
    wheelSize: string;
    rearTravelMm: number;
    frontTravelMm: number;
    shockSize: string;
    maxTire: string;
    rearAxle: string;
    bottomBracket: string;
    headsetTop: string;
    headsetBottom: string;
    brakeMount: string;
    maxDiscMm: number;
    mainPivotBearings: string;
  };
  geometryLarge: {
    reachMm: number;
    stackMm: number;
    headAngleDeg: number;
    seatAngleDeg: number;
    seatTubeMm: number;
    headTubeMm: number;
    chainstayMm: number;
    wheelbaseMm: number;
    bottomBracketDropMm: number;
    effectiveTopTubeMm: number;
    maxSeatpostInsertionMm: number;
  };
  researchNotes: {
    directlyPublished: string[];
    inferredButUseful: string[];
    stillMissingForHighFidelityPhysics: string[];
  };
  usefulSimulationHints: {
    useAsReferenceFor: string[];
    currentConfidenceSummary: string;
    likelyEasyNextDataToFind: string[];
  };
  sources: MtbResearchSource[];
}

export const starlingMurmurMtbReference: MtbReference = {
  id: 'starling-murmur-mtb-reference',
  title: 'Starling Murmur Single-Pivot MTB Reference',
  manufacturer: 'Starling Cycles',
  model: 'Murmur',
  category: 'trail',
  suspensionLayout: {
    rearDesign: 'Single-pivot full-suspension steel 29er',
    confidence: 1,
    notes:
      'Vyrobce explicitne popisuje Murmur jako single-pivot design; to z nej dela velmi vhodny referencni ramec pro jednoduchou simulaci.',
  },
  selectionReason: [
    'Vyrobce explicitne uvadi single-pivot suspension design.',
    'Oficialni stranka zverejnuje geometrii, zdvihy, rozmer tlumice, velikost kol a dalsi technicke detaily.',
    'Geometrie a konstrukce jsou dostatecne jednoduche pro prevod do hry.',
    'Sekundarni recenze doplnuji kvalitativni informace o poloze hlavniho pivotu a charakteru leverage rate.',
  ],
  recommendedGameUse: [
    'Vhodne jako referencni MTB pro budouci nemotorovou variantu hry.',
    'Vhodne jako vychozi single-pivot platforma pro simulaci trail / all-mountain kola.',
    'Dobry kandidat pro pozdejsi 2D rekonstrukci pivotu a osy hlavove trubky ze side-view obrazku.',
  ],
  framePlatform: {
    materialFrontTriangle: 'Reynolds 853 heat-treated steel',
    materialRearTriangle: 'Heat-treated Chromoly steel',
    wheelSize: '29"',
    rearTravelMm: 135,
    frontTravelMm: 150,
    shockSize: '210 x 55 mm',
    maxTire: '29 x 2.6"',
    rearAxle: '148x12 mm Boost',
    bottomBracket: '73 mm threaded',
    headsetTop: 'ZS44/28.6',
    headsetBottom: 'EC44/40',
    brakeMount: 'Post Mount 180 mm',
    maxDiscMm: 203,
    mainPivotBearings: '6902 2RS',
  },
  geometryLarge: {
    reachMm: 485,
    stackMm: 629,
    headAngleDeg: 65.0,
    seatAngleDeg: 78.0,
    seatTubeMm: 440,
    headTubeMm: 110,
    chainstayMm: 445,
    wheelbaseMm: 1260,
    bottomBracketDropMm: 34,
    effectiveTopTubeMm: 628,
    maxSeatpostInsertionMm: 310,
  },
  researchNotes: {
    directlyPublished: [
      'Rear travel 135 mm',
      'Front travel 150 mm',
      'Shock size 210 x 55 mm',
      '29-inch wheel format',
      'Large size geometry values: reach, stack, head angle, seat angle, chainstay, wheelbase, BB drop',
      'Axle standard, headset standard, bottom bracket standard, max tire and brake mount details',
    ],
    inferredButUseful: [
      'BikeRadar uvadi, ze main pivot sedi tesne nad prednim chainringem.',
      'BikeRadar a dalsi recenze popisuji leverage rate jako linearni nebo temer konstantni skrz zdvih.',
      'Z oficialnich a review fotografii lze pravdepodobne zrekonstruovat 2D polohu hlavniho pivotu, zadni osy a osy hlavove trubky.',
    ],
    stillMissingForHighFidelityPhysics: [
      'Presna 2D souradnice hlavniho pivotu vuci BB a zadni ose',
      'Presna leverage curve v cislech',
      'Shock damping curves',
      'Hmotnost ramu a podsestav',
      'Momenty setrvacnosti ramu a kol',
      'Realne grip/slip charakteristiky MTB plaste',
    ],
  },
  usefulSimulationHints: {
    useAsReferenceFor: [
      'single-pivot kinematics',
      '29er trail-bike proportions',
      'rear travel to shock stroke relationship',
      'head angle / wheelbase / chainstay combination typical for modern trail MTB',
    ],
    currentConfidenceSummary:
      'Pro geometrii a zakladni platform data je reference silna. Pro pivot souradnice a kinematicke krivky je zatim vhodna jako polovina cesty mezi official data a informed estimate.',
    likelyEasyNextDataToFind: [
      'Frame-only side-view images in higher resolution',
      'Measured frame weight from reviews or owner builds',
      'Leverage-curve or anti-squat analysis from external linkage-analysis sources',
    ],
  },
  sources: [
    {
      label: 'Starling Cycles Murmur frame page',
      url: 'https://www.starlingcycles.com/frames/murmur/',
      accessedOn: '2026-04-11',
      sourceType: 'official-spec-page',
      notes:
        'Hlavni oficialni zdroj pro technicke detaily, zdvihy, rozmer tlumice, axle standardy a aktualni geometrii.',
    },
    {
      label: 'Starling Cycles Murmur complete bike page',
      url: 'https://www.starlingcycles.com/bikes/murmur-complete-bike/',
      accessedOn: '2026-04-11',
      sourceType: 'official-spec-page',
      notes:
        'Potvrzuje kategorii, zdvihy, wheel size a positioning modelu jako trail/enduro 29er.',
    },
    {
      label: 'BikeRadar Starling Murmur review (2024)',
      url: 'https://www.bikeradar.com/author/reviews/bikes/mountain-bikes/full-suspension-mountain-bikes/starling-murmur-review',
      accessedOn: '2026-04-11',
      sourceType: 'review',
      notes:
        'Uzitecny sekundarni zdroj pro kvalitativni info: pivot nad chainringem, linearni leverage rate, anti-rise charakter a celkovy feeling zadni stavby.',
    },
    {
      label: 'BikeRadar Starling Murmur review (2021)',
      url: 'https://www.bikeradar.com/reviews/bikes/mountain-bikes/full-suspension-mountain-bikes/2021-starling-murmur-review',
      accessedOn: '2026-04-11',
      sourceType: 'review',
      notes:
        'Doplnek k geometrii a potvrzeni linearniho charakteru zadniho odpruzeni v drivejsi verzi platformy.',
    },
  ],
};
