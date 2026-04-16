import * as planck from 'planck-js';
import type { BikeControls } from '../game/bike-controls';
import type { BikeTuning } from '../tuning/bike';
import type { LevelPoint } from '../world/level';

export interface BikeRenderBody {
  position: {
    x: number;
    y: number;
  };
  angle: number;
}

export interface BikeRenderState {
  frame: BikeRenderBody;
  swingarm: BikeRenderBody;
  fork: BikeRenderBody;
  rider: BikeRenderBody & {
    radius: number;
  };
  rearWheel: BikeRenderBody & {
    radius: number;
  };
  frontWheel: BikeRenderBody & {
    radius: number;
  };
  frameRearPivot: {
    x: number;
    y: number;
  };
  frameFrontPivot: {
    x: number;
    y: number;
  };
  swingarmRearAxle: {
    x: number;
    y: number;
  };
  forkFrontAxle: {
    x: number;
    y: number;
  };
  rearWheelAnchor: {
    x: number;
    y: number;
  };
  frontWheelAnchor: {
    x: number;
    y: number;
  };
  rearShockFrameAnchor: {
    x: number;
    y: number;
  };
  rearShockSwingarmAnchor: {
    x: number;
    y: number;
  };
  frontSliderBase: {
    x: number;
    y: number;
  };
  frontSliderCurrent: {
    x: number;
    y: number;
  };
  frontAxleMin: {
    x: number;
    y: number;
  };
  frontAxleMax: {
    x: number;
    y: number;
  };
  rearAxleMinObserved: {
    x: number;
    y: number;
  };
  rearAxleMaxObserved: {
    x: number;
    y: number;
  };
  rearAxleMinLimit: {
    x: number;
    y: number;
  };
  rearAxleMaxLimit: {
    x: number;
    y: number;
  };
}

export interface BikeState {
  framePosition: {
    x: number;
    y: number;
  };
  frameVelocity: {
    x: number;
    y: number;
  };
  frameAngle: number;
  frameAngularVelocity: number;
  rearWheelSpeed: number;
  frontWheelSpeed: number;
  riderShift: number;
  frontSuspensionTravel: number;
  frontSuspensionMinTravel: number;
  frontSuspensionMaxTravel: number;
  frontSpringLength: number;
  frontSpringRestLength: number;
  frontLimitState: string;
  rearSuspensionTravel: number;
  rearSuspensionMinTravel: number;
  rearSuspensionMaxTravel: number;
  rearSpringLength: number;
  rearSpringRestLength: number;
  rearLimitState: string;
  rearSwingarmAngle: number;
  rearSwingarmLowerAngle: number;
  rearSwingarmUpperAngle: number;
}

export interface Bike {
  applyControls(controls: BikeControls): void;
  applyDebugRig(timeSeconds: number): void;
  captureDebugState(): void;
  getRenderState(): BikeRenderState;
  getState(): BikeState;
}

interface SpringDamper {
  joint: planck.PrismaticJoint;
  stiffness: number;
  compressionDamping: number;
  reboundDamping: number;
  restOffset: number;
  responseSpeed: number;
  maxMotorSpeed: number;
  maxMotorForce: number;
}

interface RearSuspensionModel {
  restLength: number;
  minLength: number;
  maxLength: number;
  springRate: number;
  compressionDamping: number;
  reboundDamping: number;
  bumpStopStiffness: number;
  bumpStopDamping: number;
  topOutStiffness: number;
  topOutDamping: number;
}

interface BikeOptions {
  testRigMode: boolean;
  spawn: LevelPoint;
}

