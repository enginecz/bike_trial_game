import { createFixedStepLoop } from '../core/fixed-step-loop';
import { readBikeControls } from './bike-controls';
import { createDebugHudLines } from './debug-hud';
import { defaultGameSessionConfig } from './session-config';
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
  const physics = createPhysicsSimulation(level, session.bikeTuning);
  const renderer = createRenderer(canvas);
  const debugOverlay = createDebugOverlay();
  let paused = false;
  let suspensionDebugEnabled = false;

  const loop = createFixedStepLoop({
    fixedDeltaTimeMs: 1000 / 60,
    maxFrameTimeMs: 250,
    update(deltaTimeSeconds) {
      input.update();
      const controls = readBikeControls(input);

      if (controls.pausePressed) {
        paused = !paused;
      }

      if (controls.suspensionDebugTogglePressed) {
        suspensionDebugEnabled = !suspensionDebugEnabled;
      }

      if (controls.testRigTogglePressed) {
        physics.toggleTestRigMode();
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
      const lookAheadX = clamp(snapshot.bike.frameVelocity.x * 0.22, -2.2, 2.2);
      const lookAheadY = clamp(snapshot.bike.frameVelocity.y * 0.08, -0.6, 0.6);
      const targetZoom = speed > 6 ? 36 : 40;

      camera.update(deltaTimeSeconds, {
        targetX: snapshot.bike.framePosition.x,
        targetY: snapshot.bike.framePosition.y + 0.55,
        lookAheadX,
        lookAheadY,
        zoom: targetZoom,
      });

      debugOverlay.setLines(
        createDebugHudLines(
          {
            camera,
            controls,
            inputSummary: input.describeActiveKeys(),
            level,
            paused,
            snapshot,
            suspensionDebugEnabled,
            testRigMode: physics.isTestRigMode(),
          },
          session.bikeTuning,
        ),
      );
    },
    render() {
      renderer.resize();
      renderer.render({
        camera,
        debugLines: debugOverlay.getLines(),
        level,
        physics: physics.getRenderState(),
        suspensionDebugEnabled,
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
