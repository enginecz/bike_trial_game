import * as planck from 'planck-js';
import type { BikeTuning } from '../tuning/bike';
import type { Level } from '../world/level';

export function createTerrainBody(world: planck.World, level: Level, tuning: BikeTuning): planck.Body {
  const ground = world.createBody();

  level.collisionChains.forEach((chain) => {
    const vertices = chain.points.map((point) => planck.Vec2(point.x, point.y));

    ground.createFixture(planck.Chain(vertices, false), {
      friction: tuning.terrain.friction,
      restitution: tuning.terrain.restitution,
    });
  });

  return ground;
}
