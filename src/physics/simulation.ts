import * as planck from 'planck-js';
import type { BikeControls } from '../game/bike-controls';
import type { Level, LevelPoint } from '../world/level';
import type { BikeTuning } from '../tuning/bike';
import { createBike, type Bike, type BikeRenderState, type BikeState } from './bike';
import { createTerrainBody } from './terrain';

export interface PhysicsRenderState {
  bike: BikeRenderState;
  testRigMode: boolean;
}

export interface PhysicsSnapshot {
  bike: BikeState;
}

export interface PhysicsSimulation {
  isTestRigMode(): boolean;
  reset(): void;
  setSpawn(spawn: LevelPoint): void;
  step(controls: BikeControls): void;
  toggleTestRigMode(): void;
  getRenderState(): PhysicsRenderState;
  getSnapshot(): PhysicsSnapshot;
}

export function createPhysicsSimulation(level: Level, tuning: BikeTuning): PhysicsSimulation {
  let testRigMode = false;
  let rigTimeSeconds = 0;
  let currentSpawn = level.spawn;
  let world = createWorld(tuning, testRigMode);
  let bike = createScene();

  function createScene(): Bike {
    if (!testRigMode) {
      createTerrainBody(world, level, tuning);
    }

    return createBike(world, tuning, {
      testRigMode,
      spawn: currentSpawn,
    });
  }

  return {
    isTestRigMode() {
      return testRigMode;
    },
    reset() {
      rigTimeSeconds = 0;
      world = createWorld(tuning, testRigMode);
      bike = createScene();
    },
    setSpawn(spawn) {
      currentSpawn = spawn;
    },
    step(controls) {
      bike.applyControls(controls);
      if (testRigMode) {
        bike.applyDebugRig(rigTimeSeconds);
        rigTimeSeconds += 1 / 60;
      }
      world.step(1 / 60, tuning.solverVelocityIterations, tuning.solverPositionIterations);
      bike.captureDebugState();
    },
    toggleTestRigMode() {
      testRigMode = !testRigMode;
      rigTimeSeconds = 0;
      world = createWorld(tuning, testRigMode);
      bike = createScene();
    },
    getRenderState() {
      return {
        bike: bike.getRenderState(),
        testRigMode,
      };
    },
    getSnapshot() {
      return {
        bike: bike.getState(),
      };
    },
  };
}

function createWorld(tuning: BikeTuning, testRigMode: boolean): planck.World {
  return new planck.World(planck.Vec2(0, testRigMode ? 0 : tuning.gravityY));
}
