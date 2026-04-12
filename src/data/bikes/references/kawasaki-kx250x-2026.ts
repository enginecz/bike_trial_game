export interface RealBikeReferenceSource {
  label: string;
  url: string;
  accessedOn: string;
  notes: string;
}

export interface RealBikeReference {
  id: string;
  manufacturer: string;
  model: string;
  modelYear: number;
  bikeCategory: 'motocross' | 'trial' | 'enduro' | 'cross-country' | 'dual-sport';
  selectionReason: string;
  sourcePriorityNote: string;
  officialSpecs: {
    engine: Record<string, string | number>;
    transmission: Record<string, string | number>;
    chassisAndDimensions: Record<string, string | number>;
    suspensionAndBrakes: Record<string, string | number>;
    features: string[];
  };
  derivedSimulationHints: {
    frontWheelOuterRadiusMetersApprox: number;
    rearWheelOuterRadiusMetersApprox: number;
    frontWheelRimRadiusMeters: number;
    rearWheelRimRadiusMeters: number;
    frontTireSidewallHeightMetersApprox: number;
    rearTireSidewallHeightMetersApprox: number;
    notes: string[];
  };
  sources: RealBikeReferenceSource[];
}

export const kawasakiKx250x2026Reference: RealBikeReference = {
  id: 'kawasaki-kx250x-2026',
  manufacturer: 'Kawasaki',
  model: 'KX250X',
  modelYear: 2026,
  bikeCategory: 'cross-country',
  selectionReason:
    'Vybrano jako referencni realna motorka pro pozdejsi prevod do hry, protoze oficialni Kawasaki specifikace pro modelovy rok 2026 uvadeji nadprumerne mnoho technickych dat pouzitelnych pro simulaci.',
  sourcePriorityNote:
    'Primarne jsou ulozene oficialni hodnoty z vyrobce. Odvozene hodnoty pro simulaci jsou oznacene zvlast a nejsou to oficialni tovární specifikace.',
  officialSpecs: {
    engine: {
      engineType: 'Liquid-cooled, 4-stroke, single-cylinder',
      compressionRatio: '14.0:1',
      valveSystem: 'DOHC, 4 valves',
      displacementCc: 249,
      boreMm: 78.0,
      strokeMm: 52.2,
      fuelSystem: 'Fuel injection: 44 mm x 1',
      lubrication: 'Forced lubrication, semi-dry sump',
      startingSystem: 'Electric',
      ignitionSystem: 'Digital',
    },
    transmission: {
      gearbox: '5-speed, return shift',
      clutch: 'Wet, multi disc',
      primaryReductionRatio: '3.350 (67/20)',
      gearRatio1: '2.077 (27/13)',
      gearRatio2: '1.688 (27/16)',
      gearRatio3: '1.438 (23/16)',
      gearRatio4: '1.235 (21/17)',
      gearRatio5: '1.045 (23/22)',
      finalDrive: 'Chain',
      finalReductionRatio: '3.846 (50/13)',
    },
    chassisAndDimensions: {
      frameType: 'Perimeter, aluminium',
      overallLengthMm: 2185,
      overallWidthMm: 820,
      overallHeightMm: 1260,
      wheelbaseMm: 1485,
      trailMm: 123,
      steeringAngleLeftDeg: 42,
      steeringAngleRightDeg: 42,
      groundClearanceMm: 330,
      seatHeightMm: 950,
      curbMassKg: 110.6,
      fuelCapacityLiters: 6.2,
      frontTire: '90/90-21 54R',
      rearTire: '140/80-18 70R',
      frontWheelNominalDiameterInches: 21,
      rearWheelNominalDiameterInches: 18,
    },
    suspensionAndBrakes: {
      frontWheelTravelMm: 305,
      rearWheelTravelMm: 307,
      frontSuspensionType: 'Inverted fork with adjustable compression and rebound damping',
      frontSuspensionDiameterMm: 49,
      rearSuspensionType:
        'Uni-Trak, adjustable dual-range (high/low-speed) compression and adjustable rebound damping, and spring preload adjustability',
      frontBrakeType: 'Single semi-floating petal disc',
      frontBrakeDiameterMm: 270,
      frontBrakeCaliperType: 'Dual-piston',
      rearBrakeType: 'Single petal disc',
      rearBrakeDiameterMm: 240,
      rearBrakeCaliperType: 'Single-piston',
    },
    features: [
      'Hydraulic clutch',
      'Power Mode selection',
      'Kawasaki TRaction Control (KTRC)',
      'Smartphone connectivity via RIDEOLOGY THE APP KX',
      'Single-shaft primary balancer',
      'Adjustable ergonomics with multiple handlebar and footpeg positions',
      'Factory-style launch control mode',
      'Side stand as standard equipment',
      '21-inch front wheel and 18-inch rear wheel tuned for cross-country use',
    ],
  },
  derivedSimulationHints: {
    frontWheelOuterRadiusMetersApprox: 0.3477,
    rearWheelOuterRadiusMetersApprox: 0.3406,
    frontWheelRimRadiusMeters: 0.2667,
    rearWheelRimRadiusMeters: 0.2286,
    frontTireSidewallHeightMetersApprox: 0.081,
    rearTireSidewallHeightMetersApprox: 0.112,
    notes: [
      'Predni pneumatika 90/90-21 je aproximovana jako sirka 90 mm a profil 90 %, tedy bocnice cca 81 mm.',
      'Zadni pneumatika 140/80-18 je aproximovana jako sirka 140 mm a profil 80 %, tedy bocnice cca 112 mm.',
      'Vnejsi polomery kol jsou vypoctene jako polomer rafku plus vyska bocnice pneumatiky.',
      'Tyto odvozene hodnoty jsou pripravene pro pozdejsi mapovani do fyzikalnich parametru hry, ne jako presna homologacni data.',
    ],
  },
  sources: [
    {
      label: 'Kawasaki Europe official model page',
      url: 'https://www.kawasaki.eu/en/Motorcycles/Motocross-Enduro/KX250X_2026.html',
      accessedOn: '2026-04-11',
      notes:
        'Hlavni oficialni zdroj pouzity pro motor, prevody, rozmery, podvozek, brzdy, pneumatiky a vybavu.',
    },
    {
      label: 'Kawasaki EICMA page for KX250X',
      url: 'https://www.kawasaki.eu/en/EICMA/KX250X.html',
      accessedOn: '2026-04-11',
      notes:
        'Zalozni oficialni zdroj se stejnymi nebo velmi podobnymi technickymi specifikacemi a popisem vybavy.',
    },
    {
      label: 'Kawasaki Owner Center manual listing',
      url: 'https://www.kawasaki.com/en-us/owner-center/service-manuals/2025/KX252FSFNN',
      accessedOn: '2026-04-11',
      notes:
        'Pouzito jen jako potvrzeni, ze k modelove rade existuje oficialni vlastnicky a servisni manual; z tohoto zdroje nejsou prepsane technicke hodnoty.',
    },
  ],
};
