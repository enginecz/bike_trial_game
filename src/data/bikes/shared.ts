import { createBikeTuningVariant, type BikeTuning, type BikeTuningOverrides } from '../../tuning/bike';

export interface BikeLocalPoint {
  x: number;
  y: number;
}

export type BikeRenderingBody = 'frame' | 'swingarm' | 'fork' | 'rider' | 'rearWheel' | 'frontWheel';

export interface BikeRenderingDefinition {
  frameTriangle?: {
    points: BikeLocalPoint[];
    localTo?: BikeRenderingBody;
  };
  headAxisLine?: {
    start: BikeLocalPoint;
    end: BikeLocalPoint;
    startLocalTo?: BikeRenderingBody;
    endLocalTo?: BikeRenderingBody;
  };
  forkTriangle?: {
    points: BikeLocalPoint[];
    localTo?: BikeRenderingBody;
  };
  frontWheelCircle?: {
    center: BikeLocalPoint;
    radius: number;
    localTo?: BikeRenderingBody;
  };
  swingarmTriangle?: {
    points: BikeLocalPoint[];
    localTo?: BikeRenderingBody;
  };
  rearWheelCircle?: {
    center: BikeLocalPoint;
    radius: number;
    localTo?: BikeRenderingBody;
  };
  riderTriangle?: {
    points: BikeLocalPoint[];
    localTo?: BikeRenderingBody;
  };
  shockLine?: {
    start: BikeLocalPoint;
    end: BikeLocalPoint;
    startLocalTo?: BikeRenderingBody;
    endLocalTo?: BikeRenderingBody;
  };
  frontSuspensionLine?: {
    start: BikeLocalPoint;
    end: BikeLocalPoint;
    startLocalTo?: BikeRenderingBody;
    endLocalTo?: BikeRenderingBody;
  };
  frameOnly?: boolean;
}

export interface BikeDefinition {
  id: string;
  name: string;
  description: string;
  tuning: BikeTuning;
  rendering?: BikeRenderingDefinition;
  variantOfId?: string;
}

export interface DerivedBikeDefinitionInput {
  id: string;
  name: string;
  description: string;
  variantOfId: string;
  overrides: BikeTuningOverrides;
}

export function createIndependentBike(definition: BikeDefinition): BikeDefinition {
  return {
    ...definition,
    tuning: createBikeTuningVariant(definition.tuning, {}),
  };
}

export function createDerivedBike(baseBike: BikeDefinition, definition: DerivedBikeDefinitionInput): BikeDefinition {
  return {
    id: definition.id,
    name: definition.name,
    description: definition.description,
    variantOfId: definition.variantOfId,
    tuning: createBikeTuningVariant(baseBike.tuning, definition.overrides),
  };
}
