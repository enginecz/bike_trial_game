import type { KeyboardInput } from '../systems/input/keyboard-input';

export interface BikeControls {
  throttle: number;
  brakeFront: number;
  brakeRear: number;
  riderShift: number;
  singleStepPressed: boolean;
  suspensionDebugTogglePressed: boolean;
  testRigTogglePressed: boolean;
  pausePressed: boolean;
  resetPressed: boolean;
}

export function readBikeControls(input: KeyboardInput): BikeControls {
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
    testRigTogglePressed: input.consumePressed('KeyT'),
    pausePressed: input.consumePressed('KeyP'),
    resetPressed: input.consumePressed('KeyR'),
  };
}
