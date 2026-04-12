import { moto01 } from './definitions/moto-01';
import { moto02 } from './definitions/moto-02';
import { mtb01 } from './definitions/mtb-01';
import { mtb02 } from './definitions/mtb-02';
import { createDerivedBike, type BikeDefinition, type DerivedBikeDefinitionInput } from './shared';

export type { BikeDefinition } from './shared';

export const bikeCatalog: BikeDefinition[] = [
  moto01,
  moto02,
  mtb01,
  mtb02,
];

export const defaultBikeId = moto01.id;

export function getBikeDefinitionById(bikeId: string): BikeDefinition {
  const bike = bikeCatalog.find((entry) => entry.id === bikeId);

  if (!bike) {
    throw new Error(`Unknown bike preset: ${bikeId}`);
  }

  return bike;
}

export function createBikeVariant(
  baseBikeId: string,
  definition: Omit<DerivedBikeDefinitionInput, 'variantOfId'>,
): BikeDefinition {
  const baseBike = getBikeDefinitionById(baseBikeId);

  return createDerivedBike(baseBike, {
    ...definition,
    variantOfId: baseBike.id,
  });
}
