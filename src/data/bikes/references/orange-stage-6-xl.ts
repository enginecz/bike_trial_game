export interface OrangeStage6XlReference {
  id: string;
  title: string;
  notes: string[];
  geometry: {
    coordinateSystem: {
      origin: string;
      xAxis: string;
      yAxis: string;
    };
    simplifiedFrameTriangle: {
      description: string;
      top_tube_ef_mm: {
        value: number;
        forms: string;
        notes: string;
      };
      stack_mm: {
        value: number;
        forms: string;
        notes: string;
      };
      seat_angle_ef_deg: {
        value: number;
        forms: string;
        notes: string;
      };
    };
    headAxis: {
      description: string;
      anchorPoint: string;
      head_angle_deg: {
        value: number;
        forms: string;
        notes: string;
      };
    };
    fork: {
      description: string;
      drawingRules: string[];
      fork_offset_mm: {
        value: number;
        forms: string;
        notes: string;
      };
      head_tube_mm: {
        value: number;
        forms: string;
        notes: string;
      };
      front_lift_mm: {
        value: number;
        forms: string;
        notes: string;
      };
      bb_drop_mm: {
        value: number;
        forms: string;
        notes: string;
      };
      resolvedConstruction: string[];
      currentStatus: string;
    };
    frontWheel: {
      description: string;
      wheel_size_in: {
        value: number;
        forms: string;
        notes: string;
      };
      placementRules: string[];
      currentStatus: string;
      resolvedConstruction: string[];
    };
    rearSwingarm: {
      description: string;
      drawingRules: string[];
      pivot_from_frame_origin_mm: {
        x: number;
        y: number;
        notes: string;
      };
      rear_wheel_center_from_frame_origin_mm: {
        x: number;
        y: number;
        notes: string;
      };
      shock_mount_from_frame_origin_mm: {
        x: number;
        y: number;
        notes: string;
      };
      currentStatus: string;
    };
    riderBody: {
      description: string;
      drawingRules: string[];
      foot_support_point_from_frame_origin_mm: {
        x: number;
        y: number;
        notes: string;
      };
      hand_support_point_from_frame_origin_mm: {
        x: number;
        y: number;
        notes: string;
      };
      rider_center_of_mass_from_frame_origin_mm: {
        x: number;
        y: number;
        notes: string;
      };
      currentStatus: string;
    };
    shock: {
      description: string;
      frame_mount_from_frame_origin_mm: {
        x: number;
        y: number;
        notes: string;
      };
      swingarm_mount_from_frame_origin_mm: {
        x: number;
        y: number;
        notes: string;
      };
      currentStatus: string;
    };
  };
}

