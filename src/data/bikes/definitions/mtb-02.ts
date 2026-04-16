import { mtb02Variables } from '../variables/mtb-02.variables';
import { createIndependentBike, type BikeDefinition } from '../shared';

const MM_TO_M = 0.001;
const IN_TO_M = 0.0254;
const LB_PER_IN_TO_N_PER_M = 175.12683524647636;

const variableEntries = Object.fromEntries(mtb02Variables.map((entry) => [entry.name, entry.value]));

function getNumericVariable(name: string): number {
  const value = variableEntries[name];

  if (typeof value !== 'number') {
    throw new Error(`Expected numeric bike variable "${name}" for mtb-02.`);
  }

  return value;
}

function mm(name: string): number {
  return getNumericVariable(name) * MM_TO_M;
}

function degrees(name: string): number {
  return (getNumericVariable(name) * Math.PI) / 180;
}

function rotatePoint(point: { x: number; y: number }, angle: number) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  };
}

function invertRotatePoint(point: { x: number; y: number }, angle: number) {
  return rotatePoint(point, -angle);
}

function getCircleIntersections(
  centerA: { x: number; y: number },
  radiusA: number,
  centerB: { x: number; y: number },
  radiusB: number,
) {
  const dx = centerB.x - centerA.x;
  const dy = centerB.y - centerA.y;
  const distance = Math.hypot(dx, dy);

  if (distance === 0 || distance > radiusA + radiusB || distance < Math.abs(radiusA - radiusB)) {
    throw new Error('mtb-02 geometry variables do not produce a valid circle intersection.');
  }

  const along = (radiusA * radiusA - radiusB * radiusB + distance * distance) / (2 * distance);
  const height = Math.sqrt(Math.max(0, radiusA * radiusA - along * along));
  const midX = centerA.x + (along * dx) / distance;
  const midY = centerA.y + (along * dy) / distance;
  const offsetX = (-dy * height) / distance;
  const offsetY = (dx * height) / distance;

  return [
    { x: midX + offsetX, y: midY + offsetY },
    { x: midX - offsetX, y: midY - offsetY },
  ];
}

const reach = mm('reach');
const stack = mm('stack');
const seatTube = mm('seat_tube');
const seatAngle = degrees('seat_angle_ef');
const headAngle = degrees('head_angle');
const headTube = mm('head_tube');
const frontSuspensionTravel = mm('front_sus_travel');
const frontSuspensionSpringRate = getNumericVariable('front_sus_rate');
const frontSuspensionCompressionDamping = getNumericVariable('front_sus_comp_damping');
const frontSuspensionReboundDamping = getNumericVariable('front_sus_rebound_damping');
const forkOffset = mm('fork_offset');
const pivotX = mm('pivot_x');
const pivotY = mm('pivot_y');
const rearSuspensionFrameX = mm('rear_sus_x');
const rearSuspensionFrameY = mm('rear_sus_y');
const rearSuspensionLength = mm('rear_sus_length');
const rearSuspensionTravel = mm('rear_sus_travel');
const rearSuspensionSpringRate = getNumericVariable('rear_sus_rate') * LB_PER_IN_TO_N_PER_M;
const rearSuspensionCompressionDamping = getNumericVariable('rear_sus_comp_damping');
const rearSuspensionReboundDamping = getNumericVariable('rear_sus_rebound_damping');
const swingPivotSuspensionDistance = mm('swing_pivot_sus');
const chainstay = mm('chainstay');
const bbDrop = mm('bb_drop');
const wheelbase = mm('wheelbase');
const frameMass = getNumericVariable('frame_mass');
const swingarmMass = getNumericVariable('swingarm_mass');
const forkMass = getNumericVariable('fork_mass');
const rearWheelMass = getNumericVariable('rear_wheel_mass');
const frontWheelMass = getNumericVariable('front_wheel_mass');
const riderMass = getNumericVariable('rider_mass');
const frontWheelRadius = getNumericVariable('wheel_front_dia') * IN_TO_M * 0.5;
const rearWheelRadius = getNumericVariable('wheel_rear_dia') * IN_TO_M * 0.5;
const riderRadius = 0.18;

const frameBottomPoint = { x: 0, y: 0 };
const frameSeatPoint = {
  x: -Math.cos(seatAngle) * seatTube,
  y: Math.sin(seatAngle) * seatTube,
};
const frameHeadPoint = { x: reach, y: stack };
const headAxisDirection = {
  x: Math.cos(headAngle),
  y: -Math.sin(headAngle),
};
const headAxisNormal = {
  x: -headAxisDirection.y,
  y: headAxisDirection.x,
};
const forkMountPoint = {
  x: frameHeadPoint.x + headAxisDirection.x * headTube,
  y: frameHeadPoint.y + headAxisDirection.y * headTube,
};
const rearPivotPoint = { x: pivotX, y: pivotY };
const rearWheelPoint = { x: -chainstay, y: bbDrop };
const swingarmInitialAngle = Math.asin((rearPivotPoint.y - rearWheelPoint.y) / chainstay);
const rearShockFramePoint = {
  x: rearSuspensionFrameX,
  y: rearSuspensionFrameY,
};

