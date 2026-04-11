export interface LevelPoint {
  x: number;
  y: number;
}

export interface LevelChainDefinition {
  id: string;
  points: LevelPoint[];
}

export interface LevelTestSpawnDefinition {
  id: string;
  name: string;
  key: number;
  position: LevelPoint;
}

export interface LevelDefinition {
  id: string;
  name: string;
  spawn: LevelPoint;
  testSpawns: LevelTestSpawnDefinition[];
  collisionChains: LevelChainDefinition[];
}

export interface TerrainSegment {
  start: LevelPoint;
  end: LevelPoint;
}

export interface LevelChain extends LevelChainDefinition {
  segments: TerrainSegment[];
}

export interface LevelTestSpawn extends LevelTestSpawnDefinition {}

export interface Level {
  id: string;
  name: string;
  spawn: LevelPoint;
  testSpawns: LevelTestSpawn[];
  collisionChains: LevelChain[];
  segmentCount: number;
}

export function createLevel(definition: LevelDefinition): Level {
  const collisionChains = definition.collisionChains.map((chain) => ({
    ...chain,
    segments: buildSegments(chain.points),
  }));

  const segmentCount = collisionChains.reduce((count, chain) => count + chain.segments.length, 0);

  return {
    id: definition.id,
    name: definition.name,
    spawn: definition.spawn,
    testSpawns: definition.testSpawns,
    collisionChains,
    segmentCount,
  };
}

function buildSegments(points: LevelPoint[]): TerrainSegment[] {
  const segments: TerrainSegment[] = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    segments.push({
      start: points[index],
      end: points[index + 1],
    });
  }

  return segments;
}
