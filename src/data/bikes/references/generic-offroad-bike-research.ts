export interface ResearchSource {
  label: string;
  url: string;
  accessedOn: string;
  sourceType:
    | 'official-spec-page'
    | 'official-manual'
    | 'standard'
    | 'academic-paper'
    | 'methodology'
    | 'secondary-reference';
  notes: string;
}

export interface PublishedRange {
  parameter: string;
  unit: string;
  motocross?: string;
  enduro?: string;
  trial?: string;
  notes: string;
}

export interface OnlineAcquisitionRecipe {
  parameterId: string;
  parameterLabel: string;
  whyItIsHardOnline: string;
  directOnlineAvailability: 'common' | 'occasional' | 'rare' | 'almost-never';
  bestSourceOrder: string[];
  searchQueries: string[];
  extractionWorkflow: string[];
  expectedOutput: string[];
  trustLevelIfFound: string;
  fallbackWhenMissing: string[];
}

export interface GenericOffroadBikeResearchReference {
  id: string;
  title: string;
  scope: string;
  usage: string[];
  categoryProfiles: {
    summary: string;
    observedPublishedRanges: PublishedRange[];
    notes: string[];
  };
  onlineResearchWorkflow: {
    overview: string[];
    sourcePriority: string[];
    dataHygieneRules: string[];
    hardParameterRecipes: OnlineAcquisitionRecipe[];
  };
  sources: ResearchSource[];
}