const [shockWorldCandidateA, shockWorldCandidateB] = getCircleIntersections(
  rearPivotPoint,
  swingPivotSuspensionDistance,
  rearShockFramePoint,
  rearSuspensionLength,
);

const rearShockWorldPoint =
  shockWorldCandidateA.x < rearPivotPoint.x ? shockWorldCandidateA : shockWorldCandidateB;
const rearShockLocalPoint = invertRotatePoint(
  {
    x: rearShockWorldPoint.x - rearPivotPoint.x,
    y: rearShockWorldPoint.y - rearPivotPoint.y,
  },
  swingarmInitialAngle,
);

const frontWheelPoint = {
  x: rearWheelPoint.x + wheelbase,
  y:
    forkMountPoint.y +
    (forkOffset - (rearWheelPoint.x + wheelbase - forkMountPoint.x) * headAxisNormal.x) / headAxisNormal.y,
};
const forkBodyOrigin = {
  x: forkMountPoint.x + headAxisDirection.x * frontSuspensionTravel,
  y: forkMountPoint.y + headAxisDirection.y * frontSuspensionTravel,
};
const forkLowerMountLocalPoint = invertRotatePoint(
  {
    x: frontWheelPoint.x - forkBodyOrigin.x,
    y: frontWheelPoint.y - forkBodyOrigin.y,
  },
  -headAngle,
);

const frameMinX = Math.min(frameBottomPoint.x, frameSeatPoint.x, frameHeadPoint.x);
const frameMaxX = Math.max(frameBottomPoint.x, frameSeatPoint.x, frameHeadPoint.x);
const frameMinY = Math.min(frameBottomPoint.y, frameSeatPoint.y, frameHeadPoint.y);
const frameMaxY = Math.max(frameBottomPoint.y, frameSeatPoint.y, frameHeadPoint.y);
const frameWidth = frameMaxX - frameMinX;
const frameHeight = frameMaxY - frameMinY;
const swingarmHeight = 0.055;
const forkWidth = 0.08;
const forkHeight = 0.57;
const frameDensity = frameMass / (frameWidth * frameHeight);
const swingarmDensity = swingarmMass / (chainstay * swingarmHeight);
const forkDensity = forkMass / (forkWidth * forkHeight);
const riderDensity = riderMass / (Math.PI * riderRadius * riderRadius);
const rearWheelDensity = rearWheelMass / (Math.PI * rearWheelRadius * rearWheelRadius);
const frontWheelDensity = frontWheelMass / (Math.PI * frontWheelRadius * frontWheelRadius);
const rearSwingarmUpperAngle = 0;

function getRearSwingarmLowerAngle() {
  const pivotToAnchor = {
    x: rearShockFramePoint.x - rearPivotPoint.x,
    y: rearShockFramePoint.y - rearPivotPoint.y,
  };
  const anchorDistance = Math.hypot(pivotToAnchor.x, pivotToAnchor.y);
  const localShockAngle = Math.atan2(rearShockLocalPoint.y, rearShockLocalPoint.x);
  const anchorAngle = Math.atan2(pivotToAnchor.y, pivotToAnchor.x);
  const compressedShockLength = rearSuspensionLength - rearSuspensionTravel;
  const cosTerm =
    (swingPivotSuspensionDistance * swingPivotSuspensionDistance +
      anchorDistance * anchorDistance -
      compressedShockLength * compressedShockLength) /
    (2 * swingPivotSuspensionDistance * anchorDistance);
  const clampedCosTerm = Math.max(-1, Math.min(1, cosTerm));
  const deltaAngle = Math.acos(clampedCosTerm);
  const candidateA = anchorAngle + deltaAngle - localShockAngle;
  const candidateB = anchorAngle - deltaAngle - localShockAngle;

  const compressedSwingarmAngle = Math.min(candidateA, candidateB);

  // RevoluteJoint limits are relative to the joint reference angle at creation time.
  // Because the joint is created in the no-load pose, the upper limit is 0 and the
  // lower limit must be expressed relative to that initial swingarm angle.
  return compressedSwingarmAngle - swingarmInitialAngle;
}