export function createBike(world: planck.World, tuning: BikeTuning, options: BikeOptions): Bike {
  const spawn = planck.Vec2(options.spawn.x, options.spawn.y);
  const frameAngle = tuning.initialPose.angle;
  const swingarmAngle = frameAngle + tuning.swingarm.initialAngle;
  const forkAngle = frameAngle + tuning.fork.initialAngle;
  const forkAxis = normalizeVec2(planck.Vec2(tuning.fork.sliderAxisX, tuning.fork.sliderAxisY));
  const frame = options.testRigMode ? world.createBody({
    position: spawn,
    angle: frameAngle,
  }) : world.createDynamicBody({
    position: spawn,
    angle: frameAngle,
    linearDamping: tuning.frame.linearDamping,
    angularDamping: tuning.frame.angularDamping,
  });

  frame.createFixture(
    planck.Box(
      tuning.frame.width * 0.5,
      tuning.frame.height * 0.5,
      planck.Vec2(tuning.frame.centerOffsetX ?? 0, tuning.frame.centerOffsetY ?? 0),
      0,
    ),
    {
      density: tuning.frame.density,
      friction: tuning.frame.friction,
      filterGroupIndex: tuning.collisionGroup,
    },
  );

  const rearPivotWorld = frame.getWorldPoint(planck.Vec2(tuning.swingarm.pivotOffsetX, tuning.swingarm.pivotOffsetY));
  const frontPivotWorld = frame.getWorldPoint(planck.Vec2(tuning.fork.mountOffsetX, tuning.fork.mountOffsetY));
  const riderMountWorld = frame.getWorldPoint(planck.Vec2(tuning.rider.mountOffsetX, tuning.rider.mountOffsetY));

  const swingarm = world.createDynamicBody({
    position: rearPivotWorld.clone(),
    angle: swingarmAngle,
    angularDamping: tuning.swingarm.angularDamping,
  });

  swingarm.createFixture(
    planck.Box(
      tuning.swingarm.length * 0.5,
      tuning.swingarm.height * 0.5,
      planck.Vec2(tuning.swingarm.wheelMountOffsetX * 0.5, 0),
      0,
    ),
    {
      density: tuning.swingarm.density,
      friction: tuning.swingarm.friction,
      filterGroupIndex: tuning.collisionGroup,
    },
  );

  const fork = world.createDynamicBody({
    position: planck.Vec2(
      frontPivotWorld.x + forkAxis.x * tuning.frontSuspension.restOffset,
      frontPivotWorld.y + forkAxis.y * tuning.frontSuspension.restOffset,
    ),
    angle: forkAngle,
    angularDamping: tuning.fork.angularDamping,
  });

  fork.createFixture(
    planck.Box(
      tuning.fork.width * 0.5,
      tuning.fork.height * 0.5,
      planck.Vec2(0, -tuning.fork.height * 0.18),
      0,
    ),
    {
      density: tuning.fork.density,
      friction: tuning.fork.friction,
      filterGroupIndex: tuning.collisionGroup,
    },
  );

  const rearWheel = world.createDynamicBody({
    position: swingarm.getWorldPoint(planck.Vec2(tuning.swingarm.wheelMountOffsetX, tuning.swingarm.wheelMountOffsetY)),
    linearDamping: tuning.rearWheel.linearDamping,
    angularDamping: tuning.rearWheel.angularDamping,
  });

  rearWheel.createFixture(planck.Circle(tuning.rearWheel.radius), {
    density: tuning.rearWheel.density,
    friction: tuning.rearWheel.friction,
    restitution: tuning.rearWheel.restitution,
    filterGroupIndex: tuning.collisionGroup,
  });

  const frontWheel = world.createDynamicBody({
    position: fork.getWorldPoint(planck.Vec2(tuning.fork.lowerMountOffsetX, tuning.fork.lowerMountOffsetY)),
    linearDamping: tuning.frontWheel.linearDamping,
    angularDamping: tuning.frontWheel.angularDamping,
  });

  frontWheel.createFixture(planck.Circle(tuning.frontWheel.radius), {
    density: tuning.frontWheel.density,
    friction: tuning.frontWheel.friction,
    restitution: tuning.frontWheel.restitution,
    filterGroupIndex: tuning.collisionGroup,
  });

  const rider = world.createDynamicBody({
    position: riderMountWorld,
    angularDamping: 1.4,
    linearDamping: 0.2,
  });

  rider.createFixture(planck.Circle(tuning.rider.radius), {
    density: tuning.rider.density,
    friction: tuning.rider.friction,
    filterGroupIndex: tuning.collisionGroup,
  });

  const swingarmPivotJoint = world.createJoint(
    planck.RevoluteJoint(
      {
        collideConnected: false,
        enableLimit: true,
        lowerAngle: tuning.rearSuspension.lowerSwingarmAngle,
        upperAngle: tuning.rearSuspension.upperSwingarmAngle,
      },
      frame,
      swingarm,
      rearPivotWorld,
    ),
  ) as planck.RevoluteJoint;

  const rearWheelJoint = world.createJoint(
    planck.RevoluteJoint(
      {
        collideConnected: false,
        enableMotor: true,
        motorSpeed: 0,
        maxMotorTorque: 0,
      },
      swingarm,
      rearWheel,
      rearWheel.getPosition(),
    ),
  ) as planck.RevoluteJoint;

  const frontWheelJoint = world.createJoint(
    planck.RevoluteJoint(
      {
        collideConnected: false,
        enableMotor: true,
        motorSpeed: 0,
        maxMotorTorque: 0,
      },
      fork,
      frontWheel,
      frontWheel.getPosition(),
    ),
  ) as planck.RevoluteJoint;

  const forkSliderJoint = world.createJoint(
    planck.PrismaticJoint(
      {
        collideConnected: false,
        enableLimit: true,
        lowerTranslation: 0,
        upperTranslation: tuning.fork.travel,
      },
      frame,
      fork,
      frontPivotWorld,
      forkAxis,
    ),
  ) as planck.PrismaticJoint;

  const riderJoint = world.createJoint(
    planck.PrismaticJoint(
      {
        collideConnected: false,
        enableLimit: true,
        lowerTranslation: -tuning.rider.shiftRange,
        upperTranslation: tuning.rider.shiftRange,
        enableMotor: true,
        maxMotorForce: tuning.rider.maxMotorForce,
        motorSpeed: 0,
      },
      frame,
      rider,
      riderMountWorld,
      planck.Vec2(1, 0),
    ),
  ) as planck.PrismaticJoint;

  const frontSpring: SpringDamper = {
    joint: forkSliderJoint,
    stiffness: tuning.frontSuspension.springStrength,
    compressionDamping: tuning.frontSuspension.compressionDamping ?? tuning.frontSuspension.damping,
    reboundDamping: tuning.frontSuspension.reboundDamping ?? tuning.frontSuspension.damping,
    restOffset: tuning.frontSuspension.restOffset,
    responseSpeed: tuning.frontSuspension.responseSpeed,
    maxMotorSpeed: tuning.frontSuspension.maxMotorSpeed,
    maxMotorForce: tuning.frontSuspension.maxMotorForce,
  };

  const frontTravelMin = forkSliderJoint.getLowerLimit();
  const frontTravelMax = forkSliderJoint.getUpperLimit();
  const rearSpringRestLength = getRearShockLengthForRelativeSwingarmAngle(0);
  const rearSpringMinLength = getRearShockLengthForRelativeSwingarmAngle(tuning.rearSuspension.lowerSwingarmAngle);
  const rearSpringMaxLength = getRearShockLengthForRelativeSwingarmAngle(tuning.rearSuspension.upperSwingarmAngle);
  const rearSuspensionEffectiveMass = rearWheel.getMass() + swingarm.getMass() * 0.7;
  const rearSuspensionSpringRate = tuning.rearSuspension.springRate ??
    (() => {
      const rearSuspensionAngularFrequency = tuning.rearSuspension.frequencyHz * Math.PI * 2;
      return rearSuspensionEffectiveMass * rearSuspensionAngularFrequency * rearSuspensionAngularFrequency;
    })();
  const rearSuspensionDamping =
    2 * tuning.rearSuspension.dampingRatio * Math.sqrt(rearSuspensionSpringRate * rearSuspensionEffectiveMass);
  const rearSuspension: RearSuspensionModel = {
    restLength: rearSpringRestLength,
    minLength: rearSpringMinLength,
    maxLength: rearSpringMaxLength,
    springRate: rearSuspensionSpringRate,
    compressionDamping: tuning.rearSuspension.compressionDamping ?? rearSuspensionDamping,
    reboundDamping: tuning.rearSuspension.reboundDamping ?? rearSuspensionDamping,
    bumpStopStiffness: rearSuspensionSpringRate * 18,
    bumpStopDamping: rearSuspensionDamping * 6,
    topOutStiffness: rearSuspensionSpringRate * 12,
    topOutDamping: rearSuspensionDamping * 4,
  };
  let rearTravelMinObserved = 0;
  let rearTravelMaxObserved = 0;
  let rearAxleMinObserved = serializeVec2(rearWheel.getPosition());
  let rearAxleMaxObserved = serializeVec2(rearWheel.getPosition());

  projectRearSuspensionGeometry();
  captureDebugState();

  return {
    applyControls(controls) {
      projectRearSuspensionGeometry();

      const rearMotorSpeed = controls.throttle > 0 ? tuning.controls.throttleMotorSpeed : 0;
      const rearMotorTorque =
        controls.throttle > 0
          ? getRearDriveTorqueForCurrentSpeed()
          : controls.brakeRear > 0
            ? tuning.controls.rearBrakeTorque
            : tuning.controls.idleBrakeTorque;

      rearWheelJoint.enableMotor(true);
      rearWheelJoint.setMotorSpeed(rearMotorSpeed);
      rearWheelJoint.setMaxMotorTorque(rearMotorTorque);

      frontWheelJoint.enableMotor(true);
      frontWheelJoint.setMotorSpeed(0);
      frontWheelJoint.setMaxMotorTorque(controls.brakeFront > 0 ? tuning.controls.frontBrakeTorque : 0.6);

      const targetShift = controls.riderShift * tuning.rider.shiftRange * tuning.controls.shiftResponsiveness;
      const riderError = targetShift - riderJoint.getJointTranslation();
      const riderSpeed = clamp(riderError * 10, -tuning.rider.maxShiftSpeed, tuning.rider.maxShiftSpeed);

      riderJoint.setMaxMotorForce(tuning.rider.maxMotorForce);
      riderJoint.setMotorSpeed(riderSpeed);

      applyPrismaticSpringDamper(frontSpring);
      applyRearSuspension(rearSuspension);
    },
    applyDebugRig(timeSeconds) {
      if (!options.testRigMode) {
        return;
      }

      const sweep = Math.sin(timeSeconds * Math.PI * 2 * tuning.debugRig.sweepFrequencyHz);
      const rearForce = planck.Vec2(0, sweep * tuning.debugRig.rearSweepForce);
      const frontForce = planck.Vec2(0, sweep * tuning.debugRig.frontSweepForce);

      rearWheel.applyForceToCenter(rearForce, true);
      frontWheel.applyForceToCenter(frontForce, true);
    },
    captureDebugState,
    getRenderState() {
      const rearWheelAnchor = serializeVec2(rearWheelJoint.getAnchorA());
      const frontWheelAnchor = serializeVec2(frontWheelJoint.getAnchorA());
      const rearShockFrameAnchor = serializeVec2(
        frame.getWorldPoint(planck.Vec2(tuning.rearSuspension.frameAnchorX, tuning.rearSuspension.frameAnchorY)),
      );
      const rearShockSwingarmAnchor = serializeVec2(
        swingarm.getWorldPoint(planck.Vec2(tuning.swingarm.shockMountOffsetX, tuning.swingarm.shockMountOffsetY)),
      );
      const frontSliderBase = serializeVec2(frame.getWorldPoint(planck.Vec2(tuning.fork.mountOffsetX, tuning.fork.mountOffsetY)));
      const frontSliderCurrent = offsetPointAlongAxis(frontSliderBase, forkAxis, forkSliderJoint.getJointTranslation());
      const frontAxleCurrent = serializeVec2(frontWheel.getPosition());
      const rearAxleLocalOffset = {
        x: tuning.swingarm.wheelMountOffsetX,
        y: tuning.swingarm.wheelMountOffsetY,
      };
      const rearAxleMinLimit = offsetPointWithAngle(
        serializeVec2(frame.getWorldPoint(planck.Vec2(tuning.swingarm.pivotOffsetX, tuning.swingarm.pivotOffsetY))),
        frame.getAngle() + tuning.swingarm.initialAngle + tuning.rearSuspension.lowerSwingarmAngle,
        rearAxleLocalOffset,
      );
      const rearAxleMaxLimit = offsetPointWithAngle(
        serializeVec2(frame.getWorldPoint(planck.Vec2(tuning.swingarm.pivotOffsetX, tuning.swingarm.pivotOffsetY))),
        frame.getAngle() + tuning.swingarm.initialAngle + tuning.rearSuspension.upperSwingarmAngle,
        rearAxleLocalOffset,
      );

      return {
        frame: serializeBody(frame),
        swingarm: serializeBody(swingarm),
        fork: serializeBody(fork),
        rider: {
          ...serializeBody(rider),
          radius: tuning.rider.radius,
        },
        rearWheel: {
          ...serializeBody(rearWheel),
          radius: tuning.rearWheel.radius,
        },
        frontWheel: {
          ...serializeBody(frontWheel),
          radius: tuning.frontWheel.radius,
        },
        frameRearPivot: serializeVec2(frame.getWorldPoint(planck.Vec2(tuning.swingarm.pivotOffsetX, tuning.swingarm.pivotOffsetY))),
        frameFrontPivot: serializeVec2(frame.getWorldPoint(planck.Vec2(tuning.fork.mountOffsetX, tuning.fork.mountOffsetY))),
        swingarmRearAxle: serializeVec2(
          swingarm.getWorldPoint(planck.Vec2(tuning.swingarm.wheelMountOffsetX, tuning.swingarm.wheelMountOffsetY)),
        ),
        forkFrontAxle: serializeVec2(fork.getWorldPoint(planck.Vec2(tuning.fork.lowerMountOffsetX, tuning.fork.lowerMountOffsetY))),
        rearWheelAnchor,
        frontWheelAnchor,
        rearShockFrameAnchor,
        rearShockSwingarmAnchor,
        frontSliderBase,
        frontSliderCurrent,
        frontAxleMin: offsetPointAlongAxis(frontAxleCurrent, forkAxis, frontTravelMin - forkSliderJoint.getJointTranslation()),
        frontAxleMax: offsetPointAlongAxis(frontAxleCurrent, forkAxis, frontTravelMax - forkSliderJoint.getJointTranslation()),
        rearAxleMinObserved,
        rearAxleMaxObserved,
        rearAxleMinLimit,
        rearAxleMaxLimit,
      };
    },
    getState() {
      const frontTravel = forkSliderJoint.getJointTranslation();
      const rearSpringLength = getRearShockLengthForRelativeSwingarmAngle(swingarmPivotJoint.getJointAngle());
      const rearTravel = rearSpringRestLength - rearSpringLength;

      return {
        framePosition: serializeVec2(frame.getPosition()),
        frameVelocity: serializeVec2(frame.getLinearVelocity()),
        frameAngle: frame.getAngle(),
        frameAngularVelocity: frame.getAngularVelocity(),
        rearWheelSpeed: rearWheel.getAngularVelocity(),
        frontWheelSpeed: frontWheel.getAngularVelocity(),
        riderShift: riderJoint.getJointTranslation(),
        frontSuspensionTravel: frontTravel,
        frontSuspensionMinTravel: frontTravelMin,
        frontSuspensionMaxTravel: frontTravelMax,
        frontSpringLength: frontTravel,
        frontSpringRestLength: tuning.frontSuspension.restOffset,
        frontLimitState: getPrismaticLimitStateName(forkSliderJoint),
        rearSuspensionTravel: rearTravel,
        rearSuspensionMinTravel: rearTravelMinObserved,
        rearSuspensionMaxTravel: rearTravelMaxObserved,
        rearSpringLength,
        rearSpringRestLength,
        rearLimitState: getRevoluteLimitStateName(swingarmPivotJoint),
        rearSwingarmAngle: swingarmPivotJoint.getJointAngle(),
        rearSwingarmLowerAngle: tuning.rearSuspension.lowerSwingarmAngle,
        rearSwingarmUpperAngle: tuning.rearSuspension.upperSwingarmAngle,
      };
    },
  };

  function captureDebugState() {
    const rearSpringLength = getRearShockLengthForRelativeSwingarmAngle(swingarmPivotJoint.getJointAngle());
    const rearTravel = rearSpringRestLength - rearSpringLength;

    rearTravelMinObserved = Math.min(rearTravelMinObserved, rearTravel);
    rearTravelMaxObserved = Math.max(rearTravelMaxObserved, rearTravel);

    if (rearTravel === rearTravelMinObserved) {
      rearAxleMinObserved = serializeVec2(rearWheel.getPosition());
    }

    if (rearTravel === rearTravelMaxObserved) {
      rearAxleMaxObserved = serializeVec2(rearWheel.getPosition());
    }
  }

  function getRearShockLengthForRelativeSwingarmAngle(relativeAngle: number) {
    const absoluteAngle = tuning.swingarm.initialAngle + relativeAngle;
    const shockMountWorld = offsetPointWithAngle(
      {
        x: tuning.swingarm.pivotOffsetX,
        y: tuning.swingarm.pivotOffsetY,
      },
      absoluteAngle,
      {
        x: tuning.swingarm.shockMountOffsetX,
        y: tuning.swingarm.shockMountOffsetY,
      },
    );

    return Math.hypot(
      tuning.rearSuspension.frameAnchorX - shockMountWorld.x,
      tuning.rearSuspension.frameAnchorY - shockMountWorld.y,
    );
  }

  function getRelativeSwingarmAngleForRearShockLength(targetLength: number) {
    const lowerAngle = tuning.rearSuspension.lowerSwingarmAngle;
    const upperAngle = tuning.rearSuspension.upperSwingarmAngle;
    const minLength = getRearShockLengthForRelativeSwingarmAngle(lowerAngle);
    const maxLength = getRearShockLengthForRelativeSwingarmAngle(upperAngle);
    const clampedLength = clamp(targetLength, minLength, maxLength);

    if (clampedLength <= minLength) {
      return lowerAngle;
    }

    if (clampedLength >= maxLength) {
      return upperAngle;
    }

    let low = lowerAngle;
    let high = upperAngle;

    for (let iteration = 0; iteration < 28; iteration += 1) {
      const mid = (low + high) * 0.5;
      const midLength = getRearShockLengthForRelativeSwingarmAngle(mid);

      if (midLength < clampedLength) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return (low + high) * 0.5;
  }

  function applyRearSuspension(suspension: RearSuspensionModel) {
    const currentAngle = swingarmPivotJoint.getJointAngle();
    const currentLength = getRearShockLengthForRelativeSwingarmAngle(currentAngle);
    const lengthDerivative = getRearShockLengthDerivative(currentAngle);
    const shockSpeed = lengthDerivative * swingarmPivotJoint.getJointSpeed();
    const springCompression = Math.max(0, suspension.restLength - currentLength);
    const springForce = suspension.springRate * springCompression;
    const dampingCoefficient = shockSpeed >= 0 ? suspension.reboundDamping : suspension.compressionDamping;
    const dampingForce = -dampingCoefficient * shockSpeed;
    const bumpStopCompression = Math.max(0, suspension.minLength - currentLength);
    const bumpStopSpringForce = suspension.bumpStopStiffness * bumpStopCompression;
    const bumpStopDampingForce = suspension.bumpStopDamping * Math.max(0, -shockSpeed);
    const topOutExtension = Math.max(0, currentLength - suspension.maxLength);
    const topOutSpringForce = -suspension.topOutStiffness * topOutExtension;
    const topOutDampingForce = -suspension.topOutDamping * Math.max(0, shockSpeed);
    const totalShockForce =
      springForce +
      dampingForce +
      bumpStopSpringForce +
      bumpStopDampingForce +
      topOutSpringForce +
      topOutDampingForce;
    const suspensionTorque = totalShockForce * lengthDerivative;

    swingarm.applyTorque(suspensionTorque, true);

    if (frame.isDynamic()) {
      frame.applyTorque(-suspensionTorque, true);
    }
  }

  function projectRearSuspensionGeometry() {
    const currentRelativeAngle = swingarmPivotJoint.getJointAngle();
    const currentLength = getRearShockLengthForRelativeSwingarmAngle(currentRelativeAngle);
    const targetRelativeAngle = getRelativeSwingarmAngleForRearShockLength(currentLength);

    if (Math.abs(targetRelativeAngle - currentRelativeAngle) < 0.0001) {
      return;
    }

    const rearPivotPosition = frame.getWorldPoint(planck.Vec2(tuning.swingarm.pivotOffsetX, tuning.swingarm.pivotOffsetY));
    const rearPivotVelocity = frame.getLinearVelocityFromWorldPoint(rearPivotPosition);
    const targetSwingarmAngle = frame.getAngle() + tuning.swingarm.initialAngle + targetRelativeAngle;

    swingarm.setTransform(rearPivotPosition, targetSwingarmAngle);
    swingarm.setLinearVelocity(rearPivotVelocity);
    swingarm.setAngularVelocity(frame.getAngularVelocity());
  }

  function getRearShockLengthDerivative(relativeAngle: number) {
    const epsilon = 0.0005;
    const angleMin = tuning.rearSuspension.lowerSwingarmAngle;
    const angleMax = tuning.rearSuspension.upperSwingarmAngle;
    const sampleA = clamp(relativeAngle - epsilon, angleMin, angleMax);
    const sampleB = clamp(relativeAngle + epsilon, angleMin, angleMax);

    if (sampleA === sampleB) {
      return 0;
    }

    const lengthA = getRearShockLengthForRelativeSwingarmAngle(sampleA);
    const lengthB = getRearShockLengthForRelativeSwingarmAngle(sampleB);
    return (lengthB - lengthA) / (sampleB - sampleA);
  }

  function getRearDriveTorqueForCurrentSpeed(): number {
    if (!tuning.controls.constantPowerWatts) {
      return tuning.controls.rearDriveTorque;
    }

    // Prevent singular torque at or near zero wheel speed while keeping the
    // drive close to constant-power behavior through the usable speed range.
    const minimumReferenceSpeed = 4;
    const wheelSpeed = Math.max(Math.abs(rearWheel.getAngularVelocity()), minimumReferenceSpeed);

    return tuning.controls.constantPowerWatts / wheelSpeed;
  }
}

function applyPrismaticSpringDamper(spring: SpringDamper) {
  const translation = spring.joint.getJointTranslation();
  const speed = spring.joint.getJointSpeed();
  const positionError = spring.restOffset - translation;
  const targetSpeed = clamp(positionError * spring.responseSpeed - speed * 0.35, -spring.maxMotorSpeed, spring.maxMotorSpeed);
  const dampingCoefficient = speed >= 0 ? spring.reboundDamping : spring.compressionDamping;
  const requestedForce = Math.abs(positionError * spring.stiffness - speed * dampingCoefficient);
  const maxForce = clamp(requestedForce, 0, spring.maxMotorForce);

  spring.joint.enableMotor(true);
  spring.joint.setMotorSpeed(targetSpeed);
  spring.joint.setMaxMotorForce(maxForce);
}

function serializeBody(body: planck.Body): BikeRenderBody {
  return {
    position: serializeVec2(body.getPosition()),
    angle: body.getAngle(),
  };
}

function serializeVec2(vector: planck.Vec2): { x: number; y: number } {
  return {
    x: vector.x,
    y: vector.y,
  };
}

function offsetPointAlongAxis(point: { x: number; y: number }, axis: planck.Vec2, distance: number): { x: number; y: number } {
  return {
    x: point.x + axis.x * distance,
    y: point.y + axis.y * distance,
  };
}

function offsetPointWithAngle(
  origin: { x: number; y: number },
  angle: number,
  offset: { x: number; y: number },
): { x: number; y: number } {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  return {
    x: origin.x + offset.x * cosine - offset.y * sine,
    y: origin.y + offset.x * sine + offset.y * cosine,
  };
}

function getPointDistance(pointA: planck.Vec2, pointB: planck.Vec2): number {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function getPrismaticLimitStateName(joint: planck.PrismaticJoint): string {
  const translation = joint.getJointTranslation();
  const lower = joint.getLowerLimit();
  const upper = joint.getUpperLimit();
  const epsilon = 0.001;

  if (Math.abs(translation - lower) < epsilon) {
    return 'lower';
  }

  if (Math.abs(translation - upper) < epsilon) {
    return 'upper';
  }

  return 'free';
}

function getRevoluteLimitStateName(joint: planck.RevoluteJoint): string {
  const angle = joint.getJointAngle();
  const lower = joint.getLowerLimit();
  const upper = joint.getUpperLimit();
  const epsilon = 0.001;

  if (Math.abs(angle - lower) < epsilon) {
    return 'lower';
  }

  if (Math.abs(angle - upper) < epsilon) {
    return 'upper';
  }

  return 'free';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeVec2(vector: planck.Vec2): planck.Vec2 {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return planck.Vec2(vector.x / length, vector.y / length);
}
