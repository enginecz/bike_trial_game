import type { BikeControls } from './bike-controls';
import type { Camera } from '../rendering/camera';
import type { PhysicsSnapshot } from '../physics/simulation';
import type { BikeTuning } from '../tuning/bike';
import type { Level } from '../world/level';
import { getBikeQuickTuneLines } from '../tuning/bike';

export interface DebugHudState {
  camera: Camera;
  controls: BikeControls;
  inputSummary: string;
  level: Level;
  paused: boolean;
  snapshot: PhysicsSnapshot;
  suspensionDebugEnabled: boolean;
  testRigMode: boolean;
}

export function createDebugHudLines(state: DebugHudState, tuning: BikeTuning): string[] {
  const speed = Math.hypot(state.snapshot.bike.frameVelocity.x, state.snapshot.bike.frameVelocity.y);

  return [
    state.level.name,
    `State: ${state.paused ? 'paused' : 'running'}`,
    `Debug overlay: ${state.suspensionDebugEnabled ? 'on' : 'off'}  Test rig: ${state.testRigMode ? 'on' : 'off'}`,
    'Prototype HUD',
    `Input: ${state.inputSummary || 'none'}`,
    `Throttle: ${state.controls.throttle.toFixed(0)}  Front brake: ${state.controls.brakeFront.toFixed(0)}  Rear brake: ${state.controls.brakeRear.toFixed(0)}`,
    `Rider shift: ${state.controls.riderShift.toFixed(0)}  Reset: ${state.controls.resetPressed ? 'yes' : 'no'}`,
    `Camera: ${state.camera.position.x.toFixed(1)}, ${state.camera.position.y.toFixed(1)}`,
    `Zoom: ${state.camera.zoom.current.toFixed(1)}`,
    `Chains: ${state.level.collisionChains.length}`,
    `Segments: ${state.level.segmentCount}`,
    `Bike x: ${state.snapshot.bike.framePosition.x.toFixed(2)}`,
    `Bike y: ${state.snapshot.bike.framePosition.y.toFixed(2)}`,
    `Frame angle: ${(state.snapshot.bike.frameAngle * (180 / Math.PI)).toFixed(1)} deg`,
    `Speed: ${speed.toFixed(2)} m/s`,
    `Pitch rate: ${(state.snapshot.bike.frameAngularVelocity * (180 / Math.PI)).toFixed(1)} deg/s`,
    `Rider offset: ${state.snapshot.bike.riderShift.toFixed(2)} m`,
    `Front travel: ${state.snapshot.bike.frontSuspensionTravel.toFixed(2)} m [${state.snapshot.bike.frontSuspensionMinTravel.toFixed(2)}..${state.snapshot.bike.frontSuspensionMaxTravel.toFixed(2)}]`,
    `Front spring: ${state.snapshot.bike.frontSpringLength.toFixed(2)} / rest ${state.snapshot.bike.frontSpringRestLength.toFixed(2)}  limit ${state.snapshot.bike.frontLimitState}`,
    `Rear travel: ${state.snapshot.bike.rearSuspensionTravel.toFixed(2)} m [${state.snapshot.bike.rearSuspensionMinTravel.toFixed(2)}..${state.snapshot.bike.rearSuspensionMaxTravel.toFixed(2)}]`,
    `Rear spring: ${state.snapshot.bike.rearSpringLength.toFixed(2)} / rest ${state.snapshot.bike.rearSpringRestLength.toFixed(2)}  limit ${state.snapshot.bike.rearLimitState}`,
    `Rear arm angle: ${state.snapshot.bike.rearSwingarmAngle.toFixed(2)} rad [${state.snapshot.bike.rearSwingarmLowerAngle.toFixed(2)}..${state.snapshot.bike.rearSwingarmUpperAngle.toFixed(2)}]`,
    `Rear wheel: ${state.snapshot.bike.rearWheelSpeed.toFixed(2)} rad/s`,
    `Front wheel: ${state.snapshot.bike.frontWheelSpeed.toFixed(2)} rad/s`,
    ...getBikeQuickTuneLines(tuning),
    'Controls: up throttle, down rear brake, A/space front brake, left/right shift, O debug, T rig, P pause, N step, R reset',
  ];
}