export const orangeStage6XlReference: OrangeStage6XlReference = {
  id: 'orange-stage-6-xl-reference',
  title: 'Orange Stage 6 XL Reference',
  notes: [
    'Toto je nova reference zalozena od nuly.',
    'Zatim nerespektuje zadne drivejsi reference ani hotove bike definice.',
    'Prvni krok je zjednoduseny ramovy trojuhelnik pro velikost XL.',
  ],
  geometry: {
    coordinateSystem: {
      origin: 'Spodni roh zjednoduseneho ramoveho trojuhelniku.',
      xAxis: 'Kladny smer doprava.',
      yAxis: 'Kladny smer nahoru.',
    },
    simplifiedFrameTriangle: {
      description:
        'Zjednoduseny ramovy trojuhelnik je zatim definovan tremi hranami: horni vodorovnou hranou, vyskou od spodniho rohu k horni hrane a zadni hranou urcenou efektivnim uhlem sedlove trubky.',
      top_tube_ef_mm: {
        value: 665,
        forms: 'Horni vodorovnou stranu trojuhelniku.',
        notes: 'Pouziva se jako vodorovna delka mezi hornim levym a hornim pravym vrcholem trojuhelniku.',
      },
      stack_mm: {
        value: 648,
        forms: 'Svislou vysku trojuhelniku.',
        notes: 'Pouziva se jako vyska od spodniho rohu trojuhelniku k horni vodorovne hrane.',
      },
      seat_angle_ef_deg: {
        value: 76,
        forms: 'Zadni stranu trojuhelniku.',
        notes:
          'Uhel je mereny vuci horizontale od zadniho kola, tedy zadni hrana stoupa ze spodniho rohu smerem dozadu a nahoru.',
      },
    },
    headAxis: {
      description:
        'Osa hlavy je definovana jako primka prochazejici prednim hornim rohem zjednoduseneho ramoveho trojuhelniku.',
      anchorPoint: 'Predni horni roh trojuhelniku.',
      head_angle_deg: {
        value: 64,
        forms: 'Uhel osy hlavy vuci horizontale.',
        notes:
          'Uhel je mereny od zadni strany, tedy osa hlavy se z predniho horniho rohu sklapi dopredu a dolu.',
      },
    },
    fork: {
      description:
        'Predni vidlice ma byt ve zjednodusenem modelu reprezentovana pravoúhlym trojuhelnikem navazanym na osu hlavy.',
      drawingRules: [
        'Vidlice se znazornuje pravoúhlym trojuhelnikem.',
        'Pravy uhel je na spodnim rohu vidlice.',
        'Zadni odvesna prochazi osou hlavy.',
      ],
      fork_offset_mm: {
        value: 42,
        forms: 'Delku predni odvesny vidlice.',
        notes: 'Pouziva se jako zjednodusena delka predni odvesny pravoúhleho trojuhelniku vidlice.',
      },
      head_tube_mm: {
        value: 130,
        forms: 'Vzdalenost horniho zadniho rohu vidlice od predniho rohu ramu.',
        notes:
          'Zatim chapané jako navazovaci rozmer mezi prednim hornim rohem ramoveho trojuhelniku a hornim zadnim rohem trojuhelniku vidlice.',
      },
      front_lift_mm: {
        value: 160,
        forms: 'Dodatecnou vzdalenost horniho zadniho rohu vidlice po ose hlavy.',
        notes:
          'Pouziva se spolu s head_tube jako dalsi prodlouzeni po ose hlavy smerem dolu a dopredu.',
      },
      bb_drop_mm: {
        value: 35,
        forms: 'Svislou polohu spodnioho rohu vidlice vuci nule ramu.',
        notes:
          'Spodni roh vidlice lezi na ose hlavy a ma souradnici Y = 35 mm vuci nule ramu.',
      },
      resolvedConstruction: [
        'Predni horni roh ramu je kotevni bod osy hlavy.',
        'Osa hlavy je pro vizualizaci kreslena jako usecka o delce head_tube = 130 mm.',
        'Zadni hrana trojuhelniku vidlice lezi na ose hlavy.',
        'Horni zadni roh vidlice je po ose hlavy vzdalen 130 mm + 160 mm od predniho horniho rohu ramu.',
        'Spodni roh vidlice lezi na ose hlavy v souradnici Y = 35 mm vuci nule ramu.',
        'Predni odvesna je na zadni hranu kolma a ma delku 42 mm.',
        'Zadane souradnice odpovidaji nezatizenemu stavu, tedy maximalnimu roztazeni predniho odpruzeni.',
        'Vidlice se muze pohybovat jen posuvne ve smeru osy hlavy.',
        'Pruzina a tlumic jsou modelovany mezi koncem head_tube a zacatkem vidlice.',
        'Pri nezatizenem stavu je jejich delka presne front_lift = 160 mm.',
        'Pri plnem zatizeni se vidlice pohybuje po ose hlavy zpet k hlave ramu, takze front_lift klesa az na 0 mm.',
        'Samotne telo vidlice je v bike definici vedeno jako tuhy tvar; front_lift urcuje jen jeho posuv po ose hlavy, ne dalsi prodlouzeni tvaru vidlice.',
      ],
      currentStatus:
        'Parametry jsou ulozene konzistentne pro aktualni zjednodusene 2D vykresleni i posuvny model pohybu vidlice.',
    },
    frontWheel: {
      description:
        'Predni kolo je zatim definovano prumerem a vazbou jeho stredu na predni hranu trojuhelniku vidlice.',
      wheel_size_in: {
        value: 29,
        forms: 'Prumer kola.',
        notes: 'Zatim je ulozen jen nominalni prumer 29 palcu bez dalsiho rozliseni plast / rafek.',
      },
      placementRules: [
        'Stred predniho kola lezi ve vrcholu trojuhelniku vidlice mezi preponou a predni odvesnou.',
      ],
      currentStatus:
        'Tohle uz urcuje jednoznacnou polohu stredu kola v ramci zjednodusene konstrukce.',
      resolvedConstruction: [
        'Stred kola je ztotoznen s prednim vrcholem trojuhelniku vidlice.',
        'Prumer kola je pro tento krok interpretovan jako 29 palcu pro cele vykreslene kolo.',
      ],
    },
    rearSwingarm: {
      description:
        'Zadni kyvka je ve zjednodusenem modelu reprezentovana obecným trojuhelnikem tvoreny pivotem rotace, stredem zadniho kola a bodem uchyceni tlumice.',
      drawingRules: [
        'Kyvka se znazornuje trojuhelnikem.',
        'Prvni bod je pivot rotace.',
        'Druhy bod je stred zadniho kola.',
        'Treti bod je bod uchyceni tlumice na kyvce.',
      ],
      pivot_from_frame_origin_mm: {
        x: 20,
        y: 70,
        notes: 'Poloha pivotu rotace vuci nule ramu.',
      },
      rear_wheel_center_from_frame_origin_mm: {
        x: -469,
        y: 35,
        notes:
          'X odpovida chainstay. Y je pro tento krok interpretovano jako uz znamy svisly offset, tedy bb_drop = 35 mm.',
      },
      shock_mount_from_frame_origin_mm: {
        x: -20,
        y: 300,
        notes: 'Poloha bodu uchyceni tlumice na kyvce vuci nule ramu.',
      },
      currentStatus:
        'Geometrie zadni kyvky je pro aktualni zjednodusene 2D vykresleni jednoznacne zadana.',
    },
    riderBody: {
      description:
        'Telo jezdce je ve zjednodusenem modelu reprezentovano obecným trojuhelnikem tvoreny bodem opory nohou, bodem opory rukou a tezistem jezdce.',
      drawingRules: [
        'Telo jezdce se znazornuje trojuhelnikem.',
        'Prvni bod je opora nohou ve stredu ramu.',
        'Druhy bod je opora rukou v prednim vrcholu ramu.',
        'Treti bod je teziste jezdce.',
      ],
      foot_support_point_from_frame_origin_mm: {
        x: 0,
        y: 0,
        notes: 'Opora nohou je presne v nule ramu.',
      },
      hand_support_point_from_frame_origin_mm: {
        x: 503.4,
        y: 648,
        notes: 'Opora rukou je presne v prednim vrcholu ramoveho trojuhelniku.',
      },
      rider_center_of_mass_from_frame_origin_mm: {
        x: 0,
        y: 1000,
        notes: 'Teziste jezdce lezi 1000 mm nad stredem ramu.',
      },
      currentStatus:
        'Geometrie tela jezdce je pro aktualni zjednodusene 2D vykresleni jednoznacne zadana.',
    },
    shock: {
      description:
        'Tlumič je ve zjednodusenem modelu reprezentovan jedinou useckou mezi ramem a kyvkou.',
      frame_mount_from_frame_origin_mm: {
        x: 200,
        y: 300,
        notes: 'Bod uchyceni tlumice na ramu.',
      },
      swingarm_mount_from_frame_origin_mm: {
        x: -20,
        y: 300,
        notes: 'Bod uchyceni tlumice na kyvce.',
      },
      currentStatus:
        'Geometrie tlumice je pro aktualni zjednodusene 2D vykresleni jednoznacne zadana.',
    },
  },
};
