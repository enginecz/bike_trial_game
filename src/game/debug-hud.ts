import type { BikeControls } from './bike-controls';
import type { BikeDefinition } from '../data/bikes';
import type { Camera } from '../rendering/camera';
import type { PhysicsSnapshot } from '../physics/simulation';
import type { BikeTuning } from '../tuning/bike';
import type { Level } from '../world/level';
import { getBikeQuickTuneLines } from '../tuning/bike';

export interface OverlayLegendEntry {
  color: string;
  label: string;
}

export interface DebugHudState {
  activeBike: BikeDefinition;
  camera: Camera;
  controls: BikeControls;
  activeSpawnName: string;
  inputSummary: string;
  level: Level;
  paused: boolean;
  snapshot: PhysicsSnapshot;
  suspensionDebugEnabled: boolean;
  terrainDebugEnabled: boolean;
  testRigMode: boolean;
}

export function createDebugHudLines(state: DebugHudState, tuning: BikeTuning): string[] {
  const speed = Math.hypot(state.snapshot.bike.frameVelocity.x, state.snapshot.bike.frameVelocity.y);

  return [
    state.level.name,
    `State: ${state.paused ? 'paused' : 'running'}`,
    `Bike overlay: ${state.suspensionDebugEnabled ? 'on' : 'off'}  Terrain overlay: ${state.terrainDebugEnabled ? 'on' : 'off'}  Test rig: ${state.testRigMode ? 'on' : 'off'}`,
    'Prototype HUD',
    `Bike: ${state.activeBike.name}`,
    'Ride Controls',
    'Up throttle | Down rear brake | A/Space front brake | Left/Right rider shift',
    'Debug / General',
    'B next bike | R reset | 1 main spawn | 2-5 test spawns | O bike overlay | G terrain overlay | T test rig | P pause | N single-step',
    'View',
    '- zoom out | = zoom in | 0 reset zoom',
    `Active spawn: ${state.activeSpawnName}`,
    `Test spawns: ${state.level.testSpawns.map((spawn) => `${spawn.key} ${spawn.name}`).join(' | ') || 'none'}`,
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
  ];
}

export function createOverlayLegendEntries(): OverlayLegendEntry[] {
  return [
    { color: '#f5f5f5', label: 'wheel centers and tire outlines' },
    { color: '#ffb703', label: 'frame body' },
    { color: '#ffd166', label: 'rear swingarm body and rear hard link' },
    { color: '#7bdff2', label: 'front assembly / fork body' },
    { color: '#a0e426', label: 'rear wheel body' },
    { color: '#c77dff', label: 'front wheel body' },
    { color: '#ff99c8', label: 'rider body' },
    { color: '#ef476f', label: 'spring-damper lines and joint-of-action references' },
    { color: '#67d6ff', label: 'travel ranges and travel limit guides' },
    { color: '#bdb2ff', label: 'reference lines: body-axis orientation guides' },
    { color: '#ffd166', label: 'joint and pivot markers' },
  ];
}

export function createTerrainLegendEntries(): OverlayLegendEntry[] {
  return [
    { color: '#f0f0f0', label: 'terrain collision chain' },
    { color: '#4cc9f0', label: 'terrain segment reference lines' },
    { color: '#8ae6c1', label: 'terrain chain vertices' },
    { color: '#ffd166', label: 'spawn and test-spawn markers' },
  ];
}
