const trackedKeys = [
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'KeyA',
  'KeyD',
  'KeyN',
  'KeyO',
  'KeyP',
  'KeyR',
  'KeyT',
  'Space',
] as const;

type TrackedKey = (typeof trackedKeys)[number];

export interface KeyboardInput {
  update(): void;
  isPressed(code: TrackedKey): boolean;
  consumePressed(code: TrackedKey): boolean;
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
    describeActiveKeys() {
      return trackedKeys.filter((code) => pressedKeys.has(code)).join(', ');
    },
  };
}
