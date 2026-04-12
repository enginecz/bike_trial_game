import { createIndependentBike, type BikeDefinition } from '../shared';

export const mtb01: BikeDefinition = createIndependentBike({
  id: 'mtb-01',
  name: 'mtb-01',
  description: 'Genericke celoodpruzene MTB podle Starling Murmur.',
  tuning: {
    // 5: Cista herni gravitace, neni to parametr MTB z realnych specifikaci.
    gravityY: -18,
    // 5: Solver iterations jsou interni technicke nastaveni simulace.
    solverVelocityIterations: 14,
    // 5: Solver iterations jsou interni technicke nastaveni simulace.
    solverPositionIterations: 8,
    // 5: Kolizni skupina je interni parametr fyziky hry.
    collisionGroup: -1,
    terrain: {
      // 5: Grip povrchu je herni aproximace, ne parametr ramu nebo kola.
      friction: 1.18,
      // 5: Restituce terenu je ciste herni rozhodnuti.
      restitution: 0,
    },
    debugRig: {
      // 5: Debug-rig vyska je jen technicka hodnota pro testovaci rezim.
      frameHeight: 2.4,
      // 5: Debug-rig sweep force je umele testovaci nastaveni.
      frontSweepForce: 90,
      // 5: Debug-rig sweep force je umele testovaci nastaveni.
      rearSweepForce: 110,
      // 5: Debug-rig sweep frekvence je umele testovaci nastaveni.
      sweepFrequencyHz: 0.18,
    },
    initialPose: {
      // 5: Spawn angle je ciste herni parametr.
      angle: 0,
    },
    frame: {
      // 3: Delka hlavniho tela je odhadnuta z wheelbase 1260 mm, reach 485 mm a trail-bike proporci Murmuru.
      width: 0.98,
      // 4: Vyska tela je zjednodusena na jednu kratkou centralni cast ramu.
      height: 0.14,
      // 4: Hustota je odhad pro lehky ocelovy ram a zbytek centralni hmoty v nasem zjednoduseni.
      density: 10.5,
      // 5: Treni tela je herni hodnota.
      friction: 0.6,
      // 5: Linear damping je herni stabilizace.
      linearDamping: 0.22,
      // 5: Angular damping je herni stabilizace.
      angularDamping: 0.78,
    },
    swingarm: {
      // 4: Vuci frame=0 je zadni stavba lehce sklopena dolu, aby lepe odpovidala trail MTB proporcim.
      initialAngle: -0.06,
      // 2: Delka zadni stavby se opira o publikovany chainstay 445 mm.
      length: 0.8,
      // 4: Vyska profilu zadni stavby je hruba geometricka aproximace.
      height: 0.08,
      // 4: Hustota je odhad pro ocelovou zadni stavbu a zadni trojuhelnik.
      density: 5.8,
      // 5: Treni je herni hodnota.
      friction: 0.6,
      // 5: Angular damping je herni stabilizace.
      angularDamping: 0.68,
      // 3: Poloha hlavniho pivotu je odhad z review, ktera ho popisuje tesne nad chainringem.
      pivotOffsetX: -0.18,
      // 4: Vertikalni poloha pivotu je 2D odhad bez presnych souradnic.
      pivotOffsetY: -0.02,
      // 2: Zadni osa je nastavena podle chainstay 445 mm.
      wheelMountOffsetX: -0.45,
      // 4: Vertikalni poloha zadni osy je layout odhad.
      wheelMountOffsetY: 0,
      // 4: Ulozeni tlumice na zadni stavbe je jen hruba single-pivot aproximace.
      shockMountOffsetX: -0.16,
      // 4: Ulozeni tlumice na zadni stavbe je jen hruba single-pivot aproximace.
      shockMountOffsetY: 0.05,
    },
    fork: {
      // 1: Vuci frame=0 je vidlice natocena podle publikovaneho 65st head angle Murmuru.
      // 65° vuci zemi znamena cca -25° vuci horizontalnimu frame=0, tedy asi -0.436 rad.
      initialAngle: -0.436,
      // 3: Sirka vidlice je odhad pro trail MTB se 150mm single crown forkem.
      width: 0.12,
      // 2: Vyska vidlice odpovida 29" kolu a publikovanemu 150 mm front travel.
      height: 1.05,
      // 4: Hustota je odhad pro lehkou hlinikovou / magnesium MTB vidlici.
      density: 4.9,
      // 5: Treni je herni hodnota.
      friction: 0.4,
      // 5: Angular damping je herni stabilizace.
      angularDamping: 0.56,
      // 3: Poloha mountu je odhad z reach/stack a hlavoveho uhlu Murmuru.
      mountOffsetX: 0.51,
      // 3: Poloha mountu je odhad z reach/stack a hlavoveho uhlu Murmuru.
      mountOffsetY: 0.12,
      // 2: Osa vidlice vychazi z publikovaneho 65st head angle.
      sliderAxisX: -0.42,
      // 2: Osa vidlice vychazi z publikovaneho 65st head angle.
      sliderAxisY: -0.91,
      // 4: Spodni uchyceni kola k vidlici je zjednoduseny layout odhad.
      lowerMountOffsetX: 0,
      // 4: Spodni uchyceni kola k vidlici je zjednoduseny layout odhad.
      lowerMountOffsetY: -0.32,
      // 1: Zdvih odpovida publikovanym 150 mm.
      travel: 0.15,
    },
    rider: {
      // 5: Polomer jezdce je cista gameplay proxy.
      radius: 0.27,
      // 5: Hustota jezdce je cista gameplay proxy.
      density: 4.8,
      // 5: Treni je gameplay proxy.
      friction: 0.5,
      // 3: Pozice jezdce je odhad z reach 485 mm, seat angle 78 st. a trail ergonomie.
      mountOffsetX: 0.05,
      // 3: Pozice jezdce je odhad z reach 485 mm, seat angle 78 st. a trail ergonomie.
      mountOffsetY: 0.5,
      // 5: Rozsah posunu jezdce je ciste gameplay tuning.
      shiftRange: 0.22,
      // 5: Max motor force je ciste gameplay tuning.
      maxMotorForce: 150,
      // 5: Max shift speed je ciste gameplay tuning.
      maxShiftSpeed: 1.2,
    },
    rearWheel: {
      // 2: Polomer vychazi z 29 x 2.6" MTB kola jako priblizny vnejsi polomer.
      radius: 0.377,
      // 4: Hustota je odhad pro lehke MTB kolo s plastem.
      density: 1.1,
      // 5: Treni je herni aproximace gripu, ne realna MTB tire force krivka.
      friction: 1.65,
      // 5: Restituce je ciste herni tuning.
      restitution: 0,
      // 5: Linear damping je ciste herni tuning.
      linearDamping: 0.06,
      // 5: Angular damping je ciste herni tuning.
      angularDamping: 0.62,
    },
    frontWheel: {
      // 2: Polomer vychazi z 29 x 2.6" MTB kola jako priblizny vnejsi polomer.
      radius: 0.377,
      // 4: Hustota je odhad pro lehke MTB kolo s plastem.
      density: 1.0,
      // 5: Treni je herni aproximace gripu, ne realna MTB tire force krivka.
      friction: 1.58,
      // 5: Restituce je ciste herni tuning.
      restitution: 0,
      // 5: Linear damping je ciste herni tuning.
      linearDamping: 0.05,
      // 5: Angular damping je ciste herni tuning.
      angularDamping: 0.58,
    },
    rearSuspension: {
      // 4: Ulozeni tlumice na ramu je zjednodusena single-pivot aproximace, ne presna souradnice Murmuru.
      frameAnchorX: 0.03,
      // 4: Ulozeni tlumice na ramu je zjednodusena single-pivot aproximace, ne presna souradnice Murmuru.
      frameAnchorY: 0.18,
      // 4: Frekvence je gameplay odhad pro citlive trail MTB odpruzeni.
      frequencyHz: 2.6,
      // 4: Damping ratio je gameplay odhad pro trail MTB odpruzeni.
      dampingRatio: 0.86,
      // 4: Dolni limit zadni stavby je geometricky odhad.
      lowerSwingarmAngle: -0.42,
      // 4: Horni limit zadni stavby je geometricky odhad.
      upperSwingarmAngle: 0.18,
    },
    frontSuspension: {
      // 4: Priblizeno citlivejsimu MTB predku s mensim zdvihem nez moto preset.
      springStrength: 95,
      // 4: Tlumeny odpor je gameplay aproximace pro trail fork.
      damping: 18,
      // 3: Klidovy offset odpovida 150 mm zdvihu a trail geometrii.
      restOffset: 0.12,
      // 5: Response speed je ciste parametr naseho spring-damper modelu.
      responseSpeed: 10,
      // 5: Max motor speed je ciste parametr naseho spring-damper modelu.
      maxMotorSpeed: 1.6,
      // 4: Max motor force je gameplay aproximace lehci MTB vidlice.
      maxMotorForce: 220,
    },
    controls: {
      // 4: Velka cilova rychlost jen udrzuje motor joint aktivni; realny pohon zde ridi konstantni vykon.
      throttleMotorSpeed: -1000,
      // 5: Tahle hodnota uz neni primarni; u mtb-01 ji prebiji constantPowerWatts.
      rearDriveTorque: 0,
      // 2: Pozadovany pohon je explicitne 1 kW na zadnim kole; v simulaci je preveden na torque = P / omega.
      // 4: Pri velmi nizkych otackach je v kodu pouzit ochranny limit, aby torque nesel do nekonecna.
      constantPowerWatts: 1000,
      // 5: Zadni brzda je ciste gameplay tuning.
      rearBrakeTorque: 12,
      // 5: Predni brzda je ciste gameplay tuning.
      frontBrakeTorque: 16,
      // 5: Idle brake je ciste gameplay tuning.
      idleBrakeTorque: 0.8,
      // 5: Odezva presunu jezdce je ciste gameplay tuning.
      shiftResponsiveness: 0.88,
    },
  },
});
