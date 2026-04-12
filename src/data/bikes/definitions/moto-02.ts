import { createIndependentBike, type BikeDefinition } from '../shared';

export const moto02: BikeDefinition = createIndependentBike({
  id: 'moto-02',
  name: 'moto-02',
  description: 'Genericka offroad motorka postavena z online dohledatelnych MX/enduro dat.',
  tuning: {
    // 5: Ciste herni gravitace, neni to parametr motorky z realnych specifikaci.
    gravityY: -18,
    // 5: Solver iterations jsou ciste technicke nastaveni simulace.
    solverVelocityIterations: 14,
    // 5: Solver iterations jsou ciste technicke nastaveni simulace.
    solverPositionIterations: 8,
    // 5: Kolizni skupina je interny parametr fyziky hry.
    collisionGroup: -1,
    terrain: {
      // 5: Grip terenu neni parametr motorky; je to herni aproximace podkladu.
      friction: 1.25,
      // 5: Odskok terenu je ciste herni rozhodnuti.
      restitution: 0,
    },
    debugRig: {
      // 5: Debug-rig vyska je jen technicka hodnota pro testovaci rezim.
      frameHeight: 2.8,
      // 5: Debug-rig sweep force je umele testovaci nastaveni.
      frontSweepForce: 140,
      // 5: Debug-rig sweep force je umele testovaci nastaveni.
      rearSweepForce: 180,
      // 5: Debug-rig sweep frekvence je umele testovaci nastaveni.
      sweepFrequencyHz: 0.18,
    },
    initialPose: {
      // 5: Spawn angle je ciste herni parametr.
      angle: 0,
    },
    frame: {
      // 4: Sirka ramu je odhadnuta z typicke delky a rozvoru MX/enduro motorky.
      width: 1.18,
      // 4: Vyska ramu je odhadnuta z bochych proporci offroad motorky.
      height: 0.2,
      // 4: Hustota je zvolena tak, aby celek pusobil lehceji a bliz realne offroad motorce.
      density: 15.2,
      // 5: Treni hlavniho tela je herni hodnota, ne publikovany realny parametr.
      friction: 0.6,
      // 5: Linear damping je herni stabilizace.
      linearDamping: 0.3,
      // 5: Angular damping je herni stabilizace.
      angularDamping: 1.0,
    },
    swingarm: {
      // 4: U generic offroad motorky nechavam zadni stavbu pri frame=0 temer vodorovne.
      initialAngle: 0,
      // 3: Delka kyvky je odhadnuta podle typickeho rozvoru 1475-1506 mm a 18" zadniho kola.
      length: 1.28,
      // 4: Vyska profilu kyvky je jen hruba geometricka aproximace.
      height: 0.11,
      // 4: Hustota je odhad pro lehkou hlinikovou kyvku.
      density: 7.8,
      // 5: Treni je herni hodnota.
      friction: 0.6,
      // 5: Angular damping je herni stabilizace.
      angularDamping: 0.82,
      // 4: Poloha pivotu je 2D geometicky odhad, online se bez vykresu hleda tezko.
      pivotOffsetX: -0.37,
      // 4: Vertikalni poloha pivotu je 2D geometicky odhad.
      pivotOffsetY: -0.03,
      // 3: Poloha zadni osy vychazi z generic wheelbase a pomeru offroad motorky.
      wheelMountOffsetX: -0.88,
      // 4: Vertikalni poloha zadni osy je hruby layout odhad.
      wheelMountOffsetY: -0.01,
      // 4: Ulozeni tlumice na kyvce je jen hruba genericka poloha.
      shockMountOffsetX: -0.19,
      // 4: Ulozeni tlumice na kyvce je jen hruba genericka poloha.
      shockMountOffsetY: 0.02,
    },
    fork: {
      // 2: Pocatecni natoceni vidlice je explicitne vuci frame=0 a odpovida generic offroad head-angle aproximaci.
      initialAngle: -0.221,
      // 4: Sirka predni sestavy je odhad podle bezne USD vidlice 48-49 mm.
      width: 0.15,
      // 3: Vyska vidlice odpovida generic 21" prednimu kolu a offroad proporcim.
      height: 1.24,
      // 4: Hustota je odhad pro lehkou predni sestavu.
      density: 6.6,
      // 5: Treni je herni hodnota.
      friction: 0.4,
      // 5: Angular damping je herni stabilizace.
      angularDamping: 0.78,
      // 4: Poloha uchyceni vidlice k ramu je 2D odhad z generic side-view proporci.
      mountOffsetX: 0.63,
      // 4: Vertikalni poloha steering/fork mountu je 2D odhad.
      mountOffsetY: 0.13,
      // 4: Smer osy vidlice je generic offroad rake/caster aproximace.
      sliderAxisX: -0.22,
      // 4: Smer osy vidlice je generic offroad rake/caster aproximace.
      sliderAxisY: -0.98,
      // 4: Spodni uchyceni kola k vidlici je layout odhad.
      lowerMountOffsetX: -0.01,
      // 4: Spodni uchyceni kola k vidlici je layout odhad.
      lowerMountOffsetY: -0.45,
      // 2: Zdvih je zvolen podle bezne publikovanych 230-305 mm u MX/enduro.
      travel: 0.3,
    },
    rider: {
      // 5: Polomer jezdce je ciste gameplay proxy, nema primy realny ekvivalent.
      radius: 0.29,
      // 5: Hustota jezdce je ciste gameplay proxy.
      density: 5.0,
      // 5: Treni je gameplay proxy.
      friction: 0.5,
      // 4: Mount pozice je odhad ergonomie generic offroad motorky.
      mountOffsetX: 0.03,
      // 4: Mount pozice je odhad ergonomie generic offroad motorky.
      mountOffsetY: 0.61,
      // 5: Rozsah posunu jezdce je ciste gameplay tuning.
      shiftRange: 0.26,
      // 5: Max motor force je ciste gameplay tuning.
      maxMotorForce: 175,
      // 5: Max shift speed je ciste gameplay tuning.
      maxShiftSpeed: 1.35,
    },
    rearWheel: {
      // 2: Polomer vychazi z bezneho 18" zadniho kola s offroad pneumatikou.
      radius: 0.341,
      // 4: Hustota je odhad pro lehke zadni kolo s pneumatikou.
      density: 1.55,
      // 5: Treni je herni aproximace gripu, ne realna grip/slip krivka pneumatiky.
      friction: 1.85,
      // 5: Restituce je ciste herni tuning.
      restitution: 0,
      // 5: Linear damping je ciste herni tuning.
      linearDamping: 0.08,
      // 5: Angular damping je ciste herni tuning.
      angularDamping: 0.84,
    },
    frontWheel: {
      // 2: Polomer vychazi z bezneho 21" predniho kola s offroad pneumatikou.
      radius: 0.348,
      // 4: Hustota je odhad pro lehke predni kolo s pneumatikou.
      density: 1.45,
      // 5: Treni je herni aproximace gripu, ne realna grip/slip krivka pneumatiky.
      friction: 1.7,
      // 5: Restituce je ciste herni tuning.
      restitution: 0,
      // 5: Linear damping je ciste herni tuning.
      linearDamping: 0.07,
      // 5: Angular damping je ciste herni tuning.
      angularDamping: 0.74,
    },
    rearSuspension: {
      // 4: Ulozeni zadniho tlumice na ramu je genericky odhad layoutu.
      frameAnchorX: 0.09,
      // 4: Ulozeni zadniho tlumice na ramu je genericky odhad layoutu.
      frameAnchorY: 0.28,
      // 4: Frekvence je generic offroad tuning odhad podle zdvihu a lehke hmotnosti.
      frequencyHz: 3.6,
      // 4: Damping ratio je generic offroad tuning odhad.
      dampingRatio: 0.92,
      // 4: Dolni limit kyvky je geometricky odhad.
      lowerSwingarmAngle: -0.58,
      // 4: Horni limit kyvky je geometricky odhad.
      upperSwingarmAngle: 0.26,
    },
    frontSuspension: {
      // 4: Prizpusobeno generic offroad vidlici se zdvihem kolem 300 mm.
      springStrength: 175,
      // 4: Tlumeny odpor je gameplay aproximace podle generic offroad charakteru.
      damping: 26,
      // 4: Klidova delka/offset je odhad odpovidajici kratsimu realnejsimu zdvihu.
      restOffset: 0.22,
      // 5: Response speed je ciste parametr naseho spring-damper modelu.
      responseSpeed: 11,
      // 5: Max motor speed je ciste parametr naseho spring-damper modelu.
      maxMotorSpeed: 2.1,
      // 4: Max motor force je gameplay aproximace pro tuzsi offroad predek.
      maxMotorForce: 460,
    },
    controls: {
      // 4: Cilova rychlost hnaciho kola je odhad generic svizne offroad motorky.
      throttleMotorSpeed: -20,
      // 4: Hnaci moment je odhad generic MX/enduro motorky v ramci jednoducheho modelu.
      rearDriveTorque: 54,
      // 5: Zadni brzda je ciste gameplay tuning.
      rearBrakeTorque: 20,
      // 5: Predni brzda je ciste gameplay tuning.
      frontBrakeTorque: 22,
      // 5: Idle brake je ciste gameplay tuning.
      idleBrakeTorque: 1.2,
      // 5: Odezva presunu jezdce je ciste gameplay tuning.
      shiftResponsiveness: 0.85,
    },
  },
});
