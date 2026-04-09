import { testLevelDefinition } from '../data/levels';
import { bikeTuning } from '../tuning/bike';

export interface GameSessionConfig {
  levelDefinition: typeof testLevelDefinition;
  bikeTuning: typeof bikeTuning;
}

// Central session wiring keeps future additions like multiple levels,
// replays, UI boot flow, or alternate bike setups out of the app shell.
export const defaultGameSessionConfig: GameSessionConfig = {
  levelDefinition: testLevelDefinition,
  bikeTuning,
};
