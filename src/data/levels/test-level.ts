import type { LevelDefinition } from '../../world/level';

export const testLevelDefinition: LevelDefinition = {
  id: 'test-level-01',
  name: 'Test Level 01',
  spawn: { x: -16, y: 1.2 },
  collisionChains: [
    {
      id: 'start-flat',
      points: [
        { x: -22, y: 0 },
        { x: -12, y: 0 },
      ],
    },
    {
      id: 'rolling-hill',
      points: [
        { x: -12, y: 0 },
        { x: -8, y: 0.35 },
        { x: -4, y: 1.1 },
        { x: 0, y: 1.45 },
        { x: 4, y: 0.8 },
        { x: 8, y: 0.25 },
        { x: 12, y: 0.25 },
      ],
    },
    {
      id: 'step-obstacle',
      points: [
        { x: 12, y: 0.25 },
        { x: 13.2, y: 0.25 },
        { x: 13.2, y: 1.55 },
        { x: 15.1, y: 1.55 },
        { x: 15.1, y: 0.25 },
        { x: 20, y: 0.25 },
      ],
    },
    {
      id: 'finish-ramp',
      points: [
        { x: 20, y: 0.25 },
        { x: 24, y: 0.65 },
        { x: 28, y: 1.5 },
        { x: 32, y: 1.5 },
      ],
    },
  ],
};
