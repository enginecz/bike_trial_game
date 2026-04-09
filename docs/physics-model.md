# Physics Model

## Intent

Use a believable but stable 2D multibody approximation of a trials motorcycle and rider system. The model should favor determinism, tuning clarity, and implementation speed over maximum physical completeness.

## Proposed V1 Body Set

Target 7 rigid bodies:

1. Main frame
2. Swingarm
3. Front fork lower assembly
4. Rear wheel
5. Front wheel
6. Rider torso/hips mass
7. Rider upper body balance mass

This count can move to 6 or 8 depending on stability and implementation complexity.

## Joint Model

- Rear wheel to swingarm: revolute joint
- Swingarm to frame: revolute joint
- Front wheel to fork: revolute joint
- Fork to frame: prismatic or constrained joint approximation
- Rider torso to frame: prismatic or revolute-guided mount for fore/aft shift
- Rider upper body to torso: limited joint for posture and balance bias

## Suspension Direction

- Rear suspension represented by the swingarm-frame relationship plus spring-damper force
- Front suspension represented by telescopic fork travel with spring-damper force
- Use moderate travel and conservative damping to avoid unstable oscillation
- Prioritize stable contact behavior over aggressive bounce

## Forces And Controls

- Rear wheel drive torque from throttle input
- Brake torque on both wheels with separate tuning values
- Rider weight shift as controlled movement of rider-related bodies
- Gravity, contact friction, and restitution from Planck.js fixtures

## Simulation Approach

- Fixed timestep update
- Decoupled render interpolation later if needed
- Tuning values stored outside simulation code
- Physics adapter interface so Planck.js can be replaced in the future

## Early Stability Guidelines

- Keep body shapes simple
- Keep center of mass low enough for learning and testing
- Start with conservative motor torques
- Avoid stacked joint chains with excessive freedom
- Limit suspension travel and rider shift range
- Add debug draw support early

## Known Simplifications For V1

- Tire behavior will be a simplified contact/friction approximation
- No deformable tires
- No clutch, gearbox, or engine RPM simulation initially
- No procedural rider animation beyond body mass shifting
