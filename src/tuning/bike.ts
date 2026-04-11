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
    density: number;
    friction: number;
    linearDamping: number;
    angularDamping: number;
  };
  swingarm: {
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
    lowerSwingarmAngle: number;
    upperSwingarmAngle: number;
  };
  frontSuspension: {
    springStrength: number;
    damping: number;
    restOffset: number;
    responseSpeed: number;
    maxMotorSpeed: number;
    maxMotorForce: number;
  };
  controls: {
    throttleMotorSpeed: number;
    rearDriveTorque: number;
    rearBrakeTorque: number;
    frontBrakeTorque: number;
    idleBrakeTorque: number;
    shiftResponsiveness: number;
  };
}

export const bikeTuning: BikeTuning = {
  // Quick edit section for rapid physics iteration.
  gravityY: -18,
  solverVelocityIterations: 14,
  solverPositionIterations: 8,
  collisionGroup: -1,
  terrain: {
    friction: 1.25,
    restitution: 0,
  },
  debugRig: {
    frameHeight: 2.8,
    frontSweepForce: 140,
    rearSweepForce: 180,
    sweepFrequencyHz: 0.18,
  },
  initialPose: {
    angle: 0,
  },
  frame: {
    width: 1.15,
    height: 0.22,
    density: 16.5,
    friction: 0.6,
    linearDamping: 0.34,
    angularDamping: 1.2,
  },
  swingarm: {
    length: 1.2,
    height: 0.12,
    density: 8.5,
    friction: 0.6,
    angularDamping: 0.85,
    pivotOffsetX: -0.35,
    pivotOffsetY: -0.04,
    wheelMountOffsetX: -0.82,
    wheelMountOffsetY: -0.02,
    shockMountOffsetX: -0.15,
    shockMountOffsetY: 0.02,
  },
  fork: {
    width: 0.16,
    height: 1.18,
    density: 7,
    friction: 0.4,
    angularDamping: 0.8,
    mountOffsetX: 0.56,
    mountOffsetY: 0.1,
    sliderAxisX: -0.24,
    sliderAxisY: -0.97,
    lowerMountOffsetX: -0.02,
    lowerMountOffsetY: -0.42,
    travel: 0.42,
  },
  rider: {
    radius: 0.28,
    density: 5.2,
    friction: 0.5,
    mountOffsetX: 0.02,
    mountOffsetY: 0.58,
    shiftRange: 0.24,
    maxMotorForce: 170,
    maxShiftSpeed: 1.3,
  },
  rearWheel: {
    radius: 0.43,
    density: 1.6,
    friction: 1.95,
    restitution: 0,
    linearDamping: 0.1,
    angularDamping: 0.9,
  },
  frontWheel: {
    radius: 0.43,
    density: 1.5,
    friction: 1.8,
    restitution: 0,
    linearDamping: 0.08,
    angularDamping: 0.78,
  },
  rearSuspension: {
    frameAnchorX: 0.05,
    frameAnchorY: 0.3,
    frequencyHz: 3.8,
    dampingRatio: 0.96,
    lowerSwingarmAngle: -0.62,
    upperSwingarmAngle: 0.28,
  },
  frontSuspension: {
    springStrength: 160,
    damping: 24,
    restOffset: 0.3,
    responseSpeed: 12,
    maxMotorSpeed: 2.2,
    maxMotorForce: 420,
  },
  controls: {
    throttleMotorSpeed: -18,
    rearDriveTorque: 48,
    rearBrakeTorque: 18,
    frontBrakeTorque: 20,
    idleBrakeTorque: 1.4,
    shiftResponsiveness: 0.82,
  },
};

export function getBikeQuickTuneLines(tuning: BikeTuning): string[] {
  return [
    `rear spring ${tuning.rearSuspension.frequencyHz.toFixed(2)}Hz / ${tuning.rearSuspension.dampingRatio.toFixed(2)}`,
    `front spring ${tuning.frontSuspension.springStrength.toFixed(0)} / ${tuning.frontSuspension.damping.toFixed(0)}`,
    `rear drive ${tuning.controls.rearDriveTorque.toFixed(0)} @ ${tuning.controls.throttleMotorSpeed.toFixed(0)}`,
    `rider range ${tuning.rider.shiftRange.toFixed(2)} force ${tuning.rider.maxMotorForce.toFixed(0)}`,
  ];
}
