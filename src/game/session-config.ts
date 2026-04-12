import { bikeCatalog, defaultBikeId, getBikeDefinitionById, type BikeDefinition } from '../data/bikes';
import { testLevelDefinition } from '../data/levels';

export interface GameSessionConfig {
  levelDefinition: typeof testLevelDefinition;
  availableBikes: BikeDefinition[];
  defaultBikeId: string;
}

// Central session wiring keeps future additions like multiple levels,
// replays, UI boot flow, or alternate bike setups out of the app shell.
export const defaultGameSessionConfig: GameSessionConfig = {
  levelDefinition: testLevelDefinition,
  availableBikes: bikeCatalog,
  defaultBikeId,
};

export function getDefaultBikeDefinition(session: GameSessionConfig): BikeDefinition {
  return getBikeDefinitionById(session.defaultBikeId);
}
