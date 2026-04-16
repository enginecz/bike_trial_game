export interface BikeTuning {
  gravityY: number;
  solverVelocityIterations: number;
  solverPositionIterations: number;
  collisionGroup: number;
  terrain: {
    friction: number;
    restitution: number;
  };
  debugRig: {
    frameHeight: number;
    frontSweepForce: number;
    rearSweepForce: number;
    sweepFrequencyHz: number;
  };
  initialPose: {
    angle: number;
  };
  frame: {
    width: number;
    height: number;
    centerOffsetX?: number;
    centerOffsetY?: number;
    density: number;
    friction: number;
    linearDamping: number;
    angularDamping: number;
  };
  swingarm: {
    initialAngle: number;
    length: number;
    height: number;
    density: number;
    friction: number;
    angularDamping: number;
    pivotOffsetX: number;
    pivotOffsetY: number;
    wheelMountOffsetX: number;
    wheelMountOffsetY: number;
    shockMountOffsetX: number;
    shockMountOffsetY: number;
  };
  fork: {
    initialAngle: number;
    width: number;
    height: number;
    density: number;
    friction: number;
    angularDamping: number;
    mountOffsetX: number;
    mountOffsetY: number;
    sliderAxisX: number;
    sliderAxisY: number;
    lowerMountOffsetX: number;
    lowerMountOffsetY: number;
    travel: number;
  };
  rider: {
    radius: number;
    density: number;
    friction: number;
    mountOffsetX: number;
    mountOffsetY: number;
    shiftRange: number;
    maxMotorForce: number;
    maxShiftSpeed: number;
  };
  rearWheel: {
    radius: number;
    density: number;
    friction: number;
    restitution: number;
    linearDamping: number;
    angularDamping: number;
  };
  frontWheel: {
    radius: number;
    density: number;
    friction: number;
    restitution: number;
    linearDamping: number;
    angularDamping: number;
  };
  rearSuspension: {
    frameAnchorX: number;
    frameAnchorY: number;
    frequencyHz: number;
    dampingRatio: number;
    springRate?: number;
    compressionDamping?: number;
    reboundDamping?: number;
    lowerSwingarmAngle: number;
    upperSwingarmAngle: number;
  };
  frontSuspension: {
    springStrength: number;
    damping: number;
    compressionDamping?: number;
    reboundDamping?: number;
    restOffset: number;
    responseSpeed: number;
    maxMotorSpeed: number;
    maxMotorForce: number;
  };
  controls: {
    throttleMotorSpeed: number;
    rearDriveTorque: number;
    constantPowerWatts?: number;
    rearBrakeTorque: number;
    frontBrakeTorque: number;
    idleBrakeTorque: number;
    shiftResponsiveness: number;
  };
}

export type BikeTuningOverrides = {
  [Key in keyof BikeTuning]?: BikeTuning[Key] extends Record<string, number>
    ? Partial<BikeTuning[Key]>
    : BikeTuning[Key];
};

export function createBikeTuningVariant(base: BikeTuning, overrides: BikeTuningOverrides): BikeTuning {
  return {
    ...base,
    ...overrides,
    terrain: { ...base.terrain, ...overrides.terrain },
    debugRig: { ...base.debugRig, ...overrides.debugRig },
    initialPose: { ...base.initialPose, ...overrides.initialPose },
    frame: { ...base.frame, ...overrides.frame },
    swingarm: { ...base.swingarm, ...overrides.swingarm },
    fork: { ...base.fork, ...overrides.fork },
    rider: { ...base.rider, ...overrides.rider },
    rearWheel: { ...base.rearWheel, ...overrides.rearWheel },
    frontWheel: { ...base.frontWheel, ...overrides.frontWheel },
    rearSuspension: { ...base.rearSuspension, ...overrides.rearSuspension },
    frontSuspension: { ...base.frontSuspension, ...overrides.frontSuspension },
    controls: { ...base.controls, ...overrides.controls },
  };
}

export function getBikeQuickTuneLines(tuning: BikeTuning): string[] {
  const rearSpringLine = tuning.rearSuspension.springRate
    ? `rear spring ${(tuning.rearSuspension.springRate / 1000).toFixed(1)}kN/m / ${tuning.rearSuspension.dampingRatio.toFixed(2)}`
    : `rear spring ${tuning.rearSuspension.frequencyHz.toFixed(2)}Hz / ${tuning.rearSuspension.dampingRatio.toFixed(2)}`;
  const driveLine = tuning.controls.constantPowerWatts
    ? `rear drive ${(tuning.controls.constantPowerWatts / 1000).toFixed(1)}kW @ any rpm`
    : `rear drive ${tuning.controls.rearDriveTorque.toFixed(0)} @ ${tuning.controls.throttleMotorSpeed.toFixed(0)}`;

  return [
    rearSpringLine,
    `front spring ${tuning.frontSuspension.springStrength.toFixed(0)} / ${(tuning.frontSuspension.reboundDamping ?? tuning.frontSuspension.damping).toFixed(0)}`,
    driveLine,
    `rider range ${tuning.rider.shiftRange.toFixed(2)} force ${tuning.rider.maxMotorForce.toFixed(0)}`,
  ];
}