export const mtb02: BikeDefinition = createIndependentBike({
  id: 'mtb-02',
  name: 'mtb-02',
  description: 'Zjednodusene MTB podle Orange Stage 6, prvni krok: jen ramovy trojuhelnik XL.',
  rendering: {
    frameOnly: true,
    frameTriangle: {
      points: [frameBottomPoint, frameSeatPoint, frameHeadPoint],
    },
    headAxisLine: {
      start: frameHeadPoint,
      end: forkMountPoint,
    },
    forkTriangle: {
      localTo: 'fork',
      points: [
        { x: 0, y: 0 },
        { x: forkLowerMountLocalPoint.x, y: 0 },
        { x: forkLowerMountLocalPoint.x, y: forkLowerMountLocalPoint.y },
      ],
    },
    frontWheelCircle: {
      localTo: 'fork',
      center: forkLowerMountLocalPoint,
      radius: frontWheelRadius,
    },
    frontSuspensionLine: {
      start: forkMountPoint,
      end: { x: 0, y: 0 },
      endLocalTo: 'fork',
    },
    swingarmTriangle: {
      localTo: 'swingarm',
      points: [
        { x: 0, y: 0 },
        { x: -chainstay, y: 0 },
        rearShockLocalPoint,
      ],
    },
    rearWheelCircle: {
      localTo: 'swingarm',
      center: { x: -chainstay, y: 0 },
      radius: rearWheelRadius,
    },
    riderTriangle: {
      points: [
        frameBottomPoint,
        frameHeadPoint,
        { x: 0, y: 1.0 },
      ],
    },
    shockLine: {
      start: rearShockFramePoint,
      end: rearShockLocalPoint,
      endLocalTo: 'swingarm',
    },
  },
  tuning: {
    gravityY: -18,
    solverVelocityIterations: 14,
    solverPositionIterations: 8,
    collisionGroup: -1,
    terrain: {
      friction: 1.18,
      restitution: 0,
    },
    debugRig: {
      frameHeight: 2.4,
      frontSweepForce: 140,
      rearSweepForce: 180,
      sweepFrequencyHz: 0.18,
    },
    initialPose: {
      angle: 0,
    },
    frame: {
      width: frameWidth,
      height: frameHeight,
      centerOffsetX: (frameMinX + frameMaxX) * 0.5,
      centerOffsetY: (frameMinY + frameMaxY) * 0.5,
      density: frameDensity,
      friction: 0.6,
      linearDamping: 0.22,
      angularDamping: 0.78,
    },
    swingarm: {
      initialAngle: swingarmInitialAngle,
      length: chainstay,
      height: swingarmHeight,
      density: swingarmDensity,
      friction: 0.6,
      angularDamping: 0.68,
      pivotOffsetX: pivotX,
      pivotOffsetY: pivotY,
      wheelMountOffsetX: -chainstay,
      wheelMountOffsetY: 0,
      shockMountOffsetX: rearShockLocalPoint.x,
      shockMountOffsetY: rearShockLocalPoint.y,
    },
    fork: {
      initialAngle: -headAngle,
      width: forkWidth,
      height: forkHeight,
      density: forkDensity,
      friction: 0.4,
      angularDamping: 0.56,
      mountOffsetX: forkMountPoint.x,
      mountOffsetY: forkMountPoint.y,
      sliderAxisX: headAxisDirection.x,
      sliderAxisY: headAxisDirection.y,
      lowerMountOffsetX: forkLowerMountLocalPoint.x,
      lowerMountOffsetY: forkLowerMountLocalPoint.y,
      travel: frontSuspensionTravel,
    },
    rider: {
      radius: riderRadius,
      density: riderDensity,
      friction: 0.5,
      mountOffsetX: 0.1678,
      mountOffsetY: 0.5493,
      shiftRange: 0.08,
      maxMotorForce: 90,
      maxShiftSpeed: 0.8,
    },
    rearWheel: {
      radius: rearWheelRadius,
      density: rearWheelDensity,
      friction: 1.55,
      restitution: 0,
      linearDamping: 0.04,
      angularDamping: 0.34,
    },
    frontWheel: {
      radius: frontWheelRadius,
      density: frontWheelDensity,
      friction: 1.5,
      restitution: 0,
      linearDamping: 0.04,
      angularDamping: 0.32,
    },
    rearSuspension: {
      frameAnchorX: rearSuspensionFrameX,
      frameAnchorY: rearSuspensionFrameY,
      frequencyHz: 2.4,
      dampingRatio: 0.82,
      springRate: rearSuspensionSpringRate,
      compressionDamping: rearSuspensionCompressionDamping,
      reboundDamping: rearSuspensionReboundDamping,
      lowerSwingarmAngle: getRearSwingarmLowerAngle(),
      upperSwingarmAngle: rearSwingarmUpperAngle,
    },
    frontSuspension: {
      springStrength: frontSuspensionSpringRate,
      damping: frontSuspensionReboundDamping,
      compressionDamping: frontSuspensionCompressionDamping,
      reboundDamping: frontSuspensionReboundDamping,
      restOffset: frontSuspensionTravel,
      responseSpeed: 9,
      maxMotorSpeed: 1.4,
      maxMotorForce: 180,
    },
    controls: {
      throttleMotorSpeed: 0,
      rearDriveTorque: 0,
      rearBrakeTorque: 0,
      frontBrakeTorque: 0,
      idleBrakeTorque: 0,
      shiftResponsiveness: 0.6,
    },
  },
});