export const genericOffroadBikeResearchReference: GenericOffroadBikeResearchReference = {
  id: 'generic-offroad-bike-research-reference-v1',
  title: 'Generic MX / Enduro / Trial Bike Online Research Reference',
  scope:
    'Genericky referencni soubor pro online ziskavani fyzikalnich, geometrickych a podvozkovych dat pro off-road motocykly typu motocross, enduro a trial.',
  usage: [
    'Pouzij jako vychozi workflow pred vytvorenim nebo ladeni konkretni motorky v hre.',
    'Nejde o jeden realny model. Jde o souhrn metod a typickych publikovanych rozsahu, ktere se opakuji napric kategoriemi.',
    'Konkretni modelova reference jako Kawasaki se ma na tento soubor napojovat, ne ho duplikovat.',
    'Co je v tomto souboru "observed range", to neni tvrzeni o vsech motorkach dane kategorie, ale prakticky rozsah z reprezentativnich oficialnich zdroju.',
  ],
  categoryProfiles: {
    summary:
      'Typicke publikovane rozdily mezi kategoriemi, sestavene z oficialnich specifikaci reprezentativnich modelu: Kawasaki KX450 (motocross), KTM 450 XCF-W / KTM 390 Enduro R (enduro), Montesa Cota 4RT 260R (trial).',
    observedPublishedRanges: [
      {
        parameter: 'frontWheelDiameter',
        unit: 'inch',
        motocross: '21',
        enduro: '21',
        trial: '21',
        notes: 'Predni kolo je napric kategoriemi casto 21".',
      },
      {
        parameter: 'rearWheelDiameter',
        unit: 'inch',
        motocross: '19',
        enduro: '18',
        trial: '18',
        notes: 'Motocross casteji 19", enduro a trial casteji 18".',
      },
      {
        parameter: 'wheelbase',
        unit: 'mm',
        motocross: '1480 to 1485',
        enduro: '1475 to 1506',
        trial: '1320',
        notes: 'Trial motorky maji vyrazne kratsi rozvor.',
      },
      {
        parameter: 'frontTravel',
        unit: 'mm',
        motocross: '305',
        enduro: '230 to 300',
        trial: '158 to 190',
        notes: 'Trial ma vyrazne mensi zdvihy nez MX a enduro.',
      },
      {
        parameter: 'rearTravel',
        unit: 'mm',
        motocross: '307',
        enduro: '230 to 310',
        trial: '170',
        notes: 'Enduro se deli na ostre zavodni a civilnejsi dual-sport podtypy.',
      },
      {
        parameter: 'curbOrReadyToRideMass',
        unit: 'kg',
        motocross: 'about 113',
        enduro: 'about 106 to 165 depending on sub-type',
        trial: 'about 78',
        notes: 'Trial je nejlehci; dual-sport enduro muze byt vyrazne tezsi.',
      },
      {
        parameter: 'groundClearance',
        unit: 'mm',
        motocross: '345',
        enduro: '272 to 347',
        trial: '310 to 335',
        notes: 'Trial ma velkou svetlou vysku navzdory nizke vysce sedla.',
      },
      {
        parameter: 'seatHeight',
        unit: 'mm',
        motocross: '960',
        enduro: '890 to 963',
        trial: '677 to 680 typical seatless-trial published value',
        notes:
          'Trial udaj je z publikovaneho "seat height", ale ergonomicky je kategorie odlisna a sedlo neni srovnatelne s MX/enduro.',
      },
      {
        parameter: 'trail',
        unit: 'mm',
        motocross: '115',
        enduro: '107 to 120',
        trial: 'about 58 to 63',
        notes: 'Trial ma velmi maly trail a jinou geometrii rizeni.',
      },
      {
        parameter: 'rakeOrCasterAngle',
        unit: 'deg',
        motocross: 'not always published, often mid-to-high 20s',
        enduro: 'sometimes published on street-legal models, example 62.3 steering head angle format on KTM road-legal specs',
        trial: 'about 23.2',
        notes:
          'Vyrobci nepouzivaji jednotne znacenou geometrii; nekde je uveden rake, jinde steering head angle nebo caster angle.',
      },
    ],
    notes: [
      'Pro hrubi herni proporce jde online vytahnout velmi dobre: kola, rozvor, zdvihy, hmotnost, trail, svetlou vysku a rozmery pneumatik.',
      'Pro presne tezke parametry online workflow funguje spis jako pipeline na dukazy a odhady nez jako zaruka primeho nalezu.',
      'Trial ma nejvetsi odchylku od MX/enduro nejen rozmery, ale i filozofii geometrie a rozlozeni hmotnosti.',
    ],
  },
  onlineResearchWorkflow: {
    overview: [
      'Nejdriv sesbirat oficialni spec page, owner manual, service manual a OEM parts fiche.',
      'Potom ziskat kvalitni side-view obrazy a servisni rozkresy pro geometrii.',
      'Nakonec resit tezke parametry po jednom: CG, mass split, pivoty, spring rates, damping, inertia, tyre curves.',
      'Kazdy parametr oznacit jednim z tagu: directly-published, inferred-from-geometry, inferred-from-similar-bike, unknown.',
      'Nikdy nemichat prime oficialni hodnoty s odhady bez oznaceni puvodu.',
    ],
    sourcePriority: [
      '1. Official manufacturer specs',
      '2. Official owner manual',
      '3. Official service manual / workshop manual',
      '4. OEM parts fiche / exploded diagrams',
      '5. Academic papers and standards',
      '6. High-quality photogrammetry or image-metrology workflow over official media images',
      '7. Reputable tuner or dyno sources',
      '8. Similar-bike fallback estimates',
    ],
    dataHygieneRules: [
      'Kazdou hodnotu uloz s puvodem: official, measured-in-paper, inferred, estimated.',
      'U geometrie oddeluj 2D side-view estimate od 3D confirmed geometry.',
      'U pneumatik oddeluj published tire size od fitted tire force model.',
      'U tlumeni oddeluj click settings od real force-velocity curve.',
      'Kdyz zdroj uvadi steering head angle nebo caster angle, neprepisuj to automaticky na rake bez poznamky o konvenci.',
    ],
    hardParameterRecipes: [
      {
        parameterId: 'center-of-gravity',
        parameterLabel: 'Poloha teziste motorky',
        whyItIsHardOnline:
          'Vyrobci ji bezne nepublikuji a akademicke papers ji pro konkretni off-road model uvadeji jen vyjimecne.',
        directOnlineAvailability: 'rare',
        bestSourceOrder: [
          'Paper / thesis o konkretnim modelu nebo velmi blizkem modelu',
          'Zdroj odkazujici na mereni dle ISO 9130:2005',
          'Homologacni nebo vyvojovy dokument s axle loads',
          '2D/3D odhad z geometrii, hmotnosti a layoutu',
        ],
        searchQueries: [
          '"<model>" center of gravity motorcycle',
          '"<model>" CG motorcycle',
          '"<model>" weight distribution motorcycle',
          'ISO 9130 motorcycle centre of gravity',
        ],
        extractionWorkflow: [
          'Zkus najit paper nebo thesis se stejnym modelem; pokud neni, pouzij co nejblizsi bike stejne kategorie a kubatury.',
          'Pokud existuji axle loads nebo front/rear weight split, uloz je jako mezikrok pro pozdejsi vypocet longitudinalni polohy CG.',
          'Z oficialnich fotek a wheelbase priprav 2D side-view geometrii a zakresli hlavni hmotove uzly: engine, rider zone, fuel tank, wheels.',
          'Odhadni CG jen jako inferred value a pripoj confidence note.',
        ],
        expectedOutput: [
          'Idealne x/z poloha teziste v souradnicich motorky',
          'Realisticky online casto jen longitudinal CG estimate a kvalitativni vyska CG',
        ],
        trustLevelIfFound:
          'Vysoka jen pokud zdroj explicitne uvadi mereni nebo normu ISO 9130; jinak stredni az nizka.',
        fallbackWhenMissing: [
          'Pouzij CG podobne MX/enduro/trial motorky ze studie nebo multibody paperu.',
          'Prototypove aproximuj CG podle wheelbase, engine placement a mass split.',
        ],
      },
      {
        parameterId: 'mass-distribution',
        parameterLabel: 'Rozlozeni hmotnosti predni / zadni osa',
        whyItIsHardOnline:
          'Mediatesty to obcas zmeri, ale u off-road motorek je to verejne mene caste nez u silnicnich modelu.',
        directOnlineAvailability: 'occasional',
        bestSourceOrder: [
          'Instrumented media test nebo paper',
          'Homologacni dokumenty / axle load style data',
          'CG paper',
          'Inference z wheelbase a CG estimate',
        ],
        searchQueries: [
          '"<model>" front rear weight distribution',
          '"<model>" axle load motorcycle',
          '"<model>" weight balance motorcycle',
        ],
        extractionWorkflow: [
          'Hledej prime procento predni/zadni hmotnosti nebo axle loads.',
          'Pokud mas longitudinal CG a celkovou hmotnost, dopocti rozlozeni hmotnosti.',
          'U trial motorky cekej vice centralizovanou hmotu a jinou ergonomii nez u MX/enduro.',
        ],
        expectedOutput: [
          'Front percentage',
          'Rear percentage',
          'Poznamka zda s palivem / bez paliva / s jezdcem',
        ],
        trustLevelIfFound:
          'Vysoka jen pri explicitnim mereni; jinak stredni, pokud je odvozena z dobre dolozeneho CG.',
        fallbackWhenMissing: [
          'Pouzij odhad z podobne kategorie a wheelbase.',
          'Oznac jako category-based estimate.',
        ],
      },
      {
        parameterId: 'swingarm-pivot',
        parameterLabel: 'Presna poloha swingarm pivotu',
        whyItIsHardOnline:
          'Casto neni publikovana jako souradnice; musi se rekonstruovat z obrazku, vykresu nebo servisnich dat.',
        directOnlineAvailability: 'rare',
        bestSourceOrder: [
          'Service manual s frame drawing nebo repair geometry',
          'OEM parts fiche a frame diagrams',
          'Official side-view image set + image metrology',
          'Photogrammetry workflow',
        ],
        searchQueries: [
          '"<model>" service manual frame pdf',
          '"<model>" swingarm pivot',
          '"<model>" parts diagram swingarm frame',
          '"<model>" side view official',
        ],
        extractionWorkflow: [
          'Sesbirat side-view obrazky s minimalni perspektivni deformaci a znamym wheelbase.',
          'Pouzit image-metrology nebo photogrammetry pristup a zkalibrovat meritko pres wheelbase a wheel diameters.',
          'Oznacit stred osy zadniho kola, steering head axis a podezrelou polohu swingarm pivotu z rozkresu nebo vizualu.',
          'Vysledek ulozit jako 2D side-view estimate nebo 3D photogrammetry estimate podle kvality dat.',
        ],
        expectedOutput: [
          '2D souradnice pivotu v side-view souradnicove soustave',
          'Confidence note a reference image set',
        ],
        trustLevelIfFound:
          'Stredni pri kvalitni fotometrii; vysoka az po potvrzeni z manualu nebo 3D dat.',
        fallbackWhenMissing: [
          'Odhad z podobneho ramu a podobne kubatury.',
          'V game modelu oznacit jako geometry-fit parameter, ne jako verified real value.',
        ],
      },
      {
        parameterId: 'steering-head-position',
        parameterLabel: 'Presna poloha steering head a osa rizeni',
        whyItIsHardOnline:
          'Vyrobce casto zverejni jen trail a nekdy rake/caster angle, ale ne uplnou polohu osy vuci ramu.',
        directOnlineAvailability: 'rare',
        bestSourceOrder: [
          'Service manual',
          'Official specs with rake/trail/caster',
          'Official side-view media images',
          'Image metrology / photogrammetry',
        ],
        searchQueries: [
          '"<model>" rake trail',
          '"<model>" caster angle trail',
          '"<model>" steering head angle',
          '"<model>" service manual steering stem',
        ],
        extractionWorkflow: [
          'Nejdriv uloz publikovane trail, rake nebo steering head angle presne tak, jak je zdroj pojmenoval.',
          'Zkalibruj side-view image na wheelbase a wheel size.',
          'Sestav osu predni vidlice / steering stemu a protni ji s ramenem ramu.',
          'Vysledek uloz oddelene jako published-angle a reconstructed-head-position.',
        ],
        expectedOutput: [
          'Published geometry labels from spec',
          '2D reconstructed steering axis and head position',
        ],
        trustLevelIfFound:
          'U uhlu stredni az vysoka; u absolutni polohy bez CAD spis stredni.',
        fallbackWhenMissing: [
          'Pouzij trail a wheel radius pro hruby after-the-fact fit v simulaci.',
        ],
      },
      {
        parameterId: 'subassembly-masses',
        parameterLabel: 'Hmotnosti podsestav',
        whyItIsHardOnline:
          'Kompletni mass breakdown vyrobci skoro nikdy nepublikuji a teardown data byvaji kusovita.',
        directOnlineAvailability: 'rare',
        bestSourceOrder: [
          'Academic model / thesis with mass breakdown',
          'OEM parts + aftermarket replacement weights',
          'Teardown / rebuild content',
          'Comparable-bike model',
        ],
        searchQueries: [
          '"<model>" engine weight',
          '"<model>" frame weight',
          '"<model>" wheel weight',
          '"<model>" teardown',
          '"<model>" bare frame',
        ],
        extractionWorkflow: [
          'Sepsat podsestavy: frame, swingarm, fork assembly, front wheel, rear wheel, engine, exhaust, fuel, rider proxy.',
          'Hledat prime vahy komponent v aftermarket a servisu.',
          'Kde nejsou prime vahy, inferovat z podobnych modelu stejne kategorie a materialu.',
          'Pri skladani zkontrolovat, ze suma dava smysl vuci publikovane ready-to-ride nebo curb mass.',
        ],
        expectedOutput: [
          'Mass breakdown with per-part confidence',
          'Residual mass bucket for unknown components',
        ],
        trustLevelIfFound:
          'Stredni jen pri vice nez jednom konzistentnim zdroji; jinak nizka az stredni.',
        fallbackWhenMissing: [
          'Pouzij category template a dopocti z total mass.',
          'Zachovej audit trail, kolik hmoty je only-estimated.',
        ],
      },
      {
        parameterId: 'spring-rates',
        parameterLabel: 'Fork a shock spring rates',
        whyItIsHardOnline:
          'U nekterych modelu jsou primo v manualech, u jinych jen doporucene varianty podle hmotnosti jezdce.',
        directOnlineAvailability: 'common',
        bestSourceOrder: [
          'Owner / service manual',
          'OEM setup sheet',
          'Aftermarket spring catalog',
          'Suspension tuner tables',
        ],
        searchQueries: [
          '"<model>" fork spring rate',
          '"<model>" shock spring rate',
          '"<model>" owner manual spring rate',
          '"<model>" service manual spring',
        ],
        extractionWorkflow: [
          'Projdi owner/service manual a najdi tuning / chassis section.',
          'Uloz standardni spring rate i nabidku soft/stiff variant.',
          'Pokud manual uvadi pouze rider-weight table, uloz to jako practical setup data, ne jako direct stock spring constant unless marked STD.',
        ],
        expectedOutput: [
          'Front spring rate',
          'Rear spring rate',
          'Optional rate table',
        ],
        trustLevelIfFound:
          'Vysoka, pokud je hodnota explicitne uvedena v owner/service manualu nebo OEM tabulce.',
        fallbackWhenMissing: [
          'Pouzij tuner catalog pro stejny fork/shock model.',
          'Jako nouzi pouzij category average a poznamku.',
        ],
      },
      {
        parameterId: 'damping-curves',
        parameterLabel: 'Realne damping curves tlumicu',
        whyItIsHardOnline:
          'Kliky nastaveni jsou bezne publikovane, ale force-velocity curves jsou vetsinou jen z dyno testu nebo od vyvojaru tlumeni.',
        directOnlineAvailability: 'rare',
        bestSourceOrder: [
          'Suspension dyno chart for exact fork/shock',
          'Academic paper on in-vehicle identification',
          'Tuner dyno examples',
          'Click settings from manuals as weak fallback',
        ],
        searchQueries: [
          '"<model>" shock dyno',
          '"<model>" fork dyno',
          '"<fork model>" damping curve',
          '"<shock model>" force velocity curve',
        ],
        extractionWorkflow: [
          'Neplest si click settings s damping curve.',
          'Pokud najdes dyno graf, uloz osu, jednotky a smer compression/rebound.',
          'Pokud mas jen paper o identifikaci, uloz metodiku a pouzij curve only as analogous reference.',
        ],
        expectedOutput: [
          'Compression force vs shaft velocity curve',
          'Rebound force vs shaft velocity curve',
          'Source note whether exact component or analogous component',
        ],
        trustLevelIfFound:
          'Vysoka jen pri exact dyno chartu daneho komponentu; jinak stredni az nizka.',
        fallbackWhenMissing: [
          'Pouzij spring rate + travel + category archetype damper shape.',
          'V simulaci oznac jako game-fit damping, ne real verified damping.',
        ],
      },
      {
        parameterId: 'moments-of-inertia',
        parameterLabel: 'Momenty setrvacnosti motorky a podsestav',
        whyItIsHardOnline:
          'Patri mezi nejhure dohledatelne parametry; metodika je dostupna, konkretni data pro model ne.',
        directOnlineAvailability: 'almost-never',
        bestSourceOrder: [
          'Paper / thesis with exact model inertia',
          'Source using ISO 9129',
          'Multibody model of close sibling bike',
          'CAD-derived estimate',
        ],
        searchQueries: [
          '"<model>" moment of inertia motorcycle',
          '"<model>" roll inertia motorcycle',
          '"<model>" yaw inertia motorcycle',
          'ISO 9129 motorcycle inertia',
        ],
        extractionWorkflow: [
          'Hledej nejprve akademicke modely a prace pro podobny bike.',
          'Pokud nic neni, uloz jen metodiku a otevreny gap.',
          'Pouzij category sibling inertia only as temporary placeholder.',
        ],
        expectedOutput: [
          'Idealne Ix Iy Iz whole bike',
          'Realisticky online casto jen methodology reference and unknown-status marker',
        ],
        trustLevelIfFound:
          'Vysoka jen pri explicitnim mereni nebo detailnim multibody modelu s validaci.',
        fallbackWhenMissing: [
          'Odhad z CAD/geometry/mass breakdown.',
          'Temporary estimate from similar bike category.',
        ],
      },
      {
        parameterId: 'tire-grip-slip-curves',
        parameterLabel: 'Skutecne tire grip/slip a force-moment krivky',
        whyItIsHardOnline:
          'Vyrobci pneumatik je verejne skoro nikdy nedavaji; papers casto uvadeji model a test rig, ale ne presne data pro danou terennni pneumatiku.',
        directOnlineAvailability: 'almost-never',
        bestSourceOrder: [
          'Academic motorcycle tire paper with measured data',
          'Magic Formula fit for motorcycle tire class',
          'Tyre test rig paper',
          'Generic off-road tire archetype model',
        ],
        searchQueries: [
          '"<tire model>" motorcycle tire force slip angle',
          '"<tire brand>" motorcycle tire model',
          'motorcycle tire model experimental slip angle',
          'motorcycle magic formula tire paper',
        ],
        extractionWorkflow: [
          'Najdi nejprve paper s motorcycle tire model a experimentem.',
          'Oddeluj generic model fit od exact tyre-specific measured curve.',
          'Pokud znas jen tire size a category, pouzij category archetype and mark low confidence.',
        ],
        expectedOutput: [
          'Lateral force vs slip angle',
          'Longitudinal force vs slip ratio',
          'Aligning moment / camber contribution if available',
        ],
        trustLevelIfFound:
          'Vysoka jen pri exact measured tire data; generic Magic Formula fit je spis modelovy archetyp.',
        fallbackWhenMissing: [
          'Pouzij academic motorcycle tire model and tune to category behavior.',
          'Zvlaste pro trial pocitej s jinym grip pri nizkych rychlostech a deformaci pneumatiky nez pro MX.',
        ],
      },
    ],
  },
  sources: [
    {
      label: 'ISO 9130:2005 Motorcycles - Measurement method for location of centre of gravity',
      url: 'https://www.iso.org/standard/33494.html',
      accessedOn: '2026-04-11',
      sourceType: 'standard',
      notes: 'Primarni metodicky zdroj pro CG.',
    },
    {
      label: 'ISO 9129:2008 Motorcycles - Measurement methods for moments of inertia',
      url: 'https://www.iso.org/standard/42939.html',
      accessedOn: '2026-04-11',
      sourceType: 'standard',
      notes: 'Primarni metodicky zdroj pro inertia measurement.',
    },
    {
      label: 'SAE 2006-01-3618 As-Assembled Suspension Geometry Measurement using Photogrammetry',
      url: 'https://doi.org/10.4271/2006-01-3618',
      accessedOn: '2026-04-11',
      sourceType: 'academic-paper',
      notes: 'Pouzitelne jako prakticka metodika pro geometrii pivotu a kinematiky z fotografii.',
    },
    {
      label: 'Single View Metrology',
      url: 'https://doi.org/10.1023/A:1026598000963',
      accessedOn: '2026-04-11',
      sourceType: 'methodology',
      notes: 'Metodika pro odhad rozmeru a geometrii ze single-view obrazku.',
    },
    {
      label: 'Yamaha YZ250X 2022 Owner Service Manual - spring tables',
      url: 'https://www.manualslib.com/manual/3341518/Yamaha-Yz250x-2022.html?page=268',
      accessedOn: '2026-04-11',
      sourceType: 'official-manual',
      notes: 'Priklad online dohledatelnych fork a shock spring rates.',
    },
    {
      label: 'Husqvarna TE 300 USA Owner Manual - rider weight spring guidance',
      url: 'https://www.manualslib.com/manual/3824956/Husqvarna-Te-300-Usa.html?page=42',
      accessedOn: '2026-04-11',
      sourceType: 'official-manual',
      notes: 'Priklad rider-weight based spring rate guidance u enduro motorky.',
    },
    {
      label: 'SAE 2004-01-2068 shock absorber and coil spring in-vehicle measurement method',
      url: 'https://doi.org/10.4271/2004-01-2068',
      accessedOn: '2026-04-11',
      sourceType: 'academic-paper',
      notes: 'Metodicky zdroj pro damping a spring identification bez plne rozborky.',
    },
    {
      label: 'Roberto Lot - A Motorcycle Tire Model for Dynamic Simulations: Theoretical and Experimental Aspects',
      url: 'https://www.researchgate.net/publication/227030513_A_Motorcycle_Tire_Model_for_Dynamic_Simulations_Theoretical_and_Experimental_Aspects',
      accessedOn: '2026-04-11',
      sourceType: 'academic-paper',
      notes: 'Dulezity metodicky zdroj pro motorcycle tire model a experiment.',
    },
    {
      label: 'Kawasaki KX450 2026 official specs',
      url: 'https://www.kawasaki.eu/en/Motorcycles/Motocross/KX450_2026.html',
      accessedOn: '2026-04-11',
      sourceType: 'official-spec-page',
      notes: 'Reprezentativni motocross zdroj pro publikovane rozmery a podvozek.',
    },
    {
      label: 'KTM 450 XCF-W 2026 official specs',
      url: 'https://www.ktm.com/en-us/models/enduro/4-stroke/2026-ktm-450-xcfw/technical-specifications.html',
      accessedOn: '2026-04-11',
      sourceType: 'official-spec-page',
      notes: 'Reprezentativni ostre enduro specifikace.',
    },
    {
      label: 'KTM 390 Enduro R 2026 official specs',
      url: 'https://www.ktm.com/en-gb/models/dual-sport/2026-ktm-390-enduror/technical-specifications.html',
      accessedOn: '2026-04-11',
      sourceType: 'official-spec-page',
      notes: 'Doplnuje civilnejsi / homologovane enduro s publikovanou steering geometry.',
    },
    {
      label: 'Honda Powersports Montesa Cota 4RT 260R 2026 official specs',
      url: 'https://powersports.honda.com/motorcycle/montesatrials/montesa-cota-4rt/montesa-cota-4rt-260r',
      accessedOn: '2026-04-11',
      sourceType: 'official-spec-page',
      notes: 'Reprezentativni trial specifikace s wheelbase, rake, trail a travel.',
    },
  ],
};
