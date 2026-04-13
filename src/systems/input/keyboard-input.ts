const trackedKeys = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'KeyA',
  'KeyB',
  'KeyD',
  'KeyG',
  'KeyH',
  'KeyN',
  'KeyO',
  'KeyP',
  'KeyR',
  'KeyT',
  'Digit0',
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Equal',
  'Minus',
  'Space',
] as const;

type TrackedKey = (typeof trackedKeys)[number];

export interface KeyboardInput {
  update(): void;
  isPressed(code: TrackedKey): boolean;
  consumePressed(code: TrackedKey): boolean;
  consumeDigitSelection(maxDigit: number): number | null;
  describeActiveKeys(): string;
}

export function createKeyboardInput(target: Window): KeyboardInput {
  const pressedKeys = new Set<string>();
  const justPressedKeys = new Set<string>();

  target.addEventListener('keydown', (event) => {
    if (!pressedKeys.has(event.code)) {
      justPressedKeys.add(event.code);
    }

    pressedKeys.add(event.code);
  });

  target.addEventListener('keyup', (event) => {
    pressedKeys.delete(event.code);
  });

  target.addEventListener('blur', () => {
    pressedKeys.clear();
    justPressedKeys.clear();
  });

  return {
    update() {
      // Reserved for per-step input bookkeeping later.
    },
    isPressed(code) {
      return pressedKeys.has(code);
    },
    consumePressed(code) {
      if (!justPressedKeys.has(code)) {
        return false;
      }

      justPressedKeys.delete(code);
      return true;
    },
    consumeDigitSelection(maxDigit) {
      for (let digit = 1; digit <= maxDigit; digit += 1) {
        const code = `Digit${digit}` as TrackedKey;

        if (!justPressedKeys.has(code)) {
          continue;
        }

        justPressedKeys.delete(code);
        return digit;
      }

      return null;
    },
    describeActiveKeys() {
      return trackedKeys.filter((code) => pressedKeys.has(code)).join(', ');
    },
  };
}
