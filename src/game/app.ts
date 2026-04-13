import { createFixedStepLoop } from '../core/fixed-step-loop';
import { readBikeControls } from './bike-controls';
import { createDebugHudPanels, createOverlayLegendEntries, createTerrainLegendEntries } from './debug-hud';
import { defaultGameSessionConfig, getDefaultBikeDefinition } from './session-config';
import { createPhysicsSimulation } from '../physics/simulation';
import { createCamera } from '../rendering/camera';
import { createDebugOverlay } from '../rendering/debug-overlay';
import { createRenderer } from '../rendering/renderer';
import { createKeyboardInput } from '../systems/input/keyboard-input';
import { createLevel } from '../world/level';

export interface GameApp {
  start(): void;
}

export function createGameApp(canvas: HTMLCanvasElement): GameApp {
  const session = defaultGameSessionConfig;
  const input = createKeyboardInput(window);
  const camera = createCamera();
  const level = createLevel(session.levelDefinition);
  let activeBike = getDefaultBikeDefinition(session);
  let activeBikeIndex = Math.max(
    0,
    session.availableBikes.findIndex((bike) => bike.id === activeBike.id),
  );
  let activeSpawn = level.spawn;
  let physics = createPhysicsSimulation(level, activeBike.tuning);
  const renderer = createRenderer(canvas);
  const debugOverlay = createDebugOverlay();
  let activeSpawnName = 'Main Spawn';
  let paused = false;
  let statsVisible = false;
  let gridVisible = false;
  let suspensionDebugEnabled = false;
  let terrainDebugEnabled = false;
  let inspectionZoom = 1;

  function rebuildPhysics() {
    const preserveTestRigMode = physics.isTestRigMode();

    physics = createPhysicsSimulation(level, activeBike.tuning);
    physics.setSpawn(activeSpawn);
    physics.reset();

    if (preserveTestRigMode) {
      physics.toggleTestRigMode();
    }
  }

  const loop = createFixedStepLoop({
    fixedDeltaTimeMs: 1000 / 60,
    maxFrameTimeMs: 250,
    update(deltaTimeSeconds) {
      input.update();
      const controls = readBikeControls(input, level.testSpawns.length);

      if (controls.pausePressed) {
        paused = !paused;
      }

      if (controls.statsTogglePressed) {
        statsVisible = !statsVisible;
      }

      if (controls.gridTogglePressed) {
        gridVisible = !gridVisible;
      }

      if (controls.suspensionDebugTogglePressed) {
        suspensionDebugEnabled = !suspensionDebugEnabled;
      }

      if (controls.terrainDebugTogglePressed) {
        terrainDebugEnabled = !terrainDebugEnabled;
      }

      if (controls.testRigTogglePressed) {
        physics.toggleTestRigMode();
      }

      if (controls.nextBikePressed) {
        activeBikeIndex = (activeBikeIndex + 1) % session.availableBikes.length;
        activeBike = session.availableBikes[activeBikeIndex];
        rebuildPhysics();
      }

      if (controls.zoomInPressed) {
        inspectionZoom = clamp(inspectionZoom * 1.15, 0.5, 3);
      }

      if (controls.zoomOutPressed) {
        inspectionZoom = clamp(inspectionZoom / 1.15, 0.5, 3);
      }

      if (controls.zoomResetPressed) {
        inspectionZoom = 1;
      }

      if (controls.testSpawnSelection !== null) {
        if (controls.testSpawnSelection === 1) {
          activeSpawnName = '1 Main Spawn';
          activeSpawn = level.spawn;
          physics.setSpawn(activeSpawn);
          physics.reset();
        }

        const selectedSpawn = level.testSpawns.find((spawn) => spawn.key === controls.testSpawnSelection);

        if (selectedSpawn) {
          activeSpawnName = `${selectedSpawn.key} ${selectedSpawn.name}`;
          activeSpawn = selectedSpawn.position;
          physics.setSpawn(activeSpawn);
          physics.reset();
        }
      }

      if (controls.resetPressed) {
        physics.reset();
      }

      const simulationControls = physics.isTestRigMode()
        ? { ...controls, throttle: 0, brakeFront: 0, brakeRear: 0, riderShift: 0 }
        : controls;

      if (!paused || controls.singleStepPressed) {
        physics.step(simulationControls);
      }

      const snapshot = physics.getSnapshot();
      const speed = Math.hypot(snapshot.bike.frameVelocity.x, snapshot.bike.frameVelocity.y);
      const inspectionMode = suspensionDebugEnabled || terrainDebugEnabled || inspectionZoom !== 1;
      const lookAheadX = inspectionMode ? 0 : clamp(snapshot.bike.frameVelocity.x * 0.22, -2.2, 2.2);
      const lookAheadY = inspectionMode ? 0 : clamp(snapshot.bike.frameVelocity.y * 0.08, -0.6, 0.6);
      const baseZoom = speed > 6 ? 36 : 40;
      const targetZoom = baseZoom * inspectionZoom;

      camera.update(deltaTimeSeconds, {
        targetX: snapshot.bike.framePosition.x,
        targetY: snapshot.bike.framePosition.y + (inspectionMode ? 0 : 0.55),
        lookAheadX,
        lookAheadY,
        zoom: targetZoom,
      });

      const hudPanels = createDebugHudPanels(
        {
          activeSpawnName,
          activeBike,
          camera,
          controls,
          inputSummary: input.describeActiveKeys(),
          level,
          paused,
          snapshot,
          suspensionDebugEnabled,
          terrainDebugEnabled,
          testRigMode: physics.isTestRigMode(),
        },
        activeBike.tuning,
      );

      debugOverlay.setPanels(hudPanels.controlsLines, hudPanels.statsLines);
    },
    render() {
      renderer.resize();
      renderer.render({
        activeBike,
        camera,
        controlsLines: debugOverlay.getControlsLines(),
        statsLines: statsVisible ? debugOverlay.getStatsLines() : [],
        gridVisible,
        level,
        physics: physics.getRenderState(),
        suspensionDebugEnabled,
        terrainDebugEnabled,
        overlayLegendEntries: createOverlayLegendEntries(),
        terrainLegendEntries: createTerrainLegendEntries(),
      });
    },
  });

  return {
    start() {
      loop.start();
    },
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
