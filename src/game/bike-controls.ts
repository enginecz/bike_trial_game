import type { KeyboardInput } from '../systems/input/keyboard-input';

export interface BikeControls {
  throttle: number;
  brakeFront: number;
  brakeRear: number;
  riderShift: number;
  singleStepPressed: boolean;
  suspensionDebugTogglePressed: boolean;
  terrainDebugTogglePressed: boolean;
  testRigTogglePressed: boolean;
  zoomInPressed: boolean;
  zoomOutPressed: boolean;
  zoomResetPressed: boolean;
  pausePressed: boolean;
  resetPressed: boolean;
  testSpawnSelection: number | null;
}

export function readBikeControls(input: KeyboardInput, testSpawnCount = 0): BikeControls {
  const throttle = input.isPressed('ArrowUp') ? 1 : 0;
  const riderShift = (input.isPressed('ArrowRight') ? 1 : 0) - (input.isPressed('ArrowLeft') ? 1 : 0);
  const brakeRear = input.isPressed('ArrowDown') ? 1 : 0;
  const brakeFront = input.isPressed('KeyA') || input.isPressed('Space') ? 1 : 0;

  return {
    throttle,
    brakeFront,
    brakeRear,
    riderShift,
    singleStepPressed: input.consumePressed('KeyN'),
    suspensionDebugTogglePressed: input.consumePressed('KeyO'),
    terrainDebugTogglePressed: input.consumePressed('KeyG'),
    testRigTogglePressed: input.consumePressed('KeyT'),
    zoomInPressed: input.consumePressed('Equal'),
    zoomOutPressed: input.consumePressed('Minus'),
    zoomResetPressed: input.consumePressed('Digit0'),
    pausePressed: input.consumePressed('KeyP'),
    resetPressed: input.consumePressed('KeyR'),
    testSpawnSelection: testSpawnCount > 0 ? input.consumeDigitSelection(testSpawnCount) : null,
  };
}
